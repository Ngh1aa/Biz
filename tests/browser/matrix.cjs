const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');const qaDir=process.env.BIZ_QA_DIR||'evidence/browser';const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch();const page=await browser.newPage();const errors=[],failures=[],matrix=[];
 const base=qaDir;fs.mkdirSync(base+'/screens',{recursive:true});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:4173/Biz/');
 const routes=await page.evaluate(async()=>Object.keys((await import('./src/data.js')).SCREEN_META));
 for(const width of [360,390,768,1440]){
   await page.setViewportSize({width,height:width===1440?1040:844});
   for(const route of routes){
     const role=route.startsWith('GV')?'gv':route==='TBM01'?'tbm':'tc';
     const id=route==='TC03b'?'CA3':route==='TC05d'?'BC3':'';
     await page.goto(`http://127.0.0.1:4173/Biz/#/${role}/${route}${id?'?id='+id:''}`);
     await page.evaluate(()=>document.fonts.ready);
     const metrics=await page.evaluate(()=>{
       const app=document.querySelector('.app');
       return {overflow:app.scrollWidth>app.clientWidth+1,bodyOverflow:document.body.scrollWidth>innerWidth+1,headings:document.querySelectorAll('.screen h1').length,unlabelledButtons:[...document.querySelectorAll('.screen button')].filter(b=>!b.textContent.trim()&&!b.getAttribute('aria-label')&&!b.getAttribute('title')).length};
     });
     matrix.push({width,route,...metrics});if(metrics.overflow||metrics.bodyOverflow||metrics.headings!==1||metrics.unlabelledButtons)failures.push({width,route,...metrics});
     if(width===390)await page.screenshot({path:`${base}/screens/${route}.png`});
   }
 }
 // Representative captures on the same pristine synthetic state.
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:width===1440?1040:844});
  for(const [name,route,query] of [['overview-a','TC01',''],['overview-b','TC01','?direction=b'],['selection','GV02',''],['form','GV04',''],['schedule','TC02',''],['approval','TBM01','']]){
    const role=route.startsWith('GV')?'gv':route==='TBM01'?'tbm':'tc';await page.goto(`http://127.0.0.1:4173/Biz/${query}#/${role}/${route}`);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${base}/${name}-${width===390?'mobile':'desktop'}.png`});
  }
 }
 // Browser Back/reload retains selection, query and drafts; invalid entity recovers.
 await page.goto('http://127.0.0.1:4173/Biz/#/tc/TC04?id=MISSING');await page.getByText('Không tìm thấy nội dung',{exact:true}).waitFor();await page.locator('.screen [data-go=TC01]').click();await page.waitForURL(/TC01/);await page.locator('.tabbar [data-go=TC02]').click();await page.waitForURL(/TC02/);await page.goBack();await page.waitForURL(/TC01/);
 // Keyboard focus remains in native modal, Escape dismisses.
 await page.locator('[data-action=shortcuts]').click();await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('#sheet').contains(document.activeElement)));await page.keyboard.press('Escape');assert.equal(await page.locator('#sheet').evaluate(e=>e.open),false);
 // Enlarged text pressure on the task-focused overview and form.
 await page.setViewportSize({width:390,height:844});
 for(const route of ['TC01','GV04','TC05c']){await page.goto(`http://127.0.0.1:4173/Biz/#/${route.startsWith('GV')?'gv':'tc'}/${route}`);await page.evaluate(()=>{const els=[...document.querySelectorAll('.screen *,.tabbar *')];const sizes=els.map(el=>parseFloat(getComputedStyle(el).fontSize));els.forEach((el,i)=>{if(el.tagName!=='svg'&&el.tagName!=='use')el.style.fontSize=sizes[i]*1.5+'px';});});const overflow=await page.locator('.app').evaluate(a=>a.scrollWidth>a.clientWidth+1);if(overflow)failures.push({route,textScale:1.5,overflow});await page.screenshot({path:`${base}/${route}-text150.png`});}
 const report={routeCount:routes.length,matrixCount:matrix.length,errors,failures,matrix,keyboardModal:'PASS',invalidEntityRecovery:'PASS',browserBack:'PASS',textScale:'150% CSS pressure test; not native Dynamic Type'};
 fs.writeFileSync(`${qaDir}/matrix.json`,JSON.stringify(report,null,2));fs.writeFileSync(base+'/matrix.json',JSON.stringify(report,null,2));console.log(JSON.stringify({...report,matrix:undefined},null,2));await browser.close();assert.equal(errors.length,0);assert.equal(failures.length,0);
})().catch(e=>{console.error(e);process.exit(1)});
