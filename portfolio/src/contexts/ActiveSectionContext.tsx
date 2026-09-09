import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { navItems } from '../data/navigation';
import { devWarn } from '../utils/devLog';
import { getDocumentPerformanceMode } from '../utils/performanceMode';

interface ActiveSectionContextType {
  activeSection: string;
  setActiveSection: (section: string) => void;
  observeSections: (root: HTMLElement | null) => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextType | undefined>(undefined);
const FALLBACK_ACTIVE_SECTION_CONTEXT: ActiveSectionContextType = {
  activeSection: 'home',
  setActiveSection: () => {},
  observeSections: () => {},
};

const sectionIds = navItems.map((item) => item.section);

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('home');
  const activeSectionRef = useRef('home');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const location = useLocation();
  const observeSections = useCallback((root: HTMLElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!root || location.pathname !== '/') {
      activeSectionRef.current = 'home';
      setActiveSection('home');
      return;
    }

    const elements = sectionIds.map((id) => root.querySelector<HTMLElement>(`#${id}`)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visibilityBySection = new Map<string, number>();
    for (const id of sectionIds) {
      visibilityBySection.set(id, 0);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibilityBySection.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let nextSection = activeSectionRef.current;
        let highestRatio = 0;

        for (const id of sectionIds) {
          const ratio = visibilityBySection.get(id) ?? 0;
          if (ratio > highestRatio) {
            highestRatio = ratio;
            nextSection = id;
          }
        }

        if (highestRatio === 0 && window.scrollY < 140) {
          nextSection = 'home';
        }

        if (activeSectionRef.current !== nextSection) {
          activeSectionRef.current = nextSection;
          setActiveSection(nextSection);
        }
      },
      {
        threshold:
          getDocumentPerformanceMode() === 'reduced'
            ? [0.08, 0.16, 0.24]
            : [0.12, 0.24, 0.36, 0.48],
        rootMargin: '-88px 0px -12% 0px',
      },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    observerRef.current = observer;
  }, [location.pathname]);

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection, observeSections }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSectionRoot() {
  return useActiveSection().observeSections;
}

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);
  if (!context) {
    devWarn('useActiveSection used without ActiveSectionProvider. Falling back to home section.');
    return FALLBACK_ACTIVE_SECTION_CONTEXT;
  }
  return context;
}
