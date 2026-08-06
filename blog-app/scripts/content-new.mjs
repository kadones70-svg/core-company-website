import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

import { CATEGORIES, CONTENT_TYPES } from '../src/config/content.ts';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIRECTORY = path.join(PROJECT_ROOT, 'src', 'content', 'posts');
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function koreanDate() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function isRealIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

function yamlString(value) {
  return JSON.stringify(value);
}

function yamlList(values, indentation = '') {
  if (values.length === 0) return ' []';
  return `\n${values.map((value) => `${indentation}  - ${yamlString(value)}`).join('\n')}`;
}

function parseBoolean(value, defaultValue) {
  const normalized = value.trim().toLocaleLowerCase('ko-KR');
  if (normalized === '') return defaultValue;
  if (['y', 'yes', 'true', '1', '예'].includes(normalized)) return true;
  if (['n', 'no', 'false', '0', '아니오'].includes(normalized)) return false;
  return undefined;
}

async function askRequired(readline, label, defaultValue = '') {
  while (true) {
    const suffix = defaultValue ? ` [${defaultValue}]` : '';
    const answer = (await readline.question(`${label}${suffix}: `)).trim();
    const value = answer || defaultValue;
    if (value) return value;
    console.log('값을 입력해 주세요.');
  }
}

async function askBoolean(readline, label, defaultValue) {
  const marker = defaultValue ? 'Y/n' : 'y/N';
  while (true) {
    const answer = await readline.question(`${label} (${marker}): `);
    const parsed = parseBoolean(answer, defaultValue);
    if (parsed !== undefined) return parsed;
    console.log('y 또는 n으로 입력해 주세요.');
  }
}

async function askChoice(readline, label, choices, defaultIndex = 0) {
  console.log(`\n${label}`);
  choices.forEach((choice, index) => console.log(`  ${index + 1}. ${choice}`));

  while (true) {
    const answer = (await readline.question(`번호 또는 정확한 값을 입력하세요 [${defaultIndex + 1}]: `)).trim();
    if (!answer) return choices[defaultIndex];
    const numericIndex = Number.parseInt(answer, 10) - 1;
    if (Number.isInteger(numericIndex) && numericIndex >= 0 && numericIndex < choices.length) {
      return choices[numericIndex];
    }
    if (choices.includes(answer)) return answer;
    console.log('목록에 있는 번호 또는 값을 입력해 주세요.');
  }
}

async function createFallbackSlug(date) {
  const dateToken = date.replaceAll('-', '');
  const base = `post-${dateToken}`;
  let candidate = base;
  let suffix = 2;

  while (await pathExists(path.join(POSTS_DIRECTORY, `${candidate}.md`))) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function renderMarkdown(values) {
  const tags = yamlList(values.tags);

  return `---
title: ${yamlString(values.title)}
summary: ${yamlString(values.summary)}
description: ${yamlString(values.description)}
category: ${yamlString(values.category)}
tags:${tags}
contentType: ${yamlString(values.contentType)}
author: ${yamlString(values.author)}
reviewer: ${yamlString(values.reviewer)}
publishedAt: ${yamlString(values.publishedAt)}
updatedAt: ${yamlString(values.publishedAt)}
draft: ${values.draft}
featured: ${values.featured}
thumbnail: ${yamlString(values.thumbnail)}
thumbnailAlt: ${yamlString(values.thumbnailAlt)}
sources: []
changeLog:
  - date: ${yamlString(values.publishedAt)}
    description: "초안 생성"
    reviewer: ${yamlString(values.reviewer)}
aiDisclosure: ${yamlString(values.aiDisclosure)}
relatedPosts: []
sample: false
---

# 문제 또는 배경

본문을 작성하세요.

# 핵심 결론

핵심 결론을 작성하세요.

# 판단 기준

판단 기준을 작성하세요.

# 비교 또는 실행 단계

비교 항목이나 실행 단계를 작성하세요.

# 체크리스트

- [ ] 확인 항목을 작성하세요.

# 주의사항

> [!WARNING]
> 주의할 내용을 작성하세요.

# 정리

글의 결론을 정리하세요.

# 출처

frontmatter의 sources에도 확인한 원문 URL과 확인 날짜를 입력하세요.
`;
}

async function main() {
  await mkdir(POSTS_DIRECTORY, { recursive: true });
  const readline = createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log('Core Company 블로그 새 글 만들기\n');
    const title = await askRequired(readline, '제목');
    let slug = (await readline.question('slug (영문 소문자·숫자·하이픈, 빈 값이면 날짜 기반 생성): ')).trim();
    const summary = await askRequired(readline, '요약');
    const description = await askRequired(readline, 'description');
    const category = await askChoice(
      readline,
      '카테고리',
      CATEGORIES.map((item) => item.name),
    );
    const rawTags = await readline.question('태그 (쉼표로 구분, 비워도 됨): ');
    const tags = [
      ...new Map(
        rawTags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((tag) => [tag.normalize('NFKC').toLocaleLowerCase('ko-KR'), tag]),
      ).values(),
    ];
    const contentType = await askChoice(readline, '콘텐츠 유형', [...CONTENT_TYPES]);
    const author = await askRequired(readline, '작성자', 'Core Company');
    const reviewer = await askRequired(readline, '검수자', '기술 책임자');

    let publishedAt = await askRequired(readline, '게시일 (YYYY-MM-DD)', koreanDate());
    while (!isRealIsoDate(publishedAt)) {
      console.log('YYYY-MM-DD 형식의 실제 날짜를 입력해 주세요.');
      publishedAt = await askRequired(readline, '게시일 (YYYY-MM-DD)', koreanDate());
    }

    const draft = await askBoolean(readline, '초안으로 저장', true);
    const featured = await askBoolean(readline, '대표 글로 표시', false);
    const thumbnail = (await readline.question('썸네일 경로 (없으면 빈 값): ')).trim();
    const thumbnailAlt = (await readline.question('썸네일 alt (썸네일이 없으면 빈 값): ')).trim();
    const aiDisclosure = (await readline.question('AI 활용 공개 문구 (없으면 빈 값): ')).trim();

    if (!slug) slug = await createFallbackSlug(publishedAt);
    if (!SLUG_PATTERN.test(slug)) {
      throw new Error('slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있으며 하이픈으로 시작하거나 끝날 수 없습니다.');
    }

    const target = path.join(POSTS_DIRECTORY, `${slug}.md`);
    if (await pathExists(target)) throw new Error(`같은 slug가 이미 존재합니다: ${slug}`);
    if (thumbnail && !thumbnailAlt) throw new Error('thumbnail이 있으면 thumbnailAlt를 입력해야 합니다.');
    if (thumbnail && !/^\/blog\/images\/posts\//.test(thumbnail)) {
      throw new Error('thumbnail은 /blog/images/posts/ 아래의 공개 경로를 입력하세요.');
    }

    const markdown = renderMarkdown({
      title,
      slug,
      summary,
      description,
      category,
      tags,
      contentType,
      author,
      reviewer,
      publishedAt,
      draft,
      featured,
      thumbnail,
      thumbnailAlt,
      aiDisclosure,
    });

    await writeFile(target, markdown, { encoding: 'utf8', flag: 'wx' });
    console.log(`\n생성 완료: ${path.relative(PROJECT_ROOT, target)}`);
    console.log('게시 전에 npm run content:validate를 실행하세요.');
  } finally {
    readline.close();
  }
}

main().catch((error) => {
  console.error(`콘텐츠 생성 실패: ${error.message}`);
  process.exitCode = 1;
});
