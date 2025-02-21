import { useCallback, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useActiveSection } from '../contexts/ActiveSectionContext';
import { navItems } from '../data/navigation';
import { scrollToHash, scrollToTop } from '../utils/scroll';

const NAV_SECTION_SET = new Set(navItems.map((item) => item.section));

export function useNavigateToSection() {
  const location = useLocation();
  const { setActiveSection } = useActiveSection();

  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>, to: string) => {
      const url = new URL(to, window.location.origin);
      const targetPath = url.pathname || '/';
      const targetHash = url.hash;

      if (location.pathname === targetPath) {
        e.preventDefault();
        if (targetHash) {
          const didScroll = scrollToHash(targetHash, { smooth: true });
          const targetSection = targetHash.replace(/^#/, '');
          if (didScroll && NAV_SECTION_SET.has(targetSection as (typeof navItems)[number]['section'])) {
            setActiveSection(targetSection);
          }
          window.history.pushState(null, '', to);
        } else {
          scrollToTop({ smooth: true });
          setActiveSection('home');
          window.history.pushState(null, '', '/');
        }
      }
    },
    [location.pathname, setActiveSection],
  );
}
