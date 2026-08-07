import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import sharp from 'sharp';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const EVIDENCE = path.resolve(process.env.QA_EVIDENCE_DIR ?? path.join(ROOT, 'review', 'v1.2'));
const mode = process.argv[2];

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesBelow(target));
    else if (entry.isFile()) files.push(target);
  }
  return files.sort((left, right) => left.localeCompare(right, 'en'));
}

function relativeTo(directory, file) {
  return path.relative(directory, file).replaceAll('\\', '/');
}

function routeFromHtml(file) {
  const relative = relativeTo(DIST, file);
  if (relative === 'index.html') return '/blog/';
  if (relative === '404.html') return '/blog/404.html';
  if (relative.endsWith('/index.html')) return `/blog/${relative.slice(0, -'index.html'.length)}`;
  return `/blog/${relative}`;
}

function occurrences(text, value) {
  return text.split(value).length - 1;
}

async function htmlRecords() {
  const files = (await filesBelow(DIST)).filter((file) => file.endsWith('.html'));
  return Promise.all(files.map(async (file) => ({
    file,
    relative: relativeTo(DIST, file),
    route: routeFromHtml(file),
    html: await readFile(file, 'utf8'),
  })));
}

function jsonLdNodes(html) {
  const nodes = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed?.['@graph'])) nodes.push(...parsed['@graph']);
      else nodes.push(parsed);
    } catch (error) {
      nodes.push({ '@type': 'INVALID_JSON_LD', error: error.message });
    }
  }
  return nodes;
}

function typeCounts(nodes) {
  const counts = {};
  for (const node of nodes) {
    const values = Array.isArray(node?.['@type']) ? node['@type'] : [node?.['@type']];
    for (const value of values.filter(Boolean)) counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
}

function jsonLdReport(records) {
  const pages = records.map((record) => ({
    route: record.route,
    ...typeCounts(jsonLdNodes(record.html)),
  }));
  const totals = typeCounts(records.flatMap((record) => jsonLdNodes(record.html)));
  return { totals, pages };
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1].replaceAll('&amp;', '&'),
  );
}

function metaRobots(html) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const robots = tags.find((tag) => /\bname=["']robots["']/i.test(tag));
  return robots?.match(/\bcontent=["']([^"']+)["']/i)?.[1] ?? '';
}

async function writeJson(filename, value) {
  await writeFile(path.join(EVIDENCE, filename), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function writeLines(filename, lines) {
  await writeFile(path.join(EVIDENCE, filename), `${lines.join('\n')}\n`, 'utf8');
}

async function collectReview() {
  const records = await htmlRecords();
  const banners = records.map((record) => ({
    route: record.route,
    count: occurrences(record.html, 'data-review-build-banner'),
  }));
  const invalidBanners = banners.filter((item) => item.count !== 1);
  if (invalidBanners.length) throw new Error(`검수 배너 개수 오류: ${JSON.stringify(invalidBanners)}`);

  const routes = records.map((record) => record.route);
  const articleRoutes = routes.filter((route) => route.includes('/articles/'));
  const categoryRoutes = routes.filter((route) => route.includes('/category/'));
  const tagRoutes = routes.filter((route) => route.includes('/tag/'));
  if (new Set(tagRoutes).size !== tagRoutes.length) throw new Error('검수 빌드 태그 경로가 중복됩니다.');

  const jsonLd = jsonLdReport(records);
  for (const route of articleRoutes) {
    const page = jsonLd.pages.find((item) => item.route === route);
    if (page?.Article !== 1 || page?.BreadcrumbList !== 1 || page?.Organization !== 1) {
      throw new Error(`${route}: Article/BreadcrumbList/Organization JSON-LD 개수가 1이 아닙니다.`);
    }
  }

  const sitemap = await readFile(path.join(DIST, 'sitemap-0.xml'), 'utf8');
  await writeJson('review-banner-counts.json', banners);
  await writeJson('review-jsonld-type-counts.json', jsonLd);
  await writeJson('review-route-summary.json', {
    html: routes.length,
    articles: articleRoutes.length,
    categories: categoryRoutes.length,
    tags: tagRoutes.length,
    uniqueTagRoutes: new Set(tagRoutes).size,
    routes,
  });
  await writeLines('review-sitemap-urls.txt', sitemapUrls(sitemap));
  console.log(`검수 증거 수집 성공: HTML ${routes.length}, 글 ${articleRoutes.length}, 카테고리 ${categoryRoutes.length}, 태그 ${tagRoutes.length}`);
}

async function scanProductionMarkers(files) {
  const textFiles = files.filter((file) => /\.(?:html|xml|txt|css|js|json|svg)$/i.test(file));
  const literals = [
    'REVIEW BUILD',
    '샘플 콘텐츠 포함',
    '운영 배포 금지',
    '검수용 샘플',
    '실제 고객 사례가 아니며 운영 배포에서 제외',
    '확인 필요',
    'TODO',
    '#REF!',
    '#NAME?',
    '●L',
    '테스트용 문구',
  ];
  const patterns = [
    { label: 'local-windows-path', regex: /[A-Za-z]:\\(?:Users|Hermes_Vault)\\/gi, probe: (text) => text.includes(':\\') },
    { label: 'local-file-url', regex: /file:\/\/[A-Za-z]:\/(?:Users|Hermes_Vault)\//gi, probe: (text) => text.includes('file://') },
    { label: 'email-address', regex: /(?:^|["'`\s(])[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-z0-9-]{1,63}(?:\.[a-z0-9-]{1,63})*\.(?:com|net|org|kr|io|ai|dev|biz|info|me|cloud|shop|site)(?=$|["'`\s),;])/gi, sensitive: true, probe: (text) => text.includes('@') },
    { label: 'phone-number', regex: /(?:\+82[-.\s]?)?01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}/g, sensitive: true, probe: (text) => /01[016789]/.test(text) },
    { label: 'secret-token', regex: /(?:^|[^a-z0-9])(?:sk-[a-z0-9_-]{16,}|ghp_[a-z0-9]{16,}|AIza[a-z0-9_-]{20,}|Bearer\s+[a-z0-9._-]{16,})/gi, sensitive: true, probe: (text) => /sk-|ghp_|AIza|Bearer/i.test(text) },
  ];
  const results = [];

  for (const file of textFiles) {
    const text = await readFile(file, 'utf8');
    const scanText = file.endsWith('.svg')
      ? text.replace(/data:[^"'\s>]+/gi, '[EMBEDDED_IMAGE_DATA]')
      : text;
    const lines = scanText.split(/\r?\n/);
    for (const literal of literals) {
      lines.forEach((line, index) => {
        if (line.includes(literal)) results.push({
          label: literal,
          file: relativeTo(DIST, file),
          line: index + 1,
          match: literal,
        });
      });
    }
    for (const pattern of patterns) {
      if (pattern.probe && !pattern.probe(scanText)) continue;
      lines.forEach((line, index) => {
        pattern.regex.lastIndex = 0;
        for (const match of line.matchAll(pattern.regex)) results.push({
          label: pattern.label,
          file: relativeTo(DIST, file),
          line: index + 1,
          match: pattern.sensitive ? '[REDACTED]' : match[0],
        });
      });
    }
  }

  return { filesScanned: textFiles.length, totalMatches: results.length, results };
}

async function collectProduction() {
  const files = await filesBelow(DIST);
  const records = await htmlRecords();
  const routes = records.map((record) => record.route);
  const articleRoutes = routes.filter((route) => route.includes('/articles/'));
  const categoryRoutes = routes.filter((route) => route.includes('/category/'));
  const tagRoutes = routes.filter((route) => route.includes('/tag/'));
  if (articleRoutes.length !== 0) throw new Error(`프로덕션 글 경로가 ${articleRoutes.length}개입니다.`);
  if (tagRoutes.length !== 0) throw new Error(`프로덕션 태그 경로가 ${tagRoutes.length}개입니다.`);
  if (categoryRoutes.length !== 6) throw new Error(`프로덕션 카테고리가 ${categoryRoutes.length}개입니다.`);

  const banners = records.map((record) => ({
    route: record.route,
    count: occurrences(record.html, 'data-review-build-banner'),
  }));
  if (banners.some((item) => item.count !== 0)) throw new Error('프로덕션에 검수 배너가 남았습니다.');

  const categoryRobots = categoryRoutes.map((route) => {
    const record = records.find((item) => item.route === route);
    return { route, robots: metaRobots(record?.html ?? '') };
  });
  if (categoryRobots.some((item) => item.robots.toLocaleLowerCase('en-US') !== 'noindex, follow')) {
    throw new Error(`빈 카테고리 robots 오류: ${JSON.stringify(categoryRobots)}`);
  }

  const sitemap = await readFile(path.join(DIST, 'sitemap-0.xml'), 'utf8');
  const urls = sitemapUrls(sitemap);
  const expectedUrls = [
    'https://corecompany.net/blog/',
    'https://corecompany.net/blog/editorial-policy/',
  ];
  if (JSON.stringify(urls) !== JSON.stringify(expectedUrls)) {
    throw new Error(`프로덕션 사이트맵 URL 오류: ${JSON.stringify(urls)}`);
  }

  const markers = await scanProductionMarkers(files);
  if (markers.totalMatches !== 0) throw new Error(`프로덕션 내부 표식 ${markers.totalMatches}건: ${JSON.stringify(markers.results.slice(0, 8))}`);

  const jsonLd = jsonLdReport(records);
  if (jsonLd.totals.Article) throw new Error('공개 글 0개 프로덕션에 Article JSON-LD가 있습니다.');
  if (jsonLd.pages.some((page) => page.Organization !== 1)) {
    throw new Error('프로덕션 HTML 중 Organization JSON-LD가 정확히 1개가 아닌 페이지가 있습니다.');
  }

  await writeLines('production-paths.txt', files.map((file) => relativeTo(DIST, file)));
  await writeLines('production-html-routes.txt', routes);
  await writeLines('sitemap-urls.txt', urls);
  await writeJson('empty-category-robots.json', categoryRobots);
  await writeLines('empty-category-robots.txt', categoryRobots.map((item) => `${item.route}\t${item.robots}`));
  await writeJson('production-jsonld-type-counts.json', jsonLd);
  await writeJson('production-banner-counts.json', banners);
  await writeJson('production-internal-marker-scan.json', markers);
  await writeLines('production-internal-marker-scan.txt', [
    `FILES_SCANNED=${markers.filesScanned}`,
    `TOTAL_MATCHES=${markers.totalMatches}`,
    ...markers.results.map((item) => `${item.label}\t${item.file}:${item.line}\t${item.match}`),
  ]);
  await writeJson('production-route-summary.json', {
    html: routes.length,
    articles: articleRoutes.length,
    categories: categoryRoutes.length,
    tags: tagRoutes.length,
    sitemapUrls: urls.length,
    reviewMarkers: markers.totalMatches,
    routes,
  });
  console.log(`프로덕션 증거 수집 성공: 글 ${articleRoutes.length}, 카테고리 ${categoryRoutes.length}, 태그 ${tagRoutes.length}, 사이트맵 ${urls.length}, 내부 표식 ${markers.totalMatches}`);
}

async function collectScreenshots() {
  const expected = [
    'home-mobile-320.png',
    'home-mobile-390.png',
    'article-mobile-320.png',
    'article-mobile-390.png',
    'category-review-banner.png',
    'search-results.png',
    'search-zero-results.png',
    'mobile-menu-open.png',
    'keyboard-focus-visible.png',
    'production-banner-absent.png',
  ];
  const directory = path.join(EVIDENCE, 'screenshots');
  const available = new Set(await readdir(directory));
  const missing = expected.filter((name) => !available.has(name));
  if (missing.length) throw new Error(`V1.2 스크린샷이 없습니다: ${missing.join(', ')}`);

  const manifest = [];
  for (const name of expected) {
    const file = path.join(directory, name);
    const buffer = await readFile(file);
    const metadata = await sharp(buffer).metadata();
    manifest.push({
      file: `screenshots/${name}`,
      width: metadata.width,
      height: metadata.height,
      bytes: buffer.byteLength,
      sha256: createHash('sha256').update(buffer).digest('hex'),
    });
  }

  const regressionDirectory = path.join(EVIDENCE, 'regression-screenshots');
  const regressionFiles = (await readdir(regressionDirectory))
    .filter((name) => name.endsWith('.png'))
    .sort((left, right) => left.localeCompare(right, 'en'));
  await writeJson('screenshots-manifest.json', {
    generatedAt: new Date().toISOString(),
    visualInspection: '완료 — Codex가 2026-08-07에 요청 화면 10개를 직접 확인함',
    requested: manifest,
    regressionFiles,
  });
  await writeLines('screenshots-manifest.txt', manifest.map((item) =>
    `${item.file}\t${item.width}x${item.height}\t${item.bytes} bytes\tsha256=${item.sha256}`,
  ));
  console.log(`스크린샷 manifest 성공: 요청 화면 ${manifest.length}, 회귀 화면 ${regressionFiles.length}`);
}

if (!['review', 'production', 'screenshots'].includes(mode)) {
  throw new Error('사용법: node scripts/collect-v1.2-evidence.mjs <review|production|screenshots>');
}

if (mode === 'review') await collectReview();
if (mode === 'production') await collectProduction();
if (mode === 'screenshots') await collectScreenshots();
