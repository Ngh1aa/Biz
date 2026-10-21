import test from 'node:test';
import assert from 'node:assert/strict';
import {seed,canOpenRoute,today} from '../src/data.js';
import {ensureFamily,familyChildren,familyReports,requestLeave,resolveLeave,cancelLeave,familyThreadVisible,familyContacts} from '../src/family.js';

test('Additive family migration retains existing staff state and respects existing empty links',()=>{
 const db=seed();db.drafts={intake:{name:'Đang nhập'}};ensureFamily(db);assert.equal(db.drafts.intake.name,'Đang nhập');assert.equal(familyChildren(db).length,2);
 db.family.children=[];ensureFamily(db);assert.equal(familyChildren(db).length,0);assert.equal(db.selectedChild,'');
});
test('Parent route boundary and approved reports require both approvals and linked child',()=>{
 const db=ensureFamily(seed());assert.equal(canOpenRoute('ph','GV11'),false);assert.equal(canOpenRoute('ph','TC05c'),false);assert.equal(canOpenRoute('ph','PH03'),true);assert.equal(canOpenRoute('tc','PH01'),false);
 assert.deepEqual(familyReports(db).map(r=>r.id),['BC5']);db.reports.find(r=>r.id==='BC5').office=false;assert.equal(familyReports(db).length,0);
});
test('Leave request rejects duplicate/past/unlinked/marked sessions and does not change attendance',()=>{
 const db=ensureFamily(seed());db.role='ph';const before=JSON.stringify(db.sessions);const first=requestLeave(db,{session:'CA1',reason:'Con cần nghỉ'});assert.ok(first.request);
 assert.ok(requestLeave(db,{session:'CA1',reason:'Gửi lại'}).error);assert.ok(requestLeave(db,{session:'CA3',reason:'Buổi cũ'}).error);assert.ok(requestLeave(db,{session:'CA2',reason:'Con khác'}).error);
 assert.equal(JSON.stringify(db.sessions),before);db.sessions[0].marks.HS001='Có';db.familyRequests=[];assert.ok(requestLeave(db,{session:'CA1',reason:'Đã điểm danh'}).error);
});
test('Office-only resolution is idempotent, rejection needs reason and history survives cancellation',()=>{
 const db=ensureFamily(seed());db.role='ph';const {request}=requestLeave(db,{session:'CA1',reason:'Xin nghỉ'});
 assert.equal(resolveLeave(db,request.id,'Chấp thuận'),false);db.role='gv';assert.equal(resolveLeave(db,request.id,'Từ chối'),false);assert.equal(resolveLeave(db,request.id,'Chấp thuận','Đã tiếp nhận'),true);assert.equal(resolveLeave(db,request.id,'Từ chối','Lần hai'),false);
 db.role='ph';assert.equal(cancelLeave(db,request.id),false);db.familyRequests=[];const next=requestLeave(db,{session:'CA1',reason:'Đổi kế hoạch'}).request;assert.equal(cancelLeave(db,next.id),true);assert.equal(next.history.length,2);assert.ok(requestLeave(db,{session:'CA1',reason:'Gửi lại sau hủy'}).request);
});
test('Family contact and conversation scope cannot leak another child or teacher',()=>{
 const db=ensureFamily(seed());db.role='ph';assert.deepEqual(familyContacts(db).map(c=>c.id),['office','T01']);assert.deepEqual(familyContacts(db,'HS006'),[]);
 assert.equal(familyThreadVisible(db,{parent:'PH002',student:'HS001',recipient:'office'}),false);assert.equal(familyThreadVisible(db,{parent:'PH001',student:'HS006',recipient:'office'}),false);
 db.role='tc';assert.equal(familyThreadVisible(db,{recipient:'office'}),false);assert.equal(familyThreadVisible(db,{recipient:'T01'}),true);
});
