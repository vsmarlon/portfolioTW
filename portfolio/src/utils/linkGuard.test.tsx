import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { installLinkGuard } from './linkGuard';

describe('installLinkGuard', () => {
  const uninstallers: Array<() => void> = [];

  afterEach(() => {
    window.getSelection()?.removeAllRanges();
    while (uninstallers.length > 0) {
      uninstallers.pop()?.();
    }
    document.body.innerHTML = '';
  });

  const renderLink = () => {
    let prevented = false;
    render(
      <a href="/alvo" onClick={(event) => { prevented = event.defaultPrevented; }}>
        texto selecionavel do cartao
      </a>,
    );
    return {
      link: screen.getByRole('link', { name: 'texto selecionavel do cartao' }),
      wasPrevented: () => prevented,
    };
  };

  it('lets plain clicks navigate untouched', () => {
    uninstallers.push(installLinkGuard());
    const { link, wasPrevented } = renderLink();

    fireEvent.click(link);

    expect(wasPrevented()).toBe(false);
  });

  it('cancels navigation when the click lands inside an active selection', () => {
    uninstallers.push(installLinkGuard());
    const { link, wasPrevented } = renderLink();

    const range = document.createRange();
    range.selectNodeContents(link);
    window.getSelection()?.addRange(range);

    fireEvent.click(link);

    expect(wasPrevented()).toBe(true);
  });

  it('ignores selections that live outside the clicked link', () => {
    uninstallers.push(installLinkGuard());
    const { link, wasPrevented } = renderLink();
    const outsider = document.createElement('p');
    outsider.textContent = 'fora do link';
    document.body.append(outsider);

    const range = document.createRange();
    range.selectNodeContents(outsider);
    window.getSelection()?.addRange(range);

    fireEvent.click(link);

    expect(wasPrevented()).toBe(false);
  });
});
