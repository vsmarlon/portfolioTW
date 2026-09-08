# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website (Portuguese/BR) built with React 19, TypeScript, Tailwind CSS v4, and Vite. The app code lives entirely inside the `portfolio/` subdirectory, so app commands should be run from there.

## Commands

```bash
cd portfolio

npm run dev       # Start Vite dev server
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
npm run lint      # ESLint flat config
npm run test:run  # Run Vitest once
```

## Architecture

**Entry point:** `src/main.tsx` renders `<App />` from `src/app.tsx`.

**Routing:** React Router DOM v7 with three routes:
- `/` — single-page layout with sections: Home, About, Projects, Contact
- `/blog` — lazy-loaded blog/demo component
- `*` — custom `NotFound` page

**State / Context:**
- `ThemeContext` — dark/light theme toggle, persisted in `localStorage`, synced with `prefers-color-scheme`, and applied via `data-theme` plus the `dark` class on `<html>`.
- `ActiveSectionContext` — tracks the current visible section using `IntersectionObserver`.

**Data layer:** Static content lives in `src/data/` (hero, projects, about, blog, contact, navigation, not-found content).

**Styling:**
- Tailwind CSS v4 integrated via `@tailwindcss/vite`.
- Dark mode uses the custom variant `@custom-variant dark (&:is(.dark *))` in `src/index.css`.
- Theme variables, animations, reveal utilities, and shared visual treatments live in `src/index.css`.
- Hero technology icons are rendered with inline SVGs via `src/components/TechIcon.tsx`.

**Animations:** Scroll reveal effects are handled by `src/hooks/useScrollReveal.ts`. AOS is no longer used.

**Testing:** Vitest + Testing Library are configured. Browser-specific gaps like `window.scrollTo`, `matchMedia`, and `IntersectionObserver` are mocked in test setup where needed.

**Utility:** `src/utils/semester.ts` calculates the current academic semester dynamically from a start date.

## Key Conventions

- Component files use PascalCase (`Home.tsx`), data/util files use camelCase (`projects.ts`, `semester.ts`).
- The app entry is lowercase `app.tsx` (not `App.tsx`).
- Static assets (images, favicon, PDF) live in `public/` and are referenced with absolute paths.
- Content is primarily in Portuguese.
- Preserve the current visual language unless the task explicitly calls for a redesign.
- Prefer a single strong container per section; avoid card-inside-card compositions when simple borders or dividers communicate hierarchy better.
- In sections like contact, skills, current focus, and blog sidebar navigation, prefer border-separated rows/columns over stacks of mini cards.
- Keep icons simple and readable at small sizes; avoid overly detailed SVG paths for skill/category icons such as DevOps.
