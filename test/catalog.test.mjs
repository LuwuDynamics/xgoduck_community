import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, cp, readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { ROOT, parseProject, loadProjects, publicUrl, loadConfig } from '../scripts/lib/catalog.mjs';
import { isPublicIP, checkBuiltLink } from '../scripts/lib/links.mjs';
import { home, showcase, detail, contribute } from '../website/templates.mjs';

function submission(fields = {}) {
  return Object.entries({
    项目名称: '我的轮足', 所属板块: '结构', 作品链接: 'https://makerworld.com/en/models/123',
    项目说明: '这是一个可以自行打印和安装的轮足结构。',
    图片: '![轮足图片](https://github.com/user-attachments/assets/cover)',
    视频链接: '', ...fields
  }).map(([label, value]) => `### ${label}\n\n${value}\n`).join('\n');
}

test('a MakerWorld introduction needs no code repository, author profile or build metadata', () => {
  const p = parseProject(submission(), '我的轮足');
  assert.equal(p.repository, 'https://makerworld.com/en/models/123');
  assert.equal(p.category, 'structure');
  assert.equal(p.image, 'https://github.com/user-attachments/assets/cover');
  assert.equal(p.author, undefined);
  assert.equal(p.video, undefined);
  for (const [label, id] of [['结构','structure'],['整机固件','firmware'],['动作模型','motion-model'],['音视频交互','av-interaction']]) {
    assert.equal(parseProject(submission({所属板块: label}), '项目').category, id);
  }
});

test('Issue form attachment HTML and empty optional responses can be copied directly', () => {
  const p = parseProject(submission({图片: '<img width="800" src="https://github.com/user-attachments/assets/one">\n![另一张](https://github.com/user-attachments/assets/two)', 视频链接: '_No response_'}).replaceAll('\n','\r\n'), 'Duck Roller');
  assert.equal(p.image, 'https://github.com/user-attachments/assets/one');
  assert.equal(p.gallery.length, 1);
  assert.equal(p.video, undefined);
  assert.equal(parseProject(submission({图片:'_No response_'}), '项目').image, undefined);
});

test('English submissions and category names keep the authors original content', () => {
  const source = '### Project name\nWheel build\n\n### Category\nStructure\n\n### Project URL\nhttps://makerworld.com/en/models/123\n\n### Description\nA printable wheel build. 保留原文，不代译。\n\n### Images\n\n### Video URL\n\n### Author\nMaker Name';
  const project = parseProject(source,'wheel-build');
  assert.equal(project.name,'Wheel build');
  assert.equal(project.description,'A printable wheel build. 保留原文，不代译。');
  assert.equal(project.author.name,'Maker Name');
  assert.equal(project.category,'structure');
  for (const [label,id] of [['Firmware','firmware'],['Motion models','motion-model'],['Audio & video','av-interaction']]) {
    assert.equal(parseProject(source.replace('Structure',label),'build').category,id);
  }
  const share = parseProject('### Share title\nMy duck\n### Category\nDuck showcase\n### Description\nMy duck enjoying the day.\n### Images\n### Video URL\nhttps://www.bilibili.com/video/BV1BBad6iELy','my-duck');
  assert.equal(share.category,'duck-life');
  assert.equal(share.repository,undefined);
});

test('English UI and language links preserve project text and use the English forms', async () => {
  const config = {...await loadConfig(),locale:'en'};
  const project = parseProject(submission({项目名称:'原文标题 Original title',项目说明:'这是作者的原文。 Original description.'}),'我的轮足');
  const homepage = home(config,[project]);
  const page = detail(config,project);
  assert.match(homepage,/<html lang="en"/);
  assert.match(homepage,/Community projects/);
  assert.match(homepage,/Duck showcase/);
  for (const html of [homepage,page]) {
    assert.match(html,/原文标题 Original title/);
    assert.match(html,/这是作者的原文。 Original description./);
  }
  assert.match(page,/Back to projects/);
  assert.match(page,/href="\.\.\/\.\.\/\.\.\/projects\//);
  assert.match(page,/src="\.\.\/\.\.\/\.\.\/assets\/app.js"/);
  const form = contribute(config,'### Project name','', 'Agent prompt', '### Share title');
  assert.match(form,/template=share-project-en.yml/);
  assert.match(form,/template=share-duck-en.yml/);
  assert.match(form,/project-template-en.md/);
});

test('duck shares accept photos or video and appear beside the four project categories', async () => {
  const config = await loadConfig();
  const photo = parseProject(submission({项目名称:'小鸭出门',所属板块:'晒晒小鸭',作品链接:''}).replace('### 项目名称','### 分享标题').replace('### 项目说明','### 分享说明'), '小鸭出门');
  assert.equal(photo.category, 'duck-life');
  assert.equal(photo.repository, undefined);
  const video = parseProject(submission({所属板块:'晒晒小鸭',作品链接:'',图片:'_No response_',视频链接:'https://www.bilibili.com/video/BV1h5nh6dEwH'}), '轮滑鸭');
  assert.equal(video.image, undefined);
  assert.match(showcase(config,[photo,video]), /小鸭出门/);
  assert.match(showcase(config,[photo,video]), /视频分享/);
  assert.doesNotMatch(showcase(config,[photo,video]), /href="undefined"/);
  assert.match(detail(config,video), /观看视频/);
  assert.doesNotMatch(detail(config,video), /原作品|detail-cover/);
  const page = home(config,[photo]);
  assert.match(page, /data-category-filter="duck-life"/);
  assert.match(page, /data-count>01/);
  assert.match(page, /data-category="duck-life"/);
  assert.doesNotMatch(page, /duck-section|进入专区/);
  const legacyPage = showcase(config,[photo,parseProject(submission(),'轮足')]);
  assert.match(legacyPage, /data-default-category="duck-life"/);
  assert.match(legacyPage, /data-category="structure"[^>]* hidden/);
  assert.throws(() => parseProject(submission({所属板块:'晒晒小鸭',作品链接:'',图片:'',视频链接:''}), '小鸭'), /至少/);
  assert.throws(() => parseProject(submission({所属板块:'晒晒小鸭',作品链接:'javascript:alert(1)'}), '小鸭'), /作品链接/);
});

test('removing a source file clears its card, detail, index and sitemap on the next build', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(),'duck-delete-build-'));
  assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir())+path.sep));
  try {
    for (const entry of ['scripts','website','docs','.github','site.config.json']) {
      await cp(path.join(ROOT,entry),path.join(root,entry),{recursive:true});
    }
    await mkdir(path.join(root,'projects'));
    await writeFile(path.join(root,'projects/removal-check.md'),submission());
    const build = () => execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'pipe',windowsHide:true});
    build();
    await access(path.join(root,'dist/projects/removal-check/index.html'));
    await access(path.join(root,'dist/en/projects/removal-check/index.html'));
    assert.match(await readFile(path.join(root,'dist/index.html'),'utf8'),/removal-check/);
    await rm(path.join(root,'projects/removal-check.md'));
    build();
    await assert.rejects(access(path.join(root,'dist/projects/removal-check/index.html')), /ENOENT/);
    await assert.rejects(access(path.join(root,'dist/en/projects/removal-check/index.html')), /ENOENT/);
    for (const file of ['index.html','showcase/index.html','en/index.html','en/showcase/index.html','projects.json','sitemap.xml']) {
      assert.doesNotMatch(await readFile(path.join(root,'dist',file),'utf8'),/removal-check/);
    }
  } finally { await rm(root,{recursive:true,force:true}); }
});

test('photo-only shares load together and duplicate media is rejected', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(),'duck-shares-'));
  try {
    await mkdir(path.join(root,'projects'));
    const first = submission({所属板块:'晒晒小鸭',作品链接:''});
    await writeFile(path.join(root,'projects/first.md'), first);
    await writeFile(path.join(root,'projects/second.md'), submission({所属板块:'晒晒小鸭',作品链接:'',图片:'https://github.com/user-attachments/assets/second'}));
    assert.equal((await loadProjects({root})).length, 2);
    await writeFile(path.join(root,'projects/second.md'), first);
    await assert.rejects(loadProjects({root}), /重复/);
  } finally { await rm(root,{recursive:true,force:true}); }
});

test('missing required sections, duplicate headings and unsupported categories are rejected', () => {
  for (const field of ['项目名称','所属板块','作品链接','项目说明']) {
    assert.throws(()=>parseProject(submission({[field]:''}), 'project'), /请填写/);
  }
  assert.throws(()=>parseProject(submission({所属板块:'其他'}), 'project'), /所属板块/);
  assert.throws(()=>parseProject(submission()+'\n### 项目名称\n重复', 'project'), /重复/);
  assert.throws(()=>parseProject(submission({项目名称:'x'.repeat(71)}), 'project'), /70/);
  assert.throws(()=>parseProject(submission({项目说明:'x'.repeat(66000)}), 'project'), /64 KB/);
});

test('unsafe links and escaping filenames are rejected', () => {
  for (const url of ['javascript:alert(1)','http://github.com/test','https://localhost/x','https://127.0.0.1/x','https://[::1]/x','https://user:secret@github.com/x','https://foo.example.org/x','https://github.com:444/x']) {
    assert.throws(()=>publicUrl(url));
  }
  assert.throws(()=>parseProject(submission({作品链接:'javascript:alert(1)'}),'project'));
  assert.throws(()=>parseProject(submission({图片:'https://127.0.0.1/a.png'}),'project'));
  assert.throws(()=>parseProject(submission({视频链接:'javascript:alert(1)'}),'project'));
  for (const slug of ['../escape','a/b','x" onclick="evil',' blank','a'.repeat(81)]) assert.throws(()=>parseProject(submission(),slug));
});

test('duplicate projects are detected across Markdown files', async () => {
  const root=await mkdtemp(path.join(os.tmpdir(),'duck-markdown-'));
  try {
    await mkdir(path.join(root,'projects'));
    await writeFile(path.join(root,'projects/我的轮足.md'),submission());
    assert.equal((await loadProjects({root})).length,1);
    await writeFile(path.join(root,'projects/second.md'),submission());
    await assert.rejects(loadProjects({root}),/作品链接重复/);
    await rm(path.join(root,'projects/second.md'));
    await writeFile(path.join(root,'projects/old.yaml'),'name: old');
    await assert.rejects(loadProjects({root}),/Markdown/);
  } finally { await rm(root,{recursive:true,force:true}); }
});

test('link checker only permits public network addresses', () => {
  for (const ip of ['127.0.0.1','10.0.0.1','169.254.169.254','192.168.1.2','100.64.0.1','::1','::ffff:127.0.0.1','fc00::1','fe80::1','2001:db8::1']) assert.equal(isPublicIP(ip),false,ip);
  for (const ip of ['8.8.8.8','1.1.1.1','2606:4700:4700::1111']) assert.equal(isPublicIP(ip),true,ip);
});

test('new site images are checked before deployment while missing and escaping paths fail', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(),'duck-site-assets-'));
  assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir())+path.sep));
  try {
    await mkdir(path.join(root,'media'));
    await writeFile(path.join(root,'media/cover.png'),'fixture');
    const options = {siteUrl:'https://luwudynamics.github.io/xgoduck_community/',directory:root};
    assert.equal((await checkBuiltLink(options.siteUrl+'media/cover.png',options)).state,'ok');
    assert.equal((await checkBuiltLink(options.siteUrl+'media/missing.png',options)).state,'error');
    assert.equal((await checkBuiltLink(options.siteUrl+'%2e%2e%2foutside.png',options)).state,'error');
    assert.equal(await checkBuiltLink('https://www.bilibili.com/video/BV1BBad6iELy',options),null);
  } finally { await rm(root,{recursive:true,force:true}); }
});

test('project text stays escaped and Chinese filenames produce valid links', async () => {
  const config=await loadConfig();
  const project=parseProject(submission({项目名称:'<script>alert(1)</script>',项目说明:'<img src=x onerror=alert(1)>'}),'我的轮足');
  for (const html of [home(config,[project]),detail(config,project)]) {
    assert.doesNotMatch(html, /<script>alert|<img src=x/);
    assert.match(html,/&lt;script&gt;/);
  }
  assert.match(home(config,[project]),new RegExp(encodeURIComponent('我的轮足')));
});

test('the contributor page has a simple form and one template, without developer setup', async () => {
  const config=await loadConfig();
  const page=contribute(config,'### 项目说明\n<test>');
  assert.match(page,/issues\/new\?template=share-project.yml/);
  assert.match(page,/复制投稿模板/);
  assert.match(page,/&lt;test&gt;/);
  assert.doesNotMatch(page,/npm|YAML|本地校验|Fork 社区仓库/);
  assert.match(home(config,[]),/暂无作品/);
  const demos=await loadProjects({directory:'examples/demo'});
  assert.equal(demos.length,4);
  assert.match(detail(config,demos[0],true),/虚构示例|noindex,nofollow/);
  assert.doesNotMatch(detail(config,demos[0],true),/href="https:\/\/github.com\/xgoduck-demo/);
});
