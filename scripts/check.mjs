import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
async function check(dir) {
  for (const item of await readdir(dir,{withFileTypes:true})) {
    const path = `${dir}/${item.name}`;
    if (item.isDirectory()) await check(path);
    else if (/\.m?js$/.test(path)) {
      const result = spawnSync(process.execPath,['--check',path],{encoding:'utf8'});
      if (result.status) { console.error(result.stderr); process.exitCode=1; }
    }
  }
}
await check('src'); await check('scripts');
if (!process.exitCode) console.log('JavaScript syntax: PASS');
