import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve(process.env.SERVE_DIR || '.');
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.json':'application/json','.png':'image/png'};
http.createServer(async (req,res) => {
  try {
    let url = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (url === '/Biz' || url.startsWith('/Biz/')) url = url.slice(4) || '/';
    const file = resolve(root, '.' + url + (url.endsWith('/') ? 'index.html' : ''));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
    res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port,'127.0.0.1',()=>console.log(`Biz: http://127.0.0.1:${port}/Biz/`));
