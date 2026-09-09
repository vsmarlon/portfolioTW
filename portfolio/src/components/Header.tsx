import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale, type Locale } from '../contexts/LocaleContext';
import Icon from './Icon';
import NavigationDrawer from './NavigationDrawer';

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
    <header data-reading={isReadingRoute || undefined} className="header-enter fixed inset-x-0 top-0 z-40 border-b-2 border-stone-900/20 bg-[#faf6ef]/90 backdrop-blur-md dark:border-stone-100/20 dark:bg-[#131110]/90">
      <div className="flex min-h-20 min-w-0 flex-wrap items-center gap-2 px-2 sm:px-6 lg:px-8">
        <div data-header-group="brand" className="order-1 flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <NavigationDrawer />
          {!isReadingRoute ? (
            <Link to="/" aria-label={t('brand')} className="focus-ring flex min-w-0 shrink items-center gap-2 sm:gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-stone-900 bg-[#a1006b] font-bold text-[#fff7fb] dark:border-stone-100 dark:bg-[#ec7cc3] dark:text-[#1c0a14]">
                MV
              </span>
              <span className="hidden text-sm font-bold tracking-[0.18em] text-stone-900 dark:text-stone-100 sm:block">MARLON VARGAS</span>
            </Link>
          ) : null}
        </div>
          {isReadingRoute ? (
            <form onSubmit={handleSubmit} data-header-group="search" className="order-3 flex basis-full min-w-0 items-center border-t border-stone-900/10 bg-[#faf6ef]/95 py-2 md:order-2 md:ml-auto md:basis-auto md:border-0 md:bg-transparent md:py-0 dark:border-stone-100/10 dark:bg-[#131110]/95 md:dark:bg-transparent">
              <label htmlFor="blog-search" className="sr-only">{t('header.blogSearch')}</label>
              <div className="relative min-w-0 flex-1 md:w-[min(40vw,40rem)] md:flex-none">
                <Link to="/" aria-label={t('brand')} className="focus-ring absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm bg-[#a1006b] text-[10px] font-bold text-[#fff7fb] dark:bg-[#ec7cc3] dark:text-[#1c0a14]">MV</Link>
                <input
                  ref={attachSearchShortcut}
                  id="blog-search"
                  type="search"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  placeholder={t('header.placeholder')}
                  className="h-11 min-w-0 w-full rounded border border-stone-900/20 bg-[#fffdf8]/80 pl-11 pr-3 text-sm text-stone-900 shadow-sm placeholder:text-stone-500 focus:border-[#a1006b] focus:outline-none focus:ring-2 focus:ring-[#a1006b]/20 dark:border-stone-100/20 dark:bg-[#1c1917]/80 dark:text-stone-100 dark:placeholder:text-stone-400 dark:focus:border-fuchsia-200 dark:focus:ring-fuchsia-200/20"
                />
              </div>
              <kbd className="ml-2 hidden rounded border border-stone-900/15 px-1.5 py-1 text-[10px] font-bold text-stone-500 dark:border-stone-100/15 dark:text-stone-400 lg:inline">Ctrl/⌘ K</kbd>
            </form>
           ) : null}
          <div data-header-group="actions" className="order-2 ml-auto flex min-w-0 shrink items-center gap-1 sm:gap-2 md:order-3">
            <label className="sr-only" htmlFor="locale-select">{t('language')}</label>
           <select id="locale-select" value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label={t('language')} className="h-11 border-2 border-stone-900/25 bg-transparent px-2 text-xs font-bold text-stone-900 dark:border-stone-100/25 dark:text-stone-100">
             <option value="pt-BR">PT</option>
             <option value="en">EN</option>
           </select>
           <button type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? t('header.light') : t('header.dark')} className="focus-ring p-3 text-stone-700 hover:text-[#a1006b] dark:text-stone-300 dark:hover:text-fuchsia-200">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
