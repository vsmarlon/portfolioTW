import type { IconName } from '../types/icons';

export const notFoundQuickLinks: Array<{ to: string; label: string; icon: IconName }> = [
  { to: '/', label: 'Voltar para o inicio', icon: 'home' },
  { to: '/#projects', label: 'Ver projetos', icon: 'grid' },
  { to: '/blog', label: 'Abrir blog e demos', icon: 'terminal' },
];
