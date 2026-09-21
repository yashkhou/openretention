import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listAccounts, riskInbox, summary, upsertAccount } from './repository.js';

const port = Number(process.env.PORT ?? 8787);
const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(here, '../public');

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === 'GET' && url.pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true });
    if (req.method === 'GET' && url.pathname === '/api/summary') return json(res, 200, summary());
    if (req.method === 'GET' && url.pathname === '/api/accounts') return json(res, 200, listAccounts());
    if (req.method === 'GET' && url.pathname === '/api/risk-inbox') return json(res, 200, riskInbox());
    if (req.method === 'POST' && url.pathname === '/api/accounts/upsert') {
      const body = await readJson(req);
      return json(res, 200, upsertAccount(body));
    }

    const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const safe = path.normalize(requested).replace(/^\.\.(\/|\\|$)+/, '');
    const target = path.join(publicDir, safe);
    if (!target.startsWith(publicDir) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
      res.writeHead(404); res.end('Not found'); return;
    }
    const ext = path.extname(target);
    const type = ext === '.js' ? 'text/javascript' : ext === '.css' ? 'text/css' : 'text/html';
    res.writeHead(200, { 'content-type': `${type}; charset=utf-8` });
    fs.createReadStream(target).pipe(res);
  } catch (error) {
    json(res, 400, { error: error.message });
  }
});

server.listen(port, () => {
  console.log(`OpenRetention running on http://localhost:${port}`);
});
