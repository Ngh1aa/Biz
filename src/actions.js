import {ROLES,SCREEN_META,SUBJECTS,TEACHERS,teacherName,seed,today,stamp,attendance,isLocked,approveReport,validateImport,applyEnrollment,courses} from './data.js';
import {esc,icon,btn,link,field,form,footer,note,avatar,statusLabel} from './ui.js';
export function createActions(ctx) {
 const {toast,sheet,navigate,render,save}=ctx;
 const selectedReport=()=>ctx.db.reports.find(r=>r.id===ctx.db.selectedReport);
 const selectedTask=()=>ctx.db.tasks.find(t=>t.id===ctx.db.selectedTask);
 const selectedSession=()=>ctx.db.sessions.find(s=>s.id===ctx.db.selectedSession);
 const close=()=>ctx.closeSheet();
 const error=(f,text)=>{const el=f.querySelector('.form-error')||f.prepend(document.createElement('div'));if(el){el.textContent=text;el.hidden=false;el.scrollIntoView({block:'nearest'});}else toast(text);};
 const values=f=>Object.fromEntries([...new FormData(f)].filter(([,v])=>typeof v==='string'));
 const files=f=>[...f.querySelectorAll('input[type=file]')].flatMap(input=>[...input.files].map(file=>file.name));
 const audit=(text,extra={})=>ctx.db.audit.push({text,time:stamp(),owner:ROLES[ctx.db.role],...extra});
 const showReason=(title,action,id,extra='')=>{
   const [label,cta]=({'return-report':['Nội dung cần bổ sung','Gửi yêu cầu bổ sung'],'reject-request':['Lý do từ chối','Từ chối đề nghị'],'ask-task':['Nội dung cần làm rõ','Gửi trao đổi'],'return-task':['Nội dung cần bổ sung','Gửi yêu cầu bổ sung']})[action]||['Lý do','Gửi yêu cầu'];
   sheet(title,form(action,`<input type="hidden" name="id" value="${id}">${extra}${field(label,'reason','',{textarea:true,required:true})}${footer(cta,'',{type:'submit',icon:'send'})}`));
 };
 const confirm=(title,text,action,id='')=>{
   const label=({'reset-confirm':'Đặt lại dữ liệu mẫu','reactivate-confirm':'Tiếp nhận trở lại','invoice-paid-confirm':'Ghi nhận đã thu','account-reset-confirm':'Tạo mật khẩu tạm','account-lock-confirm':ctx.db.accounts.find(a=>a.id===id)?.locked?'Mở khóa tài khoản':'Khóa tài khoản'})[action]||'Xác nhận';
   sheet(title,`${note(text)}${btn(label,action,{class:'primary wide',data:`data-id="${id}"`})}${btn('Hủy','close-sheet',{class:'secondary wide'})}`);
 };
 const captureDraft=f=>{
   const d=values(f),id=f.dataset.form; if(!['login','reply','new-message','task-comment'].includes(id))ctx.db.drafts[id]={...ctx.db.drafts[id],...d};
   if(id==='intake')ctx.db.drafts.intake={...ctx.db.drafts.intake,...d};
   if(id==='class'){const base=ctx.route.startsWith('GV05')?'GV05':ctx.route;ctx.db.drafts[base]={...ctx.db.drafts[base],...d,slots:new FormData(f).getAll('slots')};}
   if(id==='report')ctx.db.drafts['report-'+ctx.db.selectedReport]={...selectedReport(),...d};
   if(id==='task-result')ctx.db.drafts['result-'+ctx.db.selectedTask]=d;
   save();
 };
 async function click(name,el) {
  const db=ctx.db,id=el.dataset.id,value=el.dataset.value;
  switch(name) {
   case 'back': {const parents={GV04b:'GV04',GV04c:'GV04b',TC06c:'TC06b',TC06b:'TC06',TC05c:'TC05',TC05d:'TC05',TC05b:db.role==='gv'?'GV07':db.role==='tbm'?'TBM01':'TC05',TC03:'TC02',TC03b:'TC02',TC07b:'TC07',TC07c:'TC07',GV03:'GV02',TC04:'TC04a',TC04b:db.role==='gv'?'GV03':'TC04'};navigate(parents[ctx.route]||(db.role==='gv'?'GV01':'TC01'));break;}
   case 'close-sheet': close();break;
   case 'role': db.role=value;save();navigate(value==='gv'?'GV01':'TC01',{role:value});break;
   case 'demo-reset': confirm('Đặt lại trải nghiệm?','Xóa dữ liệu mẫu đã chỉnh trên trình duyệt và khôi phục bản ban đầu.','reset-confirm');break;
   case 'reset-confirm': {const role=db.role;ctx.db=seed();ctx.db.role=role;Object.keys(ctx.states).forEach(k=>delete ctx.states[k]);close();save();navigate(role==='gv'?'GV01':'TC01',{replace:true});toast('Đã khôi phục dữ liệu mẫu.');break;}
   case 'filter': ctx.state.filter=value;render();break;
   case 'clear-filter': Object.assign(ctx.state,{filter:'Tất cả',search:'',grade:'',subject:'',shift:''});render();break;
   case 'list-filter': {const kind=el.dataset.kind,options=kind==='grade'?['6','7','8','9','10','11','12']:kind==='shift'?['Sáng','Chiều','Tối']:SUBJECTS;sheet('Chọn '+({grade:'khối',subject:'môn',shift:'ca học'}[kind]),[btn('Tất cả','choose-list-filter',{class:'sheet-option',data:`data-kind="${kind}" data-value=""`}),...options.map(v=>btn(v,'choose-list-filter',{class:'sheet-option',data:`data-kind="${kind}" data-value="${v}"`}))].join(''));break;}
   case 'choose-list-filter':ctx.state[el.dataset.kind]=value;close();render();break;
   case 'screen-menu':sheet('Danh mục màn hình',Object.entries(SCREEN_META).filter(([r])=>r==='A00'||(db.role==='gv'?r.startsWith('GV')||r.startsWith('TC07'):r.startsWith('TC')||(r==='TBM01'&&db.role==='tbm'))).map(([r,[t]])=>link(r,`<code>${r}</code> ${t}`,'sheet-option')).join(''));break;
   case 'shortcuts':sheet('Tác vụ nhanh',(db.role==='gv'?[['GV04','Tiếp nhận học sinh'],['GV05','Xếp lớp'],['GV06','Đổi giáo viên'],['GV06b','Đổi lịch học'],['GV06c','Ngừng học'],['GV09','Giao việc'],['GV10','Điều chỉnh điểm danh'],['GV11','Tài khoản']]:[['TC03c','Buổi học bổ sung'],['TC01b','Thống kê'],['TC07','Trao đổi'],['TC05w','Nhập từ Excel'],...(db.role==='tbm'?[['TBM01','Duyệt báo cáo']]:[])]).map(([r,t])=>link(r,`${t} ${icon('arrow-up-right')}`,'sheet-option')).join(''));break;
   case 'forgot':sheet('Cần cấp lại mật khẩu?',note('Liên hệ Giáo vụ tại trung tâm để xác minh và cấp lại mật khẩu. Tài khoản được trung tâm quản lý.')+btn('Đã hiểu','close-sheet',{class:'primary wide'}));break;
   case 'use-parent':db.drafts.intake={...db.drafts.intake,parentName:el.dataset.name,parentPhone:el.dataset.phone,parentShared:true};save();render();toast('Đã dùng chung thông tin phụ huynh.');break;
   case 'intake-save-only':{const f=document.querySelector('[data-form=intake]');if(f.reportValidity())await finishIntake(f,false);break;}
   case 'select-student':db.selectedStudent=id;{const base=ctx.route.startsWith('GV05')?'GV05':ctx.route;db.drafts[base]={...db.drafts[base],studentSearch:id};}save();render();break;
   case 'pick-subject':captureDraft(document.querySelector('[data-form=class]'));if(ctx.route==='GV05')navigate('GV05-s1');else openClassPicker('GV05-s1');break;
   case 'pick-teacher':captureDraft(document.querySelector('[data-form=class]'));if(ctx.route==='GV05')navigate('GV05-s2');else openClassPicker('GV05-s2');break;
   case 'choose-subject':{const base=ctx.route.startsWith('GV05')?'GV05':ctx.route;db.drafts[base]={...db.drafts[base],subject:value,teacher:TEACHERS.find(t=>t.subject===value).id};save();close();render();break;}
   case 'choose-teacher':{const base=ctx.route.startsWith('GV05')?'GV05':ctx.route;db.drafts[base]={...db.drafts[base],teacher:value};save();close();render();break;}
   case 'reactivate':confirm('Tiếp nhận học sinh trở lại?','Hồ sơ chuyển sang Chờ xếp lớp. Kiểm tra môn học, giáo viên và lịch học trước khi xếp lớp.','reactivate-confirm');break;
   case 'reactivate-confirm':{const s=db.students.find(s=>s.id===db.selectedStudent);s.status='Chờ xếp lớp';if(s.courses)s.courses.forEach(c=>c.status='Chờ xếp lớp');audit('Tiếp nhận học sinh trở lại',{student:s.id});save();close();render();break;}
   case 'class-confirm':applyClass(JSON.parse(el.dataset.payload||'{}'));break;
   case 'scan':sheet('Bài kiểm tra đầu vào',`<div class="scan-preview">${icon('file-text',48)}<h3>Phiếu đánh giá đầu vào</h3><p>Bản xem trước minh họa</p><p>Nền tảng · Năng lực · Thái độ</p><p>Chưa có bản chụp thật để hiển thị.</p></div>${btn('Đóng','close-sheet',{class:'primary wide'})}`);break;
   case 'week':ctx.state.weekOffset=(ctx.state.weekOffset||0)+Number(value);render();break;
   case 'week-reset':ctx.state.weekOffset=0;render();break;
   case 'day':ctx.state.day=value;render();break;
   case 'day-mode':ctx.state.dayMode=value;render();break;
   case 'schedule-view':{if(value==='week')navigate('TC02');else{const key=`${db.role}-TC02b`;(ctx.states[key]||={}).dayMode=value==='student'?'student':'session';navigate('TC02b');}break;}
   case 'stats-month':{const date=new Date((ctx.state.statsDate||'2026-10')+'-01');date.setMonth(date.getMonth()+Number(value));ctx.state.statsDate=date.toISOString().slice(0,7);ctx.state.month=new Intl.DateTimeFormat('vi-VN',{month:'long',year:'numeric'}).format(date);render();break;}
   case 'mark':{const s=selectedSession();if(isLocked(s)){toast('Điểm danh đã khóa. Gửi đề nghị đến giáo vụ để điều chỉnh.');return;}db.drafts['marks-'+s.id]={...(db.drafts['marks-'+s.id]||s.marks),[el.dataset.student]:value};save();render();break;}
   case 'mark-all':{const s=selectedSession();if(isLocked(s))return;db.drafts['marks-'+s.id]=Object.fromEntries(s.students.filter(id=>db.students.some(x=>x.id===id&&x.status==='Đang học')).map(id=>[id,'Có']));save();render();break;}
   case 'save-attendance':{const s=selectedSession();if(isLocked(s)){toast('Điểm danh đã khóa. Gửi đề nghị đến giáo vụ để điều chỉnh.');return;}const m=db.drafts['marks-'+s.id]||s.marks;const active=s.students.filter(id=>db.students.some(x=>x.id===id&&x.status==='Đang học'));if(active.some(id=>!m[id])){toast('Chọn Có mặt hoặc Vắng cho từng học sinh trước khi lưu điểm danh.');return;}const changes=active.filter(id=>s.marks[id]!==m[id]).map(id=>`${db.students.find(x=>x.id===id).name}: ${statusLabel(s.marks[id]||'Chưa điểm danh')} → ${statusLabel(m[id])}`);s.marks={...m};delete db.drafts['marks-'+s.id];if(changes.length)audit(changes.join('; '),{session:s.id});save();render();toast('Đã lưu điểm danh và cập nhật chuyên cần.');break;}
   case 'request-attendance':{const s=selectedSession();sheet('Đề nghị điều chỉnh điểm danh',form('attendance-request',field('Học sinh','student',s.students[0],{options:s.students.map(id=>[id,db.students.find(x=>x.id===id)?.name||id])})+field('Kết quả điểm danh đề nghị','to','Có',{options:[['Có','Có mặt'],['Vắng','Vắng']]})+field('Lý do điều chỉnh','reason','',{textarea:true,required:true})+footer('Gửi đề nghị','',{type:'submit',icon:'send'})));break;}
   case 'request-approve':processRequest(id);break;
   case 'request-reject':showReason('Từ chối yêu cầu','reject-request',id);break;
   case 'report-draft':{const f=document.querySelector('[data-form=report]');captureDraft(f);const r=selectedReport();Object.assign(r,db.drafts['report-'+r.id]);r.status='Nháp';r.head=false;r.office=false;save();navigate('TC05');toast('Đã lưu bản nháp.');break;}
   case 'edit-report':navigate(selectedReport().status==='Làm lại'?'TC05d':'TC05c');break;
   case 'report-approve':if(approveReport(db,id,db.role)){save();render();toast('Đã duyệt báo cáo.');}else toast('Báo cáo chưa đến lượt duyệt của bạn.');break;
   case 'report-return':showReason('Yêu cầu bổ sung báo cáo','return-report',id);break;
   case 'submit-drafts':{const drafts=db.reports.filter(r=>r.status==='Nháp'&&r.teacher==='T01');const invalid=drafts.filter(r=>!validReport(r));if(invalid.length){toast(`${invalid.length} bản nháp thiếu thông tin. Mở báo cáo để bổ sung.`);return;}for(const r of drafts)submitReport(r);save();render();toast(`Đã gửi ${drafts.length} báo cáo đến Trưởng bộ môn.`);break;}
   case 'excel-template':await excelTemplate();break;
   case 'excel-import':importReports();break;
   case 'create-invoices':{const month=ctx.state.invoiceMonth||'2026-10';let added=0;for(const s of db.students){const count=attendance(db,s.id,month).present;if(!count||db.invoices.some(i=>i.student===s.id&&i.month===month))continue;db.invoices.push({id:`HD-${month}-${s.id}`,student:s.id,month,sessions:count,amount:count*150000,items:courses(s).map(c=>({subject:c.subject,sessions:attendance(db,s.id,month,c.subject).present,amount:attendance(db,s.id,month,c.subject).present*150000})).filter(i=>i.sessions),paid:false});added++;}save();render();toast(added?`Đã tạo ${added} thông báo học phí từ sổ điểm danh.`:'Chưa có buổi học được điểm danh trong tháng hoặc học phí tháng đã được lập.');break;}
   case 'invoice-paid':confirm('Ghi nhận đã thu?',`Xác nhận khoản học phí này đã được thu. Bản trải nghiệm chỉ cập nhật trạng thái, không thực hiện thanh toán.`,'invoice-paid-confirm',id);break;
   case 'invoice-paid-confirm':{const invoice=db.invoices.find(i=>i.id===id);invoice.paid=true;invoice.paidAt=stamp();save();close();render();toast('Đã ghi nhận học phí đã thu.');break;}
   case 'account-open':ctx.state.account=id;render();break;
   case 'account-close':ctx.state.account=null;render();break;
   case 'account-reset':confirm('Đặt lại mật khẩu?',`Tạo mật khẩu tạm cho ${db.accounts.find(a=>a.id===id)?.name} trong bản trải nghiệm.`,'account-reset-confirm',id);break;
   case 'account-reset-confirm':{const a=db.accounts.find(a=>a.id===id);a.lastReset=stamp();save();sheet('Mật khẩu tạm đã tạo',note('BIZ-DEMO-2026 · Chỉ là phản hồi mẫu, chưa thay đổi hệ thống tài khoản thật.')+btn('Đã ghi nhận','close-sheet',{class:'primary wide'}));break;}
   case 'account-lock':{const a=db.accounts.find(a=>a.id===id);confirm(a.locked?'Mở khóa tài khoản?':'Khóa tài khoản?',`${esc(a.name)} · ${a.locked?'Cho phép tài khoản hoạt động trở lại.':'Chuyển tài khoản sang trạng thái Tạm khóa.'} Thay đổi chỉ áp dụng trong bản trải nghiệm.`,'account-lock-confirm',id);break;}
   case 'account-lock-confirm':{const a=db.accounts.find(a=>a.id===id);a.locked=!a.locked;save();close();render();break;}
   case 'task-accept':{const t=db.tasks.find(t=>t.id===id)||selectedTask();if(t.status!=='Mới giao')return;t.status='Đang làm';t.history.push({text:'Giáo viên tiếp nhận công việc',time:stamp()});save();render();toast('Đã tiếp nhận công việc.');break;}
   case 'task-ask':db.selectedTask=id;showReason('Trao đổi với người giao việc','ask-task',id, note('Nêu nội dung cần làm rõ. Trao đổi được lưu trong chi tiết công việc.'));break;
   case 'task-progress':{const t=selectedTask();t.progress=Number(document.querySelector('[name=progress]').value);t.history.push({text:`Cập nhật tiến độ ${t.progress}%`,time:stamp()});save();render();toast('Đã cập nhật tiến độ.');break;}
   case 'task-result':navigate('TC06c');break;
   case 'task-close':{const t=selectedTask();if(db.role!=='gv'||t.status!=='Chờ xác nhận')return;t.status='Đã đóng';t.history.push({text:'Người giao việc xác nhận hoàn thành',time:stamp()});save();render();toast('Đã xác nhận hoàn thành công việc.');break;}
   case 'task-return':showReason('Yêu cầu bổ sung kết quả','return-task',selectedTask().id);break;
  }
 }
 function validReport(r){return r.foundation&&r.ability&&r.attitude&&r.comment?.trim()&&r.next?.trim();}
 function submitReport(r){r.status='Chờ duyệt';r.head=false;r.office=false;r.reason='';r.submittedAt=new Date().toISOString();r.history.push({text:'Giáo viên gửi báo cáo để xét duyệt',time:stamp()});delete ctx.db.drafts['report-'+r.id];}
 async function submit(name,f) {
  const db=ctx.db,d=values(f);
  switch(name){
   case 'login':if(!/^0\d{9}$/.test(d.phone)||d.password.length<6){error(f,'Số điện thoại cần có 10 chữ số, bắt đầu bằng 0. Mật khẩu cần ít nhất 6 ký tự.');return;}navigate(db.role==='gv'?'GV01':'TC01');toast('Đã vào không gian trải nghiệm mẫu.');break;
   case 'intake':captureDraft(f);if(ctx.route==='GV04'){if(!validPhone(d.studentPhone,true)){error(f,'Số điện thoại học sinh cần có 10 chữ số, bắt đầu bằng 0. Có thể bỏ trống nếu chưa có.');return;}navigate('GV04b');}else if(ctx.route==='GV04b'){if(!validPhone(d.parentPhone)||!validPhone(d.emergencyPhone)){error(f,'Số điện thoại phụ huynh và người liên hệ khẩn cấp cần có 10 chữ số, bắt đầu bằng 0.');return;}navigate('GV04c');}else await finishIntake(f,true);break;
   case 'class':captureDraft(f);{const base=ctx.route.startsWith('GV05')?'GV05':ctx.route,c=db.drafts[base],s=db.students.find(s=>s.id===db.selectedStudent);if(c.studentSearch!==s.id&&c.studentSearch!==s.name){error(f,'Chọn học sinh từ danh sách gợi ý trước khi lưu.');return;}if(base!=='GV06c'&&!c.slots.length){error(f,'Chọn ít nhất một ca học trong tuần.');return;}if(c.start<today()){error(f,'Ngày áp dụng cần từ hôm nay trở đi. Chọn lại ngày để tiếp tục.');return;}if(c.reason==='Lý do khác'&&!c.reasonDetail?.trim()){error(f,'Ghi rõ lý do khác trước khi tiếp tục.');return;}const summary=`${s.name} · ${base==='GV06c'?'Ngừng học':c.subject||s.subject} · Hiệu lực ${c.start}`;sheet('Kiểm tra trước khi lưu',note(esc(summary))+`<button class="btn primary wide" data-action="class-confirm" data-payload="${esc(JSON.stringify({base,...c}))}">Xác nhận lưu</button>`+btn('Quay lại kiểm tra','close-sheet',{class:'secondary wide'}));}break;
   case 'class-date':{db.drafts.GV05={...db.drafts.GV05,start:d.start};save();close();render();break;}
   case 'attendance-request':{const s=selectedSession();if(s.marks[d.student]===d.to){error(f,'Kết quả đề nghị trùng với điểm danh đã lưu. Chọn kết quả cần điều chỉnh.');return;}db.requests.push({id:'YC'+Date.now(),session:s.id,teacher:s.teacher,student:d.student,from:s.marks[d.student]||'Chưa điểm danh',to:d.to,reason:d.reason,status:'Chờ duyệt',time:stamp(),kind:'Điều chỉnh điểm danh'});save();close();toast('Đã gửi yêu cầu đến Giáo vụ.');break;}
   case 'extra-session':if(d.subject!==db.students.find(s=>s.id===d.student)?.subject){error(f,'Môn học chưa khớp với hồ sơ học sinh. Kiểm tra lại học sinh hoặc môn học.');return;}if(d.date<today()){db.requests.push({id:'YC'+Date.now(),...d,kind:d.kind,status:'Chờ duyệt',time:stamp()});save();navigate('TC02');toast('Đã gửi đề nghị bổ sung buổi học đến giáo vụ.');}else{addSession(d);save();navigate('TC02');toast('Đã bổ sung buổi học vào lịch dạy.');}break;
   case 'reject-request':{const r=db.requests.find(r=>r.id===d.id);r.status='Từ chối';r.response=d.reason;db.notices.unshift({id:'N'+Date.now(),title:'Đề nghị điều chỉnh điểm danh chưa được duyệt',body:d.reason,route:'TC03b'});audit('Từ chối yêu cầu: '+d.reason,{session:r.session});save();close();render();break;}
   case 'report':{captureDraft(f);const r=selectedReport(),draft=db.drafts['report-'+r.id];if(!validReport(draft)){error(f,'Chọn đủ ba mức đánh giá, nhập nhận xét học tập và kế hoạch hỗ trợ tháng tới trước khi gửi.');return;}Object.assign(r,draft);submitReport(r);save();navigate('TC05');toast('Đã gửi báo cáo đến Trưởng bộ môn.');break;}
   case 'return-report':{const r=db.reports.find(r=>r.id===d.id);r.status='Làm lại';r.reason=d.reason;r.head=false;r.office=false;r.history.push({text:`${ROLES[db.role]} yêu cầu bổ sung: ${d.reason}`,time:stamp()});db.notices.unshift({id:'N'+Date.now(),title:'Báo cáo cần bổ sung',body:d.reason,route:'TC05'});save();close();render();break;}
   case 'assign-task':{const t={id:'CV'+Date.now(),...d,owner:'Giáo vụ · Thu Phương',status:'Mới giao',progress:0,files:files(f),comments:[],history:[{text:'Giáo vụ giao việc',time:stamp()}]};db.tasks.unshift(t);db.notices.unshift({id:'N'+Date.now(),title:'Bạn có công việc mới',body:d.title,route:'TC06'});db.selectedTask=t.id;save();navigate('TC06b');toast('Đã giao công việc cho giáo viên.');break;}
   case 'task-result':{const t=selectedTask();t.result=d.result;t.files.push(...files(f));t.status='Chờ xác nhận';t.progress=100;t.history.push({text:'Giáo viên gửi kết quả',time:stamp()});delete db.drafts['result-'+t.id];save();navigate('TC06b');toast('Kết quả đã gửi, đang chờ người giao việc xác nhận.');break;}
   case 'task-comment':{const t=selectedTask();t.comments.push({author:ROLES[db.role],text:d.text,time:stamp()});save();render();toast('Đã gửi trao đổi công việc.');break;}
   case 'ask-task':{const t=db.tasks.find(t=>t.id===d.id);t.comments.push({author:'Giáo viên',text:d.reason,time:stamp()});t.history.push({text:'Giáo viên hỏi lại yêu cầu',time:stamp()});save();close();render();break;}
   case 'return-task':{const t=selectedTask();t.status='Đang làm';t.comments.push({author:'Người giao việc',text:d.reason,time:stamp()});t.history.push({text:'Người giao việc yêu cầu bổ sung: '+d.reason,time:stamp()});save();close();render();break;}
   case 'reply':{const t=db.threads.find(t=>t.id===db.selectedThread);t.messages.push({sender:'me',text:d.text,file:files(f)[0],time:new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}),seen:false});save();render();document.querySelector('#app').scrollTop=document.querySelector('#app').scrollHeight;break;}
   case 'new-message':{let t=db.threads.find(t=>t.name===d.recipient);if(!t){t={id:'TN'+Date.now(),name:d.recipient,group:'Trao đổi công việc',unread:0,messages:[]};db.threads.unshift(t);}t.messages.push({sender:'me',text:d.text,file:files(f)[0],time:new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}),seen:false});db.selectedThread=t.id;save();navigate('TC07b');toast('Đã gửi tin nhắn trong bản trải nghiệm.');break;}
  }
 }
 function validPhone(p,optional=false){return optional&&!p||/^0\d{9}$/.test(p);}
 async function finishIntake(f,create){
  captureDraft(f);const db=ctx.db,d=db.drafts.intake;
  const t=TEACHERS.find(t=>t.id===d.testTeacher);if(t?.subject!==d.subject){error(f,'Giáo viên kiểm tra cần thuộc bộ môn đã chọn. Chọn lại môn học hoặc giáo viên.');return;}
  if(!d.name||!d.school||!d.parentName||!d.parentPhone||!d.notes){error(f,'Hoàn thành cả 3 bước trước khi lưu hồ sơ.');return;}
  const id=`HS${String(db.students.length+1).padStart(3,'0')}`;
  db.students.push({id,name:d.name,school:d.school,grade:d.grade,status:'Chờ xếp lớp',subject:d.subject,teacher:d.testTeacher,level:d.level,notes:d.notes,slots:[],planned:8,score:'—',start:'',intake:{...d,files:files(f)}});
  db.selectedStudent=id;delete db.drafts.intake;save();navigate(create?'GV05':'GV03');toast('Đã lưu hồ sơ học sinh mới.');
 }
 function applyClass(d){
  const db=ctx.db,s=db.students.find(s=>s.id===db.selectedStudent);if(!s)return;
  const text=d.base==='GV06c'?'Ngừng học':d.base==='GV06b'?'Đổi lịch học':d.base==='GV06'?'Đổi giáo viên':'Xếp lớp';
  if(d.start>today()){
   (db.scheduledChanges||=[]).push({student:s.id,...d});audit(`${text} · Chờ hiệu lực ${d.start}`,{student:s.id});
  }else{
   applyEnrollment(db,s.id,d);
   audit(`${text} · Hiệu lực ${d.start}${d.reason?' · '+d.reason:''}`,{student:s.id});
  }
  db.notices.unshift({id:'N'+Date.now(),title:text+' · '+s.name,body:`${s.subject} · hiệu lực ${d.start}`,route:'TC02'});delete db.drafts[d.base];save();close();navigate('GV03');toast(d.start>today()?'Đã lưu điều chỉnh có ngày hiệu lực.':'Đã cập nhật hồ sơ và lịch dạy.');
 }
 function addSession(d){const db=ctx.db,date=new Date(d.date+'T12:00:00+07:00');let day=d.day||['CN','T2','T3','T4','T5','T6','T7'][date.getDay()];if(d.day){const current=['CN','T2','T3','T4','T5','T6','T7'].indexOf(d.day);date.setDate(date.getDate()+(current-date.getDay()+7)%7);}const sessionDate=d.day?new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok',year:'numeric',month:'2-digit',day:'2-digit'}).format(date):d.date;
  const existing=db.sessions.find(s=>s.date===sessionDate&&s.shift===d.shift&&s.teacher===(d.teacher||'T01')&&s.name.startsWith(d.subject)&&!isLocked(s));if(existing){if(!existing.students.includes(d.student))existing.students.push(d.student);return existing;}
  const s={id:'CA'+Date.now()+'-'+db.sessions.length,name:`${d.subject} · ${d.kind==='Xếp lớp'?'Lớp mới':d.kind}`,day,shift:d.shift,time:{Sáng:'08:00 – 09:30',Chiều:'14:00 – 15:30',Tối:'18:00 – 19:30'}[d.shift],date:sessionDate,students:[d.student],teacher:d.teacher||'T01',marks:{},locked:sessionDate<today(),extra:d.kind!=='Xếp lớp'};db.sessions.push(s);return s;
 }
 function processRequest(id){const db=ctx.db,r=db.requests.find(r=>r.id===id);if(!r||r.status!=='Chờ duyệt')return;if(r.session){const s=db.sessions.find(s=>s.id===r.session);s.marks[r.student]=r.to;audit(`${db.students.find(s=>s.id===r.student)?.name}: ${statusLabel(r.from)} → ${statusLabel(r.to)} · ${r.reason}`,{session:s.id});}else{const s=addSession(r);audit(`Duyệt buổi ${r.kind} · ${r.reason}`,{session:s.id});}r.status='Đã duyệt';db.notices.unshift({id:'N'+Date.now(),title:'Đề nghị điều chỉnh điểm danh đã được duyệt',body:r.reason,route:'TC02'});save();render();toast('Đã duyệt và cập nhật chuyên cần.');}
 function openClassPicker(route){const db=ctx.db,base=ctx.route.startsWith('GV05')?'GV05':ctx.route,d=db.drafts[base]||{},s=db.students.find(s=>s.id===db.selectedStudent);if(route==='GV05-s1')sheet('Chọn môn học',SUBJECTS.map(subject=>btn(`${icon('book-open')} ${subject}`,'choose-subject',{class:'sheet-option',data:`data-value="${subject}"`})).join(''));else if(route==='GV05-s2'){const subject=d.subject||s.subject;sheet('Giáo viên bộ môn '+esc(subject),TEACHERS.filter(t=>t.subject===subject).map(t=>btn(`${avatar(t.name)}<span>${esc(t.name)}<small>${t.subject}</small></span>`,'choose-teacher',{class:'sheet-option',data:`data-value="${t.id}"`})).join(''));}else sheet('Chọn ngày bắt đầu',form('class-date',field('Ngày bắt đầu','start',d.start||today(),{type:'date',min:today(),required:true})+footer('Chọn ngày','',{type:'submit'})));}
 function input(e){const target=e.target,f=target.closest('[data-form]');if(f&&!['login','reply','new-message','task-comment'].includes(f.dataset.form))captureDraft(f);
  if(target.name==='search'){ctx.state.search=target.value;const pos=target.selectionStart;render();const input=document.querySelector('[name=search]');input.focus();input.setSelectionRange(pos,pos);}
  if(f?.dataset.form==='class'&&target.name==='studentSearch'){const list=ctx.db.students.filter(s=>`${s.id} ${s.name}`.toLowerCase().includes(target.value.toLowerCase()));document.querySelector('#student-suggestions').innerHTML=list.slice(0,5).map(s=>btn(`${s.id} · ${esc(s.name)}<small>Khối ${s.grade} · ${esc(s.school)}</small>`,'select-student',{class:'sheet-option',data:`data-id="${s.id}"`})).join('');}
  if(f?.dataset.form==='intake'&&target.name==='name'){const found=ctx.db.students.find(s=>s.name.trim().toLowerCase()===target.value.trim().toLowerCase());document.querySelector('#duplicate-student').innerHTML=found?note(`Trùng họ tên với ${found.id}. Kiểm tra trước khi tạo hồ sơ mới. ${link('GV03','Xem hồ sơ','text-link',`data-student="${found.id}"`)}`):'';}
  if(f?.dataset.form==='intake'&&target.name==='parentPhone'){const found=ctx.db.students.find(s=>s.intake?.parentPhone===target.value);document.querySelector('#duplicate-parent').innerHTML=found?note(`Số điện thoại này đã liên kết với phụ huynh của ${esc(found.name)}. ${btn('Dùng thông tin phụ huynh','use-parent',{class:'text-link',data:`data-name="${esc(found.intake.parentName)}" data-phone="${esc(target.value)}"`})}`):'';}
 }
 async function change(e){const t=e.target;if(t.id==='mobile-role'){ctx.db.role=t.value;save();navigate(t.value==='gv'?'GV01':'TC01',{role:t.value});}if(t.name==='reportMonth'){ctx.state.reportMonth=t.value;render();}if(t.name==='invoiceMonth'){ctx.state.invoiceMonth=t.value;render();}if(t.name==='subject'&&t.closest('[data-form=class]')){const base=ctx.route.startsWith('GV05')?'GV05':ctx.route;const s=ctx.db.students.find(s=>s.id===ctx.db.selectedStudent),course=courses(s).find(c=>c.subject===t.value);ctx.db.drafts[base]={...ctx.db.drafts[base],subject:t.value,teacher:course?.teacher,slots:course?.slots};save();render();}if(t.name==='assignee'){const teacher=TEACHERS.find(x=>x.id===t.value);document.querySelector('#assignee-head').innerHTML=note('Trưởng bộ môn: '+esc(teacher.head));}if(t.id==='excel-upload')await readExcel(t.files[0]);}
 async function xlsx(){if(window.XLSX)return window.XLSX;await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='./assets/xlsx.full.min.js';script.onload=resolve;script.onerror=reject;document.head.append(script);});return window.XLSX;}
 async function excelTemplate(){try{const X=await xlsx(),rows=ctx.db.students.filter(s=>s.teacher==='T01'&&s.status==='Đang học').map(s=>({'Mã HS':s.id,'Họ tên':s.name,'Môn':s.subject,'Chuyên cần':attendance(ctx.db,s.id).present,'Điểm':'','Nền tảng':'M3','Năng lực':'M2','Thái độ':'M3','Nhận xét':'','Kế hoạch hỗ trợ tháng tới':''}));const book=X.utils.book_new(),sheet=X.utils.json_to_sheet(rows);sheet['!cols']=[{wch:12},{wch:24},{wch:12},{wch:14},{wch:10},{wch:14},{wch:14},{wch:14},{wch:45},{wch:45}];X.utils.book_append_sheet(book,sheet,'Bao cao');X.writeFile(book,'Biz-mau-bao-cao.xlsx');toast('Đã tải tệp mẫu Excel.');}catch{toast('Không tải được bộ đọc Excel. Thử lại sau khi tải lại trang.');}}
 async function readExcel(file){if(!file)return;ctx.state.importError='';ctx.state.importRows=[];if(file.size>5*1024*1024||!file.name.toLowerCase().endsWith('.xlsx')){ctx.state.importError='Chọn tệp .xlsx không quá 5 MB.';render();return;}try{const X=await xlsx(),book=X.read(await file.arrayBuffer(),{type:'array'}),rows=X.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{defval:''});if(!rows.length||rows.length>500){ctx.state.importError='Tệp cần có từ 1 đến 500 dòng dữ liệu. Kiểm tra lại tệp trước khi tải lên.';render();return;}ctx.state.importRows=validateImport(rows,ctx.db);}catch{ctx.state.importError='Không đọc được tệp Excel. Dùng tệp mẫu .xlsx và tải lên lại.';}render();}
 function importReports(){const db=ctx.db,rows=(ctx.state.importRows||[]).filter(r=>r.valid);for(const {row} of rows){const sid=String(row['Mã HS']).trim();let r=db.reports.find(r=>r.student===sid&&r.month==='2026-10');if(r&&['Chờ duyệt','Đã duyệt'].includes(r.status))continue;if(!r){r={id:'BC'+Date.now()+'-'+sid,student:sid,month:'2026-10',subject:row['Môn'],teacher:'T01',history:[]};db.reports.push(r);}Object.assign(r,{score:String(row['Điểm']||''),foundation:row['Nền tảng'],ability:row['Năng lực'],attitude:row['Thái độ'],comment:row['Nhận xét'],next:row['Kế hoạch hỗ trợ tháng tới']||row['Định hướng tháng sau']||'',status:'Nháp',head:false,office:false});r.history.push({text:'Lưu bản nháp từ Excel',time:stamp()});}ctx.state.importRows=[];save();navigate('TC05');toast('Đã lưu các báo cáo hợp lệ vào bản nháp. Báo cáo chờ duyệt hoặc đã duyệt được giữ nguyên.');}
 return {click,submit,input,change,openClassPicker};
}
