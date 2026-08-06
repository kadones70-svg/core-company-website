import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { discoverRoute, gotoApp } from './helpers';

async function expectNoAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.map((node) => node.target)
  }));
  expect(summary).toEqual([]);
}

test('main page has no automated WCAG A/AA violations', async ({ page }) => {
  await gotoApp(page);
  await expectNoAxeViolations(page);
});

test('article page has no automated WCAG A/AA violations', async ({ page }) => {
  const articleRoute = await discoverRoute(page, 'articles');
  await gotoApp(page, articleRoute);
  await expectNoAxeViolations(page);
});

test('search, editorial policy, and 404 have no automated WCAG A/AA violations', async ({ page }) => {
  for (const route of ['search/', 'editorial-policy/']) {
    await gotoApp(page, route);
    await expectNoAxeViolations(page);
  }
  await gotoApp(page, '404.html', { allowNotFound: true });
  await expectNoAxeViolations(page);
});
