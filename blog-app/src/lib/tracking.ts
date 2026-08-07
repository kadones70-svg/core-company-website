import { CATEGORIES } from '../config/content';
import { SITE } from '../config/site';

export const CTA_POSITIONS = [
  'header',
  'hero',
  'featured',
  'article-inline',
  'article-bottom',
  'category-bottom',
  'tag-bottom',
  'editorial-bottom',
  'home-bottom',
  'footer',
] as const;

export const ANALYTICS_EVENT_NAMES = [
  'article_view',
  'search',
  'search_result_click',
  'related_article_click',
  'service_page_click',
  'contact_cta_click',
] as const;

export type CtaPosition = (typeof CTA_POSITIONS)[number];
export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export interface ContactTrackingParams {
  article?: string;
  category?: string;
  cta?: CtaPosition;
}

type AnalyticsValue = string | number | boolean;
type AnalyticsParameters = Record<string, AnalyticsValue>;

const ARTICLE_SLUG_MAX_LENGTH = 96;
const ARTICLE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTIGUOUS_PHONE_PATTERN = /\d{10,11}/;
const SEPARATED_PHONE_PATTERN = /(?:^|\D)(?:\+?82[-.\s]?)?0?1[016789](?:[-.\s]?\d){7,8}(?:$|\D)/;
const EMAIL_PATTERN = /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+/i;
const URL_PATTERN = /(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|net|org|kr|io|co)(?:[\/:?#]|$))/i;

const analyticsEvents = new Set<string>(ANALYTICS_EVENT_NAMES);
const ctaPositions = new Set<string>(CTA_POSITIONS);
const categoryNameToSlug = new Map<string, string>(
  CATEGORIES.map((category) => [category.name, category.slug]),
);
const categorySlugs = new Set<string>(CATEGORIES.map((category) => category.slug));

const EVENT_PARAMETER_KEYS: Record<AnalyticsEventName, readonly string[]> = {
  article_view: ['article', 'category'],
  search: ['count'],
  search_result_click: ['article'],
  related_article_click: ['article', 'category'],
  service_page_click: ['category', 'position'],
  contact_cta_click: ['article', 'category', 'cta'],
};

function isSensitiveOrUnsafeString(value: string): boolean {
  return (
    value.length > ARTICLE_SLUG_MAX_LENGTH ||
    CONTIGUOUS_PHONE_PATTERN.test(value) ||
    SEPARATED_PHONE_PATTERN.test(value) ||
    EMAIL_PATTERN.test(value) ||
    URL_PATTERN.test(value)
  );
}

function sanitizeArticleSlug(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLocaleLowerCase('en-US');
  if (!normalized || isSensitiveOrUnsafeString(normalized)) return undefined;
  return ARTICLE_SLUG_PATTERN.test(normalized) ? normalized : undefined;
}

function sanitizeCategory(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  const slug = categoryNameToSlug.get(normalized) ?? normalized.toLocaleLowerCase('en-US');
  return categorySlugs.has(slug) ? slug : undefined;
}

function sanitizeCtaPosition(value: unknown): CtaPosition | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLocaleLowerCase('en-US');
  return ctaPositions.has(normalized) ? (normalized as CtaPosition) : undefined;
}

function sanitizeCount(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.max(0, Math.min(10_000, Math.round(value)));
}

export function trackingCategory(category?: string): string | undefined {
  return sanitizeCategory(category);
}

/**
 * 기존 문의 앵커를 보존하면서 출처 query parameter를 앵커 앞에 추가합니다.
 * 예: https://corecompany.net/?source=blog&article=...#contact
 */
export function buildContactUrl(params: ContactTrackingParams = {}): string {
  const url = new URL(SITE.contactUrl);
  url.searchParams.set('source', 'blog');

  const article = sanitizeArticleSlug(params.article);
  const category = sanitizeCategory(params.category);
  const cta = sanitizeCtaPosition(params.cta);

  if (article) url.searchParams.set('article', article);
  if (category) url.searchParams.set('category', category);
  if (cta) url.searchParams.set('cta', cta);

  return url.toString();
}

export interface SanitizedAnalyticsEvent {
  eventName: AnalyticsEventName;
  parameters: AnalyticsParameters;
}

/** 분석 서비스로 보내기 직전, 이벤트별 허용 키와 값만 남깁니다. */
export function sanitizeAnalyticsEvent(
  eventName: unknown,
  input: unknown = {},
): SanitizedAnalyticsEvent | undefined {
  if (typeof eventName !== 'string' || !analyticsEvents.has(eventName)) return undefined;
  const approvedEvent = eventName as AnalyticsEventName;
  const source = input && typeof input === 'object' ? input as Record<string, unknown> : {};
  const parameters: AnalyticsParameters = {};

  for (const key of EVENT_PARAMETER_KEYS[approvedEvent]) {
    if (key === 'article') {
      const value = sanitizeArticleSlug(source.article);
      if (value) parameters.article = value;
    } else if (key === 'category') {
      const value = sanitizeCategory(source.category);
      if (value) parameters.category = value;
    } else if (key === 'cta') {
      const value = sanitizeCtaPosition(source.cta);
      if (value) parameters.cta = value;
    } else if (key === 'position') {
      const value = sanitizeCtaPosition(source.position);
      if (value) parameters.position = value;
    } else if (key === 'count') {
      const value = sanitizeCount(source.count);
      if (value !== undefined) parameters.count = value;
    }
  }

  return { eventName: approvedEvent, parameters };
}

/**
 * 선택적 분석 어댑터입니다. GA4가 없으면 조용히 종료하며 검증된 비식별 값만 받습니다.
 */
export function trackEvent(eventName: unknown, parameters: unknown = {}): void {
  if (typeof window === 'undefined') return;
  const event = sanitizeAnalyticsEvent(eventName, parameters);
  if (!event) return;

  const analyticsWindow = window as typeof window & {
    gtag?: (command: 'event', name: string, values: Record<string, AnalyticsValue>) => void;
    dataLayer?: Array<Record<string, AnalyticsValue>>;
  };

  if (typeof analyticsWindow.gtag === 'function') {
    analyticsWindow.gtag('event', event.eventName, event.parameters);
    return;
  }

  if (Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push({ event: event.eventName, ...event.parameters });
  }
}

export function installAnalyticsBridge(): void {
  if (typeof window === 'undefined') return;

  const analyticsWindow = window as typeof window & {
    __coreAnalyticsBridgeInstalled?: boolean;
  };
  if (analyticsWindow.__coreAnalyticsBridgeInstalled) return;
  analyticsWindow.__coreAnalyticsBridgeInstalled = true;

  window.addEventListener('core:analytics', (event) => {
    if (!event.detail || typeof event.detail !== 'object') return;
    const detail = event.detail as Record<string, unknown>;
    trackEvent(detail.event, detail);
  });

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-analytics-event]')
      : null;
    if (!target) return;
    trackEvent(target.dataset.analyticsEvent, {
      article: target.dataset.analyticsArticle,
      category: target.dataset.analyticsCategory,
      cta: target.dataset.analyticsCta,
      position: target.dataset.analyticsPosition,
    });
  });

  if (document.body.dataset.analyticsPage === 'article') {
    trackEvent('article_view', {
      article: document.body.dataset.analyticsArticle,
      category: document.body.dataset.analyticsCategory,
    });
  }
}

declare global {
  interface WindowEventMap {
    'core:analytics': CustomEvent<Record<string, unknown>>;
  }
}
