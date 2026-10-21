const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('assert/strict'),fs=require('fs');
const qaDir=process.env.BIZ_QA_DIR||'evidence/browser';
(async()=>{const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1040}});await page.goto('http://127.0.0.1:4173/Biz/#/tc/TC05w');
 const [download]=await Promise.all([page.waitForEvent('download'),page.locator('.screen [data-action=excel-template]').click()]);assert.equal(download.suggestedFilename(),'Biz-mau-bao-cao.xlsx');
 const bytes=await page.evaluate(()=>{
  const rows=[{'Mã HS':'HS004','Họ tên':'Phạm Đức Anh','Môn':'Toán','Chuyên cần':999,'Điểm':8,'Nền tảng':'M3','Năng lực':'M2','Thái độ':'M3','Nhận xét':'Đã tiến bộ qua từng buổi học.','Định hướng tháng sau':'Luyện tập theo tuần.'},{'Mã HS':'HS003','Môn':'Toán','Điểm':7,'Nền tảng':'M3','Năng lực':'M2','Thái độ':'','Nhận xét':'Thiếu thái độ'},{'Mã HS':'SAI','Môn':'Toán','Điểm':7,'Nền tảng':'M3','Năng lực':'M2','Thái độ':'M3','Nhận xét':'Sai mã'}];
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(rows),'Reports');return Array.from(new Uint8Array(XLSX.write(wb,{bookType:'xlsx',type:'array'})));
 });
 await page.locator('#excel-upload').setInputFiles({name:'test.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:Buffer.from(bytes)});await page.getByText('1/3 hợp lệ',{exact:true}).waitFor();await page.getByText('Thiếu Thái độ',{exact:true}).waitFor();assert.ok(await page.locator('.import-table').getByText('Sai mã HS').count());
 await page.screenshot({path:`${qaDir}/biz-excel.png`});await page.locator('.screen [data-action=excel-import]').click();let db=await page.evaluate(()=>JSON.parse(localStorage.getItem('biz.ux.v1')));const report=db.reports.find(r=>r.student==='HS004');assert.equal(report.status,'Nháp');assert.equal(report.score,'8');assert.equal(report.comment,'Đã tiến bộ qua từng buổi học.');assert.equal(report.attendance,undefined);
 console.log('PASS: actual XLSX download → valid/missing/wrong row validation → import draft; imported attendance ignored');fs.writeFileSync(`${qaDir}/excel.json`,JSON.stringify({status:'PASS',rows:3,valid:1,templateDownload:true,attendanceImportIgnored:true},null,2));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
