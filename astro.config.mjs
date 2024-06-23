import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from "@astrojs/sitemap";
import remarkIgnoreTODO from './src/remark-ignore-todo';

// https://astro.build/config
export default defineConfig({
  site: 'https://patterns-in-leaves.com',
  markdown: {
    remarkPlugins: [remarkMath, remarkIgnoreTODO],
    rehypePlugins: [rehypeKatex]
  },
  integrations: [sitemap()]
});