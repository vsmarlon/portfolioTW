import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useActiveSection } from '../contexts/ActiveSectionContext';
import { useNavigateToSection } from '../hooks/useNavigateToSection';
import { navItems } from '../data/navigation';

export default function SectionTimeline() {
  const { activeSection } = useActiveSection();
  const location = useLocation();
  const navigateToSection = useNavigateToSection();
  const [scrollProgress, setScrollProgress] = useState(0);

  const isHome = location.pathname === '/';
  const isBlog = location.pathname.startsWith('/blog');

  // Blog scroll progress
  useEffect(() => {
    if (!isBlog) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isBlog]);

  if (!isHome && !isBlog) return null;

  // Homepage: section dots with fill line
  if (isHome) {
    const activeIndex = Math.max(
      0,
      navItems.findIndex((item) => item.section === activeSection),
    );
    const fillPct = navItems.length > 1
      ? (activeIndex / (navItems.length - 1)) * 100
      : 0;

    return (
      <nav
        aria-label="Navegação por seção"
        className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center"
      >
        <div className="relative flex flex-col items-center gap-8 py-1">
          {/* Track */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-black/20 dark:bg-white/20" />

          {/* Fill */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-cyan-400"
            style={{
              height: `${fillPct}%`,
              transition: 'height 400ms ease',
            }}
          />

          {navItems.map((item, i) => {
            const isActive = activeSection === item.section;
            const isPast = i <= activeIndex;
            return (
              <div key={item.section} className="relative flex items-center group">
                {/* Label */}
                <span
                  className={`
                    absolute right-6 whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em]
                    hidden xl:block
                    ${isActive
                      ? 'text-cyan-600 dark:text-cyan-400'
                      : 'text-black/40 dark:text-white/35'
                    }
                  `}
                >
                  {item.label}
                </span>

                {/* Dot */}
                <Link
                  to={item.to}
                  onClick={(e) => navigateToSection(e, item.to)}
                  aria-label={`Ir para ${item.label}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`
                    relative z-10 block transition-all duration-200
                    ${isActive
                      ? 'w-4 h-4 bg-cyan-400 border-2 border-cyan-400'
                      : isPast
                        ? 'w-3.5 h-3.5 bg-cyan-400/30 border-2 border-cyan-400 hover:bg-cyan-400'
                        : 'w-3.5 h-3.5 bg-transparent border-2 border-black/30 dark:border-white/30 hover:border-cyan-400 dark:hover:border-cyan-400'
                    }
                  `}
                />
              </div>
            );
          })}
        </div>
      </nav>
    );
  }

  // Blog: scroll progress bar
  return (
    <div
      aria-hidden="true"
      className="fixed right-4 top-24 bottom-8 z-40 hidden lg:flex flex-col items-center"
    >
      <div className="relative h-full w-0.5 bg-black/15 dark:bg-white/15">
        <div
          className="absolute top-0 left-0 w-full bg-cyan-400"
          style={{
            height: `${scrollProgress * 100}%`,
            transition: 'height 100ms linear',
          }}
        />
      </div>
    </div>
  );
}
