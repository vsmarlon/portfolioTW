# External Integrations

## Overview
This repository operates primarily as a standalone single-page application constructed without a dedicated backend or database.

## Client-Side Integrations
- **GitHub API:** Data fetching integration is employed within the blog functionality. Specifically, `src/components/blog/GitHubRepoExplorer.tsx` uses `@tanstack/react-query` to pull and cache repository data from GitHub remotely.

## Deployment & Hosting
- Currently, no CI/CD or explicit hosting configurations (e.g., Vercel, Netlify) are documented directly in the codebase manifest. However, the application uses Vite building (`dist/` directory output) intended for static site generation or pure static hosting.
