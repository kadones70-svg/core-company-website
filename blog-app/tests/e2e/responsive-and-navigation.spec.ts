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
    const toc = page.locator(
      'details[data-testid="mobile-toc"], details:has(summary:has-text("목차"))'
    ).first();
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

  const desktopToc = page.locator(
    'aside[data-testid="desktop-toc"], aside:has(a[href^="#"])'
  ).first();
  await expect(desktopToc).toBeVisible();
  const position = await desktopToc.evaluate((element) => getComputedStyle(element).position);
  expect(position).toBe('sticky');

  const desktopLinks = await desktopToc.locator('a[href^="#"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute('href'))
  );
  const mobileLinks = await page
    .locator('details[data-testid="mobile-toc"], details:has(summary:has-text("목차"))')
    .first()
    .locator('a[href^="#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(desktopLinks).toEqual(mobileLinks);
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
