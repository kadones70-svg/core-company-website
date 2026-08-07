import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { discoverRoute, expectNoHorizontalOverflow, gotoApp } from '../e2e/helpers';

const isProduction = process.env.CAPTURE_PRODUCTION === 'true';
const outputRoot = path.resolve(
  process.env.QA_EVIDENCE_DIR ?? path.join('review', 'v1.2'),
  'screenshots',
);

async function capture(page: Page, filename: string, fullPage = false) {
  await page.screenshot({
    path: path.join(outputRoot, filename),
    fullPage,
    animations: 'disabled',
    caret: 'hide',
    scale: 'css',
  });
}

async function searchableKoreanTerm(page: Page) {
  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);
  const title = (await page.locator('main h1').innerText()).trim();
  const query = title.match(/[가-힣]{2,}/)?.[0];
  expect(query).toBeTruthy();
  return { articleRoute, query: query! };
}

test.describe('V1.2 review evidence screenshots', () => {
  test.skip(isProduction, 'review screenshots only');
  test.describe.configure({ mode: 'serial' });

  for (const width of [320, 390]) {
    test(`home ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await gotoApp(page);
      await expect(page.locator('[data-review-build-banner]')).toHaveCount(1);
      await expectNoHorizontalOverflow(page);
      await capture(page, `home-mobile-${width}.png`);
    });

    test(`article ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const articleRoute = await discoverRoute(page, 'articles');
      await gotoApp(page, articleRoute);
      await expect(page.locator('.article-header h1')).toBeVisible();
      await expect(page.locator('[data-review-build-banner]')).toHaveCount(1);
      await expectNoHorizontalOverflow(page);
      await capture(page, `article-mobile-${width}.png`);
    });
  }

  test('category shared review banner', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page, 'category/hospitality/');
    await expect(page.locator('[data-review-build-banner]')).toHaveCount(1);
    await capture(page, 'category-review-banner.png');
  });

  test('search results present', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const { query } = await searchableKoreanTerm(page);
    await gotoApp(page, `search/?q=${encodeURIComponent(query)}`);
    await expect(page.locator('[data-testid="search-results"] article').first()).toBeVisible({ timeout: 15_000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await capture(page, 'search-results.png', true);
  });

  test('search zero results', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoApp(page, 'search/?q=zzqxvjkq-no-result-v12');
    await expect(page.locator('[data-testid="search-empty"]')).toBeVisible({ timeout: 15_000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await capture(page, 'search-zero-results.png', true);
  });

  test('mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoApp(page);
    const toggle = page.locator('header button[aria-controls][aria-expanded]').first();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await capture(page, 'mobile-menu-open.png');
  });

  test('keyboard focus-visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoApp(page);
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    const outlineWidth = await focused.evaluate((element) => getComputedStyle(element).outlineWidth);
    expect(Number.parseFloat(outlineWidth)).toBeGreaterThanOrEqual(2);
    await capture(page, 'keyboard-focus-visible.png');
  });
});

test.describe('V1.2 production evidence screenshot', () => {
  test.skip(!isProduction, 'production screenshot only');

  test('production has no review banner', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoApp(page);
    await expect(page.locator('[data-review-build-banner]')).toHaveCount(0);
    await expect(page.getByText('REVIEW BUILD', { exact: false })).toHaveCount(0);
    await capture(page, 'production-banner-absent.png');
  });
});
