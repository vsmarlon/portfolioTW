import { useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useActiveSection } from '../contexts/ActiveSectionContext';
import { navItems } from '../data/navigation';
import { socialLinks } from '../data/contact';
import { useNavigateToSection } from '../hooks/useNavigateToSection';
import Icon from './Icon';
import { useLocale } from '../contexts/LocaleContext';

const NavigationDrawer = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gestureStart = useRef<{ x: number; y: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { activeSection } = useActiveSection();
  const location = useLocation();
  const navigateToSection = useNavigateToSection();
  const isHome = location.pathname === '/';
  const { t } = useLocale();

  const close = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const open = () => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      setIsOpen(true);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={t('header.open')}
        aria-controls="site-navigation"
        aria-expanded={isOpen}
        onClick={open}
        className="z-50 inline-flex h-11 w-11 shrink-0 items-center justify-center border-2 border-stone-900/25 bg-[#faf6ef] text-stone-900 transition-colors hover:border-[#a1006b] hover:text-[#a1006b] dark:border-stone-100/25 dark:bg-[#131110] dark:text-fuchsia-200 dark:hover:border-fuchsia-200"
      >
        <Icon name="bars" className="text-lg" />
      </button>

      <dialog
        ref={dialogRef}
        id="site-navigation"
        aria-label={t('header.main')}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onCancel={close}
        onKeyDown={(event) => {
          if (event.key === 'Escape') close();
        }}
        onPointerDown={(event) => {
          gestureStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = gestureStart.current;
          gestureStart.current = null;
          if (start && event.clientX - start.x > 72 && Math.abs(event.clientY - start.y) < 48) close();
        }}
        className="m-0 h-full max-h-none w-[min(22rem,88vw)] max-w-none border-r-2 border-stone-900/25 bg-[#faf6ef] p-0 text-stone-900 backdrop:bg-black/60 dark:border-stone-100/25 dark:bg-[#131110] dark:text-stone-100"
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between border-b-2 border-stone-900/20 pb-5 dark:border-stone-100/20">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#73004c] dark:text-fuchsia-200">{t('header.portfolio')}</p>
              <p className="mt-2 text-lg font-bold">Marlon Vargas</p>
            </div>
            <button type="button" onClick={close} aria-label={t('header.close')} className="focus-ring p-2 text-stone-700 hover:text-[#a1006b] dark:text-stone-300 dark:hover:text-fuchsia-200">
              <Icon name="close" />
            </button>
          </div>
          <nav className="mt-8" aria-label={t('header.destinations')}>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const current = isHome && activeSection === item.section;
                return (
                  <li key={item.section}>
                    <Link
                      to={item.to}
                      onClick={(event) => {
                        navigateToSection(event, item.to);
                        close();
                      }}
                      aria-current={current ? 'location' : undefined}
                      className={`focus-ring flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${current ? 'border-[#a1006b] text-[#a1006b] dark:border-fuchsia-200 dark:text-fuchsia-200' : 'border-transparent text-stone-600 hover:border-stone-900/30 hover:text-stone-900 dark:text-stone-300 dark:hover:border-stone-100/40 dark:hover:text-stone-100'}`}
                    >
                      <Icon name={item.icon} aria-hidden="true" />
                      {t(`nav.${item.section}`)}
                    </Link>
                  </li>
                );
              })}
              <li>
                <NavLink
                  to="/blog"
                  onClick={close}
                  aria-current={location.pathname.startsWith('/blog') ? 'page' : undefined}
                  className={({ isActive }) => `focus-ring flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${isActive ? 'border-[#a1006b] text-[#a1006b] dark:border-fuchsia-200 dark:text-fuchsia-200' : 'border-transparent text-stone-600 hover:border-stone-900/30 hover:text-stone-900 dark:text-stone-300 dark:hover:border-stone-100/40 dark:hover:text-stone-100'}`}
                >
                  <Icon name="pen" aria-hidden="true" />
                  {t('nav.blog')}
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="mt-auto flex gap-5 border-t-2 border-stone-900/20 pt-5 dark:border-stone-100/20">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="focus-ring text-stone-600 hover:text-[#a1006b] dark:text-stone-300 dark:hover:text-fuchsia-200">
                <Icon name={link.icon} />
              </a>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NavigationDrawer;
