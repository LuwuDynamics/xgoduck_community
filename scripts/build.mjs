import { cp, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, loadConfig, loadProjects } from './lib/catalog.mjs';
import { home, showcase, detail, contribute, notFound } from '../website/templates.mjs';

export async function build({ demo = false } = {}) {
  const config = await loadConfig();
  const projects = await loadProjects({ directory: demo ? 'examples/demo' : 'projects' });
  const languages = await Promise.all(['zh', 'en'].map(async locale => {
    const files = locale === 'en'
      ? ['docs/PROJECT_TEMPLATE_EN.md', 'docs/AGENT_SUBMISSION_PROMPT_EN.md', 'docs/DUCK_SHARE_TEMPLATE_EN.md']
      : ['.github/pull_request_template.md', 'docs/AGENT_SUBMISSION_PROMPT.md', 'docs/DUCK_SHARE_TEMPLATE.md'];
    const [template, agentPrompt, duckTemplate] = await Promise.all(files.map(file => readFile(path.join(ROOT,file),'utf8')));
    return {locale,template,agentPrompt,duckTemplate};
  }));
  // Output paths are fixed and confined to the repository, including when called by dev.
  const output = path.join(ROOT, demo ? 'dist-demo' : 'dist');
  await rm(output, { force: true, recursive: true });
  await mkdir(output, { recursive: true });
  await cp(path.join(ROOT, 'website/public'), output, { recursive: true, filter: source => !source.endsWith('.gitkeep') });
  await mkdir(path.join(output, 'templates'), { recursive: true });
  for (const {locale,template,agentPrompt,duckTemplate} of languages) {
    const localized = {...config,locale};
    const pageRoot = locale === 'en' ? path.join(output,'en') : output;
    const suffix = locale === 'en' ? '-en' : '';
    await mkdir(path.join(pageRoot,'contribute'),{recursive:true});
    await mkdir(path.join(pageRoot,'showcase'),{recursive:true});
    await writeFile(path.join(pageRoot,'index.html'),home(localized,projects,demo));
    await writeFile(path.join(pageRoot,'showcase/index.html'),showcase(localized,projects,demo));
    await writeFile(path.join(pageRoot,'contribute/index.html'),contribute(localized,template,demo,agentPrompt,duckTemplate));
    await writeFile(path.join(pageRoot,'404.html'),notFound(localized,demo));
    await writeFile(path.join(output,`templates/project-template${suffix}.md`),template);
    await writeFile(path.join(output,`templates/duck-share-template${suffix}.md`),duckTemplate);
    await writeFile(path.join(output,`templates/agent-submission-prompt${suffix}.md`),agentPrompt);
    for (const project of projects) {
      const location = path.join(pageRoot,'projects',project.slug);
      await mkdir(location,{recursive:true});
      await writeFile(path.join(location,'index.html'),detail(localized,project,demo));
    }
  }
  await writeFile(path.join(output, 'projects.json'), JSON.stringify({ demo, projects }, null, 2));
  await writeFile(path.join(output, '.nojekyll'), '');
  await writeFile(path.join(output, 'robots.txt'), `User-agent: *\n${demo ? 'Disallow: /' : `Allow: /\nSitemap: ${config.siteUrl}sitemap.xml`}\n`);
  if (!demo) {
    const pages = ['', 'contribute/', 'showcase/', ...projects.map(p => `projects/${encodeURIComponent(p.slug)}/`)];
    const urls = pages.flatMap(page => [page, 'en/' + page]);
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
