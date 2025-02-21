export function getRouteScrollKey(pathname: string, search: string) {
  return `${pathname}${search}`;
}

export class RouteScrollMemory {
  private readonly positions = new Map<string, number>();

  save(routeKey: string, scrollTop: number) {
    this.positions.set(routeKey, Math.max(0, scrollTop));
  }

  read(routeKey: string) {
    return this.positions.get(routeKey);
  }
}
