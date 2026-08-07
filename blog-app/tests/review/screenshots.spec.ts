import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { discoverRoute, gotoApp } from '../e2e/helpers';

const screenshotRoot = path.resolve(
  process.env.QA_EVIDENCE_DIR ?? path.join('review', 'v1.2'),
  'regression-screenshots',
);

type CaptureOptions = {
  filename: string;
  route?: string;
  viewport: { width: number; height: number };
  fullPage: boolean;
  discover?: 'article' | 'category';
  allowNotFound?: boolean;
  expectText?: string;
};

async function capture(page: Page, options: CaptureOptions) {
  await page.setViewportSize(options.viewport);
  const route = options.discover
    ? await discoverRoute(page, options.discover === 'article' ? 'articles' : 'category')
    : options.route ?? '';
  await gotoApp(page, route, { allowNotFound: options.allowNotFound });
  await expect(page.locator('main').first()).toBeVisible();
  if (options.expectText) {
    await expect(page.getByText(options.expectText, { exact: true })).toBeVisible();
  }
  await page.screenshot({
    path: path.join(screenshotRoot, options.filename),
    fullPage: options.fullPage,
    animations: 'disabled',
    caret: 'hide',
    scale: 'css'
  });
}

const screenshots: CaptureOptions[] = [
  {
    filename: 'main-desktop-1440.png',
    viewport: { width: 1440, height: 1000 },
    fullPage: true
  },
  {
    filename: 'main-tablet-1024.png',
    viewport: { width: 1024, height: 900 },
    fullPage: true
  },
  {
    filename: 'main-mobile-390.png',
    viewport: { width: 390, height: 844 },
    fullPage: true
  },
  {
    filename: 'article-desktop-fold.png',
    discover: 'article',
    viewport: { width: 1440, height: 1000 },
    fullPage: false
  },
  {
    filename: 'article-desktop-full.png',
    discover: 'article',
    viewport: { width: 1440, height: 1000 },
    fullPage: true
  },
  {
    filename: 'article-mobile-fold.png',
    discover: 'article',
    viewport: { width: 390, height: 844 },
    fullPage: false
  },
  {
    filename: 'article-mobile-full.png',
    discover: 'article',
    viewport: { width: 390, height: 844 },
    fullPage: true
  },
  {
    filename: 'category-desktop.png',
    discover: 'category',
    viewport: { width: 1440, height: 1000 },
    fullPage: true
  },
  {
    filename: 'category-mobile.png',
    discover: 'category',
    viewport: { width: 390, height: 844 },
    fullPage: true
  },
  {
    filename: 'empty-state-desktop.png',
    route: 'category/automation-iot/',
    viewport: { width: 1440, height: 1000 },
    fullPage: true,
    expectText: '아직 공개된 글이 없습니다.'
  },
  {
    filename: 'search-desktop.png',
    route: 'search/',
    viewport: { width: 1440, height: 1000 },
    fullPage: true
  },
  {
    filename: 'search-mobile.png',
    route: 'search/',
    viewport: { width: 390, height: 844 },
    fullPage: true
  },
  {
    filename: 'editorial-policy-desktop.png',
    route: 'editorial-policy/',
    viewport: { width: 1440, height: 1000 },
    fullPage: true
  },
  {
    filename: '404-desktop.png',
    route: '404.html',
    viewport: { width: 1440, height: 1000 },
    fullPage: true,
    allowNotFound: true
  }
];

test.describe('review screenshots', () => {
  test.describe.configure({ mode: 'serial' });
  for (const screenshot of screenshots) {
    test(screenshot.filename, async ({ page }) => {
      await capture(page, screenshot);
    });
  }
});
