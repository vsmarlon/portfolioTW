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
    period: 'Projetos autorais',
    title: 'Prática de engenharia',
    location: 'Portfólio',
    description: 'Construindo estudos que conectam produto, arquitetura, dados e experiência de uso.',
    type: 'work' as const,
  },
];

export const skills = [
  {
    category: 'Frontend',
    icon: 'grid' as IconName,
    items: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind CSS'],
  },
  { category: 'Backend', icon: 'server' as IconName, items: ['NestJS', 'Node.js', 'PostgreSQL', 'Oracle'] },
  { category: 'DevOps', icon: 'cogs' as IconName, items: ['Docker', 'Git', 'CI/CD'] },
  { category: 'Mobile', icon: 'mobile' as IconName, items: ['Flutter'] },
];

export const currentFocus = {
  building: [
    'Interfaces React e Flutter com contratos claros e foco em experiência.',
    'Serviços NestJS e integrações que tornam as decisões de domínio legíveis.',
  ],
  learning: [
    'Modelagem e operação de dados com PostgreSQL e Oracle.',
    'Arquitetura full stack com eventos, cache e integrações externas.',
  ],
};
