import rss from '@astrojs/rss';
import { getVisiblePosts, getPostSlug } from '@/lib/posts';
import { articlePath } from '@/lib/paths';

export async function GET(context: { site?: URL }) {
  const posts = await getVisiblePosts();
  return rss({
    title: 'Core Company Blog',
    description: '숙박·오피스·중소기업 운영자를 위한 AI, IoT, 자동화 도입 기준과 실무 가이드',
    site: context.site ?? new URL('https://corecompany.net'),
    stylesheet: '/blog/rss/styles.xsl',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: new Date(post.data.publishedAt),
      link: articlePath(getPostSlug(post)),
      categories: [post.data.category, ...post.data.tags],
      author: post.data.author,
      customData: `<updated>${new Date(post.data.updatedAt).toISOString()}</updated>`
    }))
  });
}
