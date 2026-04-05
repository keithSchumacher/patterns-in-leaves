# Revive blog: docs, security & deps, new post

This PR brings the **patterns-in-leaves** personal blog site back up to date after a long pause. The site is an [Astro](https://astro.build/) project (content collections, Markdown with math via remark/rehype, sitemap, etc.).

## Goals

### 1. Understand and document how the site works

- Maps the real layout: content location, routing, layouts, build and deploy assumptions.
- Expands project documentation so future changes are easier—without turning the repo into a manual nobody reads.

### 2. Security and dependency hygiene

Address issues surfaced by maintenance tooling and bring the stack current:

- Review and resolve items from [Dependabot / security](https://github.com/keithSchumacher/patterns-in-leaves/security/dependabot) (and related GitHub security alerts).
- Upgrade **Astro** and other npm dependencies to supported versions, run `astro check` / build, and fix any breaking changes.
- Sanity-check for common static-site concerns (dependency advisories, build output, no accidental secret leakage).

### 3. Add a new blog post

Publish at least one new post through the existing content pipeline so the site reflects current use, and so the upgraded toolchain is validated end-to-end.

## Completed in this PR

### Documentation (goal 1)

- Replaced the Astro starter **README** with a project-specific guide: content collections, routing, Markdown pipeline (remark-math, rehype-katex, custom remark plugin), styling, GitHub Pages deploy.
- Fixed invalid nested **`body`** markup in `src/pages/index.astro`.

### Dependencies & Astro upgrade (goal 2)

- Upgraded to **Astro 6.x**, current **@astrojs/check**, **@astrojs/sitemap**, **TypeScript**, **rehype-katex**, **prettier-plugin-astro**, and regenerated **package-lock.json**.
- **Node 22+** required for Astro 6: added **`engines`** in `package.json`, **`.nvmrc`**, and **`node-version: 22`** on **`withastro/action`** in the GitHub Pages workflow.
- Migrated content collections to the **Content Layer** API: **`src/content.config.ts`** with `glob()` loader (replaces `src/content/config.ts`); pages use **`entry.id`** and **`render()`** from `astro:content`; index sorts posts by **`created`** and uses root-relative **`/${post.id}`** links.
- **`npm audit`**: previous high-severity **Astro 4.x** advisories are cleared by upgrading. **5 moderate** findings remain, all transitive (**`@astrojs/check` → yaml-language-server → yaml**); no safe non-breaking fix until upstream; re-run **Dependabot** after merge to refresh alerts.

### Remaining

- **Goal 3**: add at least one new post under `src/content/post/`.

## Out of scope (unless discovered as blocking)

- Redesign or large refactors unrelated to the above.
- Changing hosting or domain setup unless required for security or builds.

---

*Branch: `revive-blog-docs-deps-post`.*
