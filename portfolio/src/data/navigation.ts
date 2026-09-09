import type { IconName } from '../types/icons';

export interface NavItem {
  to: string;
  label: string;
  section: 'home' | 'projects' | 'systems' | 'about' | 'writing' | 'contact';
  icon: IconName;
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Início', section: 'home', icon: 'home' },
  { to: '/#projects', label: 'Projetos', section: 'projects', icon: 'grid' },
  { to: '/#systems', label: 'Sistemas', section: 'systems', icon: 'server' },
  { to: '/#about', label: 'Sobre', section: 'about', icon: 'map-pin' },
  { to: '/#writing', label: 'Escrita', section: 'writing', icon: 'pen' },
  { to: '/#contact', label: 'Contato', section: 'contact', icon: 'envelope' },
];
