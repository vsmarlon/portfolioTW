export interface NavItem {
  to: string;
  label: string;
  section: 'home' | 'sobre' | 'projects' | 'contact';
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Início', section: 'home' },
  { to: '/#sobre', label: 'Sobre', section: 'sobre' },
  { to: '/#projects', label: 'Projetos', section: 'projects' },
  { to: '/#contact', label: 'Contato', section: 'contact' },
];
