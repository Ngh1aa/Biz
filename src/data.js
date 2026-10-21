// Synthetic fixtures for the UX prototype. No production data or credentials.
export const KEY = 'biz.ux.v1';
export const SUBJECTS = ['Toán','Ngữ văn','Tiếng Anh','Vật lý','Hóa học','Sinh học','Lịch sử','Địa lý','Tin học','Tiếng Trung','Tiếng Nhật'];
export const ROLES = { gv:'Giáo vụ', tc:'Giáo viên', tbm:'Trưởng bộ môn' };
export const TEACHERS = [
  { id:'T01',name:'Nguyễn Minh Anh',subject:'Toán',head:'Trần Hoàng Nam' },
  { id:'T02',name:'Trần Hoàng Nam',subject:'Toán',head:'Trần Hoàng Nam' },
  { id:'T03',name:'Lê Thu Hà',subject:'Tiếng Anh',head:'Phạm Bảo Ngọc' },
  { id:'T04',name:'Phạm Bảo Ngọc',subject:'Tiếng Anh',head:'Phạm Bảo Ngọc' },
  ...SUBJECTS.filter(s=>!['Toán','Tiếng Anh'].includes(s)).map((subject,i)=>({id:`T${i+5}`,name:`Giáo viên ${subject}`,subject,head:`Trưởng bộ môn ${subject}`}))
];
export const CRITERIA = [
  ['Nền tảng',['Kiến thức nền tảng','Kiến thức mở rộng','Hiểu bản chất']],
  ['Năng lực',['Kỹ năng tính toán','Tư duy phân tích và lập luận','Phát hiện và sửa lỗi']],
  ['Phương pháp và thái độ',['Phương pháp và thói quen học','Thái độ học và sự kiên trì']]
];
export const SCREEN_META = {
  A00:['Đăng nhập','Tài khoản do trung tâm cấp'],
  GV01:['Tổng quan','Việc cần xử lý và lịch trong ngày'],GV02:['Học sinh','Tìm kiếm, lọc và mở hồ sơ'],GV03:['Hồ sơ học sinh','Thông tin học sinh và các môn đăng ký học'],
  GV04:['Tiếp nhận học sinh','Bước 1 · Thông tin học sinh'],GV04b:['Phụ huynh','Bước 2 · Thông tin liên hệ'],GV04c:['Kiểm tra đầu vào','Bước 3 · Kết quả kiểm tra và nhận xét'],
  GV05:['Xếp lớp','Học sinh → môn → giáo viên → lịch'], 'GV05-s1':['Chọn môn','Danh sách 11 môn'],'GV05-s2':['Chọn giáo viên','Lọc theo bộ môn'],'GV05-s3':['Ngày bắt đầu','Không chọn ngày đã qua'],
  GV06:['Đổi giáo viên','Điều chỉnh giáo viên và lịch'],GV06b:['Đổi lịch học','Đổi ca học hằng tuần'],GV06c:['Ngừng học','Lưu lý do và ngày có hiệu lực'],
  GV07:['Duyệt báo cáo','Vòng duyệt Giáo vụ'],GV08:['Học phí tháng','Tạo và cập nhật trạng thái thu'],GV09:['Giao việc','Gửi nhiệm vụ cho giáo viên'],GV10:['Điều chỉnh điểm danh','Yêu cầu sau giờ khóa và lịch sử'],GV11:['Tài khoản','Vai trò, bộ môn và trạng thái'],
  TBM01:['Duyệt bộ môn','Duyệt vòng 1 trước Giáo vụ'],
  TC01:['Tổng quan','Ca dạy và việc cần hoàn thành'],TC01b:['Thống kê','9 chỉ số theo tháng'],TC02:['Lịch dạy','Bảng tuần theo ngày × ca'],TC02b:['Lịch theo ngày','Lịch theo ngày hoặc từng học sinh'],
  TC03:['Điểm danh','Có mặt / Vắng trước giờ khóa'],TC03b:['Ca đã khóa','Chỉ xem và yêu cầu sửa'],TC03c:['Buổi học bổ sung','Dạy thay hoặc học bù'],
  TC04a:['Học sinh','Danh sách học sinh phụ trách'],TC04:['Hồ sơ học sinh','Lịch, đánh giá và báo cáo'],TC04b:['Đánh giá năng lực','8 tiêu chí theo thang M1–M4'],
  TC05:['Báo cáo','Trạng thái và hạn nộp'],TC05b:['Xem báo cáo','Tiến trình duyệt hai vòng'],TC05c:['Lập báo cáo','Chuyên cần tổng hợp từ điểm danh'],TC05d:['Bổ sung báo cáo','Nội dung cần bổ sung và lịch sử gửi'],TC05w:['Nhập từ Excel','Nhập hàng loạt trên web'],
  TC06:['Công việc','Công việc được giao và tiến độ thực hiện'],TC06b:['Chi tiết công việc','Trao đổi, cập nhật và lịch sử'],TC06c:['Gửi kết quả','Bàn giao cho người giao việc xác nhận'],
  TC07:['Trao đổi','Tin nhắn và thông báo chung'],TC07b:['Hội thoại','Tin nhắn, tệp đính kèm và trạng thái đã xem'],TC07c:['Soạn tin','Chọn người nhận và gửi']
};
export const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function seed() {
  const names = ['Nguyễn An Nhiên','Trần Minh Khang','Lê Gia Hân','Phạm Đức Anh','Hoàng Bảo Ngọc','Vũ Tuấn Kiệt','Đỗ Khánh Linh','Bùi Nhật Minh'];
  const students = names.map((name,i)=>({id:`HS${String(i+1).padStart(3,'0')}`,name,grade:String(7+i%4),school:['THCS Nguyễn Du','THCS Lê Quý Đôn','THPT Trần Phú'][i%3],status:i===6?'Chờ xếp lớp':i===7?'Đã nghỉ':'Đang học',subject:i===5?'Tiếng Anh':'Toán',teacher:i===5?'T03':'T01',level:`M${2+i%3}`,slots:i%2?['T3-Chiều','T5-Chiều']:['T2-Tối','T4-Tối'],start:'2026-10-01',planned:8,score:7+i%3,notes:'Nắm được kiến thức cơ bản, cần luyện tập đều đặn.'}));
  const reports = students.slice(0,6).map((s,i)=>({id:`BC${i+1}`,student:s.id,month:'2026-10',subject:s.subject,teacher:s.teacher,status:['Nháp','Chờ duyệt','Làm lại','Chưa nộp','Đã duyệt','Chờ duyệt'][i],head:i===4||i===5,office:i===4,score:String(s.score),foundation:'M3',ability:'M2',attitude:'M3',comment:s.notes,next:'Ôn tập kiến thức trọng tâm, luyện giải bài tập theo chủ đề.',reason:i===2?'Bổ sung ví dụ cụ thể về tư duy phân tích và kế hoạch tháng sau.':'',history:[{text:'Khởi tạo báo cáo tháng 10',time:'20/10 · 09:00'}],submittedAt:new Date(Date.now()-4*3600000).toISOString()}));
  return {version:1,role:'gv',selectedStudent:'HS001',selectedReport:'BC1',selectedTask:'CV001',selectedSession:'CA1',selectedThread:'TN1',drafts:{},students,reports,
    sessions:[{id:'CA1',name:'Toán · Khối 7',day:'T4',shift:'Chiều',time:'14:00 – 15:30',date:today(),students:['HS001','HS002','HS003'],teacher:'T01',marks:{},locked:false},
      {id:'CA2',name:'Toán · Khối 9',day:'T4',shift:'Tối',time:'18:00 – 19:30',date:today(),students:['HS004','HS005'],teacher:'T01',marks:{},locked:false},
      {id:'CA3',name:'Toán · Khối 7',day:'T2',shift:'Tối',time:'18:00 – 19:30',date:'2026-10-19',students:['HS001','HS002','HS003'],teacher:'T01',marks:{HS001:'Có',HS002:'Vắng',HS003:'Có'},locked:true}],
    requests:[{id:'YC1',session:'CA3',teacher:'T01',student:'HS002',kind:'Điều chỉnh điểm danh',from:'Vắng',to:'Có',reason:'Học sinh đến muộn, cần cập nhật có mặt.',status:'Chờ duyệt',time:'20/10 · 09:15'}],audit:[],
    tasks:[{id:'CV001',title:'Hoàn thiện báo cáo tháng 10',description:'Rà soát chuyên cần và bổ sung nhận xét, kế hoạch hỗ trợ tháng tới cho học sinh phụ trách.',assignee:'T01',owner:'Giáo vụ · Thu Phương',due:'2026-10-25',priority:'Cao',status:'Mới giao',progress:0,files:[],comments:[],history:[{text:'Thu Phương giao việc',time:'20/10 · 08:30'}]},
      {id:'CV002',title:'Chuẩn bị bài kiểm tra cuối tháng',description:'Chuẩn bị đề Toán khối 7 theo nội dung đã học.',assignee:'T01',owner:'Trưởng bộ môn · Hoàng Nam',due:'2026-10-24',priority:'Bình thường',status:'Đang làm',progress:60,files:[],comments:[],history:[{text:'Đã nhận việc',time:'19/10 · 10:00'}]},
      {id:'CV003',title:'Gửi kế hoạch phụ đạo',description:'Tổng hợp học sinh cần hỗ trợ và kế hoạch phụ đạo.',assignee:'T01',owner:'Giáo vụ · Thu Phương',due:'2026-10-20',priority:'Cao',status:'Chờ xác nhận',progress:100,result:'Đã gửi kế hoạch phụ đạo cho 3 học sinh.',files:['Kế hoạch.pdf'],comments:[],history:[{text:'Giáo viên gửi kết quả',time:'20/10 · 16:00'}]}],
    invoices:[],accounts:[{id:'A1',name:'Nguyễn Minh Anh',phone:'0900000001',role:'Giáo viên',subject:'Toán',created:'01/10/2026',locked:false},{id:'A2',name:'Trần Hoàng Nam',phone:'0900000002',role:'Trưởng bộ môn',subject:'Toán',created:'01/10/2026',locked:false},{id:'A3',name:'Lê Thu Phương',phone:'0900000003',role:'Giáo vụ',subject:'—',created:'01/10/2026',locked:false}],
    threads:[{id:'TN1',name:'Giáo vụ · Thu Phương',group:'Điều phối đào tạo',unread:2,messages:[{sender:'other',text:'Chào cô, lớp Toán chiều nay có thêm học sinh mới. Nhờ cô kiểm tra lịch giúp nhé.',time:'09:10'},{sender:'me',text:'Mình đã nhận được thông tin, cảm ơn Phương.',time:'09:12',seen:true}]},{id:'TN2',name:'PH · An Nhiên',group:'Phụ huynh học sinh',unread:1,messages:[{sender:'other',text:'Cô cho em hỏi nội dung cần ôn tập trong tuần này ạ?',time:'08:45'}]}],
    notices:[{id:'N1',title:'Hạn nộp báo cáo tháng 10',body:'Hoàn thành và gửi báo cáo trước ngày 25/10.',route:'TC05'},{id:'N2',title:'Họp bộ môn tuần này',body:'15:30 thứ Sáu · Phòng họp cơ sở 1.',route:'TC07'},{id:'N3',title:'Lịch dạy đã được cập nhật',body:'Kiểm tra các ca dạy và học sinh mới trong tuần.',route:'TC02'}]
  };
}
export function load(storage=globalThis.localStorage) { try { const d=JSON.parse(storage?.getItem(KEY)); return d?.version===1?d:seed(); } catch { return seed(); } }
export function persist(db,storage=globalThis.localStorage) { storage?.setItem(KEY,JSON.stringify(db)); }
export const teacherName = id => TEACHERS.find(t=>t.id===id)?.name || 'Chưa phân công';
export function attendance(db,id,month='2026-10',subject='') {
  return db.sessions.filter(s=>s.date.startsWith(month)&&s.students.includes(id)&&(!subject||s.subject===subject||s.name.startsWith(subject+' ·'))).reduce((a,s)=>({present:a.present+(s.marks[id]==='Có'?1:0),absent:a.absent+(s.marks[id]==='Vắng'?1:0)}),{present:0,absent:0});
}
export const courses = s => s.courses || [{subject:s.subject,teacher:s.teacher,slots:s.slots,start:s.start,status:s.status}];
export function weekDates(offset=0,reference=today()) {
  const date=new Date(reference+'T12:00:00Z');
  date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7+offset*7);
  return Array.from({length:7},(_,i)=>{const day=new Date(date);day.setUTCDate(day.getUTCDate()+i);return day.toISOString().slice(0,10);});
}
export function applyEnrollment(db,studentId,change,now=today()) {
  const s=db.students.find(s=>s.id===studentId);if(!s)return false;
  s.courses=courses(s).map(c=>({...c,slots:[...c.slots]}));
  const subject=change.subject||s.subject;
  let course=s.courses.find(c=>c.subject===subject);
  if(!course){course={subject,slots:[]};s.courses.push(course);}
  if(change.base==='GV06c')course.status='Đã nghỉ';
  else Object.assign(course,{teacher:change.teacher||course.teacher||s.teacher,slots:change.slots,start:change.start,status:'Đang học'});
  s.status=s.courses.some(c=>c.status==='Đang học')?'Đang học':'Đã nghỉ';
  const primary=s.courses.find(c=>c.status==='Đang học')||course;
  Object.assign(s,{subject:primary.subject,teacher:primary.teacher,slots:primary.slots,start:primary.start});
  // Preserve historical attendance; remove only future sessions for the changed subject.
  for(const session of db.sessions)if(session.date>=change.start&&!isLocked(session,now)&&(session.subject===subject||session.name.startsWith(subject+' ·'))){session.students=session.students.filter(id=>id!==s.id);}
  if(change.base!=='GV06c'){
    for(const slot of course.slots){
      const [day,shift]=slot.split('-'),date=new Date(change.start+'T12:00:00Z');
      const target=['CN','T2','T3','T4','T5','T6','T7'].indexOf(day);
      date.setUTCDate(date.getUTCDate()+(target-date.getUTCDay()+7)%7);
      for(let week=0;week<5;week++){
        const sessionDate=date.toISOString().slice(0,10);
        let session=db.sessions.find(x=>x.date===sessionDate&&x.shift===shift&&x.teacher===course.teacher&&(x.subject===subject||x.name.startsWith(subject+' ·'))&&!isLocked(x,now));
        if(!session){session={id:`CA-${s.id}-${subject}-${sessionDate}-${shift}`,name:`${subject} · Khối ${s.grade}`,subject,day,shift,date:sessionDate,time:{Sáng:'08:00 – 09:30',Chiều:'14:00 – 15:30',Tối:'18:00 – 19:30'}[shift],teacher:course.teacher,students:[],marks:{},locked:false};db.sessions.push(session);}
        if(!session.students.includes(s.id))session.students.push(s.id);
        date.setUTCDate(date.getUTCDate()+7);
      }
    }
  }
  return true;
}
export function applyDueChanges(db,now=today()) {
  const due=(db.scheduledChanges||[]).filter(c=>c.start<=now);
  for(const change of due){applyEnrollment(db,change.student,change,now);db.audit.push({student:change.student,text:`Điều chỉnh đã có hiệu lực ${change.start}`,time:stamp(),owner:'Giáo vụ'});}
  db.scheduledChanges=(db.scheduledChanges||[]).filter(c=>c.start>now);
  return due.length;
}
export function isLocked(session,now=today()) { return session.locked || session.date < now; }
export function approveReport(db,id,role) {
  const r=db.reports.find(r=>r.id===id); if (!r || r.status!=='Chờ duyệt') return false;
  if (role==='tbm'&&!r.head) r.head=true;
  else if (role==='gv'&&r.head&&!r.office) r.office=true;
  else return false;
  r.status=r.head&&r.office?'Đã duyệt':'Chờ duyệt';
  r.history.push({text:role==='tbm'?'Trưởng bộ môn đã duyệt':'Giáo vụ đã duyệt',time:stamp()}); return true;
}
export const stamp=()=>new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Bangkok',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date());
export function validateImport(rows,db) {
  const seen=new Set();
  return rows.map((row,i)=>{
    const id=String(row['Mã HS']||'').trim(); const subject=String(row['Môn']||'').trim();
    const s=db.students.find(s=>s.id===id); const errors=[];
    if (!s) errors.push('Không tìm thấy mã học sinh. Kiểm tra mã trong danh sách phụ trách.');
    if (s&&subject!==s.subject) errors.push('Môn học chưa khớp với hồ sơ học sinh.');
    if (!row['Thái độ']) errors.push('Chưa chọn mức đánh giá thái độ học tập.');
    for(const field of ['Nền tảng','Năng lực','Thái độ']) if(row[field]&&!/^M[1-4]$/.test(String(row[field]).trim())) errors.push(`${field}: chọn mức từ M1 đến M4.`);
    if (!String(row['Nhận xét']||'').trim()) errors.push('Chưa có nhận xét kết quả học tập.');
    if(row['Điểm']!==''&&row['Điểm']!==undefined&&(!Number.isFinite(Number(row['Điểm']))||Number(row['Điểm'])<0||Number(row['Điểm'])>10)) errors.push('Điểm kiểm tra cần nằm trong khoảng 0–10.');
    if (s&&(s.teacher!=='T01'||s.status!=='Đang học')) errors.push('Học sinh không thuộc danh sách đang phụ trách.');
    const key=`${id}-${subject}`;if(seen.has(key)) errors.push('Trùng học sinh và môn học trong tệp. Chỉ giữ một dòng.');seen.add(key);
    return {row,line:i+2,errors,valid:errors.length===0,attendance:s?attendance(db,id):null};
  });
}
