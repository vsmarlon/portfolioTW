import type { BlogPost, BlogPostMeta } from '../types/blog';
import { failure, success, type ResponseEntity } from '../shared/result';
import { formatPtBrDate } from '../utils/date';
import { devError } from '../utils/devLog';
import { getReadingTime } from '../utils/readingTime';
import type { Locale } from '../contexts/LocaleContext';

const rawPosts = import.meta.glob('../content/blog/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseArrayValue(value: string): string[] {
  const normalized = value.replace(/^\[/, '').replace(/\]$/, '');

  return normalized
    .split(',')
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function getRequiredField(record: Record<string, string>, key: string): ResponseEntity<string, string> {
  const value = record[key];

  if (!value) {
    return failure(`Post markdown is missing required field: ${key}`);
  }

  return success(value);
}

function parseFrontmatter(
  source: string,
): ResponseEntity<{ meta: BlogPostMeta; body: string }, string> {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return failure('Post markdown is missing frontmatter.');
  }

  const [, frontmatter, body] = match;
  const lines = frontmatter
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const entries: Array<readonly [string, string]> = [];
  for (const line of lines) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      return failure(`Invalid frontmatter line: ${line}`);
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    entries.push([key, value]);
  }

  const record = Object.fromEntries(entries);
  const title = getRequiredField(record, 'title');
  if (!title.success) return title;

  const slug = getRequiredField(record, 'slug');
  if (!slug.success) return slug;

  const excerpt = getRequiredField(record, 'excerpt');
  if (!excerpt.success) return excerpt;

  const publishedAt = getRequiredField(record, 'publishedAt');
  if (!publishedAt.success) return publishedAt;

  const category = getRequiredField(record, 'category');
  if (!category.success) return category;

  const tags = getRequiredField(record, 'tags');
  if (!tags.success) return tags;

  return success({
    meta: {
      title: title.data,
      slug: slug.data,
      excerpt: excerpt.data,
      publishedAt: publishedAt.data,
      category: category.data,
      tags: parseArrayValue(tags.data),
      featured: record.featured === 'true',
      hasDemo: record.hasDemo === 'true',
    },
    body: body.trim(),
  });
}

function formatPostDate(date: string, locale: Locale): string {
  return locale === 'en'
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(`${date}T00:00:00`))
    : formatPtBrDate(`${date}T00:00:00`);
}

const parsedPosts = Object.entries(rawPosts).flatMap(([path, source]) => {
  const parseResult = parseFrontmatter(source);
  if (!parseResult.success) {
    devError(`Ignoring invalid blog post at ${path}`, parseResult.error);
    return [];
  }

  const { meta, body } = parseResult.data;

  return [
    {
      ...meta,
      body,
       formattedDate: formatPostDate(meta.publishedAt, path.includes('/en/') ? 'en' : 'pt-BR'),
       locale: (path.includes('/en/') ? 'en' : 'pt-BR') as Locale,
      readTime: getReadingTime(body),
    },
  ];
});

const FALLBACK_BLOG_POST: BlogPost = {
  title: 'Conteúdo temporariamente indisponível',
  slug: 'conteudo-indisponivel',
  excerpt: 'Não foi possível carregar os artigos no momento.',
  publishedAt: '2026-01-01',
  readTime: getReadingTime('O conteúdo do blog não foi carregado corretamente.'),
  category: 'Sistema',
  tags: ['status'],
  featured: true,
  hasDemo: false,
  body: 'O conteúdo do blog não foi carregado corretamente.',
  formattedDate: formatPostDate('2026-01-01', 'pt-BR'),
};

const postsByLocale: Record<Locale, BlogPost[]> = {
  'pt-BR': parsedPosts.filter((post) => post.locale === 'pt-BR'),
  en: parsedPosts.filter((post) => post.locale === 'en'),
};

function postsFor(locale: Locale): BlogPost[] {
  return [...(postsByLocale[locale].length > 0 ? postsByLocale[locale] : [FALLBACK_BLOG_POST])]
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export function getBlogPosts(locale: Locale): BlogPost[] { return postsFor(locale); }

export function getLocalizedBlogPostBySlug(slug: string | undefined, locale: Locale): BlogPost | undefined {
  return getBlogPosts(locale).find((post) => post.slug === slug);
}
