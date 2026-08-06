import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export function getPostSlug(post: PostEntry) {
  return post.id.replace(/\\/g, '/').replace(/\.md$/i, '').split('/').pop() ?? post.id;
}

export function isVisiblePost(post: PostEntry) {
  const includeSamples = process.env.INCLUDE_SAMPLES === 'true';
  return !post.data.draft && (!post.data.sample || includeSamples);
}

export async function getVisiblePosts() {
  const posts = await getCollection('posts', isVisiblePost);
  return posts.sort((a, b) => {
    const aDate = new Date(a.data.updatedAt).getTime();
    const bDate = new Date(b.data.updatedAt).getTime();
    return bDate - aDate || a.data.title.localeCompare(b.data.title, 'ko');
  });
}

export function readingMinutes(post: PostEntry) {
  const plain = (post.body ?? '').replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`\-|]/g, ' ');
  const characters = plain.replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(characters / 500));
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(value));
}

export function isoDate(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}
