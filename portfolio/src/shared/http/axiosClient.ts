import { failure, success, type ResponseEntity } from '../result';
import { mapUnknownError, type AppError } from '../errors';

const DEFAULT_TIMEOUT_MS = 10000;

export interface RequestOptions {
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export type AxiosRequestConfig = RequestOptions;

export async function safeGet<T>(
  url: string,
  config?: RequestOptions,
): Promise<ResponseEntity<T, AppError>> {
  try {
    const fullUrl = new URL(
      url.startsWith('http')
        ? url
        : `https://api.github.com${url.startsWith('/') ? url : `/${url}`}`,
    );

    if (config?.params) {
      for (const [key, value] of Object.entries(config.params)) {
        if (value !== undefined) {
          fullUrl.searchParams.set(key, String(value));
        }
      }
    }

    const signal = config?.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS);
    const response = await fetch(fullUrl.toString(), {
      headers: {
        Accept: 'application/vnd.github+json',
        ...config?.headers,
      },
      signal,
    });

    if (!response.ok) {
      return failure(
        mapUnknownError({ status: response.status, statusText: response.statusText }),
      );
    }

    const data = (await response.json()) as T;
    return success(data);
  } catch (error) {
    return failure(mapUnknownError(error));
  }
}
