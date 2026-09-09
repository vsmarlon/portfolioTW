import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LocaleProvider } from '../contexts/LocaleContext';
import Header from './Header';

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
};

const NavigationProbe = () => <output data-testid="navigation-type">{useNavigationType()}</output>;

const RouteControls = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/')}>ir para início</button>;
};

function renderHeader(initialEntry: string) {
  return render(
    <ThemeProvider>
      <LocaleProvider><MemoryRouter initialEntries={[initialEntry]}>
        <Header />
        <LocationProbe />
        <NavigationProbe />
        <RouteControls />
        <Routes>
          <Route path="/blog" element={<span>listing</span>} />
          <Route path="/blog/:slug" element={<span>article</span>} />
          <Route path="/projects/freebay" element={<span>case study</span>} />
          <Route path="/" element={<button>home</button>} />
        </Routes>
      </MemoryRouter></LocaleProvider>
    </ThemeProvider>,
  );
}

describe('Header blog search', () => {
  it('uses the same searchable reading header on the case study', () => {
    renderHeader('/projects/freebay');
    const search = screen.getByRole('searchbox', { name: 'Buscar artigos' });
    expect(within(search.closest('form')!).getByRole('link', { name: /Marlon Vargas/i })).toHaveTextContent('MV');
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(search).toHaveFocus();
    fireEvent.change(search, { target: { value: 'Freebay' } });
    expect(screen.getByTestId('location')).toHaveTextContent('/blog?q=Freebay');
  });

  it('keeps the blog monogram inside the search field', () => {
    renderHeader('/blog');

    const banner = screen.getByRole('banner');
    const form = screen.getByRole('searchbox').closest('form')!;

    expect(within(form).getByRole('link', { name: /Marlon Vargas/i })).toHaveTextContent('MV');
    expect(form.querySelectorAll('a')).toHaveLength(1);
    expect(banner.querySelector('[data-header-group="brand"] > a')).not.toBeInTheDocument();
    expect(banner.querySelector('[data-header-group="actions"]')).toBeInTheDocument();
  });

  it('keeps the full home monogram and name beside the hamburger', () => {
    renderHeader('/');

    expect(screen.getByRole('link', { name: /Marlon Vargas/i })).toHaveTextContent(/MV.*MARLON VARGAS/);
    expect(screen.getByRole('banner').querySelector('form')).not.toBeInTheDocument();
  });

  it('syncs typing and empty values with the URL', () => {
    renderHeader('/blog?q=old');
    const input = screen.getByRole('searchbox', { name: 'Buscar artigos' });

    fireEvent.change(input, { target: { value: 'React & dados' } });
    expect(screen.getByTestId('location')).toHaveTextContent('/blog?q=React+%26+dados');

    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByTestId('location')).toHaveTextContent('/blog');
  });

  it('replaces listing history while typing', () => {
    renderHeader('/blog');
    const input = screen.getByRole('searchbox', { name: 'Buscar artigos' });

    fireEvent.change(input, { target: { value: 'R' } });
    fireEvent.change(input, { target: { value: 'React' } });

    expect(screen.getByTestId('navigation-type')).toHaveTextContent('REPLACE');
  });

  it('moves from an article to the encoded blog search', () => {
    renderHeader('/blog/artigo');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'TypeScript' } });

    expect(screen.getByTestId('location')).toHaveTextContent('/blog?q=TypeScript');
  });

  it('submits the current query with URL encoding', () => {
    renderHeader('/blog');
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'React & dados' } });
    fireEvent.submit(input.closest('form')!);

    expect(screen.getByTestId('location')).toHaveTextContent('/blog?q=React%20%26%20dados');
  });

  it.each([
    ['Control', { ctrlKey: true }],
    ['Meta', { metaKey: true }],
  ])('focuses the search with %s+K', (_, modifiers) => {
    renderHeader('/blog');
    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(document, { key: 'k', ...modifiers });
    expect(input).toHaveFocus();
  });

  it('does not render or claim the shortcut outside blog routes', () => {
    renderHeader('/');
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.getByText('home')).toBeInTheDocument();
  });

  it('does not claim K without a modifier', () => {
    renderHeader('/blog');
    const input = screen.getByRole('searchbox');
    fireEvent.keyDown(document, { key: 'k' });
    expect(input).not.toHaveFocus();
  });

  it('removes the shortcut when the route changes away from the blog', () => {
    renderHeader('/blog');
    const input = screen.getByRole('searchbox');
    fireEvent.click(screen.getByRole('button', { name: 'ir para início' }));

    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(input).not.toHaveFocus();
  });

  it('leaves focus unchanged when the shortcut is pressed outside the blog', () => {
    renderHeader('/');
    const home = screen.getByText('home');
    home.focus();

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

    expect(home).toHaveFocus();
  });
});
