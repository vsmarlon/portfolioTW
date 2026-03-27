export interface NavItem {
  to: string;
  label: string;
  section: 'home' | 'sobre' | 'projects' | 'terminal' | 'contact';
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Início', section: 'home' },
  { to: '/#sobre', label: 'Sobre', section: 'sobre' },
  { to: '/#projects', label: 'Projetos', section: 'projects' },
  { to: '/#terminal', label: 'Terminal', section: 'terminal' },
  { to: '/#contact', label: 'Contato', section: 'contact' },
];
