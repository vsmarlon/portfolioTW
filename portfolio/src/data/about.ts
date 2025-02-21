import { getCurrentSemester } from '../utils/semester';
import type { IconName } from '../types/icons';

export const timelineItems = [
  {
    period: getCurrentSemester(2024, 8, -1),
    title: 'Análise e Desenvolvimento de Sistemas',
    location: 'Faculdade',
    description:
      'Aprofundando conhecimentos em arquitetura de software, programação orientada a objetos e desenvolvimento web full-stack.',
    type: 'education' as const,
  },
  {
    period: 'Em breve',
    title: 'Novos desafios',
    location: 'Oportunidades',
    description: 'Buscando crescer em desafios que combinam produto, engenharia e impacto real.',
    type: 'work' as const,
  },
];

export const skills = [
  {
    category: 'Frontend',
    icon: 'grid' as IconName,
    items: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind CSS'],
  },
  { category: 'Backend', icon: 'server' as IconName, items: ['Python', 'Node.js', 'PostgreSQL', 'Redis'] },
  { category: 'DevOps', icon: 'cogs' as IconName, items: ['Docker', 'Git', 'CI/CD'] },
  { category: 'Mobile', icon: 'mobile' as IconName, items: ['Flutter'] },
];

export const currentFocus = {
  building: [
    'Interfaces React com mais identidade visual e foco em performance percebida.',
    'Demos técnicos que mostram processo de engenharia, não só resultado final.',
  ],
  learning: [
    'Padrões full-stack com dados assíncronos, cache e UX resiliente.',
    'Arquitetura de aplicações com Python, filas, banco relacional e integrações de IA.',
  ],
};
