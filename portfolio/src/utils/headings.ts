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

export function extractHeadings(markdown: string, canonicalMarkdown = markdown): ContentSection[] {
  const sections: ContentSection[] = [];
  const canonical = extractHeadingLabels(canonicalMarkdown);
  let index = 0;
  for (const line of markdown.split('\n')) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const label = match[2].replace(/[*_`[\]()#]/g, '').trim();
    if (!label) continue;
    sections.push({ id: slugifyHeading(canonical[index]?.label ?? label), label, depth: match[1].length });
    index += 1;
  }
  return sections;
}

function extractHeadingLabels(markdown: string): Array<{ label: string; depth: number }> {
  return markdown.split('\n').flatMap((line) => {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) return [];
    const label = match[2].replace(/[*_`[\]()#]/g, '').trim();
    return label ? [{ label, depth: match[1].length }] : [];
  });
}
