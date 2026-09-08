import { useCallback, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useActiveSection } from '../contexts/ActiveSectionContext';
import { navItems } from '../data/navigation';
import { scrollToTop } from '../utils/scroll';

const NAV_SECTION_SET = new Set(navItems.map((item) => item.section));

export function useNavigateToSection() {
  const location = useLocation();
  const { setActiveSection } = useActiveSection();
  const navigate = useNavigate();

  return useCallback(
    (e: MouseEvent<HTMLAnchorElement>, to: string) => {
      const url = new URL(to, window.location.origin);
      const targetPath = url.pathname || '/';
      const targetHash = url.hash;

      if (location.pathname === targetPath) {
        e.preventDefault();
        if (targetHash) {
          const targetSection = targetHash.replace(/^#/, '');
          if (NAV_SECTION_SET.has(targetSection as (typeof navItems)[number]['section'])) {
            setActiveSection(targetSection);
          }
          void navigate(to);
        } else {
          scrollToTop({ smooth: true });
          setActiveSection('home');
          void navigate('/');
        }
      }
    },
    [location.pathname, navigate, setActiveSection],
  );
}
