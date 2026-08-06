export function GET() {
  return new Response('User-agent: *\nAllow: /blog/\nSitemap: https://corecompany.net/blog/sitemap-index.xml\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
