# How this site works

**Patterns in Leaves** is a static blog built with [Astro](https://astro.build/) 6.x (Node 22+). Content lives in a Markdown **content collection**; pages are generated at build time. The production site is **https://patterns-in-leaves.com** (see `astro.config.mjs` `site` and `public/CNAME`).

## Project layout

| Path | Role |
|------|------|
| `src/content/post/` | Blog posts as `.md` files with YAML front matter |
| `src/content.config.ts` | Content Layer config: `post` collection + Zod schema |
| `src/pages/index.astro` | Home page: lists all posts |
| `src/pages/[...slug].astro` | Catch-all route: one HTML page per post |
| `src/layouts/MarkdownPostLayout.astro` | Shell `<html>` for individual posts (fonts, KaTeX CSS) |
| `src/styles/global.css` | Typography and layout (Bear Blog–inspired defaults) |
| `src/pages/robots.txt.ts` | Dynamic `robots.txt` with sitemap URL |
| `public/` | Static assets (`favicon.svg`, `CNAME` for GitHub Pages) |
| `.github/workflows/deploy.yml` | Build and deploy to GitHub Pages on push to `main` |

## Content model

Posts are registered under the collection name **`post`** (directory `src/content/post/`).

Required front matter fields are defined in `src/content.config.ts`:

- **`title`**, **`description`** — Used on the index and for metadata-style use.
- **`created`**, **`modified`** — Dates (ISO strings in front matter are coerced via `z.coerce.date()`).
- **`subject_tags`**, **`website_tags`** — String arrays for categorization (not heavily used in templates yet).
- **`note_type`** — Free-form string (e.g. `post`).
- **`publish`** — Boolean. **Note:** Pages and the index currently call `getCollection("post")` without filtering; every file in the folder is built. To hide a draft, remove it from the collection folder or add a `filter` in `getCollection`/`getStaticPaths` (future improvement).

Optional: **`image`**.

The URL path for a post is the collection entry’s **`id`** (Content Layer), derived from the **filename** (without extension). Example: `202406162036 Thoughts on Ex-Prodigy….md` → `202406162036-thoughts-on-ex-prodigy-…`. Choose filenames deliberately so URLs stay stable.

## Markdown pipeline

Configured in `astro.config.mjs`:

- **`remark-math`** — Parses `$...$` / `$$...$$` (and similar) for math.
- **`rehype-katex`** — Renders math with KaTeX. Post layout loads KaTeX CSS from jsDelivr.
- **Custom `remark-ignore-todo`** (`src/remark-ignore-todo.ts`) — Strips GFM task-list items (`- [ ]` / `- [x]`) from the AST so checklists do not appear in the HTML output.

## Integrations

- **`@astrojs/sitemap`** — Emits `/sitemap-index.xml` (and related). Linked from the HTML head and from `robots.txt`.
- **No** React/Vue/Svelte — templates are `.astro` only.

## Styling and fonts

- Global CSS is Bear Blog–style: max width ~750px, readable line height, dark mode via `prefers-color-scheme`.
- Headings use **Adobe Fonts** (typekit `kgy5xxh.css`); body uses **Heebo** from that kit. Changing fonts means updating the kit link and `global.css` `font-family` rules.

## Build and deploy

- **Local:** `npm install`, `npm run dev` (dev server), `npm run build` (runs `astro check` then `astro build`). Output: `dist/`.
- **CI:** Pushing to **`main`** runs `.github/workflows/deploy.yml`: `withastro/action@v2` builds and uploads artifacts; `deploy-pages` publishes to **GitHub Pages**. Custom domain is enforced via `public/CNAME` (`patterns-in-leaves.com`).

## Mental model

1. Add or edit a Markdown file under `src/content/post/` with valid front matter.
2. `getStaticPaths` in `[...slug].astro` builds a route per entry; `index.astro` lists the same collection.
3. `npm run build` produces static files; GitHub Actions deploys them on `main`.

For dependency upgrades, security fixes, and editorial workflow, see the active PR description in `documentation/pr.md`.
