export interface ProjectItem {
  title: string;
  url: string;
  image: string;
  description: string;
  tools: string[];
  featured: boolean;
  spotlight?: boolean;
  eyebrow: string;
  focus: string;
  details?: string[];
  translationKey?: string;
}

export const projectsData: ProjectItem[] = [
  {
    title: 'Freebay',
    url: '/projects/freebay',
    image: '/chat.webp',
    description: 'projectsData.freebayDescription',
    tools: ['React', 'Flutter', 'NestJS', 'PostgreSQL'],
    featured: true,
    spotlight: true,
    eyebrow: 'projectsData.freebayEyebrow',
    focus: 'projectsData.freebayFocus',
  },
  {
    title: 'ChatBot RAG',
    url: 'https://github.com/vsmarlon/chatbotRAG',
    image: '/chat.webp',
    description: 'projectsData.ragDescription',
    tools: ['React', 'Python', 'PostgreSQL', 'Tailwind CSS'],
    featured: false,
    spotlight: false,
    eyebrow: 'Projeto em foco',
    focus: 'Interface, ingestão de documentos e busca semântica',
    details: [
      'Fluxo pensado para upload, indexação e consulta com contexto recuperado antes da resposta.',
      'Backend voltado para embeddings, armazenamento vetorial e integração com modelos de linguagem.',
      'Frontend criado para explicar melhor a proposta técnica e deixar o experimento fácil de navegar.',
    ],
  },
  {
    title: 'Buscador de Animes',
    url: 'https://animeghost.vercel.app/',
    image: '/Capturar.webp',
    description: 'projectsData.animeDescription',
    tools: ['HTML', 'CSS', 'JavaScript', 'API Jikan v4'],
    featured: false,
    eyebrow: 'Case prático',
    focus: 'Consumo de API e organização de interface',
  },
  {
    title: 'To-do List',
    url: 'https://todolist-drab-one.vercel.app/',
    image: '/todolist.webp',
    description: 'projectsData.todoDescription',
    tools: ['HTML', 'CSS', 'JavaScript'],
    featured: false,
    eyebrow: 'Entrega objetiva',
    focus: 'Fundamentos de interface e lógica de interação',
  },
];
