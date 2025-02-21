export type ResponseEntity<T, E> =
  | { success: true; data: T }
  | { success: false; data: null; error: E };

export function success<T>(data: T): ResponseEntity<T, never> {
  return { success: true, data };
}

export function failure<E>(error: E): ResponseEntity<never, E> {
  return { success: false, data: null, error };
}
