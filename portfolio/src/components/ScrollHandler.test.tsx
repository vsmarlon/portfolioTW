import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import ScrollHandler from './ScrollHandler';

const { scrollToTop, scheduleHashScroll } = vi.hoisted(() => ({
  scrollToTop: vi.fn(),
  scheduleHashScroll: vi.fn(() => vi.fn()),
}));
vi.mock('../utils/scroll', () => ({ scrollToTop, scheduleHashScroll }));

function TestRoutes() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <ScrollHandler />
      <Link to="/next">PUSH top</Link>
      <Link to="/#projects">PUSH hash</Link>
      <Routes>
        <Route path="*" element={<span>page</span>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ScrollHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('scrolls to top on PUSH and schedules one hash scroll for hash navigation', async () => {
    render(<TestRoutes />);

    fireEvent.click(screen.getByRole('link', { name: 'PUSH top' }));
    await waitFor(() => expect(scrollToTop).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('link', { name: 'PUSH hash' }));
    await waitFor(() => expect(scheduleHashScroll).toHaveBeenCalledWith('#projects'));
    expect(scrollToTop).toHaveBeenCalledTimes(1);
  });

  it('does not perform custom scrolling for POP navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/', '/previous']} initialIndex={1}>
        <ScrollHandler />
        <Routes><Route path="*" element={<span>page</span>} /></Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('page')).toBeInTheDocument());
    expect(scrollToTop).not.toHaveBeenCalled();
    expect(scheduleHashScroll).not.toHaveBeenCalled();
  });
});
