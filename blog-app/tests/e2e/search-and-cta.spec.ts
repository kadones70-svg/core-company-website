import { expect, test } from '@playwright/test';
import { contactCta, discoverRoute, gotoApp } from './helpers';

test('Pagefind asset loads and a Korean article term returns a result', async ({ page, request }) => {
  const pagefind = await request.get('/blog/pagefind/pagefind.js');
  expect(pagefind.ok()).toBe(true);

  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);
  const title = (await page.locator('article h1, main h1').first().innerText()).trim();
  const query = title.match(/[가-힣]{2,}/)?.[0];
  expect(query, `article title needs a searchable Korean term: ${title}`).toBeTruthy();

  await gotoApp(page, `search/?q=${encodeURIComponent(query!)}`);
  const input = page.locator('form[role="search"] input[type="search"]').first();
  await expect(input).toHaveValue(query!);
  const results = page.locator('[data-testid="search-results"] a, [data-search-results] a');
  await expect.poll(() => results.count(), { timeout: 15_000 }).toBeGreaterThan(0);
  await expect(results.first()).toBeVisible();
});

test('search renders an accessible no-results state', async ({ page }) => {
  const query = 'zzqxvjkq987654321notfound';
  await gotoApp(page, `search/?q=${query}`);

  const status = page.locator(
    '[data-testid="search-status"], [role="status"], [aria-live="polite"]'
  ).first();
  await expect(status).toBeAttached();
  const empty = page
    .locator('[data-testid="search-empty"], [data-search-empty]')
    .or(page.getByText(/검색 결과가 없습니다|일치하는 글이 없습니다|찾지 못했습니다/))
    .first();
  await expect(empty).toBeVisible({ timeout: 15_000 });
});

test('contact CTAs carry source and position parameters', async ({ page }) => {
  await gotoApp(page);
  const ctas = contactCta(page);
  expect(await ctas.count()).toBeGreaterThan(0);

  for (const cta of await ctas.all()) {
    const href = await cta.getAttribute('href');
    expect(href).toBeTruthy();
    const url = new URL(href!, page.url());
    expect(url.searchParams.get('source')).toBe('blog');
    expect(url.searchParams.get('cta')).toBeTruthy();
  }
});

test('article-bottom CTA identifies the article and category', async ({ page }) => {
  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);
  const cta = page.locator(
    'a[data-cta-position="article-bottom"], a[href*="cta=article-bottom"]'
  ).first();
  await expect(cta).toBeVisible();
  const href = await cta.getAttribute('href');
  const url = new URL(href!, page.url());
  const slug = articleRoute.split('/').filter(Boolean).at(-1);

  expect(url.searchParams.get('source')).toBe('blog');
  expect(url.searchParams.get('cta')).toBe('article-bottom');
  expect(url.searchParams.get('article')).toBe(slug);
  expect(url.searchParams.get('category')).toBeTruthy();
});
