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
    iconBg: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
    iconColor: 'text-cyan-500',
  },
  {
    type: 'linkedin',
    href: 'https://www.linkedin.com/in/marlon-vargas-917618223/',
    label: 'LinkedIn',
    value: '/marlon-vargas',
    description: 'Bom para networking, oportunidades e conversas sobre carreira e produto.',
    actionLabel: 'Conexão profissional',
    icon: 'linkedin' as IconName,
    iconBg: 'bg-blue-500/10 group-hover:bg-blue-500/20',
    iconColor: 'text-blue-500',
  },
  {
    type: 'github',
    href: 'https://github.com/vsmarlon',
    label: 'GitHub',
    value: '@vsmarlon',
    description: 'Veja código, experimentos e a evolução técnica dos meus projetos.',
    actionLabel: 'Ver projetos publicados',
    icon: 'github' as IconName,
    iconBg: 'bg-slate-500/10 group-hover:bg-slate-500/20',
    iconColor: 'text-slate-700 dark:text-slate-300',
  },
];

export const contactHighlights = [
  {
    label: 'Formato',
    value: 'Remoto, híbrido ou freelance',
  },
  {
    label: 'Foco',
    value: 'Front-end forte com evolução full-stack',
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
