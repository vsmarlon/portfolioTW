import { describe, expect, it } from 'vitest';
import { getRouteScrollKey, RouteScrollMemory } from './routeScrollMemory';

describe('RouteScrollMemory', () => {
  it('builds route keys from pathname and search', () => {
    expect(getRouteScrollKey('/blog', '?tag=react')).toBe('/blog?tag=react');
    expect(getRouteScrollKey('/', '')).toBe('/');
  });

  it('stores independent scroll positions per route key', () => {
    const memory = new RouteScrollMemory();

    memory.save(getRouteScrollKey('/', ''), 1240);
    memory.save(getRouteScrollKey('/blog', ''), 380);

    expect(memory.read(getRouteScrollKey('/', ''))).toBe(1240);
    expect(memory.read(getRouteScrollKey('/blog', ''))).toBe(380);
  });

  it('normalizes negative values to zero', () => {
    const memory = new RouteScrollMemory();

    memory.save(getRouteScrollKey('/blog', ''), -120);

    expect(memory.read(getRouteScrollKey('/blog', ''))).toBe(0);
  });
});
