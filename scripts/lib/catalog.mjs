import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import net from 'node:net';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const CATEGORIES = [
  { id: 'structure', label: '结构', en: 'Structure' },
  { id: 'firmware', label: '整机固件', en: 'Firmware' },
  { id: 'motion-model', label: '动作模型', en: 'Motion models' },
  { id: 'av-interaction', label: '音视频交互', en: 'Audio & video' },
  { id: 'duck-life', label: '晒晒小鸭', en: 'Duck showcase' }
];

const FIELD_NAMES = {
  项目名称: '项目名称', 分享标题: '项目名称', 'project name': '项目名称', 'share title': '项目名称',
  所属板块: '所属板块', category: '所属板块', 作品链接: '作品链接', 'project url': '作品链接',
  项目说明: '项目说明', 分享说明: '项目说明', description: '项目说明',
  图片: '图片', images: '图片', 视频链接: '视频链接', 'video url': '视频链接', 作者: '作者', author: '作者'
};

export function publicUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) throw new Error('链接请保持在 2048 字符以内');
  let url;
  try { url = new URL(value); } catch { throw new Error(`无效链接: ${value}`); }
  const host = url.hostname.toLowerCase().replace(/\.$/, '').replace(/^\[|\]$/g, '');
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443') ||
      !host.includes('.') || net.isIP(host) || /(^|\.)(localhost|local|internal|test|invalid|example)$/.test(host) ||
      /(^|\.)example\.(com|org|net)$/.test(host)) {
    throw new Error(`请使用公开的 HTTPS 链接: ${value}`);
  }
  return url;
}

const linksIn = text => [...new Set((text.match(/https:\/\/[^\s<>"'\])]+/g) ?? []).map(url => url.replaceAll('&amp;', '&')))];
export function parseProject(source, slug) {
  if (slug.length > 80 || slug.trim() !== slug || !/^[\p{L}\p{N}][\p{L}\p{N} _-]*$/u.test(slug)) {
    throw new Error('文件名请使用中文、英文、数字、空格或连字符，例如「我的轮足.md」');
  }
  if (Buffer.byteLength(source) > 64 * 1024) throw new Error('项目说明不得超过 64 KB');
  const headings = [...source.matchAll(new RegExp('^###\\s+(' + Object.keys(FIELD_NAMES).join('|') + ')\\s*$', 'gmi'))];
  const fields = {};
  headings.forEach((match, index) => {
    const field = FIELD_NAMES[match[1].toLowerCase()];
    if (Object.hasOwn(fields, field)) throw new Error(`请勿重复填写「${match[1]}」`);
    const end = headings[index + 1]?.index ?? source.length;
    let value = source.slice(match.index + match[0].length, end).trim();
    if (value === '_No response_' || value === '无') value = '';
    fields[field] = value;
  });
  for (const field of ['项目名称', '所属板块', '项目说明']) {
    if (!fields[field]) throw new Error(`请填写「${field}」`);
  }
  if (fields['项目名称'].length > 70 || fields['项目名称'].includes('\n')) throw new Error('项目名称请保持在一行、70 字以内');
  if (fields['项目说明'].length < 5 || fields['项目说明'].length > 12000) throw new Error('项目说明请填写 5–12000 字');
  const category = CATEGORIES.find(item => item.label === fields['所属板块'] || item.id === fields['所属板块'] || item.en.toLowerCase() === fields['所属板块'].toLowerCase());
  if (!category) throw new Error('所属板块请选择：结构、整机固件、动作模型、音视频交互、晒晒小鸭');
  const repository = linksIn(fields['作品链接'] ?? '')[0];
  if (!repository && (category.id !== 'duck-life' || fields['作品链接'])) throw new Error('请填写「作品链接」：MakerWorld、GitHub 或其他作品页面的 HTTPS 链接');
  const images = linksIn(fields['图片'] ?? '');
  if (images.length > 7) throw new Error('最多提供 7 张图片');
  const video = linksIn(fields['视频链接'] ?? '')[0];
  if (fields['视频链接'] && !video) throw new Error('视频链接请使用 HTTPS；没有视频可以留空');
  if (category.id === 'duck-life' && !images.length && !video) throw new Error('晒晒小鸭请至少提供一张图片或一个视频链接');
  const project = {
    slug, name: fields['项目名称'], category: category.id,
    summary: fields['项目说明'].replace(/\s+/g, ' ').slice(0, 150),
    description: fields['项目说明'], repository,
    image: images[0], image_alt: fields['项目名称'],
    gallery: images.slice(1).map(image => ({ image, alt: fields['项目名称'] })),
    video, author: fields['作者'] ? { name: fields['作者'].slice(0, 70) } : undefined
  };
  for (const link of projectUrls(project)) publicUrl(link);
  return project;
}

export function projectUrls(project) {
  return [...new Set([project.repository, project.video, project.image, ...(project.gallery ?? []).map(item => item.image)].filter(Boolean))];
}

export async function loadProjects({ root = ROOT, directory = 'projects' } = {}) {
  const projects = [], errors = [], repositories = new Set(), slugs = new Set();
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    try {
      if (!entry.isFile() || !/\.md$/i.test(entry.name)) throw new Error('请提交 Markdown 项目介绍（.md）');
      const slug = entry.name.replace(/\.md$/i, '');
      const project = parseProject(await readFile(path.join(root, directory, entry.name), 'utf8'), slug);
      const key = slug.toLowerCase();
      if (slugs.has(key)) throw new Error('项目文件名重复');
      const primaryUrl = project.repository ?? project.video ?? project.image;
      if (primaryUrl) {
        const url = new URL(primaryUrl);
        url.hash = '';
        if (url.hostname === 'github.com') { url.pathname = url.pathname.toLowerCase(); url.search = ''; }
        const canonical = url.href.replace(/\/+$/, '').replace(/\.git$/, '');
        if (repositories.has(canonical)) throw new Error('作品链接重复，请更新原条目');
        repositories.add(canonical);
      }
      slugs.add(key); projects.push(project);
    } catch (error) { errors.push(`${entry.name}: ${error.message}`); }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return projects.sort((a, b) => CATEGORIES.findIndex(c => c.id === a.category) - CATEGORIES.findIndex(c => c.id === b.category) || a.name.localeCompare(b.name, 'zh-CN'));
}

export async function loadConfig(root = ROOT) {
  const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(config.repository) || !/^[\w./-]+$/.test(config.branch)) throw new Error('网站仓库配置无效');
  if (typeof config.title !== 'string' || typeof config.description !== 'string') throw new Error('网站标题和介绍必填');
  const site = publicUrl(config.siteUrl);
  if (!site.pathname.endsWith('/') || site.search || site.hash) throw new Error('siteUrl 必须是以 / 结尾的网站地址');
  return config;
}
