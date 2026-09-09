import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LocaleProvider, useLocale } from './LocaleContext';
import en from '../locales/en.json';
import ptBR from '../locales/pt-BR.json';

const Probe = () => {
  const { locale, setLocale, t } = useLocale();
  return <><output>{locale}</output><button onClick={() => setLocale('en')}>{t('language')}</button></>;
};

const MissingTranslationProbe = () => {
  const { t } = useLocale();
  return <output>{t('missing.translation')}</output>;
};

describe('LocaleProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'pt-BR';
  });

  it('defaults to Portuguese and persists an explicit selection', async () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByText('pt-BR')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Idioma' }));
    await waitFor(() => expect(screen.getByText('en')).toBeInTheDocument());
    expect(localStorage.getItem('locale')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('requires a provider', () => {
    expect(() => render(<Probe />)).toThrow('useLocale must be used within LocaleProvider');
  });

  it('ships matching translation keys', () => {
    const paths = (value: Record<string, unknown>, prefix = ''): string[] => Object.entries(value).flatMap(([key, child]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return typeof child === 'string' ? [path] : paths(child as Record<string, unknown>, path);
    }).sort();

    expect(paths(en)).toEqual(paths(ptBR));
  });

  it('throws instead of returning an empty translation', () => {
    expect(() => render(<LocaleProvider><MissingTranslationProbe /></LocaleProvider>)).toThrow(
      'Missing translation for pt-BR: missing.translation',
    );
  });
});
