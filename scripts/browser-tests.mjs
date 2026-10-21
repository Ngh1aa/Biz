import {spawnSync} from 'node:child_process';
const qaEnv={...process.env,BIZ_QA_DIR:process.env.BIZ_QA_DIR||'evidence/reference-v04'};
for(const suite of ['matrix','flows','excel','copy','reference','parent']){
 const result=spawnSync(process.execPath,[`tests/browser/${suite}.cjs`],{stdio:'inherit',env:qaEnv});
 if(result.status!==0)process.exit(result.status||1);
}
