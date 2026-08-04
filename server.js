import { createReadStream, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer((request, response) => {
  const safePath = normalize(decodeURIComponent(request.url.split('?')[0])).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = join(process.cwd(), safePath === '/' ? 'index.html' : safePath);
  if (!existsSync(filePath)) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'content-type': types[extname(filePath)] || 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
});
server.listen(process.env.PORT || 5173, () => console.log(`Anthropac Workbench running on http://localhost:${process.env.PORT || 5173}`));
