import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCurrentSemester } from './semester';

describe('getCurrentSemester', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 1st semester at start month', () => {
    vi.setSystemTime(new Date(2024, 7, 1)); // August 2024
    expect(getCurrentSemester(2024, 8)).toBe('Cursando (1º Semestre)');
  });

  it('returns 2nd semester after 6 months', () => {
    vi.setSystemTime(new Date(2025, 1, 1)); // February 2025
    expect(getCurrentSemester(2024, 8)).toBe('Cursando (2º Semestre)');
  });

  it('applies offset correctly', () => {
    vi.setSystemTime(new Date(2024, 7, 1)); // August 2024
    expect(getCurrentSemester(2024, 8, -1)).toBe('Cursando (0º Semestre)');
  });

  it('increments each 6 months', () => {
    vi.setSystemTime(new Date(2025, 7, 1)); // August 2025 = 12 months = 2 semesters
    expect(getCurrentSemester(2024, 8)).toBe('Cursando (3º Semestre)');
  });
});
