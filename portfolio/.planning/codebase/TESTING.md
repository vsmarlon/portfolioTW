# Testing Configuration

## Framework
- **Primary Engine:** Vitest configured in `vitest.config.ts`.
- **Environment Context:** Browser APIs heavily mocked within `src/test/setup.ts`, running explicitly in JSDOM contexts.
- **Assertion Utilities:** React Testing Library (`@testing-library/react`), supplemented with Jest DOM (`@testing-library/jest-dom`) extensions.

## Execution
- Commands are explicitly mapped in the `package.json`: `npm run test` or `npm run test:run` for pipeline verifications.

## Structure
- Test files remain exclusively co-located alongside the subjects they exercise.
- Files should be post-fixed `.test.tsx` for modules involving JSX components or `.test.ts` for strictly typed utilities.

## Best Practices
- Mock structural browser dependencies (e.g., Intersection Observers or specific Window interfaces) effectively limiting testing pollution.
- Favor behavioral driven verification (TDD methods focusing purely on user outcomes instead of inspecting internal module properties).
