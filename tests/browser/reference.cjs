const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.BIZ_BASE_URL||'http://127.0.0.1:4173/Biz/',out=process.env.BIZ_QA_DIR||'evidence/redesign';
(async()=>{const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],checks=[],failures=[];page.on('pageerror',e=>errors.push(e.message));
const go=async(role,route,id='')=>{await page.goto(`${base}#/${role}/${route}${id?'?id='+id:''}`);await page.locator('.screen h1').waitFor();};
await go('gv','GV01');await page.evaluate(()=>localStorage.clear());await page.reload();
const tokens=await page.evaluate(()=>{const c=getComputedStyle(document.documentElement);return Object.fromEntries(['--brand-blue','--brand-orange','--brand-yellow'].map(k=>[k,c.getPropertyValue(k).trim()]));});
assert.deepEqual(tokens,{'--brand-blue':'#253a7e','--brand-orange':'#ea4c2d','--brand-yellow':'#f4e743'});
await page.locator('.work-queue [data-go=GV02]').click();await page.locator('.student-row').first().waitFor();assert.equal(await page.locator('.chip.selected').innerText(),'Chờ xếp lớp');assert.equal(await page.locator('.student-row').count(),1);await go('gv','GV01');await page.locator('.work-queue [data-action=family-office-open]').click();await page.waitForURL(/GV10/);assert.equal(await page.locator('.chip.selected').innerText(),'Xin nghỉ');
checks.push('Brand retained; office work queue opens the matching leave-request context');
await go('tc','TC01');await page.locator('.priority-session [data-go=TC03]').click();await page.waitForURL(/TC03/);await page.locator('[data-action=mark]').last().focus();const scrollBefore=await page.locator('.screen').evaluate(e=>e.scrollTop);await page.keyboard.press('Space');assert.ok(Math.abs(await page.locator('.screen').evaluate(e=>e.scrollTop)-scrollBefore)<2);assert.equal(await page.evaluate(()=>document.activeElement.dataset.action),'mark');await page.locator('[data-action=mark-all]').click();await page.locator('[data-action=save-attendance]').click();await go('tc','TC01');assert.match(await page.locator('.center-alert').innerText(),/1 buổi chưa điểm danh/);
checks.push('Priority lesson opens its session; saved attendance reduces the canonical reminder count');
await page.locator('.tabbar [data-go=TC02b]').click();await page.waitForURL(/TC02b/);await page.locator('.session-card').first().waitFor();
for(const value of ['week','student','day']){await page.locator(`[data-action=schedule-view][data-value=${value}]`).click();await page.waitForURL(value==='week'?/\/TC02$/:/TC02b/);await page.locator(value==='student'?'.student-schedule':value==='week'?'.week-grid':'.day-strip').first().waitFor();}
await go('tbm','TBM01');assert.equal(await page.locator('.tabbar .tab').nth(2).getAttribute('data-go'),'TBM01');
checks.push('Daily schedule entry; week/student modes and department approval remain reachable');
await go('gv','GV04');await page.locator('[name=name]').fill('Bản nháp được giữ nguyên');
for(const legacy of ['pastel','mono']){await page.goto(`${base}?theme=${legacy}#/gv/GV04`);await page.locator('[name=name]').waitFor();assert.equal(await page.locator('html').getAttribute('data-theme'),'center');assert.equal(new URL(page.url()).searchParams.has('theme'),false);assert.equal(await page.locator('[data-action=theme],.theme-switch').count(),0);assert.equal(await page.locator('[name=name]').inputValue(),'Bản nháp được giữ nguyên');}
assert.equal(await page.locator('.form-group').count(),3);assert.ok((await page.locator('[name=name]').boundingBox()).height>=56);
checks.push('Grouped intake keeps drafts and 56px controls; retired theme links remain normalized');
for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:width===1440?1040:844});for(const [role,route] of [['gv','GV01'],['tc','TC01'],['gv','GV04'],['tc','TC02b'],['tc','TC03'],['tbm','TBM01'],['tc','TC05w'],['ph','PH01']]){
 await go(role,route);await page.evaluate(()=>document.fonts.ready);
 const state=await page.evaluate(()=>{
  const rgb=s=>s.match(/[\d.]+/g)?.map(Number)||[0,0,0,0],lum=c=>c.slice(0,3).map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;}).reduce((a,n,i)=>a+n*[.2126,.7152,.0722][i],0);
  const contrast=[...document.querySelectorAll('.screen .pill,.screen .primary,.screen .chip,.tab')].filter(e=>e.getBoundingClientRect().width&&!e.disabled).map(e=>{const c=getComputedStyle(e),fg=rgb(c.color),bg=rgb(c.backgroundColor);if(bg[3]!==undefined&&bg[3]!==1)return null;const a=lum(fg),b=lum(bg);return {text:e.innerText,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};}).filter(r=>r&&r.ratio<4.5);
  const nav=document.querySelector('.tabbar').getBoundingClientRect(),screen=document.querySelector('.screen'),rect=screen.getBoundingClientRect(),device=document.querySelector('.device').getBoundingClientRect();
  screen.scrollTop=screen.scrollHeight;const lastControl=[...screen.querySelectorAll('button,input,select,textarea')].filter(e=>e.getBoundingClientRect().height).at(-1)?.getBoundingClientRect();
  return {overflow:screen.scrollWidth>screen.clientWidth+1,navOutside:nav.left<device.left-1||nav.right>device.right+1,navOverlapsScreen:rect.bottom>nav.top+1,lastControlCovered:lastControl?lastControl.bottom>nav.top+1:false,navHeight:nav.height,contrast};
 });if(state.overflow||state.navOutside||state.navOverlapsScreen||state.lastControlCovered||state.navHeight<64||state.contrast.length)failures.push({width,route,...state});
}}
assert.deepEqual(failures,[]);assert.deepEqual(errors,[]);checks.push('32 responsive states: nav does not cover controls, Excel nav inside frame, sampled control contrast >=4.5:1');
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/reference-qa.json',JSON.stringify({checks,tokens,failures,errors,contrastScope:'Opaque pills, primary buttons, filter chips and navigation labels only.'},null,2));console.log(JSON.stringify({checks,failures,errors},null,2));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
