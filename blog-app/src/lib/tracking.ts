import { SITE, getCategoryByName } from '../config/site';

export type CtaPosition =
  | 'header'
  | 'hero'
  | 'featured'
  | 'article-inline'
  | 'article-bottom'
  | 'category-bottom'
  | 'tag-bottom'
  | 'editorial-bottom'
  | 'home-bottom'
  | 'footer';

export interface ContactTrackingParams {
  article?: string;
  category?: string;
  cta?: CtaPosition | (string & {});
}

export type AnalyticsEventName =
  | 'article_view'
  | 'search'
  | 'search_result_click'
  | 'related_article_click'
  | 'service_page_click'
  | 'contact_cta_click';

type AnalyticsValue = string | number | boolean;

function safeValue(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, 160) : undefined;
}

export function trackingCategory(category?: string): string | undefined {
  const normalized = safeValue(category);
  if (!normalized) return undefined;
  return getCategoryByName(normalized)?.slug ?? normalized;
}

/**
 * 기존 문의 앵커를 보존하면서 출처 query parameter를 앵커 앞에 추가합니다.
 * 예: https://corecompany.net/?source=blog&article=...#contact
 */
export function buildContactUrl(params: ContactTrackingParams = {}): string {
  const url = new URL(SITE.contactUrl);
  url.searchParams.set('source', 'blog');

  const article = safeValue(params.article);
  const category = trackingCategory(params.category);
  const cta = safeValue(params.cta);

  if (article) url.searchParams.set('article', article);
  if (category) url.searchParams.set('category', category);
  if (cta) url.searchParams.set('cta', cta);

  return url.toString();
}

/**
 * 선택적 분석 어댑터입니다. GA4가 없으면 조용히 종료하며 개인정보를 받지 않습니다.
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  parameters: Record<string, AnalyticsValue> = {}
): void {
  if (typeof window === 'undefined') return;

  const analyticsWindow = window as typeof window & {
    gtag?: (command: 'event', name: string, values: Record<string, AnalyticsValue>) => void;
    dataLayer?: Array<Record<string, AnalyticsValue>>;
  };

  if (typeof analyticsWindow.gtag === 'function') {
    analyticsWindow.gtag('event', eventName, parameters);
    return;
  }

  if (Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push({ event: eventName, ...parameters });
  }
}
