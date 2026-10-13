export const CATEGORIES = [
  {
    name: '숙박·민박 운영',
    slug: 'hospitality',
    short: '숙박',
    description: '예약부터 입실, 안내와 비상 대응까지 숙박 운영 흐름을 살펴봅니다.',
    accent: '#8B3AC8',
    image: '/blog/images/categories/hospitality.webp',
  },
  {
    name: '오피스·사무실 운영',
    slug: 'office',
    short: '오피스',
    description: '문서, 출입, 공간과 반복 업무를 안정적으로 운영하는 기준을 다룹니다.',
    accent: '#1E56C8',
    image: '/blog/images/categories/office.webp',
  },
  {
    name: '문서·데이터 AI',
    slug: 'document-data-ai',
    short: '문서 AI',
    description: 'RAG, 문서 검색과 데이터 활용을 실제 업무에 연결하는 방법입니다.',
    accent: '#3A6D11',
    image: '/blog/images/categories/document-data-ai.webp',
  },
  {
    name: 'AI 도입·비용',
    slug: 'ai-adoption-cost',
    short: 'AI 도입·비용',
    description: '도입 범위, 비용과 검증 기준을 과장 없이 비교하도록 정리합니다.',
    accent: '#B86A00',
    image: '/blog/images/categories/ai-adoption-cost.webp',
  },
  {
    name: 'AI 인프라·보안',
    slug: 'ai-infrastructure-security',
    short: 'AI 인프라·보안',
    description: '클라우드와 온프레미스, 개인정보와 접근 통제를 함께 검토합니다.',
    accent: '#C43A1A',
    image: '/blog/images/categories/ai-infrastructure-security.webp',
  },
  {
    name: '자동화·IoT',
    slug: 'automation-iot',
    short: 'IoT·자동화',
    description: '센서, 도어락과 기기 연동을 운영 절차와 함께 설계하는 기준입니다.',
    accent: '#E8620A',
    image: '/blog/images/categories/automation-iot.webp',
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

export const TITLE_FONTS = [
  'ssurround',
  'blackhansans-regular',
  'cutefont-regular',
  'diphylleia-regular',
  'dohyeon-regular',
  'dongle-light',
  'dongle-regular',
  'dongle-bold',
  'eastseadokdo-regular',
  'gaegu-light',
  'gaegu-regular',
  'gaegu-bold',
  'gamjaflower-regular',
  'gasoekone-regular',
  'gothica1-thin',
  'gothica1-extralight',
  'gothica1-light',
  'gothica1-regular',
  'gothica1-medium',
  'gothica1-semibold',
  'gothica1-bold',
  'gothica1-extrabold',
  'gothica1-black',
  'gowunbatang-regular',
  'gowunbatang-bold',
  'gowundodum-regular',
  'grandifloraone-regular',
  'gugi-regular',
  'hahmlet',
  'himelody-regular',
  'ibmplexsanskr-thin',
  'ibmplexsanskr-extralight',
  'ibmplexsanskr-light',
  'ibmplexsanskr-regular',
  'ibmplexsanskr-medium',
  'ibmplexsanskr-semibold',
  'ibmplexsanskr-bold',
  'jua-regular',
  'kiranghaerang-regular',
  'moiraione-regular',
  'nanumbrushscript-regular',
  'nanumpenscript-regular',
  'nanumgothic-regular',
  'nanumgothic-bold',
  'nanumgothic-extrabold',
  'nanummyeongjo-regular',
  'nanummyeongjo-bold',
  'nanummyeongjo-extrabold',
  'noto-sans-kr',
  'noto-serif-kr',
  'orbit-regular',
  'poorstory-regular',
  'songmyung-regular',
  'stylish-regular',
  'sunflower-light',
  'sunflower-medium',
  'sunflower-bold',
  'yeonsung-regular',
] as const;
export type TitleFont = (typeof TITLE_FONTS)[number];
export const TITLE_FONT_STACKS: Record<TitleFont, string> = {
  ssurround: "'Cafe24 Ssurround', 'Noto Sans KR', sans-serif",
  'blackhansans-regular': "'Black Han Sans Regular', 'Noto Sans KR', sans-serif",
  'cutefont-regular': "'Cute Font Regular', 'Noto Sans KR', sans-serif",
  'diphylleia-regular': "'Diphylleia Regular', 'Noto Sans KR', sans-serif",
  'dohyeon-regular': "'Do Hyeon Regular', 'Noto Sans KR', sans-serif",
  'dongle-light': "'Dongle Light', 'Noto Sans KR', sans-serif",
  'dongle-regular': "'Dongle Regular', 'Noto Sans KR', sans-serif",
  'dongle-bold': "'Dongle Bold', 'Noto Sans KR', sans-serif",
  'eastseadokdo-regular': "'East Sea Dokdo Regular', 'Noto Sans KR', sans-serif",
  'gaegu-light': "'Gaegu Light', 'Noto Sans KR', sans-serif",
  'gaegu-regular': "'Gaegu Regular', 'Noto Sans KR', sans-serif",
  'gaegu-bold': "'Gaegu Bold', 'Noto Sans KR', sans-serif",
  'gamjaflower-regular': "'Gamja Flower Regular', 'Noto Sans KR', sans-serif",
  'gasoekone-regular': "'Gasoek One Regular', 'Noto Sans KR', sans-serif",
  'gothica1-thin': "'Gothic A1 Thin', 'Noto Sans KR', sans-serif",
  'gothica1-extralight': "'Gothic A1 ExtraLight', 'Noto Sans KR', sans-serif",
  'gothica1-light': "'Gothic A1 Light', 'Noto Sans KR', sans-serif",
  'gothica1-regular': "'Gothic A1 Regular', 'Noto Sans KR', sans-serif",
  'gothica1-medium': "'Gothic A1 Medium', 'Noto Sans KR', sans-serif",
  'gothica1-semibold': "'Gothic A1 SemiBold', 'Noto Sans KR', sans-serif",
  'gothica1-bold': "'Gothic A1 Bold', 'Noto Sans KR', sans-serif",
  'gothica1-extrabold': "'Gothic A1 ExtraBold', 'Noto Sans KR', sans-serif",
  'gothica1-black': "'Gothic A1 Black', 'Noto Sans KR', sans-serif",
  'gowunbatang-regular': "'Gowun Batang Regular', 'Noto Sans KR', sans-serif",
  'gowunbatang-bold': "'Gowun Batang Bold', 'Noto Sans KR', sans-serif",
  'gowundodum-regular': "'Gowun Dodum Regular', 'Noto Sans KR', sans-serif",
  'grandifloraone-regular': "'Grandiflora One Regular', 'Noto Sans KR', sans-serif",
  'gugi-regular': "'Gugi Regular', 'Noto Sans KR', sans-serif",
  'hahmlet': "'Hahmlet Regular', 'Noto Sans KR', sans-serif",
  'himelody-regular': "'Hi Melody Regular', 'Noto Sans KR', sans-serif",
  'ibmplexsanskr-thin': "'IBM Plex Sans KR Thin', 'Noto Sans KR', sans-serif",
  'ibmplexsanskr-extralight': "'IBM Plex Sans KR ExtraLight', 'Noto Sans KR', sans-serif",
  'ibmplexsanskr-light': "'IBM Plex Sans KR Light', 'Noto Sans KR', sans-serif",
  'ibmplexsanskr-regular': "'IBM Plex Sans KR Regular', 'Noto Sans KR', sans-serif",
  'ibmplexsanskr-medium': "'IBM Plex Sans KR Medium', 'Noto Sans KR', sans-serif",
  'ibmplexsanskr-semibold': "'IBM Plex Sans KR SemiBold', 'Noto Sans KR', sans-serif",
  'ibmplexsanskr-bold': "'IBM Plex Sans KR Bold', 'Noto Sans KR', sans-serif",
  'jua-regular': "'Jua Regular', 'Noto Sans KR', sans-serif",
  'kiranghaerang-regular': "'Kirang Haerang Regular', 'Noto Sans KR', sans-serif",
  'moiraione-regular': "'Moirai One Regular', 'Noto Sans KR', sans-serif",
  'nanumbrushscript-regular': "'Nanum Brush Script', 'Noto Sans KR', sans-serif",
  'nanumpenscript-regular': "'Nanum Pen Regular', 'Noto Sans KR', sans-serif",
  'nanumgothic-regular': "'NanumGothic', 'Noto Sans KR', sans-serif",
  'nanumgothic-bold': "'NanumGothic Bold', 'Noto Sans KR', sans-serif",
  'nanumgothic-extrabold': "'NanumGothic ExtraBold', 'Noto Sans KR', sans-serif",
  'nanummyeongjo-regular': "'NanumMyeongjo', 'Noto Sans KR', sans-serif",
  'nanummyeongjo-bold': "'NanumMyeongjo Bold', 'Noto Sans KR', sans-serif",
  'nanummyeongjo-extrabold': "'NanumMyeongjo ExtraBold', 'Noto Sans KR', sans-serif",
  'noto-sans-kr': "'Noto Sans KR Thin', 'Noto Sans KR', sans-serif",
  'noto-serif-kr': "'Noto Serif KR ExtraLight', 'Noto Sans KR', sans-serif",
  'orbit-regular': "'Orbit Regular', 'Noto Sans KR', sans-serif",
  'poorstory-regular': "'Poor Story Regular', 'Noto Sans KR', sans-serif",
  'songmyung-regular': "'Song Myung Regular', 'Noto Sans KR', sans-serif",
  'stylish-regular': "'Stylish Regular', 'Noto Sans KR', sans-serif",
  'sunflower-light': "'Sunflower Light', 'Noto Sans KR', sans-serif",
  'sunflower-medium': "'Sunflower Medium', 'Noto Sans KR', sans-serif",
  'sunflower-bold': "'Sunflower Bold', 'Noto Sans KR', sans-serif",
  'yeonsung-regular': "'Yeon Sung Regular', 'Noto Sans KR', sans-serif",
};

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

export interface TagRouteReference {
  tag: string;
  source: string;
}

export interface TagRoute {
  tag: string;
  slug: string;
  sources: string[];
}

export interface TagRouteAnalysis {
  routes: TagRoute[];
  errors: string[];
}

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

/**
 * 빌드 대상 콘텐츠의 태그와 URL을 일대일로 검증합니다.
 * 같은 표기의 태그가 여러 글에 있는 것은 허용하지만, 다른 표기가 같은 slug가 되면 실패합니다.
 */
export function analyzeTagRoutes(references: readonly TagRouteReference[]): TagRouteAnalysis {
  const groups = new Map<string, Map<string, { tag: string; sources: Set<string> }>>();
  const errors: string[] = [];

  for (const reference of references) {
    const normalizedTag = reference.tag.trim().normalize('NFKC');
    const source = reference.source.trim() || '(파일 경로 없음)';
    const slug = tagToSlug(normalizedTag);

    if (!slug) {
      errors.push(`태그 "${reference.tag}"은(는) URL slug가 비어 있습니다. 글 파일: ${source}`);
      continue;
    }

    const labels = groups.get(slug) ?? new Map<string, { tag: string; sources: Set<string> }>();
    const existing = labels.get(normalizedTag) ?? { tag: normalizedTag, sources: new Set<string>() };
    existing.sources.add(source);
    labels.set(normalizedTag, existing);
    groups.set(slug, labels);
  }

  const routes: TagRoute[] = [];
  for (const [slug, labels] of groups) {
    if (labels.size > 1) {
      const collisions = [...labels.values()]
        .map(({ tag, sources }) => `"${tag}" (${[...sources].sort().join(', ')})`)
        .join(' / ');
      errors.push(`태그 slug 충돌 "${slug}": ${collisions}`);
      continue;
    }

    const [{ tag, sources }] = [...labels.values()];
    routes.push({ tag, slug, sources: [...sources].sort() });
  }

  const routeSlugs = routes.map((route) => route.slug);
  if (new Set(routeSlugs).size !== routeSlugs.length) {
    errors.push('태그 경로가 고유하지 않습니다. 태그 slug 생성 규칙을 확인하세요.');
  }

  return { routes, errors };
}

export function assertUniqueTagRoutes(references: readonly TagRouteReference[]): TagRoute[] {
  const analysis = analyzeTagRoutes(references);
  if (analysis.errors.length > 0) {
    throw new Error(`태그 경로 검증 실패:\n- ${analysis.errors.join('\n- ')}`);
  }
  return analysis.routes;
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
