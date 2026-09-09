import type { MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';
import { scrollToHash } from '../utils/scroll';
import type { ContentSection } from '../utils/headings';
import Icon from './Icon';

type ReadingNavigationProps = {
  sections: ContentSection[];
  activeId?: string | null;
  label?: string;
};

export default function ReadingNavigation({ sections, activeId, label }: ReadingNavigationProps) {
  const { t } = useLocale();
  const navLabel = label ?? t('blog.inReading');
  const location = useLocation();
  const navigate = useNavigate();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const hash = event.currentTarget.hash;
    if (location.hash === hash) scrollToHash(hash);
    else void navigate({ pathname: location.pathname, search: location.search, hash });
  };

  return (
    <details className="sidebar-accordion" open>
      <summary><span className="inline-flex items-center gap-2"><Icon name="pen" />{navLabel}</span></summary>
      <nav className="accordion-body" aria-label={navLabel}>
        <ol className="reading-navigation space-y-1 text-sm">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={handleClick}
                aria-current={activeId === section.id ? 'location' : undefined}
                className={`reading-link focus-ring ${section.depth > 2 ? 'reading-link-subsection' : ''}`}
              >
                <span aria-hidden="true" className="reading-link-number">{String(index + 1).padStart(2, '0')}</span>
                <span>{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
