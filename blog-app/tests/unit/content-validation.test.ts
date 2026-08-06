import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

// The production validator is intentionally a plain ESM script used by npm commands.
import { validateContent } from '../../scripts/content-validate.mjs';

const validPost = `---
title: "검증용 글"
summary: "콘텐츠 검증기의 실패 조건을 확인합니다."
description: "잘못된 frontmatter와 중복 slug가 배포 전에 차단되는지 확인합니다."
category: "문서·데이터 AI"
tags:
  - "체크리스트"
contentType: "체크리스트"
author: "Core Company"
reviewer: "기술 책임자"
publishedAt: "2026-08-06"
updatedAt: "2026-08-06"
draft: false
featured: false
thumbnail: ""
thumbnailAlt: ""
sources: []
changeLog:
  - date: "2026-08-06"
    description: "검증용 작성"
    reviewer: "기술 책임자"
aiDisclosure: ""
relatedPosts: []
sample: false
---

## 문제 또는 배경

검증 전용 본문입니다.
`;

async function withTemporaryPosts(
  run: (directory: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(path.join(tmpdir(), 'core-blog-content-validation-'));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('invalid frontmatter is rejected before a production build', async () => {
  await withTemporaryPosts(async (directory) => {
    await writeFile(
      path.join(directory, 'broken.md'),
      '---\ntitle: "필드가 부족한 글"\n---\n\n## 본문\n\n검증 실패가 정상입니다.\n',
      'utf8',
    );

    const result = await validateContent({ print: false, directory });
    assert.ok(result.errors.length > 0);
    assert.ok(result.errors.some((error: string) => error.includes('필수 frontmatter')));
  });
});

test('duplicate slugs are rejected across nested content folders', async () => {
  await withTemporaryPosts(async (directory) => {
    const first = path.join(directory, 'first');
    const second = path.join(directory, 'second');
    await mkdir(first);
    await mkdir(second);
    await Promise.all([
      writeFile(path.join(first, 'same-slug.md'), validPost, 'utf8'),
      writeFile(path.join(second, 'same-slug.md'), validPost, 'utf8'),
    ]);

    const result = await validateContent({ print: false, directory });
    assert.ok(result.errors.some((error: string) => error.includes('중복 slug가 2개 있습니다: same-slug')));
  });
});
