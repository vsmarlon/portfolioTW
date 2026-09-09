import type { IconName } from '../types/icons';

export const notFoundQuickLinks: Array<{ to: string; label: string; icon: IconName }> = [
  { to: '/', label: 'notFound.home', icon: 'home' },
  { to: '/#projects', label: 'home.projects', icon: 'grid' },
  { to: '/blog', label: 'nav.blog', icon: 'pen' },
];
