import { describe, expect, it } from 'vitest';
import { failure, success } from './result';

describe('ResponseEntity helpers', () => {
  it('creates a success response with payload data', () => {
    const response = success({ id: 1 });

    expect(response).toEqual({
      success: true,
      data: { id: 1 },
    });
  });

  it('creates a failure response with null data and error payload', () => {
    const response = failure({ code: 'X' });

    expect(response).toEqual({
      success: false,
      data: null,
      error: { code: 'X' },
    });
  });
});

