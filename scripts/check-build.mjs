import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { ROOT } from './lib/catalog.mjs';

const output = path.join(ROOT, process.argv.includes('--demo') ? 'dist-demo' : 'dist');
const pages = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.html')) pages.push(file);
  }
}
try {
  await walk(output);
  let checked = 0;
  for (const file of pages) {
    // 404 deliberately uses deployment-root paths for arbitrary missing URLs.
    if (path.basename(file) === '404.html') continue;
    const html = await readFile(file, 'utf8');
    for (const [, attribute] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|#)/.test(attribute)) continue;
      const target = fileURLToPath(new URL(attribute, pathToFileURL(file)));
      if (!target.startsWith(output + path.sep)) throw new Error(`资源超出输出目录: ${attribute}`);
      let info;
      try { info = await stat(target); } catch { throw new Error(`${path.relative(output, file)} 的资源不存在: ${attribute}`); }
      if (info.isDirectory()) await stat(path.join(target, 'index.html'));
      checked++;
    }
  }
  console.log(`静态链接校验通过：${pages.length} 个页面，${checked} 个内部链接 / 资源。`);
} catch (error) { console.error(error.message); process.exitCode = 1; }
