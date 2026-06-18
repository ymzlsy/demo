const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const BASE = __dirname;
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const fp = path.join(BASE, url);
  if (!fp.startsWith(BASE)) { res.writeHead(403); res.end(); return; }
  fs.readFile(fp, (err, data) => {
    if (err) {
      if (url === '/index.html') {
        const dirs = fs.readdirSync(BASE).filter(d => fs.statSync(path.join(BASE, d)).isDirectory() && d.startsWith('demo-'));
        const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>PRD Demos</title></head><body><h1>PRD Demos</h1><ul>' + dirs.map(d => `<li><a href="/${d}/">${d}</a></li>`).join('') + '</ul></body></html>';
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      } else { res.writeHead(404); res.end('Not found'); }
      return;
    }
    const ext = path.extname(fp);
    res.writeHead(200, { 'Content-Type': (MIME[ext] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Serving ${BASE} on http://localhost:${PORT}`));
