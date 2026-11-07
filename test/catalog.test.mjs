import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parseProject, loadProjects, publicUrl, loadConfig } from '../scripts/lib/catalog.mjs';
import { isPublicIP } from '../scripts/lib/links.mjs';
import { home, detail, contribute } from '../website/templates.mjs';

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
