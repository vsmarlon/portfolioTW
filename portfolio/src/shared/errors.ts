import axios from 'axios';

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
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

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
