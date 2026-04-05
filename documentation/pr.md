# Revive blog: docs, security & deps, new post

This PR brings the **patterns-in-leaves** personal blog site back up to date after a long pause. The site is an [Astro](https://astro.build/) project (content collections, Markdown with math via remark/rehype, sitemap, etc.).

## Goals

### 1. Understand and document how the site works

The default Astro starter README is still in place; operational knowledge has faded. This step:

- Maps the real layout: content location, routing, layouts, build and deploy assumptions.
- Expands project documentation (within this PR or follow-up as appropriate) so future changes are easier—without turning the repo into a manual nobody reads.

### 2. Security and dependency hygiene

Address issues surfaced by maintenance tooling and bring the stack current:

- Review and resolve items from [Dependabot / security](https://github.com/keithSchumacher/patterns-in-leaves/security/dependabot) (and related GitHub security alerts).
- Upgrade **Astro** and other npm dependencies to supported versions, run `astro check` / build, and fix any breaking changes.
- Sanity-check for common static-site concerns (dependency advisories, build output, no accidental secret leakage).

### 3. Add a new blog post

Publish at least one new post through the existing content pipeline so the site reflects current use, and so the upgraded toolchain is validated end-to-end.

## Out of scope (unless discovered as blocking)

- Redesign or large refactors unrelated to the above.
- Changing hosting or domain setup unless required for security or builds.

---

*Branch: `revive-blog-docs-deps-post`.*
