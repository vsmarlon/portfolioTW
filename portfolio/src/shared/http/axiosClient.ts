import axios, { type AxiosRequestConfig } from 'axios';
import { failure, success, type ResponseEntity } from '../result';
import { mapUnknownError, type AppError } from '../errors';

const DEFAULT_TIMEOUT_MS = 10000;

export const githubApiClient = axios.create({
  baseURL: 'https://api.github.com',
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: 'application/vnd.github+json',
  },
});

export async function safeGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ResponseEntity<T, AppError>> {
  try {
    const response = await githubApiClient.get<T>(url, config);
    return success(response.data);
  } catch (error) {
    return failure(mapUnknownError(error));
  }
}
