export interface NavItem {
  to: string;
  label: string;
  section: 'home' | 'projects' | 'systems' | 'about' | 'writing' | 'contact';
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Início', section: 'home' },
  { to: '/#projects', label: 'Projetos', section: 'projects' },
  { to: '/#systems', label: 'Sistemas', section: 'systems' },
  { to: '/#about', label: 'Sobre', section: 'about' },
  { to: '/#writing', label: 'Escrita', section: 'writing' },
  { to: '/#contact', label: 'Contato', section: 'contact' },
];
