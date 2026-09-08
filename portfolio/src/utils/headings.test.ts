import { describe, expect, it } from 'vitest';
import { extractHeadings, plainText, slugifyHeading } from './headings';

describe('headings', () => {
  it('slugifies Portuguese headings without accents', () => {
    expect(slugifyHeading('Decisão prática')).toBe('decisao-pratica');
    expect(slugifyHeading('Matriz de decisão!')).toBe('matriz-de-decisao');
  });

  it('extracts h2 and h3 sections while ignoring h1 and body text', () => {
    const sections = extractHeadings('# Título\n\nTexto.\n\n## Critérios\n\n### Detalhe\n');
    expect(sections).toEqual([
      { id: 'criterios', label: 'Critérios', depth: 2 },
      { id: 'detalhe', label: 'Detalhe', depth: 3 },
    ]);
  });

  it('reads text out of nested React nodes', () => {
    expect(plainText(['Banco ', ['de ', 'dados']])).toBe('Banco de dados');
    expect(plainText(null)).toBe('');
  });
});
