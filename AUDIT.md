# Portfolio Audit and Next Steps

> Current state: React 19 + TypeScript + Tailwind CSS v4 + Vite 6.
> All app code lives inside `portfolio/`.
> This file tracks what is already in place after the 2026 blog rebuild and what still makes sense to improve next.

---

## Current Status

The codebase is no longer in the old tabbed blog-demo state.

- The scroll progress bar has been fully removed from the app surface.
- `/blog` is now article-first instead of demo-first.
- Blog posts are authored in Markdown and resolved through a typed content layer.
- The blog has dedicated detail routes at `/blog/:slug`.
- The desktop blog layout now uses a bordered sidebar, with a dropdown navigation pattern on mobile.
- The old synthetic log-viewer demo has been replaced by a GitHub repository explorer built with MUI DataGrid and React Query.
- The blog now ships with 3 real posts instead of one hardcoded article block.
- The project still has a custom `404` page and route coverage around the blog.

---

## What Was Added In This Pass

| # | What | Result |
|---|------|--------|
| 1 | Removed stale scroll-progress leftovers | No more dead progress-bar code or misleading docs |
| 2 | Reworked blog routing to `/blog` + `/blog/:slug` | Blog scales like a real publication |
| 3 | Added Markdown-authored post system | Content is no longer hardcoded inside React components |
| 4 | Added bordered blog sidebar + mobile dropdown nav | Clear separation between navigation and article content |
| 5 | Added 3 real Portuguese posts | Listing feels intentional instead of empty |
| 6 | Embedded the main demo inside a case-study article | Demo now supports the writing instead of owning the page |
| 7 | Added React Query | Real async fetching and cache management |
| 8 | Added MUI DataGrid | Stronger production-style table experience |
| 9 | Built GitHub repository explorer | Real remote dataset tied to the portfolio owner |
| 10 | Updated tests and browser mocks for routed blog + MUI grid | Better regression coverage for the new architecture |

---

## Current File Map

```text
portfolio/src/
  app.tsx                          - Router, providers, blog routes, 404 route
  index.css                        - Theme vars, animations, scrollbar, reveal system
  content/
    blog/                          - Markdown post sources
  data/
    blogPosts.ts                   - Markdown loading and metadata parsing
  components/
    Blog.tsx                       - Blog listing, sidebar, article detail layout
    NotFound.tsx                   - Custom 404 page
    blog/
      GitHubRepoExplorer.tsx       - Embedded MUI DataGrid case study
  test/
    setup.ts                       - Vitest globals and browser mocks
```

---

## Dependency Overview

```json
// Production
"@emotion/react"
"@emotion/styled"
"@mui/material"
"@mui/x-data-grid"
"@tanstack/react-query"
"@tanstack/react-virtual"
"react-markdown"
"react-router-dom"
"remark-gfm"

// Dev
"vitest"
"@testing-library/react"
"@testing-library/jest-dom"
"@testing-library/user-event"
"jsdom"
"tailwindcss"
"@tailwindcss/vite"
"typescript"
"eslint"
"vite"
```

---

## Still Worth Doing

### Priority 1 - Visual Identity Pass

The codebase is structurally healthier now, so the biggest remaining opportunity is still differentiation.

- Push typography further so the homepage and blog feel more authored and less template-adjacent.
- Rework the projects section into a more intentional composition rather than uniform cards.
- Tighten the About section hierarchy so it matches the stronger blog/editorial direction.

### Priority 2 - Blog Depth

The platform is in place; the next leverage is editorial quality.

- Keep publishing more Markdown posts so the listing becomes a habit, not a one-time rebuild.
- Add richer article metadata like series, related posts, or reading sequence if the archive grows.
- Consider generating RSS/XML from the Markdown source later if distribution becomes useful.

### Priority 3 - Demo Maturity

The GitHub explorer is a better proof point than the old synthetic table, but it can still get sharper.

- Add richer filters or repository facets without turning the page into a generic admin screen.
- Improve empty and rate-limit messaging for the GitHub API edge cases.
- Consider a second article-embedded demo only if it supports a specific written case study.

### Priority 4 - Performance And UX Polish

- Add a better non-blocking shell/loading experience before the app fully hydrates.
- Audit MUI DataGrid bundle impact and lazy-load or isolate more of the blog/demo surface if needed.
- Keep future icon/media additions local to avoid external dependency drift.
