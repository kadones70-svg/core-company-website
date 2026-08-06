export const CATEGORIES = [
  {
    name: '숙박·민박 운영',
    slug: 'hospitality',
    short: '숙박',
    description: '예약부터 입실, 안내와 비상 대응까지 숙박 운영 흐름을 살펴봅니다.',
    accent: '#7340C8',
  },
  {
    name: '오피스·사무실 운영',
    slug: 'office',
    short: '오피스',
    description: '문서, 출입, 공간과 반복 업무를 안정적으로 운영하는 기준을 다룹니다.',
    accent: '#1E56C8',
  },
  {
    name: '문서·데이터 AI',
    slug: 'document-data-ai',
    short: '문서 AI',
    description: 'RAG, 문서 검색과 데이터 활용을 실제 업무에 연결하는 방법입니다.',
    accent: '#3A6D11',
  },
  {
    name: 'AI 도입·비용',
    slug: 'ai-adoption-cost',
    short: 'AI 도입·비용',
    description: '도입 범위, 비용과 검증 기준을 과장 없이 비교하도록 정리합니다.',
    accent: '#B86A00',
  },
  {
    name: 'AI 인프라·보안',
    slug: 'ai-infrastructure-security',
    short: 'AI 인프라·보안',
    description: '클라우드와 온프레미스, 개인정보와 접근 통제를 함께 검토합니다.',
    accent: '#C43A1A',
  },
  {
    name: '자동화·IoT',
    slug: 'automation-iot',
    short: 'IoT·자동화',
    description: '센서, 도어락과 기기 연동을 운영 절차와 함께 설계하는 기준입니다.',
    accent: '#E8620A',
  },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map((category) => category.name) as [
  (typeof CATEGORIES)[number]['name'],
  ...(typeof CATEGORIES)[number]['name'][],
];

export const CONTENT_TYPES = [
  '기둥 글',
  '비교 글',
  '체크리스트',
  '도입 가이드',
  '적용 검토',
  '가상 시나리오',
  '기술 해설',
  '정책·법률 해설',
  '비용 분석',
  '운영 가이드',
  'FAQ',
  '뉴스 해설',
] as const;

export const POPULAR_TAGS = [
  '제조',
  '정부지원',
  '정책·법률',
  '체크리스트',
  '비교',
  '비용 분석',
  'RAG',
  '온프레미스',
  '클라우드',
  '도어락',
  '출입 관리',
  '센서',
  '개인정보',
  '스마트팜',
  '스마트홈',
] as const;

export type CategoryName = (typeof CATEGORIES)[number]['name'];
export type CategorySlug = (typeof CATEGORIES)[number]['slug'];
export type ContentType = (typeof CONTENT_TYPES)[number];
export type PopularTag = (typeof POPULAR_TAGS)[number];

const TAG_SLUG_ENTRIES = [
  ['제조', 'manufacturing'],
  ['정부지원', 'government-support'],
  ['정책·법률', 'policy-law'],
  ['체크리스트', 'checklist'],
  ['비교', 'comparison'],
  ['비용 분석', 'cost-analysis'],
  ['RAG', 'rag'],
  ['온프레미스', 'on-premises'],
  ['클라우드', 'cloud'],
  ['도어락', 'door-lock'],
  ['출입 관리', 'access-control'],
  ['센서', 'sensors'],
  ['개인정보', 'privacy'],
  ['스마트팜', 'smart-farm'],
  ['스마트홈', 'smart-home'],
  ['운영 자동화', 'operations-automation'],
  ['무인 체크인', 'self-check-in'],
  ['문서 검색', 'document-search'],
  ['보안', 'security'],
] as const;

const tagSlugByName = new Map<string, string>(TAG_SLUG_ENTRIES);
const tagNameBySlug = new Map<string, string>(
  TAG_SLUG_ENTRIES.map(([name, slug]) => [slug, name]),
);

export function categoryToSlug(name: string): CategorySlug | undefined {
  return CATEGORIES.find((category) => category.name === name)?.slug;
}

export function categoryFromSlug(slug: string): CategoryName | undefined {
  return CATEGORIES.find((category) => category.slug === slug)?.name;
}

export function tagToSlug(tag: string): string {
  const normalizedTag = tag.trim().normalize('NFKC');
  const knownSlug = tagSlugByName.get(normalizedTag);

  if (knownSlug) return knownSlug;

  return normalizedTag
    .toLocaleLowerCase('ko-KR')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export function tagFromSlug(slug: string): string | undefined {
  const normalizedSlug = slug.trim().toLocaleLowerCase('en-US');
  const knownTag = tagNameBySlug.get(normalizedSlug);

  if (knownTag) return knownTag;

  if (!/^[\p{Letter}\p{Number}]+(?:-[\p{Letter}\p{Number}]+)*$/u.test(normalizedSlug)) {
    return undefined;
  }

  return normalizedSlug.replace(/-/g, ' ');
}
