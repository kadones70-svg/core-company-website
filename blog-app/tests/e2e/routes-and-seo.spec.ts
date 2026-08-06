import { expect, test } from '@playwright/test';
import {
  BLOG_ROOT,
  discoverArticleAndTag,
  discoverRoute,
  gotoApp,
  jsonLdNodes,
  nodeHasType
} from './helpers';

test('main page exposes canonical, Organization JSON-LD, and the primary landmarks', async ({ page }) => {
  await gotoApp(page);

  await expect(page.locator('a[href="#main-content"]')).toBeAttached();
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://corecompany.net/blog/'
  );

  const nodes = await jsonLdNodes(page);
  expect(nodes.some((node) => nodeHasType(node, 'Organization'))).toBe(true);
});

test('article, category, tag, search, editorial policy, and 404 routes render', async ({ page }) => {
  const categoryRoute = await discoverRoute(page, 'category');
  const { articleRoute, tagRoute } = await discoverArticleAndTag(page);
  const routes = [
    articleRoute,
    categoryRoute,
    tagRoute,
    `${BLOG_ROOT}search/`,
    `${BLOG_ROOT}editorial-policy/`
  ];

  for (const route of routes) {
    await gotoApp(page, route);
    await expect(page.locator('main h1')).toHaveCount(1);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toMatch(/^https:\/\/corecompany\.net\/blog\//);
  }

  const response = await gotoApp(page, `${BLOG_ROOT}404.html`, { allowNotFound: true });
  expect([200, 404]).toContain(response!.status());
  await expect(page.locator('main h1')).toHaveCount(1);
});

test('article publishes Article and BreadcrumbList structured data', async ({ page }) => {
  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);

  await expect(page.locator('article[data-pagefind-body]').first()).toBeVisible();
  await expect(
    page.locator(
      'nav[aria-label="현재 위치"], nav[aria-label*="경로"], nav[aria-label*="breadcrumb" i]'
    )
  ).toBeVisible();
  const times = page.locator('article time[datetime], main time[datetime]');
  expect(await times.count()).toBeGreaterThan(0);

  const nodes = await jsonLdNodes(page);
  expect(nodes.some((node) => nodeHasType(node, 'Article'))).toBe(true);
  expect(nodes.some((node) => nodeHasType(node, 'BreadcrumbList'))).toBe(true);
});

test('RSS, sitemap, robots, and Pagefind assets are served below /blog', async ({ request }) => {
  const expected = [
    '/blog/rss.xml',
    '/blog/robots.txt',
    '/blog/pagefind/pagefind.js'
  ];
  for (const path of expected) {
    const response = await request.get(path);
    expect(response.ok(), `${path}: ${response.status()}`).toBe(true);
  }

  const sitemapIndex = await request.get('/blog/sitemap-index.xml');
  const sitemap = sitemapIndex.ok()
    ? sitemapIndex
    : await request.get('/blog/sitemap-0.xml');
  expect(sitemap.ok(), `sitemap: ${sitemap.status()}`).toBe(true);
  expect(await sitemap.text()).toContain('https://corecompany.net/blog/');
});
