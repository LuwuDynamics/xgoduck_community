import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { stringify } from 'yaml';
import { loadProjects, validateProject, publicUrl, loadConfig } from '../scripts/lib/catalog.mjs';
import { isPublicIP } from '../scripts/lib/links.mjs';
import { home, detail, contribute } from '../website/templates.mjs';

const sample = {
  name: 'Test project', summary: 'A test community project.', description: 'A detailed description of a community project for validation.',
  author: { name: 'Test author', url: 'https://github.com/luwudynamics' }, category: 'firmware',
  repository: 'https://github.com/luwudynamics/test-project',
  compatibility: { hardware: ['Board A'], firmware: 'v1.0', notes: 'Requires a custom firmware build.' },
  installation: ['Read the instructions in the original repository.'], updated: '2026-11-07'
};
const clone = () => structuredClone(sample);

test('required fields, unknown fields and compatibility are enforced', async () => {
  assert.equal((await validateProject(sample, 'test-project')).slug, 'test-project');
  for (const field of ['repository', 'installation', 'compatibility']) {
    const invalid = clone(); delete invalid[field];
    await assert.rejects(validateProject(invalid, 'test-project'), /required/);
  }
  await assert.rejects(validateProject({ ...clone(), featured: true }, 'test-project'), /additional/);
  await assert.rejects(validateProject({ ...clone(), category: 'unknown' }, 'test-project'), /allowed/);
  for (const category of ['rl-ai', 'application', 'tutorial', 'distribution']) {
    await assert.rejects(validateProject({ ...clone(), category }, 'test-project'), /allowed/);
  }
  await assert.rejects(validateProject({ ...clone(), name: '   ' }, 'test-project'), /空白/);
  await assert.rejects(validateProject({ ...clone(), repository: 'https://github.com/YOUR-NAME/YOUR-PROJECT' }, 'test-project'), /占位/);
});
test('invalid slugs, impossible dates and unsafe URLs are rejected', async () => {
  for (const slug of ['../escape', 'UpperCase', 'with space', 'a'.repeat(81)]) await assert.rejects(validateProject(sample, slug));
  for (const updated of ['2026-02-30', '2026-13-01', 'yesterday']) await assert.rejects(validateProject({ ...clone(), updated }, 'project'));
  for (const url of ['javascript:alert(1)', 'http://github.com/test', 'https://localhost/x', 'https://127.0.0.1/x', 'https://[::1]/x', 'https://user:secret@github.com/x', 'https://example.com/x', 'https://github.com:444/x']) assert.throws(() => publicUrl(url));
  assert.equal(publicUrl('https://makerworld.com/en/models/123').hostname, 'makerworld.com');
});
test('link checker only permits public network addresses', () => {
  for (const ip of ['127.0.0.1', '10.0.0.1', '169.254.169.254', '192.168.1.2', '100.64.0.1', '::1', '::ffff:127.0.0.1', 'fc00::1', 'fe80::1', '2001:db8::1']) assert.equal(isPublicIP(ip), false, ip);
  for (const ip of ['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111']) assert.equal(isPublicIP(ip), true, ip);
});
test('local images require alt text, confined paths, existing files and a size limit', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'duck-images-'));
  try {
    await mkdir(path.join(root, 'website/public/assets/projects'), { recursive: true });
    await writeFile(path.join(root, 'website/public/assets/projects/cover.png'), 'test');
    const valid = { ...clone(), image: 'assets/projects/cover.png', image_alt: 'Test image' };
    await validateProject(valid, 'test', root);
    const missingAlt = { ...valid }; delete missingAlt.image_alt;
    await assert.rejects(validateProject(missingAlt, 'test', root));
    for (const image of ['assets/projects/../secret.png', 'assets/projects/nope.png', 'assets/projects/code.svg']) await assert.rejects(validateProject({ ...valid, image }, 'test', root));
    await writeFile(path.join(root, 'website/public/assets/projects/large.png'), Buffer.alloc(5 * 1024 * 1024 + 1));
    await assert.rejects(validateProject({ ...valid, image: 'assets/projects/large.png' }, 'test', root), /5 MB/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
test('duplicate YAML keys, aliases, duplicate repositories and duplicate slugs fail', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'duck-catalog-'));
  try {
    await mkdir(path.join(root, 'projects'));
    await writeFile(path.join(root, 'projects/a.yaml'), stringify(sample));
    assert.equal((await loadProjects({ root })).length, 1);
    await writeFile(path.join(root, 'projects/b.yaml'), stringify({ ...sample, repository: sample.repository + '.git/' }));
    await assert.rejects(loadProjects({ root }), /地址重复/);
    await rm(path.join(root, 'projects/b.yaml'));
    await writeFile(path.join(root, 'projects/a.yml'), stringify({ ...sample, repository: 'https://github.com/luwudynamics/other-project' }));
    await assert.rejects(loadProjects({ root }), /文件名重复/);
    await rm(path.join(root, 'projects/a.yml'));
    await writeFile(path.join(root, 'projects/a.yaml'), stringify(sample) + '\nname: Duplicate\n');
    await assert.rejects(loadProjects({ root }), /unique|Map keys/i);
    await writeFile(path.join(root, 'projects/a.yaml'), 'name: &name Duck\nsummary: *name\n');
    await assert.rejects(loadProjects({ root }), /alias/i);
  } finally { await rm(root, { recursive: true, force: true }); }
});
test('untrusted project text is escaped in cards, attributes and detail pages', async () => {
  const config = await loadConfig();
  const project = { ...clone(), slug: 'safe', name: '<script>alert(1)</script>', summary: '" onmouseover="alert(1)', description: '<img src=x onerror=alert(1)>' };
  for (const html of [home(config, [project]), detail(config, project)]) {
    assert.doesNotMatch(html, /<script>alert|<img src=x|data-search="" onmouseover/);
    assert.match(html, /&lt;script&gt;/);
  }
});
test('production empty state, demo labeling and nested relative paths remain separate', async () => {
  const config = await loadConfig();
  assert.match(home(config, []), /暂无项目/);
  assert.doesNotMatch(home(config, []), /演示模式|Duck Roller/);
  const demos = await loadProjects({ directory: 'examples/demo' });
  assert.equal(demos.length, 4);
  const demoPage = detail(config, demos[0], true);
  assert.match(demoPage, /虚构示例/);
  assert.match(demoPage, /noindex,nofollow/);
  assert.match(demoPage, /href="\.\.\/\.\.\/assets\/style.css"/);
  assert.doesNotMatch(demoPage, /href="https:\/\/github.com\/xgoduck-demo/);
  assert.match(contribute(config, 'name: <test>'), /&lt;test&gt;/);
  assert.match(contribute(config, 'name: <test>'), /href="\.\.\/assets\/style.css"/);
  assert.match(contribute(config, 'name: test', false, '## PR <test>'), /## PR &lt;test&gt;/);
});
