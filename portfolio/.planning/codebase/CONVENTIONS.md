# Coding Conventions

## Core Styles
- Modern functional React components leveraging the Context API hooks (`useContext`, `useCallback`, etc.).
- Strict adherence to TypeScript type boundaries; properties and state structs should remain explicitly typed.

## Naming Patterns
- **Components:** PascalCase (e.g., `ActiveSectionProvider.tsx`, `Hero.tsx`).
- **Hooks:** Prefix with `use` and camelCase (e.g., `useScrollReveal.ts`).
- **Data Arrays/Utilities:** camelCase (e.g., `blogPosts.ts`, `clsx.ts`).

## Error Handling & Reliability
- Relies extensively on `react-router-dom` catchall mechanisms like `NotFound.tsx` handling gracefully nested routes and missing configurations.
- Minimal data processing allows functions to bypass robust defensive checks; however, components relying on fetched variables (`GitHubRepoExplorer.tsx`) correctly defer to `@tanstack/react-query` inherent `isError` or `isLoading` properties.

## Styling
- Explicitly avoiding `AOS` packages or complex DOM querying in favor of pure Tailwind animations via `@theme` definitions combined with IntersectionObserver callbacks.
- Maintains visual integrity employing gradients, translucent backgrounds, and explicitly configured `dark:` prefixes for accessibility.
