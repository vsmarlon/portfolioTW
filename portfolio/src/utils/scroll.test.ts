import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scheduleHashScroll, scheduleScrollToPosition } from './scroll';

describe('scroll schedulers', () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalScrollTo = window.scrollTo;
  const originalScrollYDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
  const originalScrollHeightDescriptor = Object.getOwnPropertyDescriptor(
    document.documentElement,
    'scrollHeight',
  );

  let performanceNowSpy: ReturnType<typeof vi.spyOn>;
  let frameCallbacks: Map<number, FrameRequestCallback>;
  let nextFrameId: number;
  let now: number;
  let mockScrollY: number;
  let mockScrollHeight: number;

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
    mockScrollHeight = window.innerHeight + 1600;

    performanceNowSpy = vi.spyOn(performance, 'now').mockImplementation(() => now);

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      get: () => mockScrollHeight,
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

    if (originalScrollHeightDescriptor) {
      Object.defineProperty(document.documentElement, 'scrollHeight', originalScrollHeightDescriptor);
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

  it('retries restoring scroll position until the target height is reachable', () => {
    mockScrollHeight = window.innerHeight + 120;
    scheduleScrollToPosition(600, { timeoutMs: 1000 });

    runFrame();
    expect(window.scrollY).toBe(120);

    mockScrollHeight = window.innerHeight + 700;

    for (let frame = 0; frame < 4; frame += 1) {
      runFrame();
    }

    expect(window.scrollY).toBe(600);
  });

  it('returns cleanup functions that cancel pending retries', () => {
    const cancelHash = scheduleHashScroll('#missing-target', { timeoutMs: 1000 });
    const cancelPosition = scheduleScrollToPosition(400, { timeoutMs: 1000 });

    expect(frameCallbacks.size).toBe(2);

    cancelHash();
    cancelPosition();
    runFrame();

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(2);
  });
});
