import {load,persist,SCREEN_META,ROLES,applyDueChanges,isLocked} from './data.js';
import {esc,icon,btn,link,empty} from './ui.js';
import {overview} from './screens/overview.js';
import {students} from './screens/students.js';
import {teaching,countdown} from './screens/teaching.js';
import {reports} from './screens/reports.js';
import {operations} from './screens/operations.js';
import {communication} from './screens/communication.js';
import {createActions} from './actions.js';
const states={};
export const ctx={db:load(),route:'GV01',state:{},save,render,navigate,toast,sheet,closeSheet,states};
const defaults={gv:'GV01',tc:'TC01',tbm:'TC01'};
const app=document.querySelector('#app'),dialog=document.querySelector('#sheet');
let theme=new URLSearchParams(location.search).get('theme')==='mono'?'mono':'pastel';
document.documentElement.dataset.theme=theme;
const graphic=(name,className='')=>`<img class="pastel-graphic ${className}" src="./assets/graphics/${name}.svg" width="240" height="260" alt="" aria-hidden="true">`;
function setTheme(value){
 theme=value==='mono'?'mono':'pastel';
 const url=new URL(location.href);url.searchParams.set('theme',theme);history.replaceState(null,'',url);
 document.documentElement.dataset.theme=theme;
 document.querySelector('meta[name="theme-color"]').content=theme==='pastel'?'#fbfbf9':'#f7f7f7';
 renderReviewer();
}
const tabs={
 gv:[['GV01','home','Tổng quan'],['GV02','users','Học sinh'],['GV07','check-square','Duyệt'],['GV08','file-text','Học phí'],['TC07','message-circle','Trao đổi']],
 tc:[['TC01','home','Tổng quan'],['TC02','calendar','Lịch dạy'],['TC04a','users','Học sinh'],['TC05','file-text','Báo cáo'],['TC06','check-square','Công việc']]
};
function save(){try{persist(ctx.db);}catch{toast('Không thể lưu dữ liệu cục bộ. Kiểm tra dung lượng trình duyệt.');}}
let toastTimer;
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3500);}
function sheet(title,html){dialog.innerHTML=`<div class="sheet-grip"></div><div class="sheet-heading"><h2 id="sheet-title">${title}</h2>${btn(icon('x'),'close-sheet',{class:'circle',data:'aria-label="Đóng"'})}</div><div class="sheet-content">${html}</div>`;if(!dialog.open)dialog.showModal();}
function closeSheet(){dialog.close();if(ctx.route.startsWith('GV05-'))navigate('GV05',{replace:true});}
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSheet();}});
dialog.addEventListener('cancel',()=>{if(ctx.route.startsWith('GV05-'))setTimeout(()=>navigate('GV05',{replace:true}),0);});
function navigate(route,opts={}) {
 if(!SCREEN_META[route])route=defaults[ctx.db.role];
 const role=opts.role||ctx.db.role;
 const params=new URLSearchParams();
 const id=opts.id|| (['GV03','TC04','TC04b','GV05','GV06','GV06b','GV06c'].includes(route)?ctx.db.selectedStudent:route.startsWith('TC05')&&!['TC05','TC05w'].includes(route)?ctx.db.selectedReport:['TC03','TC03b'].includes(route)?ctx.db.selectedSession:['TC06b','TC06c'].includes(route)?ctx.db.selectedTask:route==='TC07b'?ctx.db.selectedThread:'');
 if(id)params.set('id',id);
 const hash=`#/${role}/${route}${params.size?'?'+params:''}`;
 if(opts.replace){history.replaceState(null,'',hash);readRoute();}else if(location.hash===hash){render();}else location.hash=hash;
}
function readRoute(){
 theme=new URLSearchParams(location.search).get('theme')==='mono'?'mono':'pastel';document.documentElement.dataset.theme=theme;
 const [path,query]=location.hash.slice(1).split('?'),[,role,route]=path.split('/');
 ctx.db.role=ROLES[role]?role:ctx.db.role;ctx.route=SCREEN_META[route]?route:defaults[ctx.db.role];
 if(ctx.route.startsWith('GV')&&ctx.db.role!=='gv'){navigate(defaults[ctx.db.role],{replace:true});return;}
 if(ctx.route==='TBM01'&&ctx.db.role!=='tbm'){navigate(defaults[ctx.db.role],{replace:true});return;}
 const id=new URLSearchParams(query).get('id');
 if(!id&&ctx.route==='TC03b')ctx.db.selectedSession=ctx.db.sessions.find(s=>isLocked(s))?.id||ctx.db.selectedSession;
 if(!id&&ctx.route==='TC03')ctx.db.selectedSession=ctx.db.sessions.find(s=>!isLocked(s)&&s.teacher==='T01')?.id||ctx.db.selectedSession;
 if(!id&&ctx.route==='TC05d')ctx.db.selectedReport=ctx.db.reports.find(r=>r.status==='Làm lại')?.id||ctx.db.selectedReport;
 if(id){if(['GV03','TC04','TC04b','GV05','GV06','GV06b','GV06c'].includes(ctx.route))ctx.db.selectedStudent=id;
 else if(ctx.route.startsWith('TC05'))ctx.db.selectedReport=id;else if(ctx.route.startsWith('TC03'))ctx.db.selectedSession=id;else if(ctx.route.startsWith('TC06'))ctx.db.selectedTask=id;else if(ctx.route==='TC07b')ctx.db.selectedThread=id;}
 applyDueChanges(ctx.db); ctx.state=states[`${ctx.db.role}-${ctx.route}`]||={};save();
 if(dialog.open)dialog.close();render();app.scrollTop=0;
 app.querySelector('h1')?.focus({preventScroll:true});
 if(ctx.route.startsWith('GV05-'))actions.openClassPicker(ctx.route);
}
function nav(){
 const list=tabs[ctx.db.role==='gv'?'gv':'tc'];
 function active(r){if(r===ctx.route)return true;if(r==='GV02')return ['GV03','GV04','GV04b','GV04c','GV05','GV06','GV06b','GV06c'].includes(ctx.route);if(r==='TC02')return ctx.route.startsWith('TC02')||ctx.route.startsWith('TC03');if(r==='TC04a')return ctx.route.startsWith('TC04');if(r==='TC05')return ctx.route.startsWith('TC05');if(r==='TC06')return ctx.route.startsWith('TC06');return false;}
 return `<nav class="tabbar" aria-label="Điều hướng chính">${list.map(([r,i,t])=>`<button data-go="${r}" class="tab ${active(r)?'active':''}" ${active(r)?'aria-current="page"':''}>${icon(i,21)}<span>${t}</span></button>`).join('')}</nav>`;
}
function render(){
 const r=ctx.route;let html;
 const entitySets={GV03:['students','selectedStudent'],TC04:['students','selectedStudent'],TC04b:['students','selectedStudent'],TC05b:['reports','selectedReport'],TC05c:['reports','selectedReport'],TC05d:['reports','selectedReport'],TC03:['sessions','selectedSession'],TC03b:['sessions','selectedSession'],TC06b:['tasks','selectedTask'],TC06c:['tasks','selectedTask'],TC07b:['threads','selectedThread']};
 const entity=entitySets[r];
 if(entity&&!ctx.db[entity[0]].some(item=>item.id===ctx.db[entity[1]])){
  app.innerHTML=`<div class="screen"><h1 tabindex="-1">Không tìm thấy nội dung</h1>${empty('Liên kết không còn hợp lệ','Nội dung mẫu có thể đã được đặt lại.',link(ctx.db.role==='gv'?'GV01':'TC01','Về tổng quan','btn primary'))}</div>${nav()}`;renderReviewer();return;
 }
 if(['A00','GV01','TC01','TC01b'].includes(r))html=overview(ctx);
 else if(['GV02','GV03','GV04','GV04b','GV04c','GV05','GV05-s1','GV05-s2','GV05-s3','GV06','GV06b','GV06c','TC04a','TC04','TC04b'].includes(r))html=students(ctx);
 else if(r.startsWith('TC02')||r.startsWith('TC03'))html=teaching(ctx);
 else if(r.startsWith('TC05')||['GV07','TBM01'].includes(r))html=reports(ctx);
 else if(r.startsWith('TC07'))html=communication(ctx);
 else html=operations(ctx);
 app.innerHTML=`<div class="screen ${r==='A00'?'login-screen':''}" data-screen="${r}">${html}</div>${r==='A00'?'':nav()}`;
 const hero=app.querySelector('.hero-task');
 if(hero){hero.dataset.category=ctx.db.role==='gv'?'report':'class';hero.querySelector('h2').insertAdjacentHTML('afterend',graphic(ctx.db.role==='gv'?'report-graphic':'pastel-toolkit','task-graphic'));}
 if(r==='A00')app.querySelector('.login-art').insertAdjacentHTML('beforeend',graphic('pastel-toolkit','welcome-graphic'));
 if(['GV03','TC04'].includes(r))app.querySelector('.profile-summary').insertAdjacentHTML('beforeend',graphic('student-graphic','profile-graphic'));
 if(['TC03','TC03b'].includes(r))app.querySelector('.session-summary').insertAdjacentHTML('beforeend',graphic('calendar-graphic','session-graphic'));
 if(r==='TC05b')app.querySelector('.report-student').insertAdjacentHTML('beforeend',graphic('report-graphic','record-graphic'));
 const headerGraphics={GV02:'student-graphic',TC04a:'student-graphic',TC02:'calendar-graphic',TC02b:'calendar-graphic',TC05:'report-graphic',GV07:'report-graphic',TBM01:'report-graphic',TC01b:'report-graphic'};
 if(headerGraphics[r])app.querySelector('.page-head')?.insertAdjacentHTML('beforeend',graphic(headerGraphics[r],'page-graphic'));
 // A reviewer-only comparison of the same overview content and state.
 app.classList.toggle('direction-b',new URLSearchParams(location.search).get('direction')==='b'&&r==='TC01');
 if(app.classList.contains('direction-b')){
   const hero=app.querySelector('.hero-task'),metrics=app.querySelector('.metrics');
   hero.before(metrics);
   const h=hero.querySelector('h2'),bottom=hero.querySelector('.hero-bottom'),top=hero.querySelector('.hero-top');
   hero.innerHTML=`<div class="compact-task-icon">${icon('clock',25)}</div><div class="compact-task-copy">${top.innerHTML}<h2>${h.innerHTML.replaceAll('<br>',' ')}</h2>${bottom.innerHTML}</div>`;
 }
 document.querySelector('#device').classList.toggle('web-device',r==='TC05w');
 document.title=`${SCREEN_META[r][0]} · Biz UX`;
 renderReviewer();
}
function renderReviewer(){
 const role=ctx.db.role,r=ctx.route;
 const pastel=theme==='pastel';
 document.querySelector('.workspace-heading span:last-child').textContent=pastel?'iOS PASTEL · V0.3':'UX TRẮNG ĐEN · V0.3';
 const themeButtons=`<div class="theme-switch" role="group" aria-label="Giao diện trải nghiệm">${[['pastel','Pastel minh họa'],['mono','Trắng đen']].map(([value,label])=>btn(label,'theme',{class:theme===value?'selected':'',data:`data-value="${value}" aria-pressed="${theme===value}"`})).join('')}</div>`;
 const screens=Object.entries(SCREEN_META).filter(([id])=>id==='A00'||(role==='gv'?id.startsWith('GV')||id.startsWith('TC07'):id.startsWith('TC')||(role==='tbm'&&id==='TBM01')));
 const selectedGroup=r.startsWith('GV04')?'Tiếp nhận học sinh':r.startsWith('TC03')?'Lịch dạy và điểm danh':r.startsWith('TC05')||['GV07','TBM01'].includes(r)?'Báo cáo học tập':'Không gian làm việc';
 document.querySelector('#review-tools').innerHTML=`<aside class="review-sidebar"><div class="review-brand">biz<span>↗</span><small>QUẢN LÝ ĐÀO TẠO</small></div><div class="review-version"><span class="live-dot"></span> ${pastel?'PASTEL GRAPHIC':'UX TRẮNG ĐEN'} <b>V0.3</b></div>${themeButtons}<p class="review-label">ĐANG TRẢI NGHIỆM VỚI VAI TRÒ</p><div class="role-switch">${Object.entries(ROLES).map(([key,label])=>btn(`${icon(key==='gv'?'layers':key==='tc'?'book-open':'award',18)} ${label}${key===role?icon('check',16):''}`,'role',{class:key===role?'selected':'',data:`data-value="${key}" aria-pressed="${key===role}"`})).join('')}</div><div class="review-label screen-label">DANH MỤC MÀN HÌNH <span>${screens.length}</span></div><nav class="screen-index" aria-label="Danh mục màn hình UX">${screens.map(([id,[title]])=>link(id,`<code>${id.replace('-','·')}</code><span>${title}</span>`,id===r?'screen-item selected':'screen-item')).join('')}</nav><div class="review-bottom"><p>Dữ liệu mẫu · Lưu trên thiết bị<br>Không kết nối hệ thống thật</p>${btn(icon('rotate-ccw',15)+' Đặt lại bản trải nghiệm','demo-reset',{class:'text-link'})}</div></aside><div class="mobile-review"><b>biz. <small>UX</small></b><label><span class="sr-only">Vai trò trải nghiệm</span><select id="mobile-role">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${k===role?'selected':''}>${v}</option>`).join('')}</select></label>${btn(icon(pastel?'circle':'droplet',17),'theme',{class:'circle',data:`data-value="${pastel?'mono':'pastel'}" aria-label="${pastel?'Xem UX trắng đen':'Xem giao diện pastel'}"`})}${btn(icon('grid',18),'screen-menu',{class:'circle',data:'aria-label="Danh mục màn hình"'})}</div>`;
 document.querySelector('#context-panel').innerHTML=`<div class="context-top"><span class="context-number">${r}</span><p>${selectedGroup}</p><h2>${SCREEN_META[r][0]}</h2><span class="context-rule"></span><p>${SCREEN_META[r][1]}</p></div><div class="context-block"><span class="review-label">NGUYÊN TẮC TRẢI NGHIỆM</span><ul><li>Trạng thái hiện tại rõ ràng</li><li>Mỗi màn một việc chính</li><li>Luôn có đường quay lại</li></ul></div><div class="context-block"><span class="review-label">THỬ MỘT LUỒNG</span>${(role==='gv'?[['GV04','Tiếp nhận → Xếp lớp'],['GV07','Duyệt báo cáo hai vòng'],['GV10','Duyệt điều chỉnh điểm danh'],['GV09','Giao việc → Xác nhận']]:[['TC02','Lịch dạy → Điểm danh'],['TC05','Lập → Gửi báo cáo'],['TC06','Nhận việc → Gửi kết quả'],...(role==='tbm'?[['TBM01','Duyệt báo cáo bộ môn']]:[])]).map(([id,t])=>link(id,`${t} ${icon('arrow-up-right',15)}`,'context-flow')).join('')}</div><div class="context-foot"><span>390 × 844</span><span>${pastel?'GIAO DIỆN PASTEL':'GIAO DIỆN TRẮNG ĐEN'}</span><div class="swatches"><i></i><i></i><i></i><i></i><i></i></div></div>`;
}
const actions=createActions(ctx);
document.addEventListener('click',async e=>{
 const go=e.target.closest('[data-go]');if(go){if(go.dataset.student)ctx.db.selectedStudent=go.dataset.student;if(go.dataset.report)ctx.db.selectedReport=go.dataset.report;if(go.dataset.session)ctx.db.selectedSession=go.dataset.session;if(go.dataset.task)ctx.db.selectedTask=go.dataset.task;if(go.dataset.thread){ctx.db.selectedThread=go.dataset.thread;const t=ctx.db.threads.find(t=>t.id===go.dataset.thread);if(t)t.unread=0;}navigate(go.dataset.go);return;}
 const a=e.target.closest('[data-action]');if(a?.dataset.action==='theme'){setTheme(a.dataset.value);return;}if(a&&!a.disabled)await actions.click(a.dataset.action,a);
});
document.addEventListener('submit',async e=>{const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();await actions.submit(f.dataset.form,f);});
document.addEventListener('input',e=>actions.input(e));
document.addEventListener('change',e=>actions.change(e));
window.addEventListener('hashchange',readRoute);
if(!location.hash)navigate(defaults[ctx.db.role],{replace:true});else readRoute();
// The center's midnight boundary uses Asia/Bangkok, independent of device timezone.
setInterval(()=>{
 const clock=app.querySelector('[data-countdown]');if(clock)clock.textContent=countdown();
 const session=ctx.db.sessions.find(s=>s.id===ctx.db.selectedSession);
 if(ctx.route==='TC03'&&session&&isLocked(session))navigate('TC03b',{id:session.id,replace:true});
 if(applyDueChanges(ctx.db)){save();if(!app.querySelector('form'))render();}
},30000);
