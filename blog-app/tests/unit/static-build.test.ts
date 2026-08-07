import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const dist = path.join(process.cwd(), 'dist');
const hasBuild = existsSync(dist);
const isReviewBuild = hasBuild && existsSync(path.join(dist, 'index.html'))
  ? readFileSync(path.join(dist, 'index.html'), 'utf8').includes('REVIEW BUILD')
  : false;

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

test('review banner appears once on every review HTML path and never in production', { skip: !hasBuild }, () => {
  const htmlFiles = filesBelow(dist).filter((file) => file.endsWith('.html'));
  assert.ok(htmlFiles.length > 0, 'dist contains no HTML');

  for (const file of htmlFiles) {
    const relative = path.relative(dist, file).replaceAll('\\', '/');
    const html = readFileSync(file, 'utf8');
    const bannerCount = (html.match(/data-review-build-banner/g) ?? []).length;
    assert.equal(
      bannerCount,
      isReviewBuild ? 1 : 0,
      `${relative}: unexpected review banner count`,
    );
    if (!isReviewBuild) {
      assert.equal(html.includes('REVIEW BUILD'), false, `${relative}: review label leaked`);
      assert.equal(html.includes('샘플 콘텐츠 포함'), false, `${relative}: review copy leaked`);
      assert.equal(html.includes('운영 배포 금지'), false, `${relative}: review warning leaked`);
    }
  }
});

test('production build excludes sample articles and empty tag archives from HTML and sitemap', { skip: !hasBuild || isReviewBuild }, () => {
  const articleHtml = filesBelow(path.join(dist, 'articles')).filter((file) => file.endsWith('.html'));
  const tagHtml = filesBelow(path.join(dist, 'tag')).filter((file) => file.endsWith('.html'));
  assert.equal(articleHtml.length, 0, 'sample or draft article leaked into production');
  assert.equal(tagHtml.length, 0, 'empty tag archive leaked into production');

  const sitemap = readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(urls, [
    'https://corecompany.net/blog/',
    'https://corecompany.net/blog/editorial-policy/'
  ]);
  assert.doesNotMatch(sitemap, /\/blog\/(?:articles|category|tag|search)\//);

  const categories = filesBelow(path.join(dist, 'category')).filter((file) => file.endsWith('index.html'));
  assert.equal(categories.length, 6, 'all six navigation category pages should remain available');
  for (const file of categories) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, /<meta[^>]+name="robots"[^>]+content="noindex, follow"/i);
  }
});

test('production HTML has no broken internal page links', { skip: !hasBuild || isReviewBuild }, () => {
  const htmlFiles = filesBelow(dist).filter((file) => file.endsWith('.html'));
  const missing: string[] = [];

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const relative = path.relative(dist, file).replaceAll('\\', '/');
    const pagePath = relative === 'index.html'
      ? '/blog/'
      : relative.endsWith('/index.html')
        ? `/blog/${relative.slice(0, -'index.html'.length)}`
        : `/blog/${relative}`;
    const baseUrl = new URL(pagePath, 'https://corecompany.net');
    const hrefs = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);

    for (const href of hrefs) {
      if (!href || href.startsWith('#') || /^(?:mailto|tel|javascript):/i.test(href)) continue;
      const url = new URL(href, baseUrl);
      if (url.origin !== 'https://corecompany.net' || !url.pathname.startsWith('/blog')) continue;
      const localPath = decodeURIComponent(url.pathname.slice('/blog'.length));
      const target = localPath === '' || localPath === '/'
        ? path.join(dist, 'index.html')
        : localPath.endsWith('/')
          ? path.join(dist, localPath.slice(1), 'index.html')
          : path.join(dist, localPath.slice(1));
      if (!existsSync(target)) missing.push(`${relative} -> ${href}`);
    }
  }

  assert.deepEqual(missing, []);
});

test('production public text contains no review or spreadsheet error markers', { skip: !hasBuild || isReviewBuild }, () => {
  const publicText = filesBelow(dist)
    .filter((file) => /\.(?:html|xml|txt|css|js)$/i.test(file))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
  const forbidden = [
    'REVIEW BUILD',
    '검수용 샘플',
    '샘플 콘텐츠 포함',
    '운영 배포 금지',
    '확인 필요',
    '#REF!',
    '#NAME?',
    '●L'
  ];
  for (const marker of forbidden) {
    assert.equal(publicText.includes(marker), false, `production marker leaked: ${marker}`);
  }
  assert.doesNotMatch(publicText, /[A-Za-z]:\\(?:Users|Hermes_Vault)\\/i);
});
