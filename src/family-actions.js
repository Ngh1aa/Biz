import {familyOwns,familyChildren,familyContacts,familyThreadVisible,requestLeave,resolveLeave,cancelLeave} from './family.js';
import {btn,field,form,footer,note,esc} from './ui.js';

export function createFamilyActions(ctx){
 const error=(f,text)=>{const el=f.querySelector('.form-error');el.textContent=text;el.hidden=false;el.scrollIntoView({block:'nearest'});};
 const currentThread=()=>ctx.db.familyThreads.find(t=>t.id===ctx.db.selectedFamilyThread&&familyThreadVisible(ctx.db,t));
 function click(name,el){
  const db=ctx.db,id=el.dataset.id;
  if(name==='family-office-open'&&db.role==='gv'){(ctx.states['gv-GV10']||={}).filter='Xin nghỉ';ctx.navigate('GV10');return true;}
  if(name==='family-start-leave'&&db.role==='ph'){db.selectedFamilySession=id;ctx.save();ctx.navigate('PH06a');return true;}
  if(name==='family-cancel'&&db.role==='ph'){
   const r=db.familyRequests.find(r=>r.id===id&&r.parent===db.family.id&&familyOwns(db,r.student)&&r.status==='Chờ xử lý');
   if(r)ctx.sheet('Hủy yêu cầu xin nghỉ?',note('Giáo vụ sẽ thấy yêu cầu đã hủy. Điểm danh và lịch học không thay đổi.')+btn('Xác nhận hủy','family-cancel-confirm',{class:'primary wide',data:`data-id="${r.id}"`})+btn('Giữ yêu cầu','close-sheet',{class:'secondary wide'}));return true;
  }
  if(name==='family-cancel-confirm'&&db.role==='ph'){if(cancelLeave(db,id)){ctx.save();ctx.closeSheet();ctx.render();ctx.toast('Đã hủy yêu cầu xin nghỉ.');}return true;}
  if(['family-approve','family-reject'].includes(name)&&db.role==='gv'){
   const status=name==='family-approve'?'Chấp thuận':'Từ chối';ctx.sheet(`${status} xin nghỉ`,form('family-resolve',`<input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="status" value="${status}">`+note('Chỉ cập nhật phản hồi xin nghỉ. Giáo viên vẫn điểm danh theo thực tế.')+field(status==='Từ chối'?'Lý do từ chối':'Phản hồi cho phụ huynh','response','',{textarea:true,required:status==='Từ chối'})+footer(`Xác nhận ${status.toLowerCase()}`,'',{type:'submit'})));return true;
  }
  return name.startsWith('family-');
 }
 function submit(name,f){
  if(!name.startsWith('family-'))return false;
  const db=ctx.db,d=Object.fromEntries(new FormData(f));
  if(name==='family-resolve'&&db.role==='gv'){
   if(!resolveLeave(db,d.id,d.status,d.response)){error(f,'Yêu cầu đã được xử lý hoặc chưa đủ thông tin. Đóng cửa sổ để kiểm tra lại.');return true;}
   ctx.save();ctx.closeSheet();ctx.render();ctx.toast('Đã cập nhật phản hồi cho phụ huynh.');return true;
  }
  if(name==='family-reply'){
   const thread=currentThread();if(!thread||!d.text?.trim()){error(f,'Chọn hội thoại hợp lệ và nhập nội dung trước khi gửi.');return true;}
   thread.messages.push({role:db.role,text:d.text.trim(),time:new Date().toLocaleString('vi-VN')});ctx.save();ctx.render();document.querySelector('.composer')?.scrollIntoView({block:'end'});ctx.toast('Đã lưu tin nhắn.');return true;
  }
  if(db.role!=='ph')return true;
  if(name==='family-leave'){
   const result=requestLeave(db,d);if(result.error){error(f,result.error);return true;}
   db.selectedFamilyRequest=result.request.id;delete db.drafts['family-leave-'+db.selectedChild];ctx.save();ctx.navigate('PH06b');ctx.toast('Đã gửi xin nghỉ đến Giáo vụ.');return true;
  }
  if(name==='family-message'){
   if(!familyContacts(db).some(c=>c.id===d.recipient)||!d.text?.trim()){error(f,'Chọn người phụ trách hợp lệ và nhập nội dung tin nhắn.');return true;}
   let thread=db.familyThreads.find(t=>t.parent===db.family.id&&t.student===db.selectedChild&&t.recipient===d.recipient);
   if(!thread){thread={id:'FT'+Date.now(),parent:db.family.id,student:db.selectedChild,recipient:d.recipient,messages:[]};db.familyThreads.unshift(thread);}
   thread.messages.push({role:'ph',text:d.text.trim(),time:new Date().toLocaleString('vi-VN')});db.selectedFamilyThread=thread.id;delete db.drafts['family-message-'+db.selectedChild];ctx.save();ctx.navigate('PH05b');ctx.toast('Đã gửi tin nhắn trong bản trải nghiệm.');return true;
  }
  return true;
 }
 function input(e){
  const f=e.target.closest('[data-form]');if(!['family-leave','family-message'].includes(f?.dataset.form)||ctx.db.role!=='ph')return false;
  ctx.db.drafts[f.dataset.form+'-'+ctx.db.selectedChild]=Object.fromEntries(new FormData(f));ctx.save();return true;
 }
 function change(e){
  const t=e.target,db=ctx.db;
  if(t.id==='family-child'&&db.role==='ph'){
   if(!familyChildren(db).some(s=>s.id===t.value))return true;
   db.selectedChild=t.value;for(const k of ['selectedFamilySession','selectedFamilyReport','selectedFamilyInvoice','selectedFamilyRequest','selectedFamilyThread'])delete db[k];ctx.save();
   const list={PH02b:'PH02',PH03b:'PH03',PH04b:'PH04',PH05b:'PH05',PH06b:'PH06'}[ctx.route]||ctx.route;ctx.navigate(list,{replace:true});return true;
  }
  if(t.name==='familyMonth'&&db.role==='ph'){ctx.state.familyMonth=t.value;ctx.render();return true;}
  return false;
 }
 return {click,submit,input,change};
}
