import {
  CATEGORIES,
  categoryToSlug,
  tagToSlug,
  type CategoryName,
  type CategorySlug
} from './content';

export const SITE = {
  name: 'Core Company',
  blogName: 'Core Company Blog',
  defaultTitle: 'Core Company 블로그',
  defaultDescription:
    '숙박·오피스·중소기업 운영자가 AI와 IoT를 도입하기 전에 확인해야 할 기준을 실제 업무 흐름과 공간 관점에서 정리합니다.',
  language: 'ko',
  locale: 'ko_KR',
  siteUrl: 'https://corecompany.net',
  blogUrl: 'https://corecompany.net/blog/',
  basePath: '/blog',
  homeUrl: 'https://corecompany.net',
  contactUrl: 'https://corecompany.net/#contact',
  privacyUrl: 'https://corecompany.net/privacy',
  naverBlogUrl: 'https://blog.naver.com/corecompany0607',
  logoPath: '/blog/brand/logo_color.webp',
  logoSourcePath: '/blog/brand/logo_color.svg',
  organizationId: 'https://corecompany.net/#organization'
} as const;

const CATEGORY_DESCRIPTIONS: Record<CategoryName, string> = {
  '숙박·민박 운영': '예약부터 입실, 안내와 비상 대응까지 숙박 운영 흐름을 살펴봅니다.',
  '오피스·사무실 운영':
    '사무실의 문서, 출입, 공간과 반복 업무를 더 안정적으로 운영하는 기준입니다.',
  '문서·데이터 AI': 'RAG, 문서 검색과 데이터 활용을 실제 업무에 연결하는 방법을 설명합니다.',
  'AI 도입·비용': '도입 범위, 비용과 검증 기준을 과장 없이 비교할 수 있도록 정리합니다.',
  'AI 인프라·보안': '클라우드와 온프레미스, 개인정보와 접근 통제를 함께 검토합니다.',
  '자동화·IoT': '센서, 도어락과 기기 연동을 운영 절차와 함께 설계하는 기준입니다.'
};

export const CATEGORY_DEFINITIONS = CATEGORIES.map((category) => ({
  name: category.name,
  slug: category.slug,
  shortLabel: category.short,
  color: category.accent,
  description: CATEGORY_DESCRIPTIONS[category.name]
}));

export type CategoryDefinition = (typeof CATEGORY_DEFINITIONS)[number];
export type { CategoryName, CategorySlug };

export function getCategoryByName(name?: string): CategoryDefinition | undefined {
  return CATEGORY_DEFINITIONS.find((category) => category.name === name);
}

export function getCategoryBySlug(slug?: string): CategoryDefinition | undefined {
  return CATEGORY_DEFINITIONS.find((category) => category.slug === slug);
}

export function categoryPath(category: string): string {
  const slug = categoryToSlug(category) ?? category;
  return `${SITE.basePath}/category/${encodeURIComponent(slug)}/`;
}

export function tagPath(tag: string): string {
  return `${SITE.basePath}/tag/${encodeURIComponent(tagToSlug(tag))}/`;
}

export function articlePath(slug: string): string {
  return `${SITE.basePath}/articles/${encodeURIComponent(slug)}/`;
}
