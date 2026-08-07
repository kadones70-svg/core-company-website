import { expect, test, type Locator, type Page } from '@playwright/test';
import { CATEGORIES } from '../../src/config/content';
import {
  discoverArticleAndTag,
  expectNoHorizontalOverflow,
  gotoApp,
} from './helpers';

async function wordRectCount(locator: Locator, word: string) {
  return locator.evaluate((element, expectedWord) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const index = node.data.indexOf(expectedWord);
      if (index < 0) continue;
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + expectedWord.length);
      return [...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0).length;
    }
    return 0;
  }, word);
}

async function expectKoreanHeadingRules(page: Page, selector: string, words: string[]) {
  const heading = page.locator(selector).first();
  await expect(heading).toBeVisible();
  const styles = await heading.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { wordBreak: computed.wordBreak, overflowWrap: computed.overflowWrap };
  });
  expect(styles.wordBreak).toBe('keep-all');
  expect(styles.overflowWrap).toBe('anywhere');
  for (const word of words) {
    expect(await wordRectCount(heading, word), `${selector}: ${word} was split`).toBe(1);
  }
}

for (const width of [320, 390]) {
  test(`${width}px keeps Korean heading words intact without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await gotoApp(page);
    await expectNoHorizontalOverflow(page);
    await expectKoreanHeadingRules(page, '.hero h1', ['현장에', '적용하는']);
    await expectKoreanHeadingRules(page, '.contact-cta h2', ['환경에도']);

    const articleRoute = await page.locator('a[href*="/blog/articles/"]').first().getAttribute('href');
    expect(articleRoute).toBeTruthy();
    await gotoApp(page, articleRoute!);
    await expectNoHorizontalOverflow(page);
    await expectKoreanHeadingRules(page, '.article-header h1', ['체크인을', '전에']);
    await expectKoreanHeadingRules(page, '.article-content .contact-cta h2', ['기준을']);
  });
}

test('every review HTML route renders the shared banner exactly once', async ({ page }) => {
  const { articleRoute, tagRoute } = await discoverArticleAndTag(page);
  const routes = [
    '/blog/',
    articleRoute,
    tagRoute,
    ...CATEGORIES.map((category) => `/blog/category/${category.slug}/`),
    '/blog/search/',
    '/blog/editorial-policy/',
    '/blog/404.html',
  ];

  for (const route of routes) {
    await gotoApp(page, route, { allowNotFound: route.endsWith('404.html') });
    const banners = page.locator('[data-review-build-banner]');
    await expect(banners, route).toHaveCount(1);
    await expect(banners).toBeVisible();
    await expect(banners).toHaveText('REVIEW BUILD · 샘플 콘텐츠 포함 · 운영 배포 금지');
  }
});

test('320px open mobile menu keeps each navigation label horizontal', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await gotoApp(page);
  const toggle = page.locator('header button[aria-controls][aria-expanded]').first();
  await toggle.click();
  const links = page.locator('[data-menu-panel] .site-nav__list a');
  await expect(links.first()).toBeVisible();
  const metrics = await links.evaluateAll((items) => items.map((item) => {
    const rect = item.getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      scrollWidth: item.scrollWidth,
      clientWidth: item.clientWidth,
    };
  }));
  expect(metrics.length).toBeGreaterThan(0);
  for (const metric of metrics) {
    expect(metric.width).toBeGreaterThan(240);
    expect(metric.height).toBeLessThanOrEqual(60);
    expect(metric.scrollWidth).toBeLessThanOrEqual(metric.clientWidth);
  }
  await expectNoHorizontalOverflow(page);
});
