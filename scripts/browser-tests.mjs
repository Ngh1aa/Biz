import {spawnSync} from 'node:child_process';
const qaEnv={...process.env,BIZ_QA_DIR:process.env.BIZ_QA_DIR||'evidence/pastel-v02'};
for(const suite of ['matrix','flows','excel','pastel-style','copy','reference']){
 const result=spawnSync(process.execPath,[`tests/browser/${suite}.cjs`],{stdio:'inherit',env:qaEnv});
 if(result.status!==0)process.exit(result.status||1);
}
