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
sources:
  - title: "공식 검증 자료"
    url: "https://example.com/official"
    checkedAt: "2026-08-06"
    type: "공식 문서"
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

test('public content requires at least one source and one change log entry', async () => {
  await withTemporaryPosts(async (directory) => {
    const missingEvidence = validPost
      .replace(
        /sources:\n  - title:[\s\S]*?    type: "공식 문서"\n/,
        'sources: []\n',
      )
      .replace(
        /changeLog:\n  - date:[\s\S]*?    reviewer: "기술 책임자"\n/,
        'changeLog: []\n',
      );
    await writeFile(path.join(directory, 'public-without-evidence.md'), missingEvidence, 'utf8');

    const result = await validateContent({ print: false, directory });
    assert.ok(
      result.errors.some((error: string) =>
        error.includes('공개 글에는 확인한 출처를 sources에 최소 1개 입력하세요.'),
      ),
    );
    assert.ok(
      result.errors.some((error: string) =>
        error.includes('공개 글에는 작성·수정 기록을 changeLog에 최소 1개 입력하세요.'),
      ),
    );
  });
});

test('public content with sources and change history passes evidence validation', async () => {
  await withTemporaryPosts(async (directory) => {
    await writeFile(path.join(directory, 'public-with-evidence.md'), validPost, 'utf8');
    const result = await validateContent({ print: false, directory });
    assert.deepEqual(result.errors, []);
  });
});

test('draft and sample content may keep evidence arrays empty', async () => {
  await withTemporaryPosts(async (directory) => {
    const withoutEvidence = validPost
      .replace(
        /sources:\n  - title:[\s\S]*?    type: "공식 문서"\n/,
        'sources: []\n',
      )
      .replace(
        /changeLog:\n  - date:[\s\S]*?    reviewer: "기술 책임자"\n/,
        'changeLog: []\n',
      );
    const draft = withoutEvidence.replace('draft: false', 'draft: true');
    const sample = withoutEvidence
      .replace('sample: false', 'sample: true')
      .replace('## 문제 또는 배경', '실제 고객 사례가 아닙니다.\n\n## 문제 또는 배경');
    await Promise.all([
      writeFile(path.join(directory, 'draft-without-evidence.md'), draft, 'utf8'),
      writeFile(path.join(directory, 'sample-without-evidence.md'), sample, 'utf8'),
    ]);

    const result = await validateContent({ print: false, directory });
    assert.deepEqual(result.errors, []);
  });
});

test('body source headings are rejected because frontmatter is the source of truth', async () => {
  await withTemporaryPosts(async (directory) => {
    await writeFile(
      path.join(directory, 'duplicate-source-section.md'),
      `${validPost}\n## 출처\n\n본문 출처를 중복으로 작성했습니다.\n`,
      'utf8',
    );
    const result = await validateContent({ print: false, directory });
    assert.ok(
      result.errors.some((error: string) =>
        error.includes('본문에 출처 heading을 만들지 말고 frontmatter sources만 사용하세요.'),
      ),
    );
  });
});

test('tag route collisions across build-visible files fail content validation', async () => {
  await withTemporaryPosts(async (directory) => {
    const upper = validPost.replace('  - "체크리스트"', '  - "RAG"');
    const lower = validPost.replace('  - "체크리스트"', '  - "rag"');
    await Promise.all([
      writeFile(path.join(directory, 'upper-tag.md'), upper, 'utf8'),
      writeFile(path.join(directory, 'lower-tag.md'), lower, 'utf8'),
    ]);

    const result = await validateContent({ print: false, directory });
    const message = result.errors.join('\n');
    assert.match(message, /태그 slug 충돌 "rag"/);
    assert.match(message, /"RAG" \(.+upper-tag\.md\)/);
    assert.match(message, /"rag" \(.+lower-tag\.md\)/);
  });
});
