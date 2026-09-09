import { createContext, useContext, useState, type ReactNode } from 'react';
import en from '../locales/en.json';
import ptBR from '../locales/pt-BR.json';

export type Locale = 'pt-BR' | 'en';
type Messages = typeof ptBR;
export type TranslationPath<T extends Record<string, unknown>> = {
  [Key in keyof T & string]: T[Key] extends string
    ? Key
    : T[Key] extends Record<string, unknown>
      ? `${Key}.${TranslationPath<T[Key]>}`
      : never;
}[keyof T & string];
type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (path: string) => string };
const messages: Record<Locale, Messages> = { 'pt-BR': ptBR, en };
const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function readLocale(): Locale {
  try {
    const stored = window.localStorage.getItem('locale');
    if (stored === 'en' || stored === 'pt-BR') return stored;
  } catch {
    // Storage can be disabled by privacy settings.
  }
  return document.documentElement.lang === 'en' ? 'en' : 'pt-BR';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale);
  const setLocale = (next: Locale) => {
    try {
      window.localStorage.setItem('locale', next);
    } catch {
      // The selected locale still works for this session.
    }
    document.documentElement.lang = next;
    setLocaleState(next);
  };
  const t = (path: string): string => {
    const value = path.split('.').reduce<unknown>((current, key) => {
      if (!current || typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[key];
    }, messages[locale]);
    if (typeof value === 'string') return value;
    throw new Error(`Missing translation for ${locale}: ${path}`);
  };
  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}
