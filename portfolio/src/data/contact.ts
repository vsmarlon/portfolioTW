import type { IconName } from '../types/icons';

export const contactLinks = [
  {
    type: 'email',
    href: 'mailto:vsmarlonvargas@gmail.com',
    label: 'contactData.email.label',
    value: 'vsmarlonvargas@gmail.com',
    description: 'contactData.email.description',
    actionLabel: 'contactData.email.action',
    icon: 'envelope' as IconName,
    iconBg: 'bg-[#a1006b]/10 group-hover:bg-[#a1006b]/20 dark:bg-fuchsia-200/10',
    iconColor: 'text-[#73004c] dark:text-fuchsia-200',
  },
  {
    type: 'linkedin',
    href: 'https://www.linkedin.com/in/marlon-vargas-917618223/',
    label: 'contactData.linkedin.label',
    value: '/marlon-vargas',
    description: 'contactData.linkedin.description',
    actionLabel: 'contactData.linkedin.action',
    icon: 'linkedin' as IconName,
    iconBg: 'bg-stone-900/5 group-hover:bg-stone-900/10 dark:bg-stone-100/10',
    iconColor: 'text-stone-800 dark:text-stone-200',
  },
  {
    type: 'github',
    href: 'https://github.com/vsmarlon',
    label: 'contactData.github.label',
    value: '@vsmarlon',
    description: 'contactData.github.description',
    actionLabel: 'contactData.github.action',
    icon: 'github' as IconName,
    iconBg: 'bg-stone-900/5 group-hover:bg-stone-900/10 dark:bg-stone-100/10',
    iconColor: 'text-stone-800 dark:text-stone-200',
  },
];

export const contactHighlights = [
  {
    label: 'contactData.highlights.format',
    value: 'contactData.highlights.formatValue',
  },
  {
    label: 'contactData.highlights.focus',
    value: 'contactData.highlights.focusValue',
  },
  {
    label: 'contactData.highlights.priority',
    value: 'contactData.highlights.priorityValue',
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
