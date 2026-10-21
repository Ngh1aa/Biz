const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.BIZ_BASE_URL||'http://127.0.0.1:4173/Biz/';
const out=process.env.BIZ_QA_DIR||'evidence/reference-v04';
(async()=>{const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1040}}),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
const go=async(role,route,id='')=>{await page.goto(`${base}#/${role}/${route}${id?'?id='+id:''}`);await page.locator('.screen h1').waitFor();};
await go('gv','GV01');await page.evaluate(()=>localStorage.clear());await page.reload();
assert.equal(await page.locator('html').getAttribute('data-theme'),'center');assert.equal(await page.locator('.center-kpis .metric').count(),4);assert.equal(await page.locator('.shortcuts .shortcut').count(),6);assert.equal(await page.locator('.center-day-list .simple-row').count(),3);assert.equal(await page.locator('.hero-task').count(),0);assert.equal(await page.locator('.pastel-graphic:visible').count(),0);
const tokens=await page.evaluate(()=>{const c=getComputedStyle(document.documentElement);return Object.fromEntries(['--brand-blue','--brand-orange','--brand-yellow','--surface','--radius-xl','--radius-lg'].map(k=>[k,c.getPropertyValue(k).trim()]));});
assert.deepEqual(tokens,{'--brand-blue':'#253a7e','--brand-orange':'#ea4c2d','--brand-yellow':'#f4e743','--surface':'#f4f5f9','--radius-xl':'24px','--radius-lg':'16px'});
assert.equal(await page.locator('.tabbar .tab').count(),5);assert.equal(await page.locator('.tabbar').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(37, 58, 126)');
checks.push('Default uses supplied DS palette/radii and office structure: four tiles, six actions, three shift rows');
await go('tc','TC01');const order=await page.locator('.screen').evaluate(e=>[...e.children].filter(n=>n.matches('.center-alert,.center-next-class,.center-follow,.metrics,.center-stats-link')).map(n=>n.className));assert.deepEqual(order,['center-alert','center-next-class','center-follow','metrics','simple-row center-stats-link']);
await go('tc','TC03','CA1');await page.locator('[data-action=mark-all]').click();await page.locator('[data-action=save-attendance]').click();await go('tc','TC01');assert.match(await page.locator('.center-alert').innerText(),/1 buổi chưa điểm danh/);
checks.push('Teacher reference hierarchy and attendance reminders reflect shared state after saving');
await go('tc','TC02');assert.equal(await page.locator('.center-schedule-views [data-action=schedule-view]').count(),3);await page.locator('[data-action=schedule-view][data-value=student]').click();await page.waitForURL(/TC02b/);await page.locator('.student-schedule').first().waitFor();assert.ok(await page.locator('.student-schedule').count());await page.locator('[data-action=schedule-view][data-value=day]').click();await page.locator('.student-schedule').first().waitFor({state:'detached'});assert.equal(await page.locator('.student-schedule').count(),0);
await go('tbm','TBM01');assert.equal(await page.locator('.tabbar .tab').nth(2).getAttribute('data-go'),'TBM01');
checks.push('Reference navigation exposes week/day/student schedule views and a department approval tab');
await go('gv','GV04');await page.locator('[name=name]').fill('Bản nháp được giữ nguyên');
for(const legacy of ['pastel','mono']){await page.goto(`${base}?theme=${legacy}#/gv/GV04`);await page.locator('[name=name]').waitFor();assert.equal(await page.locator('html').getAttribute('data-theme'),'center');assert.equal(new URL(page.url()).searchParams.has('theme'),false);assert.equal(await page.locator('[data-action=theme],.theme-switch').count(),0);assert.equal(await page.locator('[name=name]').inputValue(),'Bản nháp được giữ nguyên');}
const field=await page.locator('[name=name]').boundingBox();assert.ok(field.height>=56);assert.equal(await page.locator('.form-footer .primary').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(37, 58, 126)');
checks.push('56px fields and primary buttons use the source DS; retired theme links use the current interface and retain the saved draft');
const failures=[];
for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:width===1440?1040:844});for(const [role,route] of [['gv','GV01'],['tc','TC01'],['gv','GV04'],['tc','TC02'],['tc','TC03'],['tbm','TBM01']]){
 await go(role,route);await page.evaluate(()=>document.fonts.ready);
 const state=await page.evaluate(()=>{
  const rgb=s=>s.match(/[\d.]+/g)?.map(Number)||[0,0,0,0],lum=c=>c.slice(0,3).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;}).reduce((a,n,i)=>a+n*[.2126,.7152,.0722][i],0);
  const contrast=[...document.querySelectorAll('.screen .pill,.screen .primary,.screen .chip,.tab')].filter(e=>e.getBoundingClientRect().width&&!e.disabled).map(e=>{const style=getComputedStyle(e),fg=rgb(style.color),bg=rgb(style.backgroundColor);if(bg[3]!==undefined&&bg[3]!==1)return null;const a=lum(fg),b=lum(bg);return {text:e.innerText,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};}).filter(r=>r&&r.ratio<4.5);
  const nav=document.querySelector('.tabbar');return {overflow:document.querySelector('.app').scrollWidth>document.querySelector('.app').clientWidth+1,navHeight:nav.getBoundingClientRect().height,contrast};
 });if(state.overflow||state.navHeight<64||state.contrast.length)failures.push({width,route,...state});
}}
assert.deepEqual(failures,[]);assert.deepEqual(errors,[]);checks.push('24 representative viewport cases retain 64px navigation and readable opaque control labels');
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/reference-qa.json',JSON.stringify({checks,tokens,failures,errors,contrastScope:'Opaque pills, primary buttons, filter chips and navigation labels only.'},null,2));console.log(JSON.stringify({checks,failures,errors},null,2));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
