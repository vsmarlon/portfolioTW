import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getScrollOffset, scheduleHashScroll, scrollToElementId, scrollToTop } from './scroll';

describe('scroll schedulers', () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalScrollTo = window.scrollTo;
  const originalScrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');

  let performanceNowSpy: ReturnType<typeof vi.spyOn>;
  let frameCallbacks: Map<number, FrameRequestCallback>;
  let nextFrameId: number;
  let now: number;
  let mockScrollY: number;

  const runFrame = () => {
    const callbacks = Array.from(frameCallbacks.values());
    frameCallbacks.clear();

    for (const callback of callbacks) {
      callback(now);
    }

    now += 16;
  };

  beforeEach(() => {
    frameCallbacks = new Map();
    nextFrameId = 0;
    now = 0;
    mockScrollY = 0;

    performanceNowSpy = vi.spyOn(performance, 'now').mockImplementation(() => now);

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: vi.fn((input: number | ScrollToOptions, y?: number) => {
        if (typeof input === 'number') {
          mockScrollY = typeof y === 'number' ? y : input;
          return;
        }

        mockScrollY = typeof input.top === 'number' ? input.top : 0;
      }),
    });

    Object.defineProperty(window, 'requestAnimationFrame', {
      writable: true,
      value: vi.fn((callback: FrameRequestCallback) => {
        nextFrameId += 1;
        frameCallbacks.set(nextFrameId, callback);
        return nextFrameId;
      }),
    });

    Object.defineProperty(window, 'cancelAnimationFrame', {
      writable: true,
      value: vi.fn((id: number) => {
        frameCallbacks.delete(id);
      }),
    });
  });

  afterEach(() => {
    performanceNowSpy.mockRestore();
    document.body.innerHTML = '';

    if (originalScrollYDescriptor) {
      Object.defineProperty(window, 'scrollY', originalScrollYDescriptor);
    }

    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: originalScrollTo,
    });

    Object.defineProperty(window, 'requestAnimationFrame', {
      writable: true,
      value: originalRequestAnimationFrame,
    });

    Object.defineProperty(window, 'cancelAnimationFrame', {
      writable: true,
      value: originalCancelAnimationFrame,
    });
  });

  it('keeps retrying hash scroll long enough for late-mounted targets', () => {
    scheduleHashScroll('#late-target', { timeoutMs: 1000 });

    for (let frame = 0; frame < 20; frame += 1) {
      if (frame === 15) {
        const target = document.createElement('section');
        target.id = 'late-target';
        document.body.append(target);
      }

      runFrame();
    }

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it('animates to the top quickly instead of jumping', () => {
    mockScrollY = 500;
    scrollToTop();

    for (let frame = 0; frame < 40; frame += 1) {
      runFrame();
    }

    expect(mockScrollY).toBe(0);
    expect((window.scrollTo as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(2);
    expect(frameCallbacks.size).toBe(0);
  });

  it('jumps instantly to a zero-distance target', () => {
    scrollToTop();

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(frameCallbacks.size).toBe(0);
  });

  it('scrolls to an element with the header offset applied', () => {
    mockScrollY = 1000;
    const target = document.createElement('section');
    target.id = 'projects';
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: -200,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
    document.body.append(target);

    expect(scrollToElementId('projects')).toBe(true);

    for (let frame = 0; frame < 40; frame += 1) {
      runFrame();
    }

    expect(mockScrollY).toBe(1000 - 200 - 96);
  });

  it('derives the offset from the fixed header and leaves a readable gap', () => {
    const header = document.createElement('header');
    header.className = 'fixed';
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
      top: 0, bottom: 132, left: 0, right: 0, width: 0, height: 132, x: 0, y: 0, toJSON: () => {},
    });
    document.body.append(header);

    expect(getScrollOffset()).toBe(148);
  });

  it('uses the final header height while its entrance transform is running', () => {
    const header = document.createElement('header');
    header.className = 'fixed';
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({
      top: -100, bottom: 32, left: 0, right: 0, width: 375, height: 132, x: 0, y: -100, toJSON: () => {},
    });
    document.body.append(header);
    expect(getScrollOffset()).toBe(148);
  });

  it('does not start nested browser smooth scrolling inside animation frames', () => {
    mockScrollY = 500;
    scrollToTop();
    runFrame();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 500, behavior: 'instant' });
    window.dispatchEvent(new Event('wheel'));
  });

  it('stays instant when the user prefers reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({ matches: true }),
    });
    mockScrollY = 500;

    scrollToTop();

    expect(mockScrollY).toBe(0);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({ matches: false }),
    });
  });

  it('stops the animation as soon as the user scrolls manually', () => {
    mockScrollY = 500;
    scrollToTop();

    runFrame();
    runFrame();
    const callsAfterInterrupt = (window.scrollTo as ReturnType<typeof vi.fn>).mock.calls.length;
    window.dispatchEvent(new Event('wheel'));

    for (let frame = 0; frame < 40; frame += 1) {
      runFrame();
    }

    expect((window.scrollTo as ReturnType<typeof vi.fn>).mock.calls.length).toBe(callsAfterInterrupt);
    expect(mockScrollY).toBeGreaterThan(0);
  });

  it('returns cleanup functions that cancel pending retries', () => {
    const cancelHash = scheduleHashScroll('#missing-target', { timeoutMs: 1000 });

    expect(frameCallbacks.size).toBe(1);

    cancelHash();
    runFrame();

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('removes the previous wheel cancellation listener when replacing an animation', () => {
    mockScrollY = 500;
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    scrollToTop();
    scrollToTop();
    expect(removeEventListener).toHaveBeenCalledWith('wheel', expect.any(Function));
    runFrame();
    window.dispatchEvent(new Event('wheel'));
    runFrame();

    expect(frameCallbacks.size).toBe(0);
  });

});
