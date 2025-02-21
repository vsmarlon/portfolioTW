# Directory Structure

## Layout
The core workspace is confined to the `portfolio/` directory. 
- `./`: Contains root configurations (`package.json`, `.gitignore`, `eslint.config.js`).
- `src/`: Core application source files.
  - `components/`: UI components mapped in PascalCase (e.g., `Header.tsx`, `NotFound.tsx`).
    - `blog/`: Sub-components explicitly tailored for the blog ecosystem.
  - `contexts/`: React Contexts responsible for global app state (`ThemeContext.tsx`).
  - `hooks/`: Custom React Hooks.
  - `data/`: Statically defined data and mock utilities (`blogPosts.ts`).
  - `test/`: Testing configuration (`setup.ts`) along with related test fixtures.
  - `content/`: Markdown definitions acting as local static CMS for the blog.
- `public/`: Static assets deployed alongside the compilation.

## Naming Conventions
- components utilize **PascalCase** (`ComponentName.tsx`).
- utilities, contexts, hooks, and static data arrays favor **camelCase** (`useScrollReveal.ts`, `blogPosts.ts`).
- tests are strictly co-located within the components or globally mapped in `src/test/` appending `.test.ts` or `.test.tsx` modifiers.
