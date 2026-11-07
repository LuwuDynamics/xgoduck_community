import { loadProjects, loadConfig } from './lib/catalog.mjs';
try {
  await loadConfig();
  const projects = await loadProjects();
  console.log(`校验通过：${projects.length} 个社区项目。`);
} catch (error) {
  console.error(`项目校验失败：\n${error.message}`);
  process.exitCode = 1;
}
