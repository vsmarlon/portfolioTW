import type { IconName } from '../types/icons';

export const timelineItems = [
  {
    period: 'about.timeline.qqtech.period',
    title: 'about.timeline.qqtech.title',
    location: 'about.timeline.qqtech.location',
    description: 'about.timeline.qqtech.description',
    type: 'work' as const,
  },
  {
    period: 'about.timeline.unisinos.period',
    title: 'about.timeline.unisinos.title',
    location: 'about.timeline.unisinos.location',
    description: 'about.timeline.unisinos.description',
    type: 'education' as const,
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
    'about.focus.buildingOne',
    'about.focus.buildingTwo',
  ],
  learning: [
    'about.focus.learningOne',
    'about.focus.learningTwo',
  ],
};
