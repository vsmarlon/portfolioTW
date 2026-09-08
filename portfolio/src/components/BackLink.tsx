import { Link } from 'react-router-dom';
import Icon from './Icon';

interface BackLinkProps {
  to: string;
  children: string;
}

const BackLink = ({ to, children }: BackLinkProps) => (
  <Link
    to={to}
    className="focus-ring mb-8 inline-flex items-center gap-2 font-mono text-sm text-stone-600 transition-colors hover:text-[#a1006b] dark:text-stone-300 dark:hover:text-fuchsia-200"
  >
    <Icon name="arrow-left" />
    {children}
  </Link>
);

export default BackLink;
