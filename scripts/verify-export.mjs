import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(), false);
const root = resolve('out');
const production = process.env.NEXT_PUBLIC_SITE_MODE === 'production';
const home = await readFile(resolve(root, 'index.html'), 'utf8');
const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
const exists = path => access(resolve(root, path)).then(() => true, () => false);
assert.match(home, /id="main-content"/, 'A working skip-link target must be exported');
assert.equal((home.match(/<h1(?:\s|>)/g) || []).length, 1, 'Homepage must have one h1');
await access(resolve(root, 'og-image.png'));
if (production) {
  assert.match(home, /name="robots" content="index, follow"/, 'Production must be indexable');
  assert.match(home, /rel="canonical"/, 'Production must declare a canonical');
  assert.doesNotMatch(home, /aria-label="Design review navigation"|class="chooser"/);
  assert.match(robots, /Allow: \//);
  assert.doesNotMatch(robots, /Disallow: \//);
  assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
  assert.equal(await exists('design-1/index.html'), false, 'Review design 1 must not ship in production');
  assert.equal(await exists('design-2/index.html'), false, 'Review design 2 must not ship in production');
  const selected = process.env.NEXT_PUBLIC_SELECTED_DESIGN;
  assert.match(home, new RegExp(`class="${selected === 'design-2' ? 'design-two' : 'design-one'}"`));
} else {
  assert.match(home, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(home, /rel="canonical"/);
  assert.match(robots, /Disallow: \//);
  assert.doesNotMatch(sitemap, /<loc>/);
  for (const design of ['design-1', 'design-2']) {
    const html = await readFile(resolve(root, design, 'index.html'), 'utf8');
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(html, /aria-label="Design review navigation"/);
    assert.match(html, /id="main-content"/);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  }
}
console.log(`Static export verified: ${production ? 'production: one selected, indexable homepage; no review routes' : 'preview: selector and two complete noindex designs'}.`);
