import type { IconName } from '../types/icons';

export const contactLinks = [
  {
    type: 'email',
    href: 'mailto:vsmarlonvargas@gmail.com',
    label: 'Email',
    value: 'vsmarlonvargas@gmail.com',
    description: 'Canal ideal para propostas, entrevistas e alinhamentos iniciais.',
    actionLabel: 'Responder em até 24h',
    icon: 'envelope' as IconName,
    iconBg: 'bg-[#a1006b]/10 group-hover:bg-[#a1006b]/20 dark:bg-fuchsia-200/10',
    iconColor: 'text-[#73004c] dark:text-fuchsia-200',
  },
  {
    type: 'linkedin',
    href: 'https://www.linkedin.com/in/marlon-vargas-917618223/',
    label: 'LinkedIn',
    value: '/marlon-vargas',
    description: 'Bom para networking, oportunidades e conversas sobre carreira e produto.',
    actionLabel: 'Conexão profissional',
    icon: 'linkedin' as IconName,
    iconBg: 'bg-stone-900/5 group-hover:bg-stone-900/10 dark:bg-stone-100/10',
    iconColor: 'text-stone-800 dark:text-stone-200',
  },
  {
    type: 'github',
    href: 'https://github.com/vsmarlon',
    label: 'GitHub',
    value: '@vsmarlon',
    description: 'Veja código, experimentos e a evolução técnica dos meus projetos.',
    actionLabel: 'Ver projetos publicados',
    icon: 'github' as IconName,
    iconBg: 'bg-stone-900/5 group-hover:bg-stone-900/10 dark:bg-stone-100/10',
    iconColor: 'text-stone-800 dark:text-stone-200',
  },
];

export const contactHighlights = [
  {
    label: 'Formato',
    value: 'Remoto, híbrido ou freelance',
  },
  {
    label: 'Foco',
    value: 'Full-stack, com front-end forte',
  },
  {
    label: 'Prioridade',
    value: 'Produtos com impacto real e boa experiência',
  },
];

export const socialLinks = [
  {
    href: 'https://github.com/vsmarlon',
    icon: 'github' as IconName,
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/marlon-vargas-917618223/',
    icon: 'linkedin' as IconName,
    label: 'LinkedIn',
  },
];
