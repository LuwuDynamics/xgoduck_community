import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, loadConfig, loadProjects } from './lib/catalog.mjs';
import { home, detail, contribute, notFound } from '../website/templates.mjs';

export async function build({ demo = false } = {}) {
  const config = await loadConfig();
  const projects = await loadProjects({ directory: demo ? 'examples/demo' : 'projects' });
  const template = await readFile(path.join(ROOT, '.github/pull_request_template.md'), 'utf8');
  // Output paths are fixed and confined to the repository, including when called by dev.
  const output = path.join(ROOT, demo ? 'dist-demo' : 'dist');
  await rm(output, { force: true, recursive: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(ROOT, 'website/public'), output, { recursive: true, filter: source => !source.endsWith('.gitkeep') });
  await mkdir(path.join(output, 'contribute'), { recursive: true });
  await writeFile(path.join(output, 'index.html'), home(config, projects, demo));
  await writeFile(path.join(output, 'contribute/index.html'), contribute(config, template, demo));
  await mkdir(path.join(output, 'templates'), { recursive: true });
  await writeFile(path.join(output, 'templates/project-template.md'), template);
  await writeFile(path.join(output, '404.html'), notFound(config, demo));
  for (const project of projects) {
    const location = path.join(output, 'projects', project.slug);
    await mkdir(location, { recursive: true });
    await writeFile(path.join(location, 'index.html'), detail(config, project, demo));
  }
  await writeFile(path.join(output, 'projects.json'), JSON.stringify({ demo, projects }, null, 2));
  await writeFile(path.join(output, '.nojekyll'), '');
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\n${demo ? 'Disallow: /' : `Allow: /\nSitemap: ${config.siteUrl}sitemap.xml`}\n`);
  if (!demo) {
    const urls = ['', 'contribute/', ...projects.map(p => `projects/${encodeURIComponent(p.slug)}/`)];
    const xmlEscape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
    await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${xmlEscape(config.siteUrl + url)}</loc></url>`).join('')}</urlset>`);
  }
  console.log(`${demo ? '演示' : '正式'}构建完成：${projects.length} 个项目 → ${path.relative(ROOT, output)}/`);
  return { output, projects };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { await build({ demo: process.argv.includes('--demo') }); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
