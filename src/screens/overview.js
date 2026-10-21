import { ROLES, teacherName, today, isLocked, attendance } from '../data.js';
import {icon,link,btn,avatar,head,pill,section,progress,detail,form,field,footer,esc} from '../ui.js';
const metric=(number,label,route,ico)=>link(route,`<span class="metric-top">${icon(ico)}${icon('arrow-up-right',18)}</span><strong>${number}</strong><span>${label}</span>`,'metric');
export function overview(ctx) {
  const {db,route}=ctx;
  if(route==='A00') return `<div class="login-art"><span class="brand-mark">b<span>↗</span></span><div class="art-orbit"></div><span class="art-caption">KẾT NỐI ĐỘI NGŨ · ĐỒNG HÀNH HỌC SINH</span></div><div class="login-content"><p class="eyebrow">CHÀO MỪNG ĐẾN BIZ</p><h1>Cùng dạy tốt,<br>cùng học tốt.</h1><p>Không gian làm việc dành cho đội ngũ đào tạo.</p>${form('login',field('Số điện thoại','phone','',{type:'tel',required:true,autocomplete:'username',placeholder:'Nhập số điện thoại'})+field('Mật khẩu','password','',{type:'password',required:true,autocomplete:'current-password',placeholder:'Nhập mật khẩu'})+btn('Quên mật khẩu?','forgot',{class:'text-link'})+footer('Đăng nhập','',{type:'submit',icon:'arrow-right'}))}<p class="login-hint">Tài khoản do trung tâm cấp</p></div>`;
  if(route==='TC01b') return stats(ctx);
  return centerOverview(ctx);
}

function centerOverview(ctx) {
 const {db}=ctx,office=db.role==='gv',name=office?'Thu Phương':'Minh Anh';
 const daySessions=db.sessions.filter(s=>s.date===today()&&s.students.length&&(office||s.teacher==='T01'));
 const unmarked=daySessions.filter(s=>!isLocked(s)&&s.students.some(id=>!s.marks[id]));
 const reports=db.reports.filter(r=>r.status==='Chờ duyệt'&&r.head),pending=db.students.filter(s=>s.status==='Chờ xếp lớp');
 const next=daySessions.find(s=>!isLocked(s));
 const follow=db.students.filter(s=>s.teacher==='T01'&&s.status==='Đang học'&&attendance(db,s.id).present<s.planned);
 const date=new Intl.DateTimeFormat('vi-VN',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
 const greeting=`<header class="center-greeting">${avatar(name)}<div><p>${esc(date)}</p><h1 tabindex="-1">Chào ${name}</h1></div>${link('TC07',icon('bell'),'circle notification','aria-label="Mở tin nhắn và thông báo"')}</header>`;
 const notices=section('Thông báo chung',link('TC07','Xem tất cả'))+`<div class="notice-list">${db.notices.slice(0,2).map(n=>link(n.route,`<span class="notice-dot"></span><span><strong>${esc(n.title)}</strong><small>${esc(n.body)}</small></span>${icon('chevron-right',16)}`,'notice-row')).join('')}</div>`;
 if(office)return greeting+`<div class="metrics center-kpis">${metric(pending.length,'Chờ xếp lớp','GV02','users')+metric(reports.length,'Báo cáo chờ duyệt','GV07','file-text')+metric(unmarked.length,'Buổi chưa điểm danh','TC02','calendar')+metric(db.invoices.filter(i=>!i.paid).length,'Học phí chưa thu','GV08','credit-card')}</div>`+
 section('Tác vụ nhanh',btn(icon('grid'),'shortcuts',{class:'circle',data:'aria-label="Mở tác vụ nhanh"'}))+`<div class="shortcuts">${[['GV04','user-plus','Tiếp nhận học sinh'],['GV05','plus-square','Xếp lớp'],['GV06','refresh-cw','Đổi giáo viên'],['GV06b','calendar','Đổi lịch học'],['GV06c','user-minus','Ngừng học'],['GV08','file-text','Học phí']].map(([r,i,t])=>link(r,`${icon(i)}<span>${t}</span>`,'shortcut')).join('')}</div>`+
 section('Lịch học trong ngày')+`<div class="center-day-list">${['Sáng','Chiều','Tối'].map(shift=>{const rows=daySessions.filter(s=>s.shift===shift);return link('TC02',`<strong>${shift}</strong><span>${rows.length} ca · ${rows.reduce((n,s)=>n+s.students.length,0)} học sinh</span>${icon('chevron-right',16)}`,'simple-row');}).join('')}</div>`+notices+`<div class="utility-links">${[['GV09','Giao việc'],['GV10','Điều chỉnh điểm danh'],['GV11','Tài khoản']].map(([r,t])=>link(r,t)).join('')}</div>`;
 return greeting+
 (unmarked.length?link('TC03',`${icon('alert-circle')}<span><strong>${unmarked.length} buổi chưa điểm danh</strong><small>Cập nhật trước 00:00 ngày mai</small></span>${icon('chevron-right')}`,'center-alert',`data-session="${unmarked[0].id}"`):`<div class="note">${icon('check')} Đã hoàn tất điểm danh các buổi học hôm nay.</div>`)+
 (next?link('TC03',`<span class="center-class-time">${esc(next.time.split(' – ')[0])}<small>Ca tiếp theo</small></span><span><strong>${esc(next.name)}</strong><small>${next.students.length} học sinh · ${esc(next.shift)}</small></span>${icon('chevron-right')}`,'center-next-class',`data-session="${next.id}"`):`<div class="note">Hôm nay chưa có ca dạy.</div>`)+
 section('Học sinh cần theo dõi',link('TC04a',`${follow.length} học sinh`))+`<div class="center-follow">${follow.slice(0,2).map(s=>link('TC04',`<span>${esc(s.name)}</span><strong>${attendance(db,s.id).present}/${s.planned} buổi</strong>`,'simple-row',`data-student="${s.id}"`)).join('')||'<p>Chưa có học sinh cần theo dõi thêm về số buổi học.</p>'}</div>`+
 `<div class="metrics">${metric('38<span>/40</span>','Buổi dạy tháng này','TC01b','calendar')+metric('7<span>/10</span>','Mục tiêu quý IV','TC01b','target')}</div>`+
 link('TC01b',`${icon('bar-chart-2')}<span><strong>Thống kê giảng dạy</strong><small>9 chỉ số theo tháng</small></span>${icon('chevron-right')}`,'simple-row center-stats-link')+
 (db.role==='tbm'?link('TBM01',`${icon('check-square')} Duyệt báo cáo bộ môn ${icon('chevron-right')}`,'full-link'):'')+notices+`<div class="utility-links">${btn('Tác vụ nhanh','shortcuts',{class:'text-link'})}</div>`;
}
function stats(ctx) {
 const {db}=ctx;
 const stats=[['Chuyên cần','92%','2 học sinh chưa đủ số buổi dự kiến','users'],['Buổi dạy','38/40','95% kế hoạch tháng','calendar'],['Mục tiêu quý IV','7/10','3 mục tiêu cần hoàn thành','target'],['Biến động học sinh','+3','Tiếp nhận 4 · Ngừng học 1 · Đổi giáo viên 1 · Dạy thay 2','shuffle'],['Tần suất học','2 buổi','1 buổi: 2 · 2 buổi: 4 · 3 buổi: 1','repeat'],['Điểm trung bình','7,8','<5: 0 · 5–7: 2 · 7–9: 3 · ≥9: 1','bar-chart-2'],['Phân bố theo khối lớp','Khối 7','K7: 40% · K8: 30% · K9: 20% · K10: 10%','pie-chart'],['Thời gian làm việc','64 giờ','Thời gian theo dữ liệu chấm công minh họa','clock'],['Công việc chưa hoàn thành',String(db.tasks.filter(t=>t.status!=='Đã đóng').length),'Cần hoàn thành trong tháng','check-square']];
 return head('Thống kê<br>giảng dạy','THỐNG KÊ')+`<div class="month-picker">${btn(icon('chevron-left'),'stats-month',{class:'circle',data:'data-value="-1" aria-label="Tháng trước"'})}<strong>${esc(ctx.state.month||'Tháng 10, 2026')}</strong>${btn(icon('chevron-right'),'stats-month',{class:'circle',data:'data-value="1" aria-label="Tháng sau"'})}</div><div class="stats-hero"><span>BUỔI DẠY TRONG THÁNG</span><div class="bar-chart">${[55,78,65,94].map((v,i)=>`<div><span style="height:${v}%"><b>${[8,11,9,10][i]}</b></span><small>Tuần ${i+1}</small></div>`).join('')}</div></div><div class="stats-list">${stats.map(([label,n,desc,i])=>`<article>${icon(i)}<div><h3>${label}</h3><small>${desc}</small></div><strong>${n}</strong></article>`).join('')}</div><p class="muted">Dữ liệu minh họa · tháng được chọn để xem bố cục thống kê.</p>`;
}
