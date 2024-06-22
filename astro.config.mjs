import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://patterns-in-leaves.com',
  markdown: {
    remarkPlugins: [
      remarkMath
    ],
    rehypePlugins: [
      rehypeKatex
    ]
  }
});
