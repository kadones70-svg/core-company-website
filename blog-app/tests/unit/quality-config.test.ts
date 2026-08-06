import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (relativePath: string) =>
  readFileSync(path.join(root, relativePath), 'utf8');

test('Astro is locked to a static /blog build with the production site URL', () => {
  const astroConfig = read('astro.config.mjs');

  assert.match(astroConfig, /site:\s*['"]https:\/\/corecompany\.net['"]/);
  assert.match(astroConfig, /base:\s*['"]\/blog['"]/);
  assert.match(astroConfig, /output:\s*['"]static['"]/);
  assert.match(astroConfig, /trailingSlash:\s*['"]always['"]/);
});

test('the required local quality and content commands are exposed', () => {
  const packageJson = JSON.parse(read('package.json')) as {
    scripts: Record<string, string>;
  };
  const requiredScripts = [
    'dev',
    'build',
    'build:review',
    'preview',
    'check',
    'test',
    'test:e2e',
    'lighthouse',
    'review:screenshots',
    'content:new',
    'content:validate',
    'content:list',
    'image:optimize'
  ];

  for (const script of requiredScripts) {
    assert.ok(packageJson.scripts[script], `missing npm script: ${script}`);
  }
  assert.match(packageJson.scripts.build, /pagefind/);
  assert.match(packageJson.scripts['build:review'], /INCLUDE_SAMPLES=true/);
});

test('review screenshot plan contains every approved output filename', () => {
  const screenshotSpec = read('tests/review/screenshots.spec.ts');
  const expectedFiles = [
    'main-desktop-1440.png',
    'main-tablet-1024.png',
    'main-mobile-390.png',
    'article-desktop-fold.png',
    'article-desktop-full.png',
    'article-mobile-fold.png',
    'article-mobile-full.png',
    'category-desktop.png',
    'category-mobile.png',
    'search-desktop.png',
    'search-mobile.png',
    'editorial-policy-desktop.png',
    '404-desktop.png'
  ];

  for (const filename of expectedFiles) {
    assert.ok(screenshotSpec.includes(filename), `missing screenshot: ${filename}`);
  }
});

test('Lighthouse thresholds reflect the documented quality targets', () => {
  const lighthouseConfig = read('lighthouserc.cjs');

  assert.match(lighthouseConfig, /'categories:performance'.*minScore:\s*0\.95/);
  assert.match(lighthouseConfig, /'categories:accessibility'.*minScore:\s*1/);
  assert.match(lighthouseConfig, /'categories:best-practices'.*minScore:\s*1/);
  assert.match(lighthouseConfig, /'categories:seo'.*minScore:\s*1/);
  assert.match(lighthouseConfig, /'cumulative-layout-shift'.*maxNumericValue:\s*0\.1/);
});
