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
      title: 'MoviesFlutter: integração de catálogo, identidade e persistência',
      slug: 'movies-flutter-produto-completo',
      excerpt: 'Como dados do TMDB, cache local e favoritos persistentes assumem responsabilidades distintas no mesmo aplicativo.',
      category: 'Estudo de projeto',
      formattedDate: '21 de out. de 2026',
      readTime: '~8 min de leitura',
    },
    {
      title: 'Pokédex: arquitetura da informação e regras de interação',
      slug: 'pokedex-interface-regras',
      excerpt: 'Busca, filtros e batalhas explicitam como a interface organiza dados e comunica os limites das regras implementadas.',
      category: 'Estudo de projeto',
      formattedDate: '08 de out. de 2026',
      readTime: '~7 min de leitura',
    },
    {
      title: 'Arquitetura full stack como evidência de trabalho',
      slug: 'full-stack-architecture-evidence',
      excerpt: 'Como fluxos, contratos e limites arquiteturais transformam projetos de portfólio em evidências técnicas verificáveis.',
      category: 'Arquitetura',
      formattedDate: '12 de abr. de 2026',
      readTime: '~7 min de leitura',
    },
  ],
  en: [
    {
      title: 'MoviesFlutter: integrating catalog, identity, and persistence',
      slug: 'movies-flutter-complete-product',
      excerpt: 'How TMDB data, local caching, and persistent favorites assume distinct responsibilities within one application.',
      category: 'Project study',
      formattedDate: 'Oct 21, 2026',
      readTime: '~7 min read',
    },
    {
      title: 'Pokédex: information architecture and interaction rules',
      slug: 'pokedex-interface-rules',
      excerpt: 'Search, filters, and battles show how the interface organizes data and communicates the limits of implemented rules.',
      category: 'Project study',
      formattedDate: 'Oct 8, 2026',
      readTime: '~7 min read',
    },
    {
      title: 'Full-stack architecture as evidence of work',
      slug: 'full-stack-architecture-evidence',
      excerpt: 'How flows, contracts, and architectural boundaries turn portfolio projects into verifiable technical evidence.',
      category: 'Architecture',
      formattedDate: 'Apr 12, 2026',
      readTime: '~7 min read',
    },
  ],
};

export function getBlogHighlights(locale: Locale): BlogHighlight[] {
  return highlights[locale];
}
