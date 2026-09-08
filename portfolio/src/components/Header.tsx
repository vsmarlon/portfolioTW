import { useEffect, useRef, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Icon from './Icon';
import NavigationDrawer from './NavigationDrawer';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const isBlogRoute = pathname === '/blog' || pathname.startsWith('/blog/');
  const query = searchParams.get('q') ?? '';

  useEffect(() => {
    if (!isBlogRoute) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isBlogRoute]);

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
    <header className="header-enter fixed inset-x-0 top-0 z-40 border-b-2 border-stone-900/20 bg-[#faf6ef]/90 backdrop-blur-md dark:border-stone-100/20 dark:bg-[#131110]/90">
      <div className="mx-auto flex h-20 min-w-0 max-w-7xl items-center justify-between gap-2 px-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <NavigationDrawer />
          <Link to="/" aria-label="Marlon Vargas — início" className="focus-ring ml-10 flex min-w-0 shrink items-center gap-2 sm:gap-3 lg:ml-0">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center border-2 border-stone-900 bg-[#a1006b] font-bold text-[#fff7fb] dark:border-stone-100 dark:bg-[#ec7cc3] dark:text-[#1c0a14]">
              MV
            </span>
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-bold tracking-[0.18em] text-stone-900 dark:text-stone-100">MARLON VARGAS</span>
              <span className="block text-[10px] tracking-[0.2em] text-[#73004c] dark:text-fuchsia-200">FULL STACK ENGINEER</span>
            </span>
          </Link>
        </div>
        <div className="flex min-w-0 shrink items-center gap-1 sm:gap-2">
          {isBlogRoute ? (
            <form onSubmit={handleSubmit} className="flex min-w-0 shrink items-center">
              <label htmlFor="blog-search" className="sr-only">Buscar artigos</label>
              <input
                ref={searchRef}
                id="blog-search"
                type="search"
                value={query}
                onChange={(event) => updateQuery(event.target.value)}
                placeholder="buscar artigos..."
                className="h-11 min-w-0 w-28 shrink border-2 border-stone-900/25 bg-[#fffdf8] px-2 text-sm text-stone-900 placeholder:text-stone-500 focus:border-[#a1006b] focus:outline-none dark:border-stone-100/25 dark:bg-[#1c1917] dark:text-stone-100 dark:placeholder:text-stone-400 dark:focus:border-fuchsia-200 sm:w-52 sm:px-3"
              />
              <span className="ml-2 hidden text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 lg:inline">Ctrl/⌘ K</span>
            </form>
          ) : null}
          <button type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'} className="focus-ring p-3 text-stone-700 hover:text-[#a1006b] dark:text-stone-300 dark:hover:text-fuchsia-200">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
