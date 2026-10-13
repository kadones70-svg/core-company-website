// assemble-site.mjs — Cloudflare Pages git-build 병합 스크립트
// 홈페이지 정적파일(루트 *.html + assets/)을 dist/ 로,
// Astro 블로그 빌드(blog-app/dist/*)를 dist/blog/ 로 합친다.
// 실행: (blog-app에서 npm run build 후) `node scripts/assemble-site.mjs`
// Cloudflare 설정: Build output directory = dist
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const blogDist = join(root, 'blog-app', 'dist');

if (!existsSync(blogDist)) {
  console.error('[assemble] blog-app/dist 없음 — 먼저 blog-app에서 `npm run build` 하세요.');
  process.exit(1);
}

// 1) 깨끗한 출력 폴더
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// 2) 홈페이지 정적자산: 루트의 *.html 전부 + assets/ 디렉터리
let copied = [];
for (const name of readdirSync(root)) {
  const src = join(root, name);
  if (name.endsWith('.html') && statSync(src).isFile()) {
    cpSync(src, join(out, name));
    copied.push(name);
  }
}
const assets = join(root, 'assets');
if (existsSync(assets)) {
  cpSync(assets, join(out, 'assets'), { recursive: true });
  copied.push('assets/');
}

// 3) 블로그 빌드를 /blog 아래로 (base=/blog 이므로 dist 루트가 블로그 콘텐츠)
cpSync(blogDist, join(out, 'blog'), { recursive: true });
copied.push('blog/ (from blog-app/dist)');

console.log('[assemble] dist/ 생성 완료:', copied.join(', '));
