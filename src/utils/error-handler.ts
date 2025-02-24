import { ApiError } from '@/lib/api-client';

export type ErrorWithMessage = {
  message: string;
};

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  try {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  } catch {
    return false;
  }
}

export function toErrorWithMessage(maybeError: unknown): { message: string } {
  if (isErrorWithMessage(maybeError)) {
    return { message: maybeError.message };
  }

  try {
    if (maybeError === null || maybeError === undefined) {
      return { message: 'An unexpected error occurred' };
    }

    if (typeof maybeError === 'number' || typeof maybeError === 'object') {
      return { message: 'An unexpected error occurred' };
    }

    return { message: String(maybeError) };
  } catch {
    return { message: 'An unexpected error occurred' };
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}
