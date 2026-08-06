import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const dist = path.join(process.cwd(), 'dist');
const hasBuild = existsSync(dist);

function filesBelow(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const candidate = path.join(directory, name);
    return statSync(candidate).isDirectory() ? filesBelow(candidate) : [candidate];
  });
}

test('built HTML uses a Core Company /blog canonical', { skip: !hasBuild }, () => {
  const htmlFiles = filesBelow(dist).filter((file) => file.endsWith('.html'));
  assert.ok(htmlFiles.length > 0, 'dist contains no HTML');

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const canonical = html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
    )?.[1] ?? html.match(
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i
    )?.[1];
    assert.ok(canonical, `missing canonical: ${path.relative(dist, file)}`);
    assert.match(canonical, /^https:\/\/corecompany\.net\/blog(?:\/|$)/);
  }
});

test('production artifacts include Pagefind, RSS, sitemap, and 404', { skip: !hasBuild }, () => {
  assert.ok(existsSync(path.join(dist, 'pagefind', 'pagefind.js')), 'Pagefind index missing');
  assert.ok(existsSync(path.join(dist, 'rss.xml')), 'RSS missing');
  assert.ok(
    existsSync(path.join(dist, 'sitemap-index.xml')) ||
      existsSync(path.join(dist, 'sitemap-0.xml')),
    'sitemap missing'
  );
  assert.ok(existsSync(path.join(dist, '404.html')), '404.html missing');
});
