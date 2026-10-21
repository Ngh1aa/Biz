import {today,isLocked,courses,TEACHERS} from './data.js';

// Additive migration for existing browser data; never infer links from names/phones.
export function ensureFamily(db){
 db.family??={id:'PH001',name:'Nguyễn Thu Hương',children:['HS001','HS005']};
 db.familyRequests??=[];db.familyThreads??=[];
 const children=familyChildren(db);
 if(!children.some(s=>s.id===db.selectedChild))db.selectedChild=children[0]?.id||'';
 return db;
}
export const familyChildren=db=>db.students.filter(s=>db.family?.children.includes(s.id));
export const familyOwns=(db,id)=>familyChildren(db).some(s=>s.id===id);
export const publishedReport=r=>r.status==='Đã duyệt'&&r.head===true&&r.office===true;
export const familyReports=db=>db.reports.filter(r=>familyOwns(db,r.student)&&publishedReport(r));
export const familyInvoices=db=>db.invoices.filter(i=>familyOwns(db,i.student));
export const familySessions=db=>db.sessions.filter(s=>s.students.includes(db.selectedChild));
export const canRequestLeave=(db,session,student=db.selectedChild)=>familyOwns(db,student)&&!!session&&session.students.includes(student)&&session.date>=today()&&!isLocked(session)&&!session.marks[student];
export function familyContacts(db,student=db.selectedChild){
 const s=familyChildren(db).find(s=>s.id===student);
 return s?[{id:'office',name:'Giáo vụ · Trung tâm'},...TEACHERS.filter(t=>courses(s).some(c=>c.teacher===t.id&&c.status==='Đang học')).map(t=>({id:t.id,name:`${t.name} · ${t.subject}`}))]:[];
}
export const familyThreadVisible=(db,t)=>!!t&&(db.role==='ph'?t.parent===db.family.id&&familyOwns(db,t.student):db.role==='gv'||t.recipient==='T01');
export function requestLeave(db,{session:sessionId,reason}){
 const session=db.sessions.find(s=>s.id===sessionId);
 if(!canRequestLeave(db,session))return {error:'Buổi học không còn phù hợp để xin nghỉ. Chọn một buổi sắp tới chưa được điểm danh.'};
 if(!reason?.trim())return {error:'Ghi lý do xin nghỉ để Giáo vụ có đủ thông tin xử lý.'};
 const existing=db.familyRequests.find(r=>r.student===db.selectedChild&&r.session===sessionId&&['Chờ xử lý','Chấp thuận'].includes(r.status));
 if(existing)return {error:'Buổi này đã có yêu cầu xin nghỉ. Xem trạng thái tại mục Yêu cầu.',existing};
 const request={id:'NP'+Date.now()+'-'+db.familyRequests.length,parent:db.family.id,student:db.selectedChild,session:sessionId,reason:reason.trim(),status:'Chờ xử lý',createdAt:new Date().toISOString(),history:[{text:'Phụ huynh gửi yêu cầu đến Giáo vụ',time:new Date().toLocaleString('vi-VN')}]};
 db.familyRequests.unshift(request);return {request};
}
export function resolveLeave(db,id,status,response=''){
 const r=db.familyRequests.find(r=>r.id===id);
 if(db.role!=='gv'||!r||r.status!=='Chờ xử lý'||!['Chấp thuận','Từ chối'].includes(status)||status==='Từ chối'&&!response.trim())return false;
 Object.assign(r,{status,response:response.trim(),resolvedAt:new Date().toISOString(),owner:'Giáo vụ'});
 r.history.push({text:`Giáo vụ ${status.toLowerCase()}${response?' · '+response:''}`,time:new Date().toLocaleString('vi-VN')});return true;
}
export function cancelLeave(db,id){
 const r=db.familyRequests.find(r=>r.id===id);
 if(db.role!=='ph'||!r||r.parent!==db.family.id||!familyOwns(db,r.student)||r.status!=='Chờ xử lý')return false;
 r.status='Đã hủy';r.history.push({text:'Phụ huynh hủy yêu cầu',time:new Date().toLocaleString('vi-VN')});return true;
}
