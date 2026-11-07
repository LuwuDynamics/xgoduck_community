import http from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ROOT, loadConfig } from './lib/catalog.mjs';

const demo = process.argv.includes('--demo');
const portArg = process.argv.indexOf('--port');
const port = Number(portArg === -1 ? 4173 : process.argv[portArg + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('--port 必须在 1–65535 之间');
const output = path.join(ROOT, demo ? 'dist-demo' : 'dist');
const config = await loadConfig();
const mount = new URL(config.siteUrl).pathname;
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8', '.yaml': 'text/yaml; charset=utf-8' };
let building = false;
let pending = false;
async function rebuild() {
  if (building) { pending = true; return; }
  building = true;
  const success = await new Promise(resolve => {
    const child = spawn(process.execPath, [path.join(ROOT, 'scripts/build.mjs'), ...(demo ? ['--demo'] : [])], { cwd: ROOT, stdio: 'inherit', windowsHide: true });
    child.on('error', error => { console.error(error.message); resolve(false); });
    child.on('exit', code => resolve(code === 0));
  });
  building = false;
  if (pending) { pending = false; return rebuild(); }
  return success;
}
if (process.argv.includes('--build') && !await rebuild()) process.exit(1);
try { await stat(path.join(output, 'index.html')); }
catch { console.error('未找到构建产物，请先运行 npm run build（演示使用 npm run build:demo）。'); process.exit(1); }
const outputReal = await realpath(output);
const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    if (url.pathname === '/' && mount !== '/') { response.writeHead(302, { Location: mount + url.search }); response.end(); return; }
    if (!url.pathname.startsWith(mount)) throw new Error('Not found');
    const pathname = decodeURIComponent(url.pathname.slice(mount.length));
    const filename = path.resolve(output, pathname || '.');
    if (filename !== output && !filename.startsWith(output + path.sep)) throw new Error('Not found');
    let file = filename;
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: url.pathname + '/' + url.search }); response.end(); return; }
      file = path.join(file, 'index.html');
    }
    const resolved = await realpath(file);
    if (!resolved.startsWith(outputReal + path.sep)) throw new Error('Not found');
    const data = await readFile(resolved);
    response.writeHead(200, { 'Content-Type': mime[path.extname(resolved)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : await readFile(path.join(output, '404.html')).catch(() => 'Not found'));
  }
});
server.on('error', error => { console.error(`预览启动失败：${error.message}。可用 --port 指定其他端口。`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}${mount}${demo ? ' (虚构示例预览)' : ''}`));
const watchers = [];
let timer;
if (process.argv.includes('--watch')) {
  for (const directory of ['projects', 'website', 'examples', 'schemas', 'scripts']) {
    watchers.push(watch(path.join(ROOT, directory), { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(rebuild, 250); }));
  }
  watchers.push(watch(path.join(ROOT, 'site.config.json'), () => console.log('site.config.json 已更改，请重启预览以更新网站路径。')));
  console.log('文件变更后自动重新构建；刷新浏览器即可查看。');
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { clearTimeout(timer); watchers.forEach(watcher => watcher.close()); server.close(); });
