import type { APIRoute } from 'astro';
import { CATEGORIES, assertUniqueTagRoutes } from '@/config/content';
import { SITE } from '@/config/site';
import { articlePath, withBase } from '@/lib/paths';
import { getPostSlug, getVisiblePosts, isoDate } from '@/lib/posts';

export const prerender = true;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = await getVisiblePosts();
  const categoryNames = new Set(posts.map((post) => post.data.category));
  const tagRoutes = assertUniqueTagRoutes(
    posts.flatMap((post) => post.data.tags.map((tag) => ({ tag, source: `src/content/posts/${post.id}.md` }))),
  );
  const entries: Array<{ path: string; lastmod?: string }> = [
    { path: withBase('/') },
    { path: withBase('/editorial-policy/') },
    ...posts.map((post) => ({
      path: articlePath(getPostSlug(post)),
      lastmod: isoDate(post.data.updatedAt)
    })),
    ...CATEGORIES.filter((category) => categoryNames.has(category.name)).map((category) => ({
      path: withBase(`/category/${category.slug}/`)
    })),
    ...tagRoutes.map((route) => ({ path: withBase(`/tag/${route.slug}/`) }))
  ];

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = escapeXml(new URL(path, SITE.siteUrl).toString());
      return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
