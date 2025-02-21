# Architecture Overview

## Application Pattern
This is a Single Page Application (SPA) driven by React 19. The application state is primarily local and context-driven, relying on minimal external data.

## Entry Point
- **HTML:** `index.html` loads the core script.
- **Bootstrap:** `src/main.tsx` mounts the application via \`ReactDOM.createRoot()\` onto `<div id="app">`.
- **Root Component:** `src/app.tsx` establishes the global providers and routing schema.

## Layers and Data Flow
- **State Management:** Handled largely through local React Contexts (`ThemeContext.tsx`, `ActiveSectionContext.tsx`).
- **Routing:** Controlled via standard `react-router-dom` definitions in `src/app.tsx`, distinguishing between the main portfolio landing page (`/`) and blog pages (`/blog`, `/blog/:slug`).
- **Data Hydration (Remote):** Minimal remote fetching logic utilizes `@tanstack/react-query`, isolated strictly to components like the `GitHubRepoExplorer`.

## Abstractions
- **Animations:** Extracted into Custom Hooks (`useScrollReveal.ts`) employing the Intersection API to trigger CSS classes (`revealed`).
- **Styling tokens:** Kept in `src/index.css` leveraging Tailwind CSS v4 directives combined with modular `@theme` and `@keyframes` definitions.
