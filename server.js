const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = 8080;

function mimeType(filePath){
  const ext = path.extname(filePath).toLowerCase();
  return ({
    '.html':'text/html; charset=utf-8',
    '.js':'text/javascript; charset=utf-8',
    '.css':'text/css; charset=utf-8',
    '.json':'application/json; charset=utf-8',
    '.png':'image/png',
    '.jpg':'image/jpeg',
    '.jpeg':'image/jpeg',
    '.gif':'image/gif',
    '.svg':'image/svg+xml'
  })[ext] || 'text/plain; charset=utf-8';
}

const server = http.createServer((req,res)=>{
  const urlPath = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(root, urlPath.replace(/^\/+/, ''));
  if (urlPath === '/' || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, 'index.html');
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      return res.end('Not Found');
    }
  }
  fs.readFile(filePath, (err, data)=>{
    if (err){ res.writeHead(500); return res.end('Server Error'); }
    res.writeHead(200, { 'Content-Type': mimeType(filePath) });
    res.end(data);
  });
});

server.listen(port, ()=>{
  console.log(`Preview server running at http://127.0.0.1:${port}/`);
});