import { expect, test } from '@playwright/test';
import {
  discoverRoute,
  expectNoHorizontalOverflow,
  gotoApp
} from './helpers';

test.describe('390px mobile behavior', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('main and article pages have no document-level horizontal overflow', async ({ page }) => {
    await gotoApp(page);
    await expectNoHorizontalOverflow(page);

    const articleLink = page.locator('a[href*="/blog/articles/"]').first();
    const href = await articleLink.getAttribute('href');
    expect(href).toBeTruthy();
    await gotoApp(page, new URL(href!, page.url()).pathname);
    await expectNoHorizontalOverflow(page);
  });

  test('mobile menu manages focus, aria-expanded, and Escape', async ({ page }) => {
    await gotoApp(page);
    const toggle = page.locator(
      'header [data-testid="mobile-menu-toggle"], header button[aria-controls][aria-expanded]'
    ).first();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const controlledId = await toggle.getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const menu = page.locator(`#${controlledId}`);
    await expect(menu).toBeVisible();
    const focusIsInside = await menu.evaluate((element) =>
      element.contains(document.activeElement)
    );
    expect(focusIsInside).toBe(true);

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('mobile article table of contents is a closed details element', async ({ page }) => {
    const articleRoute = await discoverRoute(page, 'articles');
    await gotoApp(page, articleRoute);
    const toc = page.getByTestId('mobile-toc');
    await expect(toc).toHaveCount(1);
    await expect(page.getByTestId('desktop-toc')).toHaveCount(1);
    await expect(page.getByTestId('desktop-toc')).toBeHidden();
    await expect(toc).toBeVisible();
    await expect(toc).not.toHaveAttribute('open', '');
    await toc.locator('summary').click();
    await expect(toc).toHaveAttribute('open', '');
    expect(await toc.locator('a[href^="#"]').count()).toBeGreaterThan(0);
  });
});

test('desktop TOC is sticky and matches the mobile TOC links', async ({ page }) => {
  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);

  const desktopToc = page.getByTestId('desktop-toc');
  const mobileToc = page.getByTestId('mobile-toc');
  await expect(desktopToc).toHaveCount(1);
  await expect(mobileToc).toHaveCount(1);
  await expect(desktopToc).toBeVisible();
  await expect(mobileToc).toBeHidden();
  const position = await desktopToc.evaluate((element) => getComputedStyle(element).position);
  expect(position).toBe('sticky');

  const desktopLinks = await desktopToc.locator('a[href^="#"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href'))
  );
  const mobileLinks = await mobileToc
    .locator('a[href^="#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(desktopLinks).toEqual(mobileLinks);
  expect(new Set(desktopLinks).size).toBe(desktopLinks.length);

  for (const href of desktopLinks) {
    expect(href).toMatch(/^#.+/);
    await expect(page.locator(href!)).toHaveCount(1);
  }

  const articleGap = await page.locator('.article-content').evaluate((content) => {
    const header = document.querySelector('.article-header');
    if (!header) return Number.POSITIVE_INFINITY;
    return Math.round(content.getBoundingClientRect().top - header.getBoundingClientRect().bottom);
  });
  expect(articleGap).toBeGreaterThanOrEqual(0);
  expect(articleGap).toBeLessThanOrEqual(120);
});

test('article tables and code blocks preserve columns with internal scrolling', async ({ page }) => {
  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);

  const table = page.locator('article table').first();
  await expect(table).toBeAttached();
  await expect(table.locator('caption')).toBeAttached();
  expect(await table.locator('thead th[scope="col"]').count()).toBeGreaterThan(0);
  const tableOverflow = await table.evaluate((element) => {
    const ownOverflow = getComputedStyle(element).overflowX;
    const parentOverflow = element.parentElement
      ? getComputedStyle(element.parentElement).overflowX
      : 'visible';
    return [ownOverflow, parentOverflow];
  });
  expect(tableOverflow.some((value) => ['auto', 'scroll'].includes(value))).toBe(true);

  const code = page.locator('article pre').first();
  await expect(code).toBeAttached();
  const codeOverflow = await code.evaluate((element) => getComputedStyle(element).overflowX);
  expect(['auto', 'scroll']).toContain(codeOverflow);
});
