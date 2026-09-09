import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EngineeringSystems from './EngineeringSystems';
import { LocaleProvider } from '../contexts/LocaleContext';

const renderSystems = () =>
  render(
    <LocaleProvider><MemoryRouter><EngineeringSystems /></MemoryRouter></LocaleProvider>,
  );

describe('EngineeringSystems', () => {
  it('exposes the architecture diagram to assistive technology with CSS-only motion', () => {
    renderSystems();
    const svg = screen.getByRole('img', { name: 'Arquitetura do Freebay' });

    expect(svg.querySelector('title')).toHaveTextContent('Arquitetura do Freebay');
    expect(svg.querySelector('desc')).toHaveTextContent(/Clientes React e Flutter passam pelo NestJS/);
    expect(svg).toHaveTextContent('React + Flutter');
    expect(svg).toHaveTextContent('PostgreSQL');
    expect(svg).toHaveTextContent('Socket.IO');
    expect(svg.querySelector('marker[id^="architecture-arrow"]')).toBeInTheDocument();
    expect(svg.querySelectorAll('.architecture-paths path')).toHaveLength(6);
    expect(svg.querySelectorAll('.architecture-paths path[marker-end]')).toHaveLength(6);
    expect(svg.querySelector('.architecture-paths path[d="M385 100H430V92H670"]')).toBeInTheDocument();
    expect(svg.querySelectorAll('.architecture-traveler')).toHaveLength(0);
    expect(EngineeringSystems.toString()).not.toMatch(/setInterval|setTimeout|useEffect/);
  });

  it('animates every edge with staggered pulses and no effects', () => {
    renderSystems();
    const svg = screen.getByRole('img', { name: 'Arquitetura do Freebay' });
    const paths = svg.querySelectorAll('.architecture-paths path');

    expect(paths).toHaveLength(6);
    paths.forEach((path, index) => {
      expect(path.getAttribute('style')).toContain(`--i: ${index}`);
    });
    expect(EngineeringSystems.toString()).not.toMatch(/useEffect/);
  });
});
