import { useState, useCallback } from 'react';
import type { MouseEvent } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useActiveSection } from '../contexts/ActiveSectionContext';
import { navItems } from '../data/navigation';
import { socialLinks } from '../data/contact';
import { useNavigateToSection } from '../hooks/useNavigateToSection';
import { scrollToTop } from '../utils/scroll';
import Icon from './Icon';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { activeSection } = useActiveSection();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigateToSection = useNavigateToSection();

  const handleNavClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>, to: string) => {
      navigateToSection(e, to);
      setIsMobileMenuOpen(false);
    },
    [navigateToSection],
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 border-b border-white/10 dark:border-white/10 bg-zinc-100/80 dark:bg-slate-900/70 backdrop-blur-md shadow-lg z-50 transition-colors duration-300 animate-[slideDown_0.5s_ease-out]"
    >
      <nav className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <button
          onClick={() => scrollToTop({ smooth: true })}
          className="flex items-center gap-1 group"
          aria-label="Ir para início"
        >
          <div className="flex h-8 w-8 items-center justify-center border-2 border-black dark:border-white bg-cyan-400 text-black font-bold text-xl transition-colors duration-200 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black">
            M
          </div>
          <span className="text-slate-900 dark:text-white font-bold tracking-widest text-lg overflow-hidden w-0 opacity-0 md:group-hover:w-16 group-hover:opacity-100 transition-all duration-300 ease-out translate-x-[-10px] group-hover:translate-x-0">
            arlon
          </span>
        </button>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-4 text-base font-medium">
          {navItems.map((item) => (
            <li key={item.section}>
              <Link
                to={item.to}
                onClick={(e) => handleNavClick(e, item.to)}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  (isHomePage && activeSection === item.section)
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-zinc-300 dark:hover:bg-white/10 hover:text-cyan-600 dark:hover:text-cyan-400'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-zinc-300 dark:hover:bg-white/10 hover:text-cyan-600 dark:hover:text-cyan-400'
                }`
              }
            >
              Blog
            </NavLink>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-zinc-300 dark:hover:bg-white/10 transition-colors"
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {theme === 'dark' ? (
              <Icon name="sun" className="text-lg" />
            ) : (
              <Icon name="moon" className="text-lg" />
            )}
          </button>

          <div className="hidden md:flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:scale-110 transition-all"
                aria-label={link.label}
              >
                <Icon name={link.icon} />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-zinc-300 dark:hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'bars'} className="text-xl" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-100 dark:bg-slate-900 border-b border-black/5 dark:border-white/10 shadow-lg py-4 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.section}
              to={item.to}
              onClick={(e) => handleNavClick(e, item.to)}
              className={`px-4 py-3 rounded-xl transition-all duration-200 ${
                (isHomePage && activeSection === item.section)
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 font-medium hover:bg-zinc-300 dark:hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <NavLink
            to="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 font-medium hover:bg-zinc-300 dark:hover:bg-white/10'
              }`
            }
          >
            Blog
          </NavLink>

          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-black/5 dark:border-white/10">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-slate-400 hover:text-cyan-500 transition-colors"
              >
                  <Icon name={link.icon} />
                </a>
              ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
