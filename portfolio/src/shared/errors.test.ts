import { describe, expect, it } from 'vitest';
import { mapUnknownError } from './errors';

describe('mapUnknownError', () => {
  it('maps GitHub 403 responses to RATE_LIMITED', () => {
    const mapped = mapUnknownError({
      isAxiosError: true,
      response: { status: 403 },
    });

    expect(mapped.code).toBe('RATE_LIMITED');
    expect(mapped.status).toBe(403);
  });

  it('keeps non-rate-limited HTTP responses as HTTP_ERROR', () => {
    const mapped = mapUnknownError({
      isAxiosError: true,
      response: { status: 500 },
    });

    expect(mapped.code).toBe('HTTP_ERROR');
    expect(mapped.status).toBe(500);
  });
});
