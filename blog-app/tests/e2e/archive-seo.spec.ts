import { expect, test, type Page } from '@playwright/test';
import {
  discoverArticleAndTag,
  gotoApp,
  jsonLdNodes,
  nodeHasType
} from './helpers';

const SITE_ORIGIN = 'https://corecompany.net';
const EMPTY_CATEGORY_ROUTE = '/blog/category/automation-iot/';
const UNUSED_TAG_ROUTE = '/blog/tag/smart-farm/';

async function robotsContent(page: Page) {
  return ((await page.locator('meta[name="robots"]').getAttribute('content')) ?? '')
    .toLocaleLowerCase('en-US')
    .replace(/\s+/g, ' ');
}

async function discoverCategoryRoute(page: Page, articleRoute: string) {
  await gotoApp(page, articleRoute);
  const categoryLink = page
    .locator('nav[aria-label="현재 위치 경로"] a[href*="/blog/category/"]')
    .first();
  await expect(categoryLink, 'article has no category archive link').toBeVisible();
  const href = await categoryLink.getAttribute('href');
  expect(href).toBeTruthy();
  return new URL(href!, page.url()).pathname;
}

function canonicalUrl(route: string) {
  return new URL(route, SITE_ORIGIN).toString();
}

test('review archives index only archives backed by visible sample posts', async ({ page }) => {
  const { articleRoute, tagRoute } = await discoverArticleAndTag(page);
  const categoryRoute = await discoverCategoryRoute(page, articleRoute);

  await gotoApp(page, tagRoute);
  await expect(page.locator('main h1')).toHaveCount(1);
  expect(await robotsContent(page)).not.toContain('noindex');
  await expect(page.locator(`a[href="${articleRoute}"]`).first()).toBeVisible();

  await gotoApp(page, categoryRoute);
  await expect(page.locator('main h1')).toHaveCount(1);
  expect(await robotsContent(page)).not.toContain('noindex');
  await expect(page.locator(`a[href="${articleRoute}"]`).first()).toBeVisible();

  await gotoApp(page, EMPTY_CATEGORY_ROUTE);
  const emptyRobots = await robotsContent(page);
  expect(emptyRobots).toContain('noindex');
  expect(emptyRobots).toContain('follow');
  await expect(page.locator('main h1')).toHaveCount(1);

  const unusedTagResponse = await page.goto(UNUSED_TAG_ROUTE, {
    waitUntil: 'domcontentloaded'
  });
  expect(unusedTagResponse, `no response for ${UNUSED_TAG_ROUTE}`).not.toBeNull();
  expect(unusedTagResponse!.status()).toBe(404);
});

test('review sitemap includes visible content and excludes empty or utility routes', async ({
  page,
  request
}) => {
  const { articleRoute, tagRoute } = await discoverArticleAndTag(page);
  const categoryRoute = await discoverCategoryRoute(page, articleRoute);

  const response = await request.get('/blog/sitemap-0.xml');
  expect(response.ok(), `/blog/sitemap-0.xml: ${response.status()}`).toBe(true);
  const sitemap = await response.text();

  for (const includedRoute of [
    '/blog/',
    '/blog/editorial-policy/',
    articleRoute,
    categoryRoute,
    tagRoute
  ]) {
    expect(sitemap, `sitemap is missing ${includedRoute}`).toContain(
      `<loc>${canonicalUrl(includedRoute)}</loc>`
    );
  }

  for (const excludedRoute of [
    EMPTY_CATEGORY_ROUTE,
    UNUSED_TAG_ROUTE,
    '/blog/search/',
    '/blog/404.html'
  ]) {
    expect(sitemap, `sitemap unexpectedly contains ${excludedRoute}`).not.toContain(
      `<loc>${canonicalUrl(excludedRoute)}</loc>`
    );
  }
});

test('article emits one Article, BreadcrumbList, and Organization without a role reviewer', async ({
  page
}) => {
  const { articleRoute } = await discoverArticleAndTag(page);
  await gotoApp(page, articleRoute);

  const nodes = await jsonLdNodes(page);
  const articles = nodes.filter((node) => nodeHasType(node, 'Article'));
  const breadcrumbs = nodes.filter((node) => nodeHasType(node, 'BreadcrumbList'));
  const organizations = nodes.filter((node) => nodeHasType(node, 'Organization'));

  expect(articles).toHaveLength(1);
  expect(breadcrumbs).toHaveLength(1);
  expect(organizations).toHaveLength(1);
  expect(articles[0]).not.toHaveProperty('reviewedBy');
  expect(JSON.stringify(nodes)).not.toContain('기술 책임자');
});
