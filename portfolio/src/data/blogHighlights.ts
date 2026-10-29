import type { Locale } from '../contexts/LocaleContext';

export type BlogHighlight = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  formattedDate: string;
  readTime: string;
};

const highlights: Record<Locale, BlogHighlight[]> = {
  'pt-BR': [
    {
      title: 'MoviesFlutter: do catálogo ao produto completo',
      slug: 'movies-flutter-produto-completo',
      excerpt: 'O que muda quando uma lista de filmes ganha autenticação e favoritos persistentes por conta.',
      category: 'Estudo de projeto',
      formattedDate: '21 de out. de 2026',
      readTime: '~8 min de leitura',
    },
    {
      title: 'Pokédex: quando a interface também explica as regras',
      slug: 'pokedex-interface-regras',
      excerpt: 'Busca, filtros, detalhes e batalhas mostram como uma interface pode organizar muitos dados sem perder clareza.',
      category: 'Estudo de projeto',
      formattedDate: '08 de out. de 2026',
      readTime: '~7 min de leitura',
    },
    {
      title: 'Arquitetura full stack como evidência de trabalho',
      slug: 'full-stack-architecture-evidence',
      excerpt: 'Como usar um portfólio para mostrar decisões de produto, contratos e limites de sistema sem transformar a apresentação em um inventário de ferramentas.',
      category: 'Arquitetura',
      formattedDate: '12 de abr. de 2026',
      readTime: '~7 min de leitura',
    },
  ],
  en: [
    {
      title: 'MoviesFlutter: from catalog to complete product',
      slug: 'movies-flutter-complete-product',
      excerpt: 'What changes when a movie list gains authentication and persistent per-account favorites.',
      category: 'Project study',
      formattedDate: 'Oct 21, 2026',
      readTime: '~7 min read',
    },
    {
      title: 'Pokédex: when the interface also explains the rules',
      slug: 'pokedex-interface-rules',
      excerpt: 'Search, filters, details, and battles show how an interface can organize a large dataset without losing clarity.',
      category: 'Project study',
      formattedDate: 'Oct 8, 2026',
      readTime: '~7 min read',
    },
    {
      title: 'Full-stack architecture as evidence of work',
      slug: 'full-stack-architecture-evidence',
      excerpt: 'How to use a portfolio to show product decisions, contracts, and system boundaries without turning the presentation into an inventory of tools.',
      category: 'Architecture',
      formattedDate: 'Apr 12, 2026',
      readTime: '~7 min read',
    },
  ],
};

export function getBlogHighlights(locale: Locale): BlogHighlight[] {
  return highlights[locale];
}
