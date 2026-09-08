import type { ReactNode } from 'react';

export interface ContentSection {
  id: string;
  label: string;
  depth: number;
}

// Strips accents via NFD decomposition plus the combining-marks range.
const COMBINING_MARKS = /[̀-ͯ]/g;

export function slugifyHeading(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function plainText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(plainText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return plainText((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

export function extractHeadings(markdown: string): ContentSection[] {
  const sections: ContentSection[] = [];
  for (const line of markdown.split('\n')) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const label = match[2].replace(/[*_`[\]()#]/g, '').trim();
    if (!label) continue;
    sections.push({ id: slugifyHeading(label), label, depth: match[1].length });
  }
  return sections;
}
