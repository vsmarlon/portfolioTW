import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { useRouteScrollRoot } from './useRouteScrollRoot';

const { scrollToTop, scheduleHashScroll, cancelHashScroll } = vi.hoisted(() => ({
  scrollToTop: vi.fn(),
  scheduleHashScroll: vi.fn(() => cancelHashScroll),
  cancelHashScroll: vi.fn(),
}));
vi.mock('../utils/scroll', () => ({ scrollToTop, scheduleHashScroll }));

function Page() {
  const rootRef = useRouteScrollRoot();
  return <main ref={rootRef}>page</main>;
}

function TestRoutes() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Link to="/next">PUSH top</Link>
      <Link to="/#projects">PUSH hash</Link>
      <Link to="/replaced" replace>REPLACE</Link>
      <Routes>
        <Route path="*" element={<Page />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('useRouteScrollRoot', () => {
  beforeEach(() => vi.clearAllMocks());

  it('scrolls the attached route root on PUSH and schedules one hash scroll', async () => {
    render(<TestRoutes />);
    fireEvent.click(screen.getByRole('link', { name: 'PUSH top' }));
    await waitFor(() => expect(scrollToTop).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole('link', { name: 'PUSH hash' }));
    await waitFor(() =>
      expect(scheduleHashScroll).toHaveBeenCalledWith(
        '#projects',
        expect.objectContaining({ root: expect.any(HTMLElement) }),
      ),
    );
  });

  it('does not perform custom scrolling for POP navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/', '/previous']} initialIndex={1}>
        <Routes>
          <Route path="*" element={<Page />} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByText('page')).toBeInTheDocument());
    expect(scrollToTop).not.toHaveBeenCalled();
    expect(scheduleHashScroll).not.toHaveBeenCalled();
  });

  it('schedules a hash scroll for POP navigation on the attached root', async () => {
    render(
      <MemoryRouter initialEntries={['/', '/previous#projects']} initialIndex={1}>
        <Routes>
          <Route path="*" element={<Page />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(scheduleHashScroll).toHaveBeenCalledWith(
        '#projects',
        expect.objectContaining({ root: expect.any(HTMLElement) }),
      ),
    );
  });

  it('does not reset scroll for REPLACE navigation', async () => {
    render(<TestRoutes />);
    fireEvent.click(screen.getByRole('link', { name: 'REPLACE' }));

    await waitFor(() => expect(screen.getByText('page')).toBeInTheDocument());
    expect(scrollToTop).not.toHaveBeenCalled();
    expect(scheduleHashScroll).not.toHaveBeenCalled();
  });

  it('cancels a pending hash retry when the route root changes', async () => {
    render(<TestRoutes />);
    fireEvent.click(screen.getByRole('link', { name: 'PUSH hash' }));
    await waitFor(() => expect(scheduleHashScroll).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('link', { name: 'PUSH top' }));
    await waitFor(() => expect(cancelHashScroll).toHaveBeenCalledTimes(1));
  });
});
