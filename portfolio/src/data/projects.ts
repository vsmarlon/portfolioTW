export type ProjectTone = 'berry' | 'blue' | 'green' | 'amber' | 'violet' | 'rose';

export type ProjectItem = {
  title: string;
  repositoryUrl: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  image?: string;
  visual: string;
  tone: ProjectTone;
  description: string;
  tools: string[];
  eyebrow: string;
  details?: string[];
};

export const projectsData: ProjectItem[] = [
  {
    title: 'Freebay',
    repositoryUrl: 'https://github.com/vsmarlon/freebay',
    caseStudyUrl: '/projects/freebay',
    image: '/freebay-login.webp',
    visual: 'FB',
    tone: 'berry',
    description: 'projectsData.freebayDescription',
    tools: ['React', 'Flutter', 'NestJS', 'PostgreSQL'],
    eyebrow: 'projectsData.freebayEyebrow',
  },
  {
    title: 'ChatBot RAG',
    repositoryUrl: 'https://github.com/vsmarlon/chatbotRAG',
    image: '/chat.webp',
    visual: 'RAG',
    tone: 'violet',
    description: 'projectsData.ragDescription',
    tools: ['React', 'Python', 'PostgreSQL', 'Tailwind CSS'],
    eyebrow: 'projectsData.ragEyebrow',
    details: [
      'projectsData.ragDetail1',
      'projectsData.ragDetail2',
    ],
  },
  {
    title: 'MoviesFlutter',
    repositoryUrl: 'https://github.com/vsmarlon/MoviesFlutter',
    visual: 'MOV',
    tone: 'blue',
    description: 'projectsData.moviesDescription',
    tools: ['Flutter', 'TypeScript', 'Express', 'PostgreSQL'],
    eyebrow: 'projectsData.moviesEyebrow',
  },
  {
    title: 'Pokédex & Battle Arena',
    repositoryUrl: 'https://github.com/vsmarlon/pokedex',
    visual: 'PKM',
    tone: 'amber',
    description: 'projectsData.pokedexDescription',
    tools: ['TypeScript', 'Tailwind CSS', 'Vite', 'PokéAPI'],
    eyebrow: 'projectsData.pokedexEyebrow',
  },
  {
    title: 'AnimeGhost',
    repositoryUrl: 'https://github.com/vsmarlon/MyAnimeAPI',
    liveUrl: 'https://animeghost.vercel.app/',
    image: '/Capturar.webp',
    visual: 'ANI',
    tone: 'rose',
    description: 'projectsData.animeDescription',
    tools: ['HTML', 'CSS', 'JavaScript', 'Jikan API'],
    eyebrow: 'projectsData.animeEyebrow',
  },
];
