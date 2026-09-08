# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

Personal professional portfolio , in Portuguese (BR) built with React 19, TypeScript, Tailwind CSS v4, and Vite.

- Repository root contains docs like `CLAUDE.md`, and this file.
- The application itself lives entirely in `portfolio/`.
- Run app commands from `portfolio/`, not the repo root.

## Commands

All commands must be run from the `portfolio/` directory:

```bash
cd portfolio

# Development
npm run dev              # Start dev server on localhost:5173

# Build & Preview
npm run build            # TypeScript check + production build
npm run preview          # Preview production build locally

# Linting
npm run lint             # Run ESLint on all TypeScript/React files

# Testing
npm run test             # Run Vitest in watch mode
npm run test:run         # Run all tests once and exit
npm test path/to/file    # Run a specific test file (watch mode)
npm run test:run path/to/file.test.tsx  # Run specific test once
```

### Running Single Tests

```bash
# Examples for running individual tests:
npm test src/components/Contact.test.tsx
npm run test:run src/utils/date.test.ts
npm test -- --grep "renders the contact pitch"  # Filter by test name
```

## Current Architecture

- `portfolio/src/main.tsx` bootstraps the app and imports `portfolio/src/app.tsx`.
- `portfolio/src/app.tsx` sets up `QueryClientProvider`, `ThemeProvider`, `ActiveSectionProvider`, router, background, routes, header, and footer.
- Routes:
  - `/` renders the single-page portfolio sections.
  - `/blog` renders the article listing with sidebar navigation.
  - `/blog/:slug` renders individual blog posts.
  - `*` renders `portfolio/src/components/NotFound.tsx`.

## Important Implementation Notes

- `ThemeContext` persists the selected theme in `localStorage`, syncs with `prefers-color-scheme`, and updates both `data-theme` and the `dark` class on `<html>`.
- `ActiveSectionContext` uses `IntersectionObserver` to track the section currently in view.
- Scroll reveal animations are handled by `portfolio/src/hooks/useScrollReveal.ts`; AOS custom scroll implementation is not used.
- Blog posts are authored as Markdown files under `portfolio/src/content/blog/`.
- Blog post metadata and routing data are derived in `portfolio/src/data/blogPosts.ts` via `import.meta.glob`.
- The blog case-study demo uses `@tanstack/react-query` for fetching/caching and `@mui/x-data-grid` for the repository explorer.
- Hero tech icons are rendered via `portfolio/src/components/TechIcon.tsx` using inline SVGs for reliability.

## Code Style Guidelines

### File Naming & Organization

- **Components**: PascalCase (e.g., `Contact.tsx`, `BlogPostView.tsx`)
- **Data/Utils/Hooks**: camelCase (e.g., `about.ts`, `useScrollReveal.ts`)
- **Types**: camelCase (e.g., `icons.ts`)
- **Tests**: Match source file with `.test.tsx` or `.test.ts` suffix

### Import Order

Follow this import order (seen in `app.tsx`):

1. React imports (`react`, `react-dom`)
2. Third-party libraries (`react-router-dom`, `@tanstack/react-query`)
3. Context providers (`./contexts/*`)
4. Components (`./components/*`)
5. Hooks (`./hooks/*`)
6. Utils (`./utils/*`)
7. Types (`./types/*`)
8. Data (`./data/*`)

### TypeScript Guidelines

- Use **strict mode** (enabled in `tsconfig.app.json`)
- Prefer `type` over `interface` for simple type definitions
- Use explicit return types for exported functions
- Avoid `any`; use `unknown` for truly unknown types
- Use `as const` for readonly arrays/objects (see `about.ts`)
- Export types inline: `export type Theme = 'dark' | 'light'`

### React Patterns

**Functional Components**:
```typescript
// Default export for page/section components
const About = () => {
  // hooks first
  const reveal = useScrollReveal();
  
  // logic
  
  // return JSX
  return <section>...</section>;
};

export default About;
```

**Named Exports for utilities/contexts**:
```typescript
export function ThemeProvider({ children }: { children: ReactNode }) {
  // implementation
}

export function useTheme() {
  // implementation
}
```

**Hooks**:
- Use `useCallback` for stable function references
- Use `useRef` for mutable values that don't trigger re-renders
- Custom hooks start with `use` prefix

**Context Pattern**:
- Provide fallback values for contexts (see `ThemeContext.tsx`)
- Use `devWarn` for development warnings when context is missing
- Create custom hook for consuming context (`useTheme`, not raw `useContext`)

### Error Handling & Logging

Use the `devLog` utilities for development-only logging:

```typescript
import { devWarn, devError } from '../utils/devLog';

// These only run in development mode
devWarn('useTheme used without ThemeProvider');
devError('Failed to load data', error);
```

### Styling Conventions

- Use Tailwind classes directly in JSX
- Extract repeated class strings into `const` variables (see `About.tsx`):
  ```typescript
  const focusColumnClassName = 'py-5 first:pt-0 last:pb-0';
  ```
- Use `classNames` utility for conditional classes:
  ```typescript
  import { classNames } from '../utils/classNames';
  classNames('base-class', isActive && 'active-class');
  ```
- current design system: cyan/blue accents, glassy cards, soft gradients
- Favor one strong parent surface per section; use borders to separate content

### Testing Guidelines

- Use Vitest + React Testing Library
- Setup file: `portfolio/src/test/setup.ts` (mocks browser APIs)
- Wrap components with required providers:
  ```typescript
  const Providers = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  
  render(<Contact />, { wrapper: Providers });
  ```
- Test user-facing behavior, not implementation details
- Use `data-testid` sparingly, prefer accessible queries

### Icon System

- All icons defined as union type in `portfolio/src/types/icons.ts`
- Use `Icon` component, not direct SVG imports:
  ```typescript
  import Icon from './Icon';
  <Icon name="github" />
  ```
- When adding icons: update `IconName` type first, then add SVG to `Icon.tsx`

### Performance Considerations

- Lazy load heavy components (e.g., `Blog` in `app.tsx`)
- Use `Suspense` with `LoadingScreen` fallback
- Check performance mode via `usePerformanceMode` hook
- Respect `prefers-reduced-motion` (handled in `useScrollReveal`)

## Testing And Validation

- Use `npm run lint` for static checks.
- Use `npm run build` for TypeScript + production build verification.
- Use `npm run test:run` for the Vitest suite.
- `portfolio/src/test/setup.ts` mocks browser APIs used by routing, observers, and the MUI grid.
- There is no backend or database in this repo.

## Editing Conventions

- Keep component files in PascalCase.
- Keep data and utility files in camelCase.
- Favor small, local changes that match the current code style.
- Do not move app code out of `portfolio/` unless explicitly asked.
- Content is written in **Portuguese (BR)**, but agent documentation stays in English.
- When modifying Portuguese content, maintain natural, professional tone.
