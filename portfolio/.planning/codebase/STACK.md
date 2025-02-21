# Technology Stack

## Core Technologies
- **Runtime Environment:** Node.js (build), Browser (execution)
- **Language:** TypeScript (`~5.8.3`), JavaScript
- **Framework:** React (`^19.1.13`)
- **Build Tool:** Vite (`^6.3.5`)

## Dependencies
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), Emotion
- **UI Components:** Material UI (`@mui/material`, `@mui/x-data-grid`)
- **Routing:** React Router DOM (`^7.9.1`)
- **Data Fetching:** TanStack Query (`@tanstack/react-query`)
- **Virtualization:** TanStack Virtual (`@tanstack/react-virtual`)
- **Markdown Handling:** React Markdown, Remark GFM

## Development & Testing
- **Linter:** ESLint (`^9.39.4`)
- **Test Runner:** Vitest (`^4.1.1`)
- **Testing Utilities:** Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`), JSDOM

## Configuration
- `vite.config.ts`: Configures React plugin and Tailwind CSS v4 plugin.
- `package.json`: Contains standard build (`tsc -b && vite build`) and test run scripts.
- `tailwind.config.js`: Minimal tailwind setup due to v4 native Vite integration.
