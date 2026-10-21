import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html','.nojekyll','src','assets']) await cp(file,`dist/${file}`,{recursive:true});
console.log('PREPARED: dist/ — static assets, relative paths, no publication.');
