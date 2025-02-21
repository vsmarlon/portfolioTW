export function devWarn(message: string, meta?: unknown) {
  if (!import.meta.env.DEV) {
    return;
  }

  console.warn(message, meta);
}

export function devError(message: string, meta?: unknown) {
  if (!import.meta.env.DEV) {
    return;
  }

  console.error(message, meta);
}
