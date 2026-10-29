import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale, type Locale } from '../contexts/LocaleContext';
import { socialLinks } from '../data/contact';
import Icon from './Icon';
import NavigationDrawer from './NavigationDrawer';

function attachAutoHideHeader(header: HTMLElement | null): (() => void) | undefined {
  if (!header) return undefined;

  let previousScrollY = Math.max(window.scrollY, 0);
  const showHeader = () => header.removeAttribute('data-header-hidden');
  const handleScroll = () => {
    const scrollY = Math.max(window.scrollY, 0);
    const hideAfter = header.offsetHeight || 80;

    if (scrollY <= hideAfter || scrollY < previousScrollY) {
      showHeader();
    } else if (scrollY > previousScrollY) {
      header.setAttribute('data-header-hidden', '');
    }

    previousScrollY = scrollY;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  header.addEventListener('focusin', showHeader);

  return () => {
    window.removeEventListener('scroll', handleScroll);
    header.removeEventListener('focusin', showHeader);
  };
}

function attachSearchShortcut(input: HTMLInputElement | null): (() => void) | undefined {
  if (!input) return undefined;

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k' && input.isConnected) {
      event.preventDefault();
      input.focus();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isReadingRoute = pathname === '/blog' || pathname.startsWith('/blog/') || pathname === '/projects/freebay';
  const query = searchParams.get('q') ?? '';

  const updateQuery = (value: string) => {
    if (pathname !== '/blog') {
      navigate(value ? `/blog?q=${encodeURIComponent(value)}` : '/blog');
      return;
    }

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) {
        next.set('q', value);
      } else {
        next.delete('q');
      }
      return next;
    }, { replace: true });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(query.trim() ? `/blog?q=${encodeURIComponent(query.trim())}` : '/blog');
  };

  return (
    <header ref={attachAutoHideHeader} data-reading={isReadingRoute || undefined} className="header-enter fixed inset-x-0 top-0 z-40 border-b-2 border-stone-900/20 bg-[#faf6ef]/90 backdrop-blur-md dark:border-stone-100/20 dark:bg-[#09090b]/90">
      <div className={`flex min-w-0 flex-wrap items-center gap-2 px-2 sm:px-6 lg:px-8 ${isReadingRoute ? 'min-h-14' : 'min-h-20'}`}>
        <div data-header-group="brand" className="order-1 flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <NavigationDrawer />
          {!isReadingRoute ? (
            <Link to="/" aria-label={t('brand')} className="focus-ring flex min-w-0 shrink items-center gap-2 sm:gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-stone-900 dark:border-stone-100">
                <img data-brand-mark src="/mv-editorial-mark.png" alt="" className="h-full w-full" />
              </span>
              <span className="hidden text-sm font-bold tracking-[0.18em] text-stone-900 dark:text-stone-100 sm:block">MARLON VARGAS</span>
            </Link>
          ) : null}
        </div>

        {isReadingRoute ? (
          <form onSubmit={handleSubmit} data-header-group="search" className="order-2 flex min-w-24 flex-1 items-center md:ml-auto md:flex-none">
            <label htmlFor="blog-search" className="sr-only">{t('header.blogSearch')}</label>
            <div className="relative min-w-0 flex-1 md:w-[min(40vw,40rem)] md:flex-none">
              <Link to="/" aria-label={t('brand')} className="focus-ring absolute inset-y-0 left-3 z-10 my-auto flex h-6 w-6 items-center justify-center">
                <img data-brand-mark src="/mv-editorial-mark-compact.svg" alt="" className="h-full w-full" />
              </Link>
              <input
                ref={attachSearchShortcut}
                id="blog-search"
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder={t('header.placeholder')}
                className="h-11 min-w-0 w-full rounded border border-stone-900/20 bg-[#fffdf8]/80 pl-12 pr-3 text-sm text-stone-900 shadow-sm placeholder:text-stone-500 focus:border-[#a1006b] focus:outline-none focus:ring-2 focus:ring-[#a1006b]/20 dark:border-stone-100/20 dark:bg-[#1c1917]/80 dark:text-stone-100 dark:placeholder:text-stone-400 dark:focus:border-fuchsia-200 dark:focus:ring-fuchsia-200/20"
              />
            </div>
            <kbd className="ml-2 hidden rounded border border-stone-900/15 px-1.5 py-1 text-[10px] font-bold text-stone-500 dark:border-stone-100/15 dark:text-stone-400 lg:inline">Ctrl/⌘ K</kbd>
          </form>
        ) : null}

        <div data-header-group="actions" className="order-3 ml-auto flex min-w-0 shrink items-center gap-0 sm:gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="focus-ring p-2 text-stone-700 transition-colors hover:text-[#a1006b] dark:text-stone-300 dark:hover:text-fuchsia-200 sm:p-3"
            >
              <Icon name={link.icon} />
            </a>
          ))}
          <button type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? t('header.light') : t('header.dark')} className="focus-ring p-2 text-stone-700 hover:text-[#a1006b] dark:text-stone-300 dark:hover:text-fuchsia-200 sm:p-3">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <label className="sr-only" htmlFor="locale-select">{t('language')}</label>
          <select id="locale-select" value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label={t('language')} className="h-9 border-2 border-stone-900/25 bg-transparent px-1 text-xs font-bold text-stone-900 [color-scheme:light] dark:border-stone-100/25 dark:text-stone-100 dark:[color-scheme:dark] sm:h-11 sm:px-2">
            <option value="pt-BR" className="bg-[#fffdf8] text-stone-900 dark:bg-[#131110] dark:text-stone-100">PT</option>
            <option value="en" className="bg-[#fffdf8] text-stone-900 dark:bg-[#131110] dark:text-stone-100">EN</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
