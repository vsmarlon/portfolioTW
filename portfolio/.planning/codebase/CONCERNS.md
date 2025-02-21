# Technical Debt & Concerns

## Brittle Verification Sequences
- The test suite frequently fractures upon seemingly minor updates to UI implementations. 
- Overly coupled implementations lacking isolated unit/behavioral testing constructs directly undermine the velocity of further expansion.

## Animation Syncing
- Implementation details surrounding the intersection tracking via `useScrollReveal.ts` lack robust test coverage.

## Focus Needed
- Restructuring tests away from snapshotting or internal DOM structural queries toward `testing-library` approved visual behavioral checkpoints.
