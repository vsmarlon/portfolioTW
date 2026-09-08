import { describe, expect, it } from 'vitest';
import { getReadingTime } from './readingTime';

describe('getReadingTime', () => {
  it('returns one minute for empty and short bodies', () => {
    expect(getReadingTime('')).toBe('~1 min de leitura');
    expect(getReadingTime('Texto curto.')).toBe('~1 min de leitura');
  });

  it('weights code more slowly than prose', () => {
    const code = Array.from({ length: 71 }, () => 'token').join(' ');

    expect(getReadingTime('```ts\n' + code + '\n```')).toBe('~2 min de leitura');
  });

  it('does not count fence markers or language identifiers as code', () => {
    expect(getReadingTime('```ts\n```')).toBe('~1 min de leitura');
    expect(getReadingTime('```\nconst value = true;\n```')).toBe('~1 min de leitura');
  });
});
