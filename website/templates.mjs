import { CATEGORIES } from '../scripts/lib/catalog.mjs';

export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const paths = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  external: '<path d="M14 3h7v7M21 3l-11 11M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
  github: '<path d="M9 19c-4.3 1.3-4.3-2.2-6-2.6M15 22v-3.9a3.4 3.4 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7.4a5.8 5.8 0 0 0-1.6-4c.2-1 .2-2-.1-3 0 0-1.3-.4-4.2 1.6a14.3 14.3 0 0 0-7.6 0C4.3.6 3 1 3 1c-.4 1-.4 2-.1 3a5.8 5.8 0 0 0-1.6 4c0 5.8 3.4 7 6.7 7.4a3.4 3.4 0 0 0-1 2.7V22" transform="translate(1 0) scale(.95)"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  box: '<path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v5M15 1v5M9 18v5M15 18v5M1 9h5M1 15h5M18 9h5M18 15h5"/><path d="M10 10h4v4h-4z"/>',
  brain: '<path d="M12 18a4 4 0 0 1-7 2 4 4 0 0 1-2-7 4 4 0 0 1 2-7 4 4 0 0 1 7-2v14ZM12 5h5l3 3M12 12h8M12 19h5l3-3"/><circle cx="21" cy="9" r="1"/><circle cx="21" cy="12" r="1"/><circle cx="21" cy="15" r="1"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  book: '<path d="M12 5C8 2 5 3 2 4v16c3-1 6-2 10 1 4-3 7-2 10-1V4c-3-1-6-2-10 1v16"/>',
  branch: '<circle cx="6" cy="5" r="3"/><circle cx="6" cy="20" r="3"/><circle cx="19" cy="5" r="3"/><path d="M6 8v9M19 8a8 8 0 0 1-8 8H6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  play: '<path d="m9 5 11 7-11 7V5Z"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  globe: '<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20"/>'
};
export const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.box}</svg>`;
const ext = (url, label, cls = '') => `<a href="${escape(url)}" class="${cls}" target="_blank" rel="noopener noreferrer"${cls === 'github-nav' ? ' aria-label="GitHub 社区仓库（新窗口）"' : ''}>${label}${icon('external')}<span class="sr-only">（新窗口）</span></a>`;
const categoryFor = p => CATEGORIES.find(c => c.id === p.category);
const paragraphs = value => String(value).split(/\n\s*\n/).map(p => `<p>${escape(p).replace(/\n/g, '<br>')}</p>`).join('');

export function duckArt() {
  return `<svg class="duck-art" viewBox="0 0 520 360" fill="none" aria-hidden="true">
    <ellipse cx="279" cy="296" rx="137" ry="20" fill="currentColor" opacity=".05"/>
    <g stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">
      <path d="m207 175 65-35 91 37-67 39-89-41Z" fill="#fffdf6"/>
      <path d="M207 175v49l89 41v-49l-89-41Zm89 41 67-39v48l-67 40" fill="#e8e7dd"/>
      <path d="m230 158 1-36 50-24 48 22v37" fill="#fffdf6"/>
      <path d="m231 122 49 23 49-25M280 145v32"/>
      <path d="m280 145 50-24v36l-50 26v-38Z" fill="#242521"/>
      <ellipse cx="295" cy="153" rx="3" ry="5" fill="#fff8cf" stroke="none"/>
      <ellipse cx="316" cy="142" rx="3" ry="5" fill="#fff8cf" stroke="none"/>
      <path d="m330 145 26 3-25 15-13-3" fill="#ffd64a"/>
      <path d="m230 221-17 34 22 26M320 250l-8 27 27 17" stroke-width="11" stroke="#888c79"/>
      <path d="m230 221-17 34 22 26M320 250l-8 27 27 17" stroke-width="5" stroke="#f7f6ee"/>
      <path d="m209 279 32-5 26 17-44 7-14-19Zm109 13 26-5 34 13-47 8-13-16Z" fill="#fffefa"/>
      <circle cx="237" cy="211" r="12" fill="#ffe377"/><circle cx="237" cy="211" r="4"/>
      <path d="m211 184-24-6-8 19 29 12M256 185l23 11M256 194l23 11"/>
      <path d="M281 98V81m-5 0h10"/>
    </g>
  </svg>`;
}

export function projectArt(category) {
  if (category === 'structure') return duckArt();
  const art = {
    firmware: '<path d="m260 77 106 61v94l-106 61-106-61v-94l106-61Z" stroke="#989c88" stroke-dasharray="4 6"/><path d="m260 113 72 42v52l-72 42-72-42v-52l72-42Z" fill="#ede6c9" stroke="currentColor" stroke-width="2"/><path d="m188 155 72 42 72-42M260 197v52" stroke="currentColor" stroke-width="2"/><path d="m260 134 36 21-36 21-36-21 36-21Z" fill="#70693c"/><g stroke="currentColor" stroke-width="2"><path d="m207 170-25 14m44-3-25 14m44-3-25 14m64 11 25 14m-6-25 25 14m-6-25 25 14"/></g><text x="260" y="311" text-anchor="middle">0x01  /  BUILD. FLASH. REPEAT.</text>',
    'motion-model': '<g stroke="#a0a88d" stroke-width="1.3"><path d="m132 110 126-20 120 35M132 110l30 132 96-152 23 126 97-91-23 127-74-36-119 26m0 0 193 10M132 110l149 106"/></g><g fill="#f7f8ef" stroke="#788060" stroke-width="2"><circle cx="132" cy="110" r="14"/><circle cx="258" cy="90" r="10"/><circle cx="378" cy="125" r="12"/><circle cx="162" cy="242" r="10"/><circle cx="355" cy="252" r="14"/></g><circle cx="281" cy="216" r="34" fill="#7f8c50"/><path d="m265 217 12 12 21-26" stroke="white" stroke-width="3"/><text x="260" y="311" text-anchor="middle">OBSERVE → LEARN → WALK</text>',
    'av-interaction': '<rect x="160" y="78" width="200" height="174" rx="12" fill="#e3e8d7" stroke="#a0a68c" stroke-width="2"/><path d="M181 121v-22h24m112 0h23v22M181 211v22h24m112 0h23v-22" stroke="#69734e" stroke-width="3"/><path d="M204 167s23-30 56-30 56 30 56 30-23 30-56 30-56-30-56-30Z" stroke="#69734e" stroke-width="2"/><circle cx="260" cy="167" r="15" fill="#8b965c"/><path d="M260 63v15M145 167h15m200 0h15M260 252v15" stroke="#a0a68c" stroke-width="1.5"/><text x="260" y="311" text-anchor="middle">A DIFFERENT WAY TO SEE.</text>',
  };
  const drawing = (art[category] ?? art.firmware).replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, '');
  return `<svg class="project-art" viewBox="0 0 520 360" fill="none" aria-hidden="true">${drawing}</svg>`;
}

function shell({ config, content, title, prefix = './', demo = false, description = config.description, canonicalPath = '' }) {
  const repo = `https://github.com/${config.repository}`;
  const pageTitle = title ? `${title} · ${config.title}` : config.title;
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(pageTitle)}</title><meta name="description" content="${escape(description)}">
<meta name="theme-color" content="#f5f3ed"><meta property="og:title" content="${escape(pageTitle)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website">
${demo ? '<meta name="robots" content="noindex,nofollow">' : `<link rel="canonical" href="${escape(config.siteUrl + canonicalPath)}">`}
<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${prefix}assets/style.css">
<script src="${prefix}assets/app.js" defer></script></head>
<body><a class="skip-link" href="#main">跳至内容</a>
<header class="site-header"><div class="container header-inner"><a class="brand" href="${prefix}" aria-label="XGO-Duck Community 首页"><span class="brand-name">XGO-DUCK<span class="brand-dot" aria-hidden="true">●</span></span><span class="brand-sub">COMMUNITY</span></a>
<nav aria-label="主导航"><a class="nav-explore" href="${prefix}#explore">社区项目</a><a href="${prefix}contribute/">投稿指南</a>${ext(repo, '<span>GitHub</span>', 'github-nav')}</nav></div></header>
${demo ? '<div class="container demo-notice"><span class="status-dot"></span> 演示预览 · 以下项目均为虚构示例</div>' : ''}
<main id="main">${content}</main>
<footer class="site-footer"><div class="container footer-inner"><div><a class="footer-brand" href="${prefix}">XGO-DUCK<span class="brand-dot" aria-hidden="true">●</span><span class="footer-community">COMMUNITY</span></a><p>第三方项目由原作者独立维护。</p></div><div class="footer-links">${ext(`${repo}/discussions`, '社区讨论')}${ext(repo, 'GitHub')}</div></div></footer>
</body></html>`;
}

function thumbnail(project, prefix = './') {
  return project.image ? `<img src="${escape(project.image.startsWith('https://') ? project.image : prefix + project.image)}" alt="${escape(project.image_alt)}" loading="lazy" width="520" height="360" referrerpolicy="no-referrer">` : projectArt(project.category);
}

function projectCard(project, demo) {
  const category = categoryFor(project);
  const search = [project.name, project.summary, project.author.name, category.label, ...(project.tags ?? []), ...project.compatibility.hardware, project.compatibility.firmware].join(' ');
  return `<article class="project-card" data-project data-category="${project.category}" data-search="${escape(search.toLowerCase())}" data-hardware="${escape(JSON.stringify(project.compatibility.hardware))}" data-updated="${project.updated}" data-name="${escape(project.name)}">
    <a class="project-cover cover-${project.category}" href="./projects/${project.slug}/" aria-label="查看 ${escape(project.name)} 的详情">${thumbnail(project)}${demo ? '<span class="demo-tag">演示项目</span>' : ''}</a>
    <div class="project-body"><div class="project-category">${category.label}</div><h3><a href="./projects/${project.slug}/">${escape(project.name)}</a></h3><p class="project-summary">${escape(project.summary)}</p>
    <div class="project-meta"><span>${escape(project.author.name)}</span>${demo ? `<a href="./projects/${project.slug}/">查看详情 ${icon('external')}</a>` : ext(project.repository, '项目仓库')}</div></div></article>`;
}

export function home(config, projects, demo = false) {
  const hardware = [...new Set(projects.flatMap(p => p.compatibility.hardware))].sort();
  const content = `<section class="directory-intro container"><div><p class="eyebrow">XGO-DUCK COMMUNITY</p><h1><span class="marker">社区作品</span></h1></div><div class="intro-action"><p>通过 PR 分享你的项目。</p><a class="button button-primary" href="./contribute/">提交项目 ${icon('external')}</a></div></section>
  <section id="explore" class="directory-surface" aria-labelledby="projects-heading"><div class="explore container"><div class="section-heading"><h2 id="projects-heading">项目目录 <span class="count-label" data-count>${String(projects.length).padStart(2, '0')}</span></h2></div>
  <div class="explore-controls" data-enhanced hidden><div class="filter-row" role="group" aria-label="按项目类别筛选"><button class="filter active" data-category-filter="all" aria-pressed="true">全部</button>${CATEGORIES.map(c => `<button class="filter" data-category-filter="${c.id}" aria-pressed="false">${c.label}</button>`).join('')}</div>
  <div class="search-row"><div class="search-input">${icon('search')}<label class="sr-only" for="search">搜索项目、作者、关键词</label><input id="search" type="search" placeholder="搜索作品、作者、关键词…" autocomplete="off" maxlength="150"><kbd>/</kbd></div><label class="select-field"><span class="sr-only">硬件兼容性</span><select id="hardware"><option value="all">所有硬件</option>${hardware.map(h => `<option value="${escape(h)}">${escape(h)}</option>`).join('')}</select></label><label class="select-field"><span class="sr-only">排序方式</span><select id="sort"><option value="updated">最近更新</option><option value="name">名称 A—Z</option></select></label></div></div>
  <p class="sr-only" role="status" aria-live="polite" data-results>${projects.length} 个项目</p>
  <div class="project-grid" data-grid>${projects.map(p => projectCard(p, demo)).join('')}</div>
  <div class="empty-state" data-empty ${projects.length ? 'hidden' : ''}><h3 data-empty-title>暂无项目</h3><p data-empty-description>通过 Pull Request 提交你的项目。</p><a class="button button-primary" href="./contribute/">提交项目 ${icon('external')}</a><button class="text-link" type="button" data-reset hidden>清除筛选 ${icon('back')}</button></div></div></section>`;
  return shell({ config, content, demo });
}

export function detail(config, project, demo = false) {
  const prefix = '../../';
  const category = categoryFor(project);
  const content = `<div class="container detail"><a class="back-link" href="../../#explore">${icon('back')} 返回项目</a><div class="detail-layout"><div class="detail-main"><div class="project-category">${category.label}${demo ? '<span class="demo-tag-inline">虚构示例</span>' : ''}</div><h1>${escape(project.name)}</h1><p class="detail-summary">${escape(project.summary)}</p><div class="detail-author">${demo ? escape(project.author.name) : ext(project.author.url, escape(project.author.name))}<span>更新于 ${project.updated}</span></div><div class="detail-cover cover-${project.category}">${thumbnail(project, prefix)}</div><section class="prose"><h2>项目介绍</h2>${paragraphs(project.description)}</section>${project.video ? `<section class="video-section"><h2>演示视频</h2>${ext(project.video, icon('play') + '观看演示', 'button button-light')}</section>` : ''}${project.gallery?.length ? `<section><h2>项目图集</h2><div class="gallery">${project.gallery.map(item => `<figure><img src="${escape(item.image.startsWith('https://') ? item.image : prefix + item.image)}" alt="${escape(item.alt)}" loading="lazy" referrerpolicy="no-referrer"><figcaption>${escape(item.alt)}</figcaption></figure>`).join('')}</div></section>` : ''}<section class="installation"><h2>安装与使用</h2><ol>${project.installation.map(step => `<li>${escape(step)}</li>`).join('')}</ol>${project.documentation ? ext(project.documentation, '完整文档', 'text-link') : ''}</section></div><aside class="detail-aside"><div class="aside-card"><h2>项目链接</h2>${demo ? '<span class="button button-disabled" aria-disabled="true">示例 · 无实际仓库</span>' : ext(project.repository, '访问项目仓库', 'button button-primary')}${project.issues ? ext(project.issues, '反馈问题', 'text-link') : ''}</div><div class="compatibility"><h2>兼容性</h2><dl><dt>硬件</dt><dd>${project.compatibility.hardware.map(h => `<span class="tag">${escape(h)}</span>`).join('')}</dd><dt>固件 / 软件</dt><dd>${escape(project.compatibility.firmware)}</dd><dt>使用说明</dt><dd>${escape(project.compatibility.notes)}</dd><dt>许可证</dt><dd>${escape(project.license ?? '以原项目声明为准')}</dd></dl></div><div class="detail-tags">${(project.tags ?? []).map(t => `<span class="tag">${escape(t)}</span>`).join('')}</div></aside></div></div>`;
  return shell({ config, content, title: project.name, description: project.summary, prefix, demo, canonicalPath: `projects/${project.slug}/` });
}

export function contribute(config, template, demo = false, prTemplate = '') {
  const repo = `https://github.com/${config.repository}`;
  const templateBlock = (id, label, content) => `<div class="code-block"><div class="code-heading"><span>${label}</span><button type="button" data-copy="${id}" aria-label="复制 ${label}">${icon('copy')}<span aria-live="polite">复制模板</span></button></div><pre><code id="${id}" data-template>${escape(content)}</code></pre></div>`;
  const content = `<div class="container guide"><a class="back-link" href="../#explore">${icon('back')} 返回项目</a><div class="guide-heading"><p class="eyebrow">CONTRIBUTE</p><h1><span class="marker">提交项目</span></h1><p>项目保留在你的仓库，通过 PR 加入社区目录。</p></div><div class="guide-layout"><div>
  <section class="guide-step"><span class="step-number">01</span><div><h2>填写项目资料</h2><p>Fork 社区仓库，将 YAML 模板保存为 <code>projects/your-project.yaml</code>。选择结构、整机固件、动作模型或音视频交互中的一个板块。</p><p>展示图片放入 <code>website/public/assets/projects/</code>。</p><details class="template-details"><summary>项目 YAML 模板</summary>${templateBlock('project-template', 'YAML 模板', template)}</details><div class="template-actions">${ext(`${repo}/fork`, 'Fork 社区仓库', 'text-link')}<a class="text-link" href="../templates/project-template.yaml" download>下载 YAML 模板 ${icon('arrow')}</a></div></div></section>
  <section class="guide-step"><span class="step-number">02</span><div><h2>本地校验</h2><pre class="command-block"><code>npm ci
npm run check
npm run check:links</code></pre><p>检查通过后，将 YAML 和展示图片提交到你的 Fork。</p></div></section>
  <section class="guide-step"><span class="step-number">03</span><div><h2>提交 Pull Request</h2><p>使用下面的 PR 正文模板。审核合并后，目录自动更新。</p>${templateBlock('pr-template', 'PR 模板', prTemplate)}<div class="template-actions">${ext(`${repo}/compare`, '创建 Pull Request', 'button button-primary')}<a class="text-link" href="../templates/pull-request-template.md" download>下载 PR 模板 ${icon('arrow')}</a></div></div></section>
  </div><aside class="guide-aside"><div class="aside-card"><h2>收录要求</h2><ul class="requirements"><li>公开可访问的项目地址</li><li>明确的硬件与固件版本</li><li>项目介绍与安装步骤</li><li>有权使用的展示素材</li></ul>${ext(`${repo}/blob/${config.branch}/CONTRIBUTING.md`, '字段与图片规范', 'text-link')}</div><div class="guide-note"><h3>更新 / 下架</h3><p>提交 PR 修改或删除对应 YAML。项目文件和问题反馈由原仓库维护。</p></div></aside></div></div>`;
  return shell({ config, content, title: '提交项目', prefix: '../', demo, canonicalPath: 'contribute/' });
}

export function notFound(config, demo = false) {
  // Relative links work from the Pages project root and from arbitrary missing paths.
  const content = `<div class="container empty-state error-page"><span class="error-code mono">404</span><h1>页面不存在</h1><a class="button button-primary" href="${escape(config.siteUrl)}">返回首页 ${icon('arrow')}</a></div>`;
  return shell({ config, content, title: '页面未找到', prefix: new URL(config.siteUrl).pathname, demo, canonicalPath: '404.html' });
}
