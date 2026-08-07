import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildContactUrl,
  sanitizeAnalyticsEvent,
} from '../../src/lib/tracking';

const unsafeArticleValues = [
  '010-1234-5678',
  '01012345678',
  '0212345678',
  'private@example.com',
  'https://example.com/private',
  'a'.repeat(97),
];

for (const value of unsafeArticleValues) {
  test(`analytics rejects unsafe article value: ${value.slice(0, 28)}`, () => {
    const event = sanitizeAnalyticsEvent('article_view', {
      article: value,
      category: 'hospitality',
    });
    assert.deepEqual(event, {
      eventName: 'article_view',
      parameters: { category: 'hospitality' },
    });
  });
}

test('analytics accepts a normal English and numeric article slug', () => {
  assert.deepEqual(
    sanitizeAnalyticsEvent('article_view', {
      article: 'rag-guide-2026-v2',
      category: 'document-data-ai',
    }),
    {
      eventName: 'article_view',
      parameters: {
        article: 'rag-guide-2026-v2',
        category: 'document-data-ai',
      },
    },
  );
});

test('analytics rejects unapproved category, CTA, and position values', () => {
  assert.deepEqual(
    sanitizeAnalyticsEvent('contact_cta_click', {
      article: 'approved-slug-2',
      category: 'unapproved-category',
      cta: 'unknown-cta',
    }),
    {
      eventName: 'contact_cta_click',
      parameters: { article: 'approved-slug-2' },
    },
  );
  assert.deepEqual(
    sanitizeAnalyticsEvent('service_page_click', {
      category: 'unapproved-category',
      position: 'search',
    }),
    { eventName: 'service_page_click', parameters: {} },
  );
});

test('analytics strips unknown payload keys and raw search text', () => {
  assert.deepEqual(
    sanitizeAnalyticsEvent('search', {
      count: 2.6,
      category: 'document-data-ai',
      article: 'valid-but-unneeded',
      query: '원문 검색어',
      freeText: '자유 입력 문장',
      unknown: 'unknown-value',
    }),
    { eventName: 'search', parameters: { count: 3 } },
  );
  assert.equal(sanitizeAnalyticsEvent('unknown_event', { count: 1 }), undefined);
});

test('contact tracking URL uses only approved operational values', () => {
  const approved = new URL(buildContactUrl({
    article: 'office-ai-2026-v2',
    category: '문서·데이터 AI',
    cta: 'article-bottom',
  }));
  assert.equal(approved.searchParams.get('source'), 'blog');
  assert.equal(approved.searchParams.get('article'), 'office-ai-2026-v2');
  assert.equal(approved.searchParams.get('category'), 'document-data-ai');
  assert.equal(approved.searchParams.get('cta'), 'article-bottom');

  const rejected = new URL(buildContactUrl({
    article: '010-1234-5678',
    category: '승인되지 않은 분류',
    cta: 'header',
  }));
  assert.equal(rejected.searchParams.get('article'), null);
  assert.equal(rejected.searchParams.get('category'), null);
  assert.equal(rejected.searchParams.get('cta'), 'header');
});
