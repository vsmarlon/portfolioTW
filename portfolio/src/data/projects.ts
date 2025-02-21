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
}

export const projectsData: ProjectItem[] = [
  {
    title: 'ChatBot RAG',
    url: 'https://github.com/vsmarlon/chatbotRAG',
    image: '/chat.webp',
    description:
      'Projeto de busca semântica com IA para responder perguntas a partir de documentos. A proposta combina interface web, pipeline de embeddings e persistência em PostgreSQL para transformar arquivos em respostas consultáveis.',
    tools: ['React', 'Python', 'PostgreSQL', 'Tailwind CSS'],
    featured: true,
    spotlight: true,
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
    description:
      'Aplicação para busca e exploração de animes com favoritos, consumo da API Jikan v4 e alternância entre temas claro e escuro.',
    tools: ['HTML', 'CSS', 'JavaScript', 'API Jikan v4'],
    featured: false,
    eyebrow: 'Case prático',
    focus: 'Consumo de API e organização de interface',
  },
  {
    title: 'To-do List',
    url: 'https://todolist-drab-one.vercel.app/',
    image: '/todolist.webp',
    description:
      'Projeto de base para consolidar manipulação do DOM, estado local e pequenas interações em JavaScript puro.',
    tools: ['HTML', 'CSS', 'JavaScript'],
    featured: false,
    eyebrow: 'Entrega objetiva',
    focus: 'Fundamentos de interface e lógica de interação',
  },
];
