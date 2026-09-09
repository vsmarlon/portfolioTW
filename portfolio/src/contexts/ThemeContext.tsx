import { createContext, useCallback, useContext, useState, useSyncExternalStore, type ReactNode } from 'react';
import { devWarn } from '../utils/devLog';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  themeRootRef: (node: HTMLElement | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const FALLBACK_THEME_CONTEXT: ThemeContextType = {
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
  themeRootRef: () => {},
};

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(t: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', t);
  root.classList.toggle('dark', t === 'dark');
}

function persistTheme(theme: Theme) {
  try {
    window.localStorage.setItem('theme', theme);
  } catch {
    // Storage is an optional persistence layer; the in-memory preference remains usable.
  }
}

const subscribeToSystemTheme = (onChange: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
};

let storedThemeRevision = 0;

const subscribeToStoredTheme = (onChange: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'theme' || event.key === null) {
      storedThemeRevision += 1;
      onChange();
    }
  };
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
};

const getStoredThemeRevision = () => storedThemeRevision;

export function bootstrapTheme(): void {
  applyTheme(readStoredTheme() ?? getSystemTheme());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme, (): Theme => 'light');
  const storageRevision = useSyncExternalStore(subscribeToStoredTheme, getStoredThemeRevision, () => 0);
  const storedTheme = readStoredTheme();
  const [manualPreference, setManualPreference] = useState<{ theme: Theme; storageRevision: number } | null>(() => {
    const initialTheme = typeof window === 'undefined' ? null : readStoredTheme();
    return initialTheme ? { theme: initialTheme, storageRevision: 0 } : null;
  });
  const theme = manualPreference?.storageRevision === storageRevision
    ? manualPreference.theme
    : storedTheme ?? systemTheme;

  const themeRootRef = useCallback((node: HTMLElement | null) => {
    if (node) applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    persistTheme(next);
    applyTheme(next);
    setManualPreference({ theme: next, storageRevision });
  }, [storageRevision, theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    persistTheme(newTheme);
    applyTheme(newTheme);
    setManualPreference({ theme: newTheme, storageRevision });
  }, [storageRevision]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, themeRootRef }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeRootRef() {
  return useTheme().themeRootRef;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    devWarn('useTheme used without ThemeProvider. Falling back to dark theme defaults.');
    return FALLBACK_THEME_CONTEXT;
  }
  return context;
}
