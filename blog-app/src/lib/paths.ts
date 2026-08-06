export const BASE_PATH = '/blog';

export function withBase(path = '/') {
  if (/^https?:\/\//.test(path)) return path;
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized === '/' ? '/' : normalized}`;
}

export function articlePath(slug: string) {
  return withBase(`/articles/${slug}/`);
}
