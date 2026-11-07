import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import net from 'node:net';
import Ajv from 'ajv';
import { parseDocument } from 'yaml';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const CATEGORIES = [
  { id: 'structure', label: '结构', en: 'STRUCTURE', icon: 'box' },
  { id: 'firmware', label: '整机固件', en: 'FIRMWARE', icon: 'chip' },
  { id: 'motion-model', label: '动作模型', en: 'MOTION MODELS', icon: 'brain' },
  { id: 'av-interaction', label: '音视频交互', en: 'AUDIO & VIDEO', icon: 'grid' }
];
const schema = JSON.parse(await readFile(path.join(ROOT, 'schemas/project.schema.json'), 'utf8'));
const validate = new Ajv({ allErrors: true, strict: true }).compile(schema);

export function publicUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error(`无效链接: ${value}`); }
  const host = url.hostname.toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '');
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443') ||
      !host.includes('.') || net.isIP(host) || /(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host) ||
      host === 'example.com' || host.endsWith('.example.com') || host === 'example.org' || host === 'example.net') {
    throw new Error(`请使用公开的 HTTPS 链接（不接受内网、IP、凭据或示例域名）: ${value}`);
  }
  return url;
}

export function projectUrls(project) {
  return [...new Set([
    project.repository, project.author.url, project.documentation, project.issues, project.video,
    project.image?.startsWith('https://') ? project.image : undefined,
    ...(project.gallery ?? []).map(item => item.image).filter(url => url.startsWith('https://'))
  ].filter(Boolean))];
}

export async function validateProject(project, slug, root = ROOT) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) throw new Error('文件名必须是小写英文、数字和连字符（最多 80 字符）');
  if (!validate(project)) throw new Error(validate.errors.map(error => `${error.instancePath || '/'} ${error.message}`).join('; '));
  const checkText = value => {
    if (typeof value === 'string' && !value.trim()) throw new Error('文本字段不能只包含空白字符');
    if (value && typeof value === 'object') Object.values(value).forEach(checkText);
  };
  checkText(project);
  if (/YOUR-(NAME|PROJECT|VIDEO-ID)/.test(JSON.stringify(project))) throw new Error('请替换模板中的 YOUR-* 占位内容');
  for (const url of projectUrls(project)) publicUrl(url);
  if (new Date(`${project.updated}T00:00:00Z`).toISOString().slice(0, 10) !== project.updated) throw new Error('updated 必须是真实日期');
  for (const image of [project.image, ...(project.gallery ?? []).map(item => item.image)].filter(Boolean)) {
    if (image.startsWith('https://')) continue;
    if (!/^assets\/projects\/[a-zA-Z0-9_/-]+\.(png|jpe?g|webp|gif)$/i.test(image) || image.includes('..')) {
      throw new Error(`本地图片必须位于 assets/projects/，使用 PNG、JPEG、WebP 或 GIF: ${image}`);
    }
    const publicRoot = await realpath(path.join(root, 'website/public'));
    const location = await realpath(path.join(publicRoot, image));
    if (!location.startsWith(publicRoot + path.sep) || !(await stat(location)).isFile()) throw new Error(`图片路径越界或不是文件: ${image}`);
    if ((await stat(location)).size > 5 * 1024 * 1024) throw new Error(`图片不得超过 5 MB: ${image}`);
  }
  return { ...project, slug };
}

export async function loadProjects({ root = ROOT, directory = 'projects' } = {}) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const projects = [];
  const errors = [];
  const repos = new Set();
  const slugs = new Set();
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    if (!entry.isFile() || !/\.ya?ml$/.test(entry.name)) { errors.push(`${entry.name}: projects/ 只能包含 YAML 文件`); continue; }
    try {
      const source = await readFile(path.join(root, directory, entry.name), 'utf8');
      if (Buffer.byteLength(source) > 64 * 1024) throw new Error('YAML 不得超过 64 KB');
      const document = parseDocument(source, { uniqueKeys: true, version: '1.2' });
      if (document.errors.length) throw new Error(document.errors.map(error => error.message).join('; '));
      const project = await validateProject(document.toJS({ maxAliasCount: 0 }), entry.name.replace(/\.ya?ml$/, ''), root);
      if (slugs.has(project.slug)) throw new Error('项目文件名重复（.yml / .yaml）');
      const repoUrl = new URL(project.repository);
      repoUrl.hash = '';
      if (repoUrl.hostname === 'github.com') { repoUrl.pathname = repoUrl.pathname.toLowerCase(); repoUrl.search = ''; }
      const repo = repoUrl.href.replace(/\/+$/, '').replace(/\.git$/, '');
      if (repos.has(repo)) throw new Error('项目地址重复，请更新现有条目');
      slugs.add(project.slug); repos.add(repo); projects.push(project);
    } catch (error) { errors.push(`${entry.name}: ${error.message}`); }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return projects.sort((a, b) => b.updated.localeCompare(a.updated) || a.slug.localeCompare(b.slug));
}

export async function loadConfig(root = ROOT) {
  const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(config.repository) || !/^[\w./-]+$/.test(config.branch)) throw new Error('site.config.json 中的 repository / branch 无效');
  if (typeof config.title !== 'string' || typeof config.description !== 'string') throw new Error('网站标题和介绍必填');
  const site = publicUrl(config.siteUrl);
  if (!site.pathname.endsWith('/') || site.search || site.hash) throw new Error('siteUrl 必须是以 / 结尾的 HTTPS 网站地址');
  return config;
}
