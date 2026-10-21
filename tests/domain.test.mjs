import test from 'node:test';
import assert from 'node:assert/strict';
import {seed,attendance,approveReport,validateImport,isLocked,weekDates,applyEnrollment,applyDueChanges,courses,load,persist} from '../src/data.js';
test('Report cannot skip department approval and cannot be approved twice',()=>{
 const db=seed(),r=db.reports.find(r=>r.status==='Chờ duyệt'&&!r.head);
 assert.equal(approveReport(db,r.id,'gv'),false);assert.equal(approveReport(db,r.id,'tbm'),true);
 assert.equal(r.status,'Chờ duyệt');assert.equal(approveReport(db,r.id,'tbm'),false);
 assert.equal(approveReport(db,r.id,'gv'),true);assert.equal(r.status,'Đã duyệt');assert.equal(approveReport(db,r.id,'gv'),false);
});
test('Attendance counts only marked sessions, separated by month and subject',()=>{
 const db=seed();assert.deepEqual(attendance(db,'HS001'),{present:1,absent:0});
 assert.deepEqual(attendance(db,'HS002'),{present:0,absent:1});
 assert.deepEqual(attendance(db,'HS001','2026-09'),{present:0,absent:0});
 assert.deepEqual(attendance(db,'HS001','2026-10','Tiếng Anh'),{present:0,absent:0});
});
test('Past sessions lock regardless of fixture flag',()=>{
 assert.equal(isLocked({date:'2026-10-20',locked:false},'2026-10-21'),true);
 assert.equal(isLocked({date:'2026-10-21',locked:false},'2026-10-21'),false);
 assert.equal(isLocked({date:'2026-10-22',locked:true},'2026-10-21'),true);
});
test('Week calendar uses actual dates across months and year boundaries',()=>{
 assert.deepEqual(weekDates(0,'2026-10-21'),['2026-10-19','2026-10-20','2026-10-21','2026-10-22','2026-10-23','2026-10-24','2026-10-25']);
 assert.equal(weekDates(1,'2026-12-31')[0],'2027-01-04');
});
test('Adding a second subject retains existing enrollment and attendance',()=>{
 const db=seed(),old=db.sessions.find(s=>s.id==='CA3');
 applyEnrollment(db,'HS001',{base:'GV05',subject:'Tiếng Anh',teacher:'T03',slots:['T5-Chiều'],start:'2026-10-21'},'2026-10-21');
 const s=db.students[0];assert.equal(courses(s).length,2);assert.ok(courses(s).some(c=>c.subject==='Toán'&&c.status==='Đang học'));
 assert.equal(old.marks.HS001,'Có');assert.ok(db.sessions.some(s=>s.teacher==='T03'&&s.students.includes('HS001')&&s.date==='2026-10-22'));
});
test('Future withdrawal applies on effective day and preserves historical marks',()=>{
 const db=seed();db.scheduledChanges=[{student:'HS001',base:'GV06c',subject:'Toán',start:'2026-10-25'}];
 assert.equal(applyDueChanges(db,'2026-10-21'),0);assert.equal(db.students[0].status,'Đang học');
 assert.equal(applyDueChanges(db,'2026-10-25'),1);assert.equal(db.students[0].status,'Đã nghỉ');
 assert.equal(db.sessions.find(s=>s.id==='CA3').marks.HS001,'Có');assert.equal(db.scheduledChanges.length,0);
});
test('Changing teacher removes future old allocation, keeps past attendance',()=>{
 const db=seed();applyEnrollment(db,'HS001',{base:'GV06',subject:'Toán',teacher:'T02',slots:['T4-Chiều'],start:'2026-10-21'},'2026-10-21');
 assert.ok(!db.sessions.find(s=>s.id==='CA1').students.includes('HS001'));
 assert.ok(db.sessions.find(s=>s.id==='CA3').students.includes('HS001'));
 assert.ok(db.sessions.some(s=>s.teacher==='T02'&&s.students.includes('HS001')));
});
test('Excel validates missing, wrong, duplicate and out of scope data; attendance is not imported',()=>{
 const db=seed(),row={'Mã HS':'HS001','Môn':'Toán','Điểm':8,'Nền tảng':'M3','Năng lực':'M2','Thái độ':'M4','Nhận xét':'Tiến bộ','Chuyên cần':999};
 const result=validateImport([row,{...row},{...row,'Mã HS':'NOPE','Thái độ':''},{...row,'Mã HS':'HS006','Môn':'Tiếng Anh'}],db);
 assert.equal(result[0].valid,true);assert.equal(result[0].attendance.present,1);
 assert.ok(result[1].errors.includes('Trùng dòng'));assert.ok(result[2].errors.includes('Sai mã HS'));assert.ok(result[2].errors.includes('Thiếu Thái độ'));assert.ok(result[3].errors.includes('Ngoài danh sách phụ trách'));
});
test('Corrupt local data recovers to fixtures; persistence round trips',()=>{
 const store={value:'broken',getItem(){return this.value;},setItem(_,v){this.value=v;}};
 assert.equal(load(store).version,1);const db=seed();db.students[0].name='Đã thay đổi';persist(db,store);assert.equal(load(store).students[0].name,'Đã thay đổi');
});
