import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const routes = ['projects.html', ...['websites', 'nonprofits-programs', 'campaigns-content', 'media', 'workflows'].map(name => `work/${name}/index.html`)];
for (const route of routes) {
  const html = read(route);
  assert.match(html, /class="site-header centered-nav-header"/);
  assert.match(html, /data-site-navigation/);
  assert.match(html, /workroom\.js\?v=20260915-restored-collections/);
  assert.doesNotMatch(html, /class="briefing"/);
  for (const [, raw] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(raw)) continue;
    const pathname = raw.split(/[?#]/)[0];
    if (!pathname) continue;
    assert.ok(existsSync(resolve(root, dirname(route), decodeURIComponent(pathname))), `${route}: missing ${pathname}`);
  }
}
const media = read('work/media/index.html');
for (const [attribute, count] of [['data-audio-index', 4], ['data-video-index', 4], ['data-live-index', 3]]) {
  assert.equal([...media.matchAll(new RegExp(`${attribute}=`, 'g'))].length, count, attribute);
}
assert.match(media, /Birthday Montage/);
assert.doesNotMatch(media, /autoplay/);
assert.equal([...read('work/campaigns-content/index.html').matchAll(/data-social=/g)].length, 3);
assert.equal([...read('work/workflows/index.html').matchAll(/data-workflow=/g)].length, 5);
assert.doesNotMatch(read('work/workflows/index.html'), /andrew-ai-idea|proof-stage/);
for (const route of ['index.html', 'mobile.html']) {
  const html = read(route);
  for (const label of ['Websites', 'Social Media', 'Audio Editing', 'Video Editing', 'Live Music', 'NYC Field Work']) assert.ok(html.includes(`<h3>${label}</h3>`), `${route}: missing ${label}`);
  assert.ok(html.includes('work/media/#audio') && html.includes('work/media/#video') && html.includes('work/media/#live'));
}
console.log('Workroom checks passed: navigation, local paths, 4 audio / 4 video / 3 performances / 3 social posts / 5 workflows, and six homepage choices.');
