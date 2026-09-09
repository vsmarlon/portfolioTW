export type ProjectItem = {
  title: string;
  url: string;
  image: string;
  description: string;
  tools: string[];
  eyebrow: string;
  details?: string[];
};

export const projectsData: ProjectItem[] = [
  {
    title: 'Freebay',
    url: '/projects/freebay',
    image: '/freebay-login.webp',
    description: 'projectsData.freebayDescription',
    tools: ['React', 'Flutter', 'NestJS', 'PostgreSQL'],
    eyebrow: 'projectsData.freebayEyebrow',
  },
  {
    title: 'ChatBot RAG',
    url: 'https://github.com/vsmarlon/chatbotRAG',
    image: '/chat.webp',
    description: 'projectsData.ragDescription',
    tools: ['React', 'Python', 'PostgreSQL', 'Tailwind CSS'],
    eyebrow: 'projectsData.ragEyebrow',
    details: [
      'projectsData.ragDetail1',
      'projectsData.ragDetail2',
      'projectsData.ragDetail3',
    ],
  },
  {
    title: 'Buscador de Animes',
    url: 'https://animeghost.vercel.app/',
    image: '/Capturar.webp',
    description: 'projectsData.animeDescription',
    tools: ['HTML', 'CSS', 'JavaScript', 'API Jikan v4'],
    eyebrow: 'projectsData.animeEyebrow',
  },
  {
    title: 'To-do List',
    url: 'https://todolist-drab-one.vercel.app/',
    image: '/todolist.webp',
    description: 'projectsData.todoDescription',
    tools: ['HTML', 'CSS', 'JavaScript'],
    eyebrow: 'projectsData.todoEyebrow',
  },
];

