import {load,persist,SCREEN_META,ROLES,applyDueChanges,isLocked,canOpenRoute,roleHome,isRoleScreen} from './data.js';
import {esc,icon,btn,link,empty} from './ui.js';
import {overview} from './screens/overview.js';
import {students} from './screens/students.js';
import {teaching,countdown} from './screens/teaching.js';
import {reports} from './screens/reports.js';
import {operations} from './screens/operations.js';
import {communication} from './screens/communication.js';
import {createActions} from './actions.js';
import {ensureFamily,familyThreadVisible} from './family.js';
import {parents} from './screens/parents.js';
const states={};
export const ctx={db:ensureFamily(load()),route:'GV01',state:{},save,render,navigate,toast,sheet,closeSheet,states};
const defaults={gv:'GV01',tc:'TC01',tbm:'TC01',ph:'PH01'};
const familyRouteKeys={PH02b:'selectedFamilySession',PH03b:'selectedFamilyReport',PH04b:'selectedFamilyInvoice',PH05b:'selectedFamilyThread',PH06b:'selectedFamilyRequest'};
const app=document.querySelector('#app'),dialog=document.querySelector('#sheet');
ctx.theme='center';
document.documentElement.dataset.theme='center';
// Old theme links keep their route and open the single current interface.
const url=new URL(location.href);
if(url.searchParams.has('theme')){url.searchParams.delete('theme');history.replaceState(null,'',url);}
function formatHeadings(){
 app.querySelectorAll('h1,h2').forEach(h=>{h.innerHTML=h.innerHTML.replaceAll('<br>',' ');});
}
const tabs={
 ph:[['PH01','home','Tổng quan'],['PH02','calendar','Lịch học'],['PH03','file-text','Kết quả'],['PH04','credit-card','Học phí'],['PH05','message-circle','Trao đổi']],
 gv:[['GV01','home','Tổng quan'],['GV02','users','Học sinh'],['GV07','check-square','Duyệt'],['GV08','file-text','Học phí'],['TC07','message-circle','Trao đổi']],
 tc:[['TC01','home','Tổng quan'],['TC02b','calendar','Lịch dạy'],['TC04a','users','Học sinh'],['TC05','file-text','Báo cáo'],['TC06','check-square','Công việc']],
 tbm:[['TC01','home','Tổng quan'],['TC02b','calendar','Lịch dạy'],['TBM01','check-square','Duyệt'],['TC05','file-text','Báo cáo'],['TC06','check-square','Công việc']]
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
 if(familyRouteKeys[route]&&!opts.id)opts={...opts,id:ctx.db[familyRouteKeys[route]]};
 const id=opts.id|| (['GV03','TC04','TC04b','GV05','GV06','GV06b','GV06c'].includes(route)?ctx.db.selectedStudent:route.startsWith('TC05')&&!['TC05','TC05w'].includes(route)?ctx.db.selectedReport:['TC03','TC03b'].includes(route)?ctx.db.selectedSession:['TC06b','TC06c'].includes(route)?ctx.db.selectedTask:route==='TC07b'?ctx.db.selectedFamilyThread||ctx.db.selectedThread:'');
 if(id)params.set('id',id);
 const hash=`#/${role}/${route}${params.size?'?'+params:''}`;
 if(opts.replace){history.replaceState(null,'',hash);readRoute();}else if(location.hash===hash){render();}else location.hash=hash;
}
function readRoute(){
 const [path,query]=location.hash.slice(1).split('?'),[,role,route]=path.split('/');
 ctx.db.role=ROLES[role]?role:ctx.db.role;ctx.route=SCREEN_META[route]?route:defaults[ctx.db.role];
 if(!canOpenRoute(ctx.db.role,ctx.route)){navigate(defaults[ctx.db.role],{replace:true});return;}
 if(ctx.route==='TBM01'&&ctx.db.role!=='tbm'){navigate(defaults[ctx.db.role],{replace:true});return;}
 const id=new URLSearchParams(query).get('id');
 if(ctx.route==='TC07b'&&id)ctx.db.selectedFamilyThread=ctx.db.familyThreads.some(t=>t.id===id)?id:'';
 if(!id&&ctx.route==='TC03b')ctx.db.selectedSession=ctx.db.sessions.find(s=>isLocked(s))?.id||ctx.db.selectedSession;
 if(!id&&ctx.route==='TC03')ctx.db.selectedSession=ctx.db.sessions.find(s=>!isLocked(s)&&s.teacher==='T01')?.id||ctx.db.selectedSession;
 if(!id&&ctx.route==='TC05d')ctx.db.selectedReport=ctx.db.reports.find(r=>r.status==='Làm lại')?.id||ctx.db.selectedReport;
 if(id&&ctx.db.role==='ph'&&familyRouteKeys[ctx.route])ctx.db[familyRouteKeys[ctx.route]]=id;
 if(id){if(['GV03','TC04','TC04b','GV05','GV06','GV06b','GV06c'].includes(ctx.route))ctx.db.selectedStudent=id;
 else if(ctx.route.startsWith('TC05'))ctx.db.selectedReport=id;else if(ctx.route.startsWith('TC03'))ctx.db.selectedSession=id;else if(ctx.route.startsWith('TC06'))ctx.db.selectedTask=id;else if(ctx.route==='TC07b')ctx.db.selectedThread=id;}
 applyDueChanges(ctx.db); ctx.state=states[`${ctx.db.role}-${ctx.route}`]||={};save();
 if(dialog.open)dialog.close();render();app.querySelector('.screen')?.scrollTo(0,0);
 app.querySelector('h1')?.focus({preventScroll:true});
 if(ctx.route.startsWith('GV05-'))actions.openClassPicker(ctx.route);
}
function nav(){
 const list=tabs[ctx.db.role];
 function active(r){if(ctx.db.role==='ph')return r===ctx.route||r!=='PH01'&&ctx.route.startsWith(r);if(r===ctx.route)return true;if(r==='GV02')return ['GV03','GV04','GV04b','GV04c','GV05','GV06','GV06b','GV06c'].includes(ctx.route);if(r==='TC02b')return ctx.route.startsWith('TC02')||ctx.route.startsWith('TC03');if(r==='TC04a')return ctx.route.startsWith('TC04');if(r==='TC05')return ctx.route.startsWith('TC05');if(r==='TC06')return ctx.route.startsWith('TC06');return false;}
 return `<nav class="tabbar" aria-label="Điều hướng chính">${list.map(([r,i,t])=>`<button data-go="${r}" class="tab ${active(r)?'active':''}" ${active(r)?'aria-current="page"':''}>${icon(i,21)}<span>${t}</span></button>`).join('')}</nav>`;
}
function render(){
 const r=ctx.route;let html;
 app.classList.toggle('without-nav',r==='A00');
 document.querySelector('#device').classList.toggle('web-device',r==='TC05w');
 const previous=app.querySelector('.screen'),scrollTop=previous?.dataset.screen===r?previous.scrollTop:0;
 const focused=previous?.dataset.screen===r&&previous.contains(document.activeElement)&&document.activeElement.matches('button[data-action]')?document.activeElement:null;
 const focusSelector=focused?['data-action','data-value','data-student','data-id'].filter(a=>focused.hasAttribute(a)).map(a=>`[${a}="${CSS.escape(focused.getAttribute(a))}"]`).join(''):'';
 const entitySets={GV03:['students','selectedStudent'],TC04:['students','selectedStudent'],TC04b:['students','selectedStudent'],TC05b:['reports','selectedReport'],TC05c:['reports','selectedReport'],TC05d:['reports','selectedReport'],TC03:['sessions','selectedSession'],TC03b:['sessions','selectedSession'],TC06b:['tasks','selectedTask'],TC06c:['tasks','selectedTask'],TC07b:['threads','selectedThread']};
 const entity=entitySets[r];
 const familyThread=ctx.db.familyThreads.find(t=>t.id===ctx.db.selectedFamilyThread);
 if(r==='TC07b'&&familyThread&&!familyThreadVisible(ctx.db,familyThread)){ctx.db.selectedFamilyThread='';navigate('TC07',{replace:true});return;}
 if(entity&&!ctx.db[entity[0]].some(item=>item.id===ctx.db[entity[1]])&&!(r==='TC07b'&&familyThread)){
  app.innerHTML=`<div class="screen" data-screen="${r}"><h1 tabindex="-1">Không tìm thấy nội dung</h1>${empty('Liên kết không còn hợp lệ','Nội dung mẫu có thể đã được đặt lại.',link(roleHome(ctx.db.role),'Về tổng quan','btn primary'))}</div>${nav()}`;renderReviewer();return;
 }
 if(r.startsWith('PH'))html=parents(ctx);
 else if(['A00','GV01','TC01','TC01b'].includes(r))html=overview(ctx);
 else if(['GV02','GV03','GV04','GV04b','GV04c','GV05','GV05-s1','GV05-s2','GV05-s3','GV06','GV06b','GV06c','TC04a','TC04','TC04b'].includes(r))html=students(ctx);
 else if(r.startsWith('TC02')||r.startsWith('TC03'))html=teaching(ctx);
 else if(r.startsWith('TC05')||['GV07','TBM01'].includes(r))html=reports(ctx);
 else if(r.startsWith('TC07'))html=communication(ctx);
 else html=operations(ctx);
 app.innerHTML=`<div class="screen ${r==='A00'?'login-screen':''}" data-screen="${r}">${html}</div>${r==='A00'?'':nav()}`;
 app.querySelector('.screen').scrollTop=scrollTop;
 if(focusSelector)app.querySelector(focusSelector)?.focus({preventScroll:true});
 formatHeadings();
 document.title=`${SCREEN_META[r][0]} · Minh Hoàng Center`;
 renderReviewer();
}
function renderReviewer(){
 const role=ctx.db.role,r=ctx.route;
 document.querySelector('.workspace-heading span:first-child').textContent='MINH HOÀNG / QUẢN LÝ ĐÀO TẠO';
 document.querySelector('.workspace-heading span:last-child').textContent='UX WORKSPACE · V0.5';
 const screens=Object.entries(SCREEN_META).filter(([id])=>isRoleScreen(role,id));
 const selectedGroup=r.startsWith('GV04')?'Tiếp nhận học sinh':r.startsWith('TC03')?'Lịch dạy và điểm danh':r.startsWith('TC05')||['GV07','TBM01'].includes(r)?'Báo cáo học tập':'Không gian làm việc';
 document.querySelector('#review-tools').innerHTML=`<aside class="review-sidebar"><div class="review-brand">Minh Hoàng<small>CENTER · QUẢN LÝ ĐÀO TẠO</small></div><div class="review-version"><span class="live-dot"></span> BẢN TRẢI NGHIỆM UX <b>V0.5</b></div><p class="review-label">ĐANG TRẢI NGHIỆM VỚI VAI TRÒ</p><div class="role-switch">${Object.entries(ROLES).map(([key,label])=>btn(`${icon(key==='gv'?'layers':key==='tc'?'book-open':key==='ph'?'users':'award',18)} ${label}${key===role?icon('check',16):''}`,'role',{class:key===role?'selected':'',data:`data-value="${key}" aria-pressed="${key===role}"`})).join('')}</div><div class="review-label screen-label">DANH MỤC MÀN HÌNH <span>${screens.length}</span></div><nav class="screen-index" aria-label="Danh mục màn hình UX">${screens.map(([id,[title]])=>link(id,`<code>${id.replace('-','·')}</code><span>${title}</span>`,id===r?'screen-item selected':'screen-item')).join('')}</nav><div class="review-bottom"><p>Dữ liệu mẫu · Lưu trên thiết bị<br>Không kết nối hệ thống thật</p>${btn(icon('rotate-ccw',15)+' Đặt lại bản trải nghiệm','demo-reset',{class:'text-link'})}</div></aside><div class="mobile-review"><b>Minh Hoàng <small>UX</small></b><label><span class="sr-only">Vai trò trải nghiệm</span><select id="mobile-role">${Object.entries(ROLES).map(([k,v])=>`<option value="${k}" ${k===role?'selected':''}>${v}</option>`).join('')}</select></label>${btn(icon('grid',18),'screen-menu',{class:'circle',data:'aria-label="Danh mục màn hình"'})}</div>`;
 document.querySelector('#context-panel').innerHTML=`<div class="context-top"><span class="context-number">${r}</span><p>${selectedGroup}</p><h2>${SCREEN_META[r][0]}</h2><span class="context-rule"></span><p>${SCREEN_META[r][1]}</p></div><div class="context-block"><span class="review-label">NGUYÊN TẮC TRẢI NGHIỆM</span><ul><li>Trạng thái hiện tại rõ ràng</li><li>Mỗi màn một việc chính</li><li>Luôn có đường quay lại</li></ul></div><div class="context-block"><span class="review-label">THỬ MỘT LUỒNG</span>${(role==='ph'?[['PH02','Lịch học → Xin nghỉ'],['PH03','Xem báo cáo đã công bố'],['PH04','Theo dõi học phí'],['PH05','Trao đổi với trung tâm']]:role==='gv'?[['GV04','Tiếp nhận → Xếp lớp'],['GV07','Duyệt báo cáo hai vòng'],['GV10','Duyệt điều chỉnh điểm danh'],['GV09','Giao việc → Xác nhận']]:[['TC02','Lịch dạy → Điểm danh'],['TC05','Lập → Gửi báo cáo'],['TC06','Nhận việc → Gửi kết quả'],...(role==='tbm'?[['TBM01','Duyệt báo cáo bộ môn']]:[])]).map(([id,t])=>link(id,`${t} ${icon('arrow-up-right',15)}`,'context-flow')).join('')}</div><div class="context-foot"><span>390 × 844</span><span>MINH HOÀNG DESIGN SYSTEM</span><div class="swatches"><i></i><i></i><i></i><i></i><i></i></div></div>`;
}
const actions=createActions(ctx);
document.addEventListener('click',async e=>{
 const go=e.target.closest('[data-go]');if(go){if(!canOpenRoute(ctx.db.role,go.dataset.go)){toast('Màn hình không thuộc vai trò đang xem.');return;}if(go.dataset.listFilter)(states[`${ctx.db.role}-${go.dataset.go}`]||={}).filter=go.dataset.listFilter;for(const [kind,key] of Object.entries({Session:'selectedFamilySession',Report:'selectedFamilyReport',Invoice:'selectedFamilyInvoice',Request:'selectedFamilyRequest',Thread:'selectedFamilyThread'})){if(go.dataset['family'+kind])ctx.db[key]=go.dataset['family'+kind];}if(go.dataset.thread)ctx.db.selectedFamilyThread='';if(go.dataset.student)ctx.db.selectedStudent=go.dataset.student;if(go.dataset.report)ctx.db.selectedReport=go.dataset.report;if(go.dataset.session)ctx.db.selectedSession=go.dataset.session;if(go.dataset.task)ctx.db.selectedTask=go.dataset.task;if(go.dataset.thread){ctx.db.selectedThread=go.dataset.thread;const t=ctx.db.threads.find(t=>t.id===go.dataset.thread);if(t)t.unread=0;}navigate(go.dataset.go);return;}
 const a=e.target.closest('[data-action]');if(a&&!a.disabled)await actions.click(a.dataset.action,a);
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
