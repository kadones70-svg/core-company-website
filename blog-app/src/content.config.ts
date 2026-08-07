import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { CATEGORY_NAMES, CONTENT_TYPES, tagToSlug } from './config/content';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const POST_IMAGE_PATTERN = /^\/blog\/images\/posts\/.+\.(?:avif|webp|png|jpe?g|svg)$/iu;

function isRealIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function isPostImagePath(value: string): boolean {
  if (value === '') return true;
  if (!POST_IMAGE_PATTERN.test(value) || /[?#]/.test(value)) return false;
  return !value.split('/').includes('..');
}

const isoDate = z
  .string()
  .refine(isRealIsoDate, 'YYYY-MM-DD 형식의 실제 날짜를 입력하세요.')
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

const sourceSchema = z.object({
  title: z.string().trim().min(1, '출처명을 입력하세요.'),
  url: z
    .url({ message: '출처 URL은 유효한 절대 URL이어야 합니다.' })
    .refine((value) => /^https?:\/\//i.test(value), '출처 URL은 http 또는 https여야 합니다.'),
  checkedAt: isoDate,
  type: z.string().trim().min(1, '자료 유형을 입력하세요.'),
});

const changeLogSchema = z.object({
  date: isoDate,
  description: z.string().trim().min(1, '변경 내용을 입력하세요.'),
  reviewer: z.string().trim().min(1, '검수자를 입력하세요.'),
});

const postSchema = z
  .object({
    title: z.string().trim().min(1, '제목을 입력하세요.'),
    summary: z.string().trim().min(1, '요약을 입력하세요.'),
    description: z.string().trim().min(1, '메타 설명을 입력하세요.'),
    category: z.enum(CATEGORY_NAMES),
    tags: z.array(
      z
        .string()
        .trim()
        .min(1, '빈 태그는 사용할 수 없습니다.')
        .refine((tag) => tagToSlug(tag).length > 0, '기호만으로 된 태그는 URL을 만들 수 없습니다.'),
    ),
    contentType: z.enum(CONTENT_TYPES),
    author: z.string().trim().min(1, '작성자를 입력하세요.'),
    reviewer: z.string().trim().min(1, '검수자를 입력하세요.'),
    publishedAt: isoDate,
    updatedAt: isoDate,
    draft: z.boolean(),
    featured: z.boolean(),
    thumbnail: z
      .string()
      .trim()
      .refine(
        isPostImagePath,
        '썸네일은 /blog/images/posts/ 아래의 지원 이미지 경로여야 합니다.',
      ),
    thumbnailAlt: z.string().trim(),
    sources: z.array(sourceSchema),
    changeLog: z.array(changeLogSchema),
    aiDisclosure: z.string().trim(),
    relatedPosts: z.array(
      z.string().regex(SLUG_PATTERN, '관련 글 slug는 영문 소문자·숫자·하이픈만 사용할 수 있습니다.'),
    ),
    sample: z.boolean(),
  })
  .refine(({ publishedAt, updatedAt }) => updatedAt >= publishedAt, {
    message: 'updatedAt은 publishedAt보다 빠를 수 없습니다.',
    path: ['updatedAt'],
  })
  .refine(({ thumbnail, thumbnailAlt }) => thumbnail === '' || thumbnailAlt.length > 0, {
    message: 'thumbnail이 있으면 thumbnailAlt가 필요합니다.',
    path: ['thumbnailAlt'],
  })
  .refine(({ tags }) => new Set(tags.map((tag) => tag.normalize('NFKC'))).size === tags.length, {
    message: '중복 태그를 제거하세요.',
    path: ['tags'],
  })
  .refine(({ relatedPosts }) => new Set(relatedPosts).size === relatedPosts.length, {
    message: '중복 relatedPosts를 제거하세요.',
    path: ['relatedPosts'],
  })
  .superRefine(({ draft, sample, sources, changeLog }, context) => {
    if (draft || sample) return;
    if (sources.length === 0) {
      context.addIssue({
        code: 'custom',
        message: '공개 글에는 확인한 출처를 sources에 최소 1개 입력하세요.',
        path: ['sources'],
      });
    }
    if (changeLog.length === 0) {
      context.addIssue({
        code: 'custom',
        message: '공개 글에는 작성·수정 기록을 changeLog에 최소 1개 입력하세요.',
        path: ['changeLog'],
      });
    }
  });

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.md',
    generateId: ({ entry }) => entry.replace(/\\/g, '/').replace(/\.md$/i, ''),
  }),
  schema: postSchema,
});

export const collections = { posts };
