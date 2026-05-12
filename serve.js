const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': (types[ext] || 'text/plain') + ';charset=utf-8' });
    res.end(data);
  });
});

server.listen(0, '127.0.0.1', () => {
  const addr = server.address();
  console.log('http://127.0.0.1:' + addr.port);
});
