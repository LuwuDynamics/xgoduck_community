import { loadProjects, projectUrls } from './lib/catalog.mjs';
import { checkLink } from './lib/links.mjs';
try {
  const projects = await loadProjects();
  const urls = [...new Set(projects.flatMap(projectUrls))];
  let errors = 0;
  let warnings = 0;
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(4, urls.length) }, async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const result = await checkLink(url);
      if (result.state === 'error') errors++;
      if (result.state === 'warning') warnings++;
      console.log(`${result.state.toUpperCase()} ${url} — ${result.reason}`);
      if (process.env.GITHUB_ACTIONS && result.state !== 'ok') {
        const safe = value => value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
        console.log(`::${result.state}::${safe(url + ' — ' + result.reason)}`);
      }
    }
  }));
  console.log(`链接检查：${urls.length} 个链接，${errors} 个失效，${warnings} 个需人工复核。`);
  if (errors) process.exitCode = 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
