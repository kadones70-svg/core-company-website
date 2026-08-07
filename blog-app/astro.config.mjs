import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkCallouts from './src/lib/remark-callouts.mjs';
import rehypeTaskLabels from './src/lib/rehype-task-labels.mjs';

export default defineConfig({
  site: 'https://corecompany.net',
  base: '/blog',
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: unified({
      gfm: true,
      remarkPlugins: [remarkCallouts],
      rehypePlugins: [rehypeTaskLabels]
    }),
    shikiConfig: { theme: 'github-dark' }
  },
  build: {
    format: 'directory'
  }
});
