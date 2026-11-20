import { CATEGORIES } from '../scripts/lib/catalog.mjs';
import { escape, icon, projectArt } from './art.mjs';
import { messages, isEnglish, categoryLabel } from './i18n.mjs';
export { escape, icon, duckArt, projectArt } from './art.mjs';

const paragraphs = value => String(value).split(/\n\s*\n/).map(p => `<p>${escape(p).replace(/\n/g, '<br>')}</p>`).join('');
const external = config => (url, label, cls = '') => `<a href="${escape(url)}" class="${cls}" target="_blank" rel="noopener noreferrer"${cls === 'github-nav' ? ` aria-label="${messages(config).githubLabel}"` : ''}>${label}${icon('external')}<span class="sr-only">${messages(config).newWindow}</span></a>`;

function shell({ config, content, title, prefix = './', demo = false, description, canonicalPath = '' }) {
  const ui = messages(config), en = isEnglish(config), link = external(config);
  const repo = `https://github.com/${config.repository}`;
  const pageTitle = title ? `${title} · ${config.title}` : config.title;
  const assetPrefix = prefix.startsWith('/') ? new URL(config.siteUrl).pathname : (en ? '../' : '') + prefix;
  const alternate = en ? prefix + '../' + canonicalPath : prefix + 'en/' + canonicalPath;
  const canonical = config.siteUrl + (en ? 'en/' : '') + canonicalPath;
  description ??= ui.siteDescription;
  return `<!doctype html>
<html lang="${en ? 'en' : 'zh-CN'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(pageTitle)}</title><meta name="description" content="${escape(description)}">
<meta name="theme-color" content="#f5f3ed"><meta property="og:title" content="${escape(pageTitle)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website">
${demo ? '<meta name="robots" content="noindex,nofollow">' : `<link rel="canonical" href="${escape(canonical)}"><link rel="alternate" hreflang="zh-CN" href="${escape(config.siteUrl + canonicalPath)}"><link rel="alternate" hreflang="en" href="${escape(config.siteUrl + 'en/' + canonicalPath)}">`}
<link rel="icon" href="${assetPrefix}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${assetPrefix}assets/style.css"><script src="${assetPrefix}assets/app.js" defer></script></head>
<body><a class="skip-link" href="#main">${ui.skip}</a>
<header class="site-header"><div class="container header-inner"><a class="brand" href="${prefix}" aria-label="XGO-Duck Community · ${ui.home}"><span class="brand-name">XGO-DUCK<span class="brand-dot" aria-hidden="true">●</span></span><span class="brand-sub">COMMUNITY</span></a>
<nav aria-label="${ui.navigation}"><a class="nav-explore" href="${prefix}#explore">${ui.projects}</a><a href="${prefix}contribute/">${ui.submitNav}</a><a class="language-switch" href="${alternate}" data-language-switch lang="${en ? 'zh-CN' : 'en'}" hreflang="${en ? 'zh-CN' : 'en'}">${en ? '中文' : 'English'}</a>${link(repo, '<span>GitHub</span>', 'github-nav')}</nav></div></header>
${demo ? `<div class="container demo-notice">${ui.previewNotice}</div>` : ''}
<main id="main">${content}</main>
<footer class="site-footer"><div class="container footer-inner"><div><a class="footer-brand" href="${prefix}">XGO-DUCK<span class="brand-dot" aria-hidden="true">●</span><span class="footer-community">COMMUNITY</span></a><p>${ui.footer}</p></div><div class="footer-links">${link(`${repo}/discussions`, ui.discussion)}${link(repo, 'GitHub')}</div></div></footer></body></html>`;
}

function thumbnail(project, assetPrefix = './') {
  return project.image ? `<img src="${escape(project.image.startsWith('https://') ? project.image : assetPrefix + project.image)}" alt="${escape(project.image_alt)}" loading="lazy" width="520" height="360" referrerpolicy="no-referrer">` : projectArt(project.category);
}

function platformName(url, ui) {
  if (!url) return ui.member;
  const host = new URL(url).hostname;
  if (host === 'makerworld.com' || host.endsWith('.makerworld.com')) return 'MakerWorld';
  return host === 'github.com' ? 'GitHub' : host;
}

function projectCard(config, project, demo, prefix = './', hidden = false) {
  const ui = messages(config), category = CATEGORIES.find(c => c.id === project.category);
  const sharing = project.category === 'duck-life', projectPath = prefix + 'projects/' + encodeURIComponent(project.slug) + '/';
  const search = [project.name, project.description, project.author?.name ?? '', category.label, category.en, category.id, platformName(project.repository, ui)].join(' ');
  const cover = project.image ? thumbnail(project, (isEnglish(config) ? '../' : '') + prefix) : sharing ? `<div class="video-cover">${icon('play')}<span>${ui.videoShare}</span></div>` : projectArt(project.category);
  return `<article class="project-card${sharing ? ' duck-card' : ''}" data-project data-category="${project.category}" data-search="${escape(search.toLowerCase())}"${hidden ? ' hidden' : ''}>
<a class="project-cover" href="${projectPath}" aria-label="${ui.details}: ${escape(project.name)}">${cover}${demo ? `<span class="demo-tag">${ui.preview}</span>` : ''}</a>
<div class="project-body"><div class="project-category">${escape(categoryLabel(config, category))}</div><h3><a href="${projectPath}">${escape(project.name)}</a></h3><p class="project-summary">${escape(project.summary)}</p>
<div class="project-meta"><span>${escape(project.author?.name ?? platformName(project.repository, ui))}</span>${demo || sharing ? `<a href="${projectPath}">${sharing ? ui.shareDetails : ui.details}</a>` : external(config)(project.repository, ui.viewProject)}</div></div></article>`;
}

export function home(config, projects, demo = false, { prefix = './', initialCategory = 'all', title } = {}) {
  const ui = messages(config), visible = projects.filter(p => initialCategory === 'all' || p.category === initialCategory);
  const filters = [{ id: 'all', label: ui.all }, ...CATEGORIES.map(c => ({id:c.id,label:categoryLabel(config,c)}))];
  const content = `<section class="directory-intro container"><div><p class="eyebrow">XGO-DUCK COMMUNITY</p><h1><span class="marker">${ui.projects}</span></h1></div><div class="intro-action"><p>${ui.intro}</p><a class="button button-primary" href="${prefix}contribute/">${ui.submit}</a></div></section>
<section id="explore" class="directory-surface" aria-labelledby="projects-heading"><div class="explore container"><div class="section-heading"><h2 id="projects-heading">${ui.directory} <span class="count-label" data-count>${String(visible.length).padStart(2, '0')}</span></h2></div>
<div class="explore-controls" data-enhanced hidden><div class="filter-row" role="group" aria-label="${ui.filter}">${filters.map(c => `<button class="filter${c.id === initialCategory ? ' active' : ''}" data-category-filter="${c.id}" aria-pressed="${c.id === initialCategory}">${escape(c.label)}</button>`).join('')}</div>
<div class="search-row"><div class="search-input">${icon('search')}<label class="sr-only" for="search">${ui.search}</label><input id="search" type="search" placeholder="${ui.search}…" autocomplete="off" maxlength="150"><kbd>/</kbd></div></div></div>
<p class="sr-only" role="status" aria-live="polite" data-results>${visible.length}</p><div class="project-grid" data-grid data-default-category="${initialCategory}">${projects.map(p => projectCard(config,p,demo,prefix,initialCategory !== 'all' && p.category !== initialCategory)).join('')}</div>
<div class="empty-state" data-empty ${visible.length ? 'hidden' : ''}><h3 data-empty-title>${ui.empty}</h3><p data-empty-description>${ui.emptyDescription}</p><a class="button button-primary" href="${prefix}contribute/">${ui.submit}</a><button class="text-link" type="button" data-reset hidden>${ui.reset}</button></div></div></section>`;
  return shell({config,content,demo,prefix,title});
}

export function showcase(config, projects, demo = false) {
  return home(config,projects,demo,{prefix:'../',initialCategory:'duck-life',title:messages(config).duckHeading});
}

export function detail(config, project, demo = false) {
  const ui = messages(config), prefix = '../../', assetPrefix = (isEnglish(config) ? '../' : '') + prefix, link = external(config);
  const category = CATEGORIES.find(c => c.id === project.category), sharing = project.category === 'duck-life';
  const images = project.gallery?.length ? `<section><h2>${ui.photos}</h2><div class="gallery">${project.gallery.map(item => `<figure><img src="${escape(item.image)}" alt="${escape(item.alt)}" loading="lazy" referrerpolicy="no-referrer"></figure>`).join('')}</div></section>` : '';
  const video = project.video ? `<section class="video-section"><h2>${ui.video}</h2>${link(project.video,icon('play') + ui.watch,'button button-light')}</section>` : '';
  const heading = `<div class="project-category">${escape(categoryLabel(config,category))}${demo ? `<span class="demo-tag-inline">${ui.fictional}</span>` : ''}</div><h1>${escape(project.name)}</h1>${project.author ? `<p class="project-credit">${escape(project.author.name)}</p>` : ''}<div class="prose">${paragraphs(project.description)}</div>`;
  const content = sharing
    ? `<div class="container detail"><a class="back-link" href="../../?category=duck-life#explore">${icon('back')}${ui.backDucks}</a><div class="duck-detail">${heading}${project.image ? `<figure class="duck-detail-cover">${thumbnail(project,assetPrefix)}</figure>` : ''}${images}<div class="duck-detail-actions">${project.video ? link(project.video,icon('play') + ui.watch,'button button-primary') : ''}${project.repository && !demo ? link(project.repository,ui.related,'button button-light') : ''}</div></div></div>`
    : `<div class="container detail"><a class="back-link" href="../../#explore">${icon('back')}${ui.backProjects}</a><div class="detail-layout"><div class="detail-main">${heading}<div class="detail-cover">${thumbnail(project,assetPrefix)}</div>${images}${video}</div><aside class="detail-aside"><div class="aside-card"><h2>${ui.original}</h2>${demo ? `<span class="button button-disabled" aria-disabled="true">${ui.noOriginal}</span>` : link(project.repository,ui.viewOriginal,'button button-primary')}</div></aside></div></div>`;
  return shell({config,content,title:project.name,description:project.summary,prefix,demo,canonicalPath:'projects/'+encodeURIComponent(project.slug)+'/'});
}

export function contribute(config, template, demo = false, agentPrompt = '', duckTemplate = '') {
  const ui = messages(config), en = isEnglish(config), link = external(config), repo = 'https://github.com/'+config.repository;
  const templateRoot = en ? '../../templates/' : '../templates/', suffix = en ? '-en' : '';
  const form = repo+'/issues/new?template=share-project'+suffix+'.yml';
  const content = `<div class="container guide"><a class="back-link" href="../#explore">${icon('back')}${ui.backProjects}</a><div class="guide-heading"><p class="eyebrow">SHARE YOUR PROJECT</p><h1><span class="marker">${ui.shareHeading}</span></h1><p>${ui.shareIntro}</p></div>
<section class="submission-start"><div class="submission-main"><h2>${ui.formHeading}</h2><p>${ui.formIntro}</p>${link(form,ui.formButton,'button button-primary')}</div><aside class="aside-card"><h2>${ui.prepare}</h2><ul class="requirements">${[ui.nameCategory,ui.projectLink,ui.descriptionImages,ui.optionalVideo].map(value=>`<li>${value}</li>`).join('')}</ul></aside></section>
<section class="submission-duck" id="duck-life"><h2>${ui.duckHeading}</h2><p>${ui.duckIntro}</p>${link(repo+'/issues/new?template=share-duck'+suffix+'.yml',ui.shareDuck,'button button-primary')}<details class="template-details"><summary>${ui.duckTemplate}</summary><div class="code-block"><div class="code-heading"><span>${ui.duckTemplateLabel}</span><button type="button" data-copy="duck-template">${icon('copy')}<span aria-live="polite">${ui.copyTemplate}</span></button></div><pre><code id="duck-template">${escape(duckTemplate)}</code></pre></div></details></section>
<section class="submission-agent" id="agent"><h2>${ui.agentHeading}</h2><p>${ui.agentIntro}</p><div class="agent-actions"><button type="button" class="button button-primary" data-copy="agent-prompt">${icon('copy')}<span aria-live="polite">${ui.copyPrompt}</span></button><a class="text-link" href="${templateRoot}agent-submission-prompt${suffix}.md" download>${ui.downloadPrompt}</a></div><details class="template-details"><summary>${ui.fullPrompt}</summary><div class="code-block"><pre><code id="agent-prompt">${escape(agentPrompt)}</code></pre></div></details></section>
<section class="submission-template"><h2>${ui.templateHeading}</h2><div class="code-block"><div class="code-heading"><span>${ui.description}</span><button type="button" data-copy="project-template" aria-label="${en ? 'Copy submission template' : '复制投稿模板'}">${icon('copy')}<span aria-live="polite">${ui.copyTemplate}</span></button></div><pre><code id="project-template">${escape(template)}</code></pre></div><a class="text-link" href="${templateRoot}project-template${suffix}.md" download>${ui.downloadTemplate}</a>
<details class="template-details"><summary>${ui.prHeading}</summary><div class="pr-instructions"><ol><li>${ui.prStepOne} <code>projects/${en ? 'your-project' : '你的作品名'}.md</code>.</li><li>${ui.prStepTwo}</li><li>${ui.prStepThree}</li></ol><p>${ui.prNote}</p>${link(repo+'/new/'+config.branch+'/projects',ui.newFile,'button button-light')}</div></details></section></div>`;
  return shell({config,content,title:ui.shareHeading,prefix:'../',demo,canonicalPath:'contribute/'});
}

export function notFound(config, demo = false) {
  const ui = messages(config), prefix = new URL(config.siteUrl).pathname + (isEnglish(config) ? 'en/' : '');
  const content = `<div class="container empty-state error-page"><span class="error-code mono">404</span><h1>${ui.notFound}</h1><a class="button button-primary" href="${prefix}">${ui.returnHome}</a></div>`;
  return shell({config,content,title:ui.notFound,prefix,demo,canonicalPath:'404.html'});
}
