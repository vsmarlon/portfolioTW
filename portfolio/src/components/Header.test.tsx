import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
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
      <MemoryRouter initialEntries={[initialEntry]}>
        <Header />
        <LocationProbe />
        <NavigationProbe />
        <RouteControls />
        <Routes>
          <Route path="/blog" element={<span>listing</span>} />
          <Route path="/blog/:slug" element={<span>article</span>} />
          <Route path="/" element={<button>home</button>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('Header blog search', () => {
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
