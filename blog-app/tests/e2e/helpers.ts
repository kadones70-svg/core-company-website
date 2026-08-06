import { expect, type Page } from '@playwright/test';

export const BLOG_ROOT = '/blog/';

export async function gotoApp(
  page: Page,
  route = '',
  options: { allowNotFound?: boolean } = {}
) {
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  const normalized = route
    ? route.startsWith('/blog/')
      ? route
      : `${BLOG_ROOT}${route.replace(/^\/+/, '')}`
    : BLOG_ROOT;
  const response = await page.goto(normalized, { waitUntil: 'domcontentloaded' });
  expect(response, `no response for ${normalized}`).not.toBeNull();
  if (!options.allowNotFound) {
    expect(response!.status(), `unexpected status for ${normalized}`).toBeLessThan(400);
  }
  await expect(page.locator('main').first()).toBeVisible();
  await page.evaluate(async () => {
    if ('fonts' in document) await document.fonts.ready;
  });
  return response;
}

export async function discoverRoute(page: Page, routeSegment: string) {
  await gotoApp(page);
  const locator = page.locator(`a[href*="/blog/${routeSegment}/"]:visible`).first();
  await expect(locator, `no ${routeSegment} link found on the page`).toBeVisible();
  const href = await locator.getAttribute('href');
  expect(href).toBeTruthy();
  return new URL(href!, page.url()).pathname;
}

export async function discoverArticleAndTag(page: Page) {
  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);
  const tagLink = page.locator('a[href*="/blog/tag/"]').first();
  await expect(tagLink).toBeVisible();
  const tagHref = await tagLink.getAttribute('href');
  expect(tagHref).toBeTruthy();
  return {
    articleRoute,
    tagRoute: new URL(tagHref!, page.url()).pathname
  };
}

export async function jsonLdNodes(page: Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed = blocks.flatMap((block) => {
    try {
      const value = JSON.parse(block) as Record<string, unknown>;
      const graph = value['@graph'];
      return Array.isArray(graph) ? graph : [value];
    } catch {
      return [];
    }
  });
  return parsed as Array<Record<string, unknown>>;
}

export function nodeHasType(node: Record<string, unknown>, expected: string) {
  const type = node['@type'];
  return Array.isArray(type) ? type.includes(expected) : type === expected;
}

export async function expectNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => {
    const viewport = window.innerWidth;
    const offenders = [...document.body.querySelectorAll<HTMLElement>('*')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${
            element.classList.length ? `.${[...element.classList].join('.')}` : ''
          }`,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          scrollWidth: element.scrollWidth
        };
      })
      .filter((item) => item.left < -1 || item.right > viewport + 1)
      .slice(0, 12);
    return {
      viewport,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
      offenders
    };
  });
  expect(metrics.document, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.viewport + 1);
  expect(metrics.body, JSON.stringify(metrics)).toBeLessThanOrEqual(metrics.viewport + 1);
}

export function contactCta(page: Page) {
  return page.locator(
    'a[data-testid="contact-cta"], a[data-cta-position], a[href*="source=blog"]'
  );
}
