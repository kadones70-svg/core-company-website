import { expect, test, type Page } from '@playwright/test';
import { discoverRoute, gotoApp } from './helpers';

type AnalyticsParameters = Record<string, unknown>;
type GtagCall = ['event', string, AnalyticsParameters];

async function waitForAnalyticsBridge(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          Boolean(
            (window as typeof window & { __coreAnalyticsBridgeInstalled?: boolean })
              .__coreAnalyticsBridgeInstalled
          )
      )
    )
    .toBe(true);
}

test('CTA click is forwarded to gtag exactly once and does not also use dataLayer', async ({
  page
}) => {
  await page.addInitScript(() => {
    const analyticsWindow = window as typeof window & {
      __gtagCalls: unknown[][];
      dataLayer: Array<Record<string, unknown>>;
      gtag: (...args: unknown[]) => void;
    };
    analyticsWindow.__gtagCalls = [];
    analyticsWindow.dataLayer = [];
    analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.__gtagCalls.push(args);
  });

  await gotoApp(page);
  await waitForAnalyticsBridge(page);

  await page.evaluate(() => {
    document.addEventListener(
      'click',
      (event) => {
        const target = event.target instanceof Element
          ? event.target.closest('[data-analytics-event="contact_cta_click"]')
          : null;
        if (target) event.preventDefault();
      },
      { capture: true }
    );
  });

  const cta = page.locator(
    'a[data-analytics-event="contact_cta_click"][data-analytics-cta="header"]'
  );
  await expect(cta).toBeVisible();
  await cta.click();

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __gtagCalls: unknown[][] }).__gtagCalls.length
      )
    )
    .toBe(1);

  const result = await page.evaluate(() => {
    const analyticsWindow = window as typeof window & {
      __gtagCalls: GtagCall[];
      dataLayer: Array<Record<string, unknown>>;
    };
    return {
      calls: analyticsWindow.__gtagCalls,
      dataLayer: analyticsWindow.dataLayer
    };
  });

  expect(result.calls).toEqual([['event', 'contact_cta_click', { cta: 'header' }]]);
  expect(result.dataLayer).toEqual([]);
  expect(result.calls[0][2]).not.toHaveProperty('query');
  expect(result.calls[0][2]).not.toHaveProperty('freeText');
});

test('dataLayer fallback receives only allowlisted, sanitized operational data once', async ({
  page
}) => {
  await page.addInitScript(() => {
    (window as typeof window & { dataLayer: Array<Record<string, unknown>> }).dataLayer = [];
  });

  await gotoApp(page);
  await waitForAnalyticsBridge(page);

  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent('core:analytics', {
        detail: {
          event: 'search',
          count: 2.6,
          category: 'document-data-ai',
          position: 'search',
          article: '예약 문의 010-1234-5678',
          query: '개인정보가 포함된 검색어',
          freeText: '사용자가 입력한 자유 문장',
          email: 'private@example.com'
        }
      })
    );

    window.dispatchEvent(
      new CustomEvent('core:analytics', {
        detail: { event: 'not_allowlisted', query: '전송되면 안 되는 값' }
      })
    );
  });

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { dataLayer: Array<Record<string, unknown>> }).dataLayer
            .length
      )
    )
    .toBe(1);

  const dataLayer = await page.evaluate(
    () =>
      (window as typeof window & { dataLayer: Array<Record<string, unknown>> }).dataLayer
  );

  expect(dataLayer).toEqual([
    {
      event: 'search',
      count: 3
    }
  ]);
  expect(JSON.stringify(dataLayer)).not.toContain('개인정보');
  expect(JSON.stringify(dataLayer)).not.toContain('010-1234-5678');
  expect(JSON.stringify(dataLayer)).not.toContain('private@example.com');
});

test('article_view is forwarded to gtag once per article page load', async ({ page }) => {
  await page.addInitScript(() => {
    const analyticsWindow = window as typeof window & {
      __gtagCalls: unknown[][];
      gtag: (...args: unknown[]) => void;
    };
    analyticsWindow.__gtagCalls = [];
    analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.__gtagCalls.push(args);
  });

  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);
  await waitForAnalyticsBridge(page);

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __gtagCalls: GtagCall[] }).__gtagCalls.filter(
            (call) => call[1] === 'article_view'
          ).length
      )
    )
    .toBe(1);

  const articleViews = await page.evaluate(() =>
    (window as typeof window & { __gtagCalls: GtagCall[] }).__gtagCalls.filter(
      (call) => call[1] === 'article_view'
    )
  );
  const slug = articleRoute.split('/').filter(Boolean).at(-1);

  expect(articleViews).toHaveLength(1);
  expect(articleViews[0][0]).toBe('event');
  expect(articleViews[0][2].article).toBe(slug);
  expect(articleViews[0][2].category).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  expect(Object.keys(articleViews[0][2]).sort()).toEqual(['article', 'category']);
});

test('search with results sends count once and one result click sends one event', async ({ page }) => {
  await page.addInitScript(() => {
    const analyticsWindow = window as typeof window & {
      __gtagCalls: unknown[][];
      gtag: (...args: unknown[]) => void;
    };
    analyticsWindow.__gtagCalls = [];
    analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.__gtagCalls.push(args);
  });

  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);
  const title = (await page.locator('main h1').innerText()).trim();
  const query = title.match(/[가-힣]{2,}/)?.[0];
  expect(query).toBeTruthy();

  await gotoApp(page, `search/?q=${encodeURIComponent(query!)}`);
  await waitForAnalyticsBridge(page);
  const resultLink = page.locator('[data-testid="search-results"] a[data-analytics-event="search_result_click"]').first();
  await expect(resultLink).toBeVisible({ timeout: 15_000 });
  await expect
    .poll(() => page.evaluate(() =>
      (window as typeof window & { __gtagCalls: GtagCall[] }).__gtagCalls.filter(
        (call) => call[1] === 'search',
      )), { timeout: 15_000 })
    .toHaveLength(1);

  await page.evaluate(() => {
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element
        ? event.target.closest('[data-analytics-event="search_result_click"]')
        : null;
      if (target) event.preventDefault();
    }, { capture: true });
  });
  await resultLink.click();

  const calls = await page.evaluate(() =>
    (window as typeof window & { __gtagCalls: GtagCall[] }).__gtagCalls,
  );
  const searches = calls.filter((call) => call[1] === 'search');
  const clicks = calls.filter((call) => call[1] === 'search_result_click');
  expect(searches).toHaveLength(1);
  expect(searches[0][2].count).toBeGreaterThan(0);
  expect(searches[0][2]).not.toHaveProperty('query');
  expect(clicks).toHaveLength(1);
  expect(clicks[0][2].article).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

test('zero-result search sends count zero exactly once without the query', async ({ page }) => {
  await page.addInitScript(() => {
    const analyticsWindow = window as typeof window & {
      __gtagCalls: unknown[][];
      gtag: (...args: unknown[]) => void;
    };
    analyticsWindow.__gtagCalls = [];
    analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.__gtagCalls.push(args);
  });

  await gotoApp(page, 'search/?q=zzqxvjkq-no-result-2026');
  await waitForAnalyticsBridge(page);
  await expect(page.locator('[data-testid="search-empty"]')).toBeVisible({ timeout: 15_000 });
  await expect
    .poll(() => page.evaluate(() =>
      (window as typeof window & { __gtagCalls: GtagCall[] }).__gtagCalls.filter(
        (call) => call[1] === 'search',
      )), { timeout: 15_000 })
    .toHaveLength(1);

  const searches = await page.evaluate(() =>
    (window as typeof window & { __gtagCalls: GtagCall[] }).__gtagCalls.filter(
      (call) => call[1] === 'search',
    ),
  );
  expect(searches).toEqual([['event', 'search', { count: 0 }]]);
  expect(JSON.stringify(searches)).not.toContain('zzqxvjkq-no-result-2026');
});

test('one related article click sends exactly one approved event', async ({ page }) => {
  await page.addInitScript(() => {
    const analyticsWindow = window as typeof window & {
      __gtagCalls: unknown[][];
      gtag: (...args: unknown[]) => void;
    };
    analyticsWindow.__gtagCalls = [];
    analyticsWindow.gtag = (...args: unknown[]) => analyticsWindow.__gtagCalls.push(args);
  });

  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);
  await waitForAnalyticsBridge(page);
  const related = page.locator('a[data-related-article][data-analytics-event="related_article_click"]').first();
  await expect(related).toBeVisible();
  await page.evaluate(() => {
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-related-article]') : null;
      if (target) event.preventDefault();
    }, { capture: true });
  });
  await related.click();

  await expect
    .poll(() => page.evaluate(() =>
      (window as typeof window & { __gtagCalls: GtagCall[] }).__gtagCalls.filter(
        (call) => call[1] === 'related_article_click',
      )))
    .toHaveLength(1);
  const clicks = await page.evaluate(() =>
    (window as typeof window & { __gtagCalls: GtagCall[] }).__gtagCalls.filter(
      (call) => call[1] === 'related_article_click',
    ),
  );
  expect(clicks).toHaveLength(1);
  expect(Object.keys(clicks[0][2]).sort()).toEqual(['article', 'category']);
});
