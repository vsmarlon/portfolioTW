# portfolioTW

Personal portfolio built with React, TypeScript, Tailwind CSS, and Vite. The application lives in this directory.

## Local development

Run commands from `portfolio/`:

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run test:run
npm run lint
npm run build
node scripts/portfolio-smoke.mjs
```

`portfolio-smoke.mjs` starts Vite and uses a browser to check responsive widths, themes, localized home and blog pages, article anchors, and CV pages. It writes screenshots and `summary.json` under `C:\Users\Qiyana\AppData\Local\Temp\opencode\portfolio-smoke`.

## Content and routes

- UI translations are `src/locales/en.json` and `src/locales/pt-BR.json`.
- Resume copy is separate in `src/locales/resume-en.json` and `src/locales/resume-pt-BR.json`; shared facts and localized PDF paths live in `src/data/resume.ts` and `src/data/resumeLinks.ts`.
- `src/components/Resume.css` defines the A4 print layout. `/cv/en` and `/cv/pt-BR` render the dedicated resume viewer without the normal site chrome.
- The viewer links to static PDFs in `public/cv/` in a new tab. These links intentionally do not force a download. Keep the Canva originals until the owner explicitly removes them.

The CV generator is opt-in:

```bash
npx playwright install chromium
npm run cv:generate
```

It uses Playwright in development to render both localized viewers, checks that each fits exactly one A4 page, and writes the PDFs to `public/cv/`. No PDF-generation library is shipped in the application.

## Git hooks

`npm run install:hooks` is opt-in. It copies `portfolio/.githooks/pre-commit` into the repository's Git hooks directory; inspect an existing hook before running it because the target hook is replaced. The hook checks staged authored runtime files with the effect restriction lint. CI also runs the full lint command.

Authored runtime code has a project-level ban on React effect APIs, including wrappers and aliases around `useEffect`, `useLayoutEffect`, and `useInsertionEffect`. Prefer render derivation, event handlers, CSS, callback refs with cleanup, or `useSyncExternalStore` as appropriate. This is project policy, not a blanket recommendation about React. See [React's effect guidance](https://react.dev/learn/you-might-not-need-an-effect).
