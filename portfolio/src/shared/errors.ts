export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'RATE_LIMITED'
  | 'HTTP_ERROR'
  | 'INVALID_RESPONSE'
  | 'UNEXPECTED_ERROR';

export interface AppError {
  code: ErrorCode;
  message: string;
  status?: number;
  cause?: unknown;
}

export function mapUnknownError(error: unknown): AppError {
  const status =
    typeof error === 'object' && error !== null
      ? ('status' in error && typeof (error as { status?: unknown }).status === 'number'
          ? (error as { status: number }).status
          : 'response' in error &&
              typeof (error as { response?: { status?: unknown } }).response?.status === 'number'
            ? (error as { response: { status: number } }).response.status
            : undefined)
      : undefined;

  if (status === 429 || status === 403) {
    return {
      code: 'RATE_LIMITED',
      message: 'Limite de requisições da API atingido. Tente novamente em alguns minutos.',
      status,
      cause: error,
    };
  }

  if (typeof status === 'number') {
    return {
      code: 'HTTP_ERROR',
      message: 'A API do GitHub não respondeu como esperado.',
      status,
      cause: error,
    };
  }

  if (
    error instanceof TypeError ||
    (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch')))
  ) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Não foi possível conectar com a API do GitHub.',
      cause: error,
    };
  }

  return {
    code: 'UNEXPECTED_ERROR',
    message: 'Falha inesperada ao processar a solicitação.',
    cause: error,
  };
}

export function getUserSafeErrorMessage(error: AppError): string {
  return error.message;
}
