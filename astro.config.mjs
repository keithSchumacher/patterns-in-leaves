import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from "@astrojs/sitemap";
import remarkIgnoreTODO from './src/remark-ignore-todo';
import rehypeFootnoteLabelA11y from './src/rehype-footnote-label-a11y';

// https://astro.build/config
export default defineConfig({
  site: 'https://patterns-in-leaves.com',
  markdown: {
    remarkPlugins: [remarkMath, remarkIgnoreTODO],
    rehypePlugins: [rehypeKatex, rehypeFootnoteLabelA11y],
    // Cleaner footnote URLs (#fn-1) than default GitHub-style (#user-content-fn-1)
    // https://github.com/remarkjs/remark-rehype#options
    remarkRehype: {
      clobberPrefix: '',
    },
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  integrations: [sitemap()]
});