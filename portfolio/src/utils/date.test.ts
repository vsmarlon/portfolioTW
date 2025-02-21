import { describe, expect, it } from 'vitest';
import { formatCompactNumber, formatPtBrDate } from './date';

describe('date utils', () => {
  it('formats pt-BR dates from ISO strings', () => {
    expect(formatPtBrDate('2026-03-23T12:00:00.000Z')).toMatch(/2026/);
  });

  it('returns fallback label for invalid date values', () => {
    expect(formatPtBrDate('not-a-date')).toBe('Data indisponivel');
  });

  it('formats compact pt-BR numbers', () => {
    expect(formatCompactNumber(1200).toLowerCase()).toContain('mil');
  });
});

