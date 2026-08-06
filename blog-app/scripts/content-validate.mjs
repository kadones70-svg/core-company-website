import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import matter from 'gray-matter';

import { CATEGORIES, CONTENT_TYPES } from '../src/config/content.ts';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIRECTORY = path.join(PROJECT_ROOT, 'src', 'content', 'posts');
const PUBLIC_DIRECTORY = path.join(PROJECT_ROOT, 'public');
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CATEGORY_NAMES = new Set(CATEGORIES.map((category) => category.name));
const CONTENT_TYPE_NAMES = new Set(CONTENT_TYPES);
const REQUIRED_FIELDS = [
  'title',
  'summary',
  'description',
  'category',
  'tags',
  'contentType',
  'author',
  'reviewer',
  'publishedAt',
  'updatedAt',
  'draft',
  'featured',
  'thumbnail',
  'thumbnailAlt',
  'sources',
  'changeLog',
  'aiDisclosure',
  'relatedPosts',
  'sample',
];

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function findMarkdownFiles(directory = POSTS_DIRECTORY) {
  if (!(await exists(directory))) return [];
  const files = [];

  async function visit(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(target);
      else if (entry.isFile() && /\.md$/i.test(entry.name)) files.push(target);
    }
  }

  await visit(directory);
  return files.sort((left, right) => left.localeCompare(right, 'en'));
}

export function slugFromFile(file) {
  return path.basename(file, path.extname(file));
}

export async function readPostRecords(directory = POSTS_DIRECTORY) {
  const files = await findMarkdownFiles(directory);
  return Promise.all(
    files.map(async (file) => {
      const raw = await readFile(file, 'utf8');
      const relative = path.relative(PROJECT_ROOT, file).replaceAll('\\', '/');
      try {
        const parsed = matter(raw);
        return {
          file,
          relative,
          slug: slugFromFile(file),
          data: parsed.data,
          body: parsed.content,
          parseError: undefined,
        };
      } catch (error) {
        return {
          file,
          relative,
          slug: slugFromFile(file),
          data: {},
          body: '',
          parseError: error,
        };
      }
    }),
  );
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRealIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isHttpUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizedDuplicateValues(values) {
  const seen = new Map();
  const duplicates = new Set();
  for (const value of values) {
    const normalized = String(value).trim().normalize('NFKC').toLocaleLowerCase('ko-KR');
    if (seen.has(normalized)) duplicates.add(String(value));
    else seen.set(normalized, value);
  }
  return [...duplicates];
}

function localImageTarget(source, markdownFile) {
  const cleanSource = source.split(/[?#]/, 1)[0];
  if (/^(?:https?:|data:)/i.test(cleanSource)) return undefined;
  if (cleanSource.startsWith('/blog/')) return path.join(PUBLIC_DIRECTORY, cleanSource.slice('/blog/'.length));
  if (cleanSource.startsWith('/')) return path.join(PUBLIC_DIRECTORY, cleanSource.slice(1));
  return path.resolve(path.dirname(markdownFile), cleanSource);
}

async function validateImagePath(source, label, record, errors, warnings) {
  if (!isNonEmptyString(source)) return;
  const target = localImageTarget(source, record.file);
  if (!target) return;

  if (!(await exists(target))) {
    errors.push(`${record.relative}: ${label} 이미지가 없습니다: ${source}`);
    return;
  }

  const extension = path.extname(target).toLocaleLowerCase('en-US');
  if (!['.avif', '.webp', '.png', '.jpg', '.jpeg', '.svg'].includes(extension)) {
    errors.push(`${record.relative}: ${label}에 지원하지 않는 이미지 확장자를 사용했습니다: ${source}`);
  }

  const info = await stat(target);
  if (extension === '.png' && info.size > 2 * 1024 * 1024) {
    errors.push(`${record.relative}: 2MB를 넘는 PNG는 사용할 수 없습니다: ${source}`);
  } else if (info.size > 300 * 1024) {
    warnings.push(`${record.relative}: 300KB를 넘는 콘텐츠 이미지입니다: ${source}`);
  }
}

function extractMarkdownImages(body) {
  const images = [];
  const pattern = /!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
  for (const match of body.matchAll(pattern)) images.push({ alt: match[1].trim(), source: match[2] });
  return images;
}

function extractHtmlImages(body) {
  const images = [];
  for (const match of body.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1];
    const source = attributes.match(/\bsrc=["']([^"']+)["']/i)?.[1] ?? '';
    const altMatch = attributes.match(/\balt=["']([^"']*)["']/i);
    images.push({
      source,
      alt: altMatch?.[1].trim(),
      hasAlt: Boolean(altMatch),
      hasWidth: /\bwidth=["']?\d+/i.test(attributes),
      hasHeight: /\bheight=["']?\d+/i.test(attributes),
    });
  }
  return images;
}

function validateHeadingStructure(record, errors, warnings) {
  const headings = [];
  let fence;

  record.body.split(/\r?\n/).forEach((line, index) => {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1][0];
      else if (fence === fenceMatch[1][0]) fence = undefined;
      return;
    }
    if (fence) return;

    const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) headings.push({ level: heading[1].length, text: heading[2].trim(), line: index + 1 });
  });

  if (headings.length === 0) {
    warnings.push(`${record.relative}: 본문 heading이 없습니다.`);
    return;
  }
  if (headings[0].level > 2) {
    errors.push(`${record.relative}:${headings[0].line}: 첫 본문 heading은 H1 또는 H2여야 합니다.`);
  }

  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index].level > headings[index - 1].level + 1) {
      errors.push(
        `${record.relative}:${headings[index].line}: heading 단계가 H${headings[index - 1].level}에서 H${headings[index].level}(으)로 건너뛰었습니다.`,
      );
    }
  }
}

async function validateRecord(record, allSlugs, errors, warnings) {
  const prefix = record.relative;
  if (record.parseError) {
    errors.push(`${prefix}: frontmatter를 파싱할 수 없습니다: ${record.parseError.message}`);
    return;
  }

  const { data, body } = record;
  for (const field of REQUIRED_FIELDS) {
    if (!Object.hasOwn(data, field)) errors.push(`${prefix}: 필수 frontmatter가 없습니다: ${field}`);
  }

  if (!SLUG_PATTERN.test(record.slug)) {
    errors.push(`${prefix}: 파일명 slug는 영문 소문자·숫자·하이픈만 사용할 수 있습니다.`);
  }

  for (const field of ['title', 'summary', 'description', 'author', 'reviewer']) {
    if (!isNonEmptyString(data[field])) errors.push(`${prefix}: ${field}은(는) 비어 있을 수 없습니다.`);
  }
  if (!CATEGORY_NAMES.has(data.category)) errors.push(`${prefix}: 허용되지 않은 category입니다: ${data.category}`);
  if (!CONTENT_TYPE_NAMES.has(data.contentType)) {
    errors.push(`${prefix}: 허용되지 않은 contentType입니다: ${data.contentType}`);
  }

  if (!Array.isArray(data.tags)) errors.push(`${prefix}: tags는 배열이어야 합니다.`);
  else {
    if (data.tags.some((tag) => !isNonEmptyString(tag))) errors.push(`${prefix}: 빈 태그를 사용할 수 없습니다.`);
    const duplicates = normalizedDuplicateValues(data.tags);
    if (duplicates.length) errors.push(`${prefix}: 중복 태그를 제거하세요: ${duplicates.join(', ')}`);
  }

  if (!isRealIsoDate(data.publishedAt)) errors.push(`${prefix}: publishedAt은 YYYY-MM-DD 형식의 실제 날짜여야 합니다.`);
  if (!isRealIsoDate(data.updatedAt)) errors.push(`${prefix}: updatedAt은 YYYY-MM-DD 형식의 실제 날짜여야 합니다.`);
  if (isRealIsoDate(data.publishedAt) && isRealIsoDate(data.updatedAt) && data.updatedAt < data.publishedAt) {
    errors.push(`${prefix}: updatedAt은 publishedAt보다 빠를 수 없습니다.`);
  }

  for (const field of ['draft', 'featured', 'sample']) {
    if (typeof data[field] !== 'boolean') errors.push(`${prefix}: ${field}은(는) boolean이어야 합니다.`);
  }
  if (typeof data.thumbnail !== 'string') errors.push(`${prefix}: thumbnail은 문자열이어야 합니다.`);
  if (typeof data.thumbnailAlt !== 'string') errors.push(`${prefix}: thumbnailAlt는 문자열이어야 합니다.`);
  if (isNonEmptyString(data.thumbnail)) {
    if (!/^\/blog\/images\/posts\//.test(data.thumbnail)) {
      errors.push(`${prefix}: thumbnail은 /blog/images/posts/ 아래의 경로여야 합니다.`);
    }
    if (!isNonEmptyString(data.thumbnailAlt)) errors.push(`${prefix}: thumbnail이 있으면 thumbnailAlt가 필요합니다.`);
    await validateImagePath(data.thumbnail, 'thumbnail', record, errors, warnings);
  }

  if (!Array.isArray(data.sources)) errors.push(`${prefix}: sources는 배열이어야 합니다.`);
  else {
    data.sources.forEach((source, index) => {
      const label = `sources[${index}]`;
      if (!source || typeof source !== 'object') {
        errors.push(`${prefix}: ${label}은(는) 객체여야 합니다.`);
        return;
      }
      if (!isNonEmptyString(source.title)) errors.push(`${prefix}: ${label}.title이 비어 있습니다.`);
      if (!isHttpUrl(source.url)) errors.push(`${prefix}: ${label}.url은 비어 있지 않은 http(s) URL이어야 합니다.`);
      if (!isRealIsoDate(source.checkedAt)) errors.push(`${prefix}: ${label}.checkedAt은 YYYY-MM-DD 날짜여야 합니다.`);
      if (!isNonEmptyString(source.type)) errors.push(`${prefix}: ${label}.type이 비어 있습니다.`);
    });
  }

  if (!Array.isArray(data.changeLog)) errors.push(`${prefix}: changeLog는 배열이어야 합니다.`);
  else {
    data.changeLog.forEach((change, index) => {
      const label = `changeLog[${index}]`;
      if (!change || typeof change !== 'object') {
        errors.push(`${prefix}: ${label}은(는) 객체여야 합니다.`);
        return;
      }
      if (!isRealIsoDate(change.date)) errors.push(`${prefix}: ${label}.date는 YYYY-MM-DD 날짜여야 합니다.`);
      if (!isNonEmptyString(change.description)) errors.push(`${prefix}: ${label}.description이 비어 있습니다.`);
      if (!isNonEmptyString(change.reviewer)) errors.push(`${prefix}: ${label}.reviewer가 비어 있습니다.`);
    });
  }

  if (typeof data.aiDisclosure !== 'string') errors.push(`${prefix}: aiDisclosure는 문자열이어야 합니다.`);
  if (!Array.isArray(data.relatedPosts)) errors.push(`${prefix}: relatedPosts는 배열이어야 합니다.`);
  else {
    const duplicates = normalizedDuplicateValues(data.relatedPosts);
    if (duplicates.length) errors.push(`${prefix}: 중복 relatedPosts를 제거하세요: ${duplicates.join(', ')}`);
    data.relatedPosts.forEach((slug) => {
      if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
        errors.push(`${prefix}: 잘못된 relatedPosts slug입니다: ${slug}`);
      } else if (slug === record.slug) {
        errors.push(`${prefix}: relatedPosts에 현재 글 자신을 넣을 수 없습니다.`);
      } else if (!allSlugs.has(slug)) {
        errors.push(`${prefix}: relatedPosts slug가 존재하지 않습니다: ${slug}`);
      }
    });
  }

  if (!isNonEmptyString(body)) errors.push(`${prefix}: Markdown 본문이 비어 있습니다.`);
  if (data.sample === true && !body.includes('실제 고객 사례가 아닙니다')) {
    errors.push(`${prefix}: sample 글 본문 상단에 실제 고객 사례가 아님을 표시하세요.`);
  }

  for (const image of extractMarkdownImages(body)) {
    if (!image.alt) errors.push(`${prefix}: Markdown 이미지 alt가 비어 있습니다: ${image.source}`);
    await validateImagePath(image.source, '본문', record, errors, warnings);
  }
  for (const image of extractHtmlImages(body)) {
    if (!image.hasAlt || !image.alt) errors.push(`${prefix}: HTML 이미지 alt가 비어 있습니다: ${image.source}`);
    if (!image.hasWidth || !image.hasHeight) warnings.push(`${prefix}: HTML 이미지에 width와 height를 모두 지정하세요: ${image.source}`);
    await validateImagePath(image.source, '본문 HTML', record, errors, warnings);
  }

  validateHeadingStructure(record, errors, warnings);
}

export async function validateContent({ print = true, directory = POSTS_DIRECTORY } = {}) {
  const errors = [];
  const warnings = [];
  const records = await readPostRecords(directory);
  const slugCounts = new Map();

  for (const record of records) slugCounts.set(record.slug, (slugCounts.get(record.slug) ?? 0) + 1);
  for (const [slug, count] of slugCounts) {
    if (count > 1) errors.push(`중복 slug가 ${count}개 있습니다: ${slug}`);
  }

  const allSlugs = new Set(records.map((record) => record.slug));
  for (const record of records) await validateRecord(record, allSlugs, errors, warnings);

  if (print) {
    console.log(`콘텐츠 검증: ${records.length}개 Markdown 파일`);
    records.forEach((record) => {
      const state = record.parseError
        ? 'frontmatter 오류'
        : `draft:${String(record.data.draft)} sample:${String(record.data.sample)}`;
      console.log(`- ${record.slug} (${state})`);
    });
    if (warnings.length) {
      console.log(`\n경고 ${warnings.length}건`);
      warnings.forEach((warning) => console.warn(`- ${warning}`));
    }
    if (errors.length) {
      console.error(`\n오류 ${errors.length}건`);
      errors.forEach((error) => console.error(`- ${error}`));
    }
    const draftCount = records.filter((record) => record.data.draft === true).length;
    const sampleCount = records.filter((record) => record.data.sample === true).length;
    console.log(`\n상태 요약: draft ${draftCount}개, sample ${sampleCount}개`);
    console.log(errors.length ? '검증 실패' : '검증 성공');
  }

  return { records, errors, warnings };
}

function isMainModule() {
  if (!process.argv[1]) return false;
  return path.resolve(process.argv[1]).toLocaleLowerCase('en-US') === fileURLToPath(import.meta.url).toLocaleLowerCase('en-US');
}

if (isMainModule()) {
  validateContent()
    .then(({ errors }) => {
      if (errors.length) process.exitCode = 1;
    })
    .catch((error) => {
      console.error(`콘텐츠 검증 실행 실패: ${error.message}`);
      process.exitCode = 1;
    });
}
