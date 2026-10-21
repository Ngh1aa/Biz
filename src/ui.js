export const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Presentation labels only: retain persisted status values and filter contracts.
export const statusLabel = value => ({'Chưa tích':'Chưa điểm danh','Đã tích':'Đã điểm danh','Có':'Có mặt','Nháp':'Bản nháp','Làm lại':'Cần bổ sung','Đã nghỉ':'Ngừng học','Tạm nghỉ':'Ngừng học','Đang làm':'Đang thực hiện','Đã đóng':'Đã hoàn thành','Đang mở':'Chưa hoàn thành','Thiếu buổi':'Chưa đủ buổi','Phát sinh':'Buổi bổ sung','Sửa tích lịch':'Điều chỉnh điểm danh'})[value] || String(value??'');
export const contactLabel = value => String(value??'').replace(/^PH · /,'Phụ huynh · ').replace(/^TBM · /,'Trưởng bộ môn · ');
export const icon=(name,size=20)=>`<svg width="${size}" height="${size}" aria-hidden="true" class="icon"><use href="./assets/icons.svg#${name}"></use></svg>`;
export const action=(name,data='')=>`data-action="${name}" ${data}`;
export const btn=(text,name,opts={})=>`<button type="${opts.type||'button'}" class="btn ${opts.class||''}" ${name?action(name):''} ${opts.data||''} ${opts.disabled?'disabled':''}>${opts.icon?icon(opts.icon):''}${text}</button>`;
export const link=(route,text,cls='',data='')=>`<button type="button" class="${cls||'text-link'}" data-go="${route}" ${data}>${text}</button>`;
export const circle=(name,route,label)=>link(route,icon(name),'circle',`aria-label="${esc(label)}"`);
export const pill=(text,dark=false)=>{
  const label=String(text);
  const status=/Quá hạn|Làm lại|Cần bổ sung|Vắng|Đã nghỉ|Ngừng học|Tạm nghỉ|Tạm khóa|Từ chối/.test(label)?'warning':/Đã duyệt|Đã thu|Đang học|Hợp lệ|Hoạt động|Đã đóng|Đã hoàn thành|Có mặt|Chấp thuận|Đã công bố/.test(label)?'success':/Chờ|Nháp|Chưa|Sắp tới/.test(label)?'pending':'neutral';
  return `<span class="pill ${dark?'dark':''}" data-status="${status}">${esc(statusLabel(text))}</span>`;
};
export const avatar=(name,cls='')=>`<span class="avatar ${cls}" aria-hidden="true">${esc(name.split(' ').slice(-2).map(n=>n[0]).join(''))}</span>`;
export const head=(title,sub='',back=true,extra='')=>`<header class="page-head"><div class="head-actions">${back?btn(icon('arrow-left')+'<span>Quay lại</span>','back',{class:'back-link'}):'<span class="product-label">MINH HOÀNG CENTER</span>'}${extra}</div>${sub?`<div class="eyebrow">${sub}</div>`:''}<h1 tabindex="-1">${title.replaceAll('<br>',' ').replace(/\.$/,'')}</h1></header>`;
export const section=(title,extra='')=>`<div class="section-head"><h2>${title}</h2>${extra}</div>`;
export const chips=(values,selected,name='filter')=>`<div class="chips" role="group" aria-label="Bộ lọc">${values.map(v=>btn(esc(statusLabel(v)),name,{class:`chip ${selected===v?'selected':''}`,data:`data-value="${esc(v)}" aria-pressed="${selected===v}"`})).join('')}</div>`;
export function field(label,name,value='',opts={}) {
  const input=opts.textarea?`<textarea name="${name}" ${opts.required?'required':''} placeholder="${esc(opts.placeholder||'')}">${esc(value)}</textarea>`:opts.options?`<select name="${name}" ${opts.required?'required':''}>${opts.options.map(o=>{const [v,l]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${v===value?'selected':''}>${esc(l)}</option>`}).join('')}</select>`:`<input name="${name}" type="${opts.type||'text'}" value="${esc(value)}" ${opts.required?'required':''} ${opts.readonly?'readonly':''} ${opts.min!==undefined?`min="${opts.min}"`:''} ${opts.max!==undefined?`max="${opts.max}"`:''} ${opts.step?`step="${opts.step}"`:''} ${opts.accept?`accept="${opts.accept}"`:''} placeholder="${esc(opts.placeholder||'')}" ${opts.autocomplete?`autocomplete="${opts.autocomplete}"`:''}>`;
  return `<label class="field"><span>${esc(label)}${opts.required?' <span aria-hidden="true">*</span>':''}${opts.readonly?' <small>Điền tự động</small>':''}</span>${input}${opts.hint?`<small>${esc(opts.hint)}</small>`:''}</label>`;
}
export const search=(placeholder,value='')=>`<label class="search">${icon('search')}<input type="search" name="search" aria-label="${esc(placeholder)}" placeholder="${esc(placeholder)}" value="${esc(value)}"></label>`;
export const empty=(title='Chưa có nội dung',text='Nội dung sẽ hiển thị sau khi được cập nhật.',extra='')=>`<div class="empty">${icon('inbox',32)}<h3>${title}</h3><p>${text}</p>${extra}</div>`;
export const note=(text,cls='')=>`<div class="note ${cls}">${icon('info')}<div>${text}</div></div>`;
export const footer=(text,name,opts={})=>`<div class="form-footer">${btn(text,name,{...opts,class:`primary ${opts.class||''}`})}</div>`;
export const detail=(label,value)=>`<div class="detail-row"><span>${label}</span><strong>${value}</strong></div>`;
export const progress=value=>`<div class="progress" role="progressbar" aria-label="Tiến độ" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100"><span style="width:${value}%"></span></div>`;
export const history=rows=>`<ol class="history">${rows.map(r=>`<li><strong>${esc(r.text)}</strong><small>${esc(r.time)}</small></li>`).join('')}</ol>`;
export function studentRow(s,route,extra='') {return link(route,`${avatar(s.name)}<span class="row-copy"><strong>${esc(s.name)}</strong><small>${esc(s.id)} · Khối ${esc(s.grade)} · ${esc(s.school)}</small>${extra||`<span class="row-bottom">${esc(s.subject)} ${pill(s.status)}</span>`}</span>${icon('chevron-right',18)}`,'student-row',`data-student="${s.id}"`);}
export const form=(id,content)=>`<form data-form="${id}"><div class="form-error" role="alert" tabindex="-1" hidden></div>${content}</form>`;
export const formGroup=(title,content,hint='')=>`<fieldset class="form-group"><legend>${esc(title)}</legend>${hint?`<p class="group-hint">${esc(hint)}</p>`:''}${content}</fieldset>`;
export const money=v=>new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(v);
export const dateLabel=value=>{const [year,month,day]=String(value).split('-');return day?`${day}/${month}/${year}`:value;};
export const monthLabel=value=>{const [year,month]=String(value).split('-');return month?`${Number(month)}/${year}`:value;};
