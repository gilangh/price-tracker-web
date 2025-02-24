import { ApiError } from '@/lib/api-client';
import {
  isErrorWithMessage,
  toErrorWithMessage,
  getErrorMessage,
} from '../error-handler';

describe('error-handler', () => {
  describe('isErrorWithMessage', () => {
    it('returns true for objects with message property', () => {
      expect(isErrorWithMessage({ message: 'test error' })).toBe(true);
    });

    it('returns false for objects without message property', () => {
      expect(isErrorWithMessage({ error: 'test error' })).toBe(false);
    });

    it('returns false for non-objects', () => {
      expect(isErrorWithMessage('test error')).toBe(false);
      expect(isErrorWithMessage(123)).toBe(false);
      expect(isErrorWithMessage(null)).toBe(false);
      expect(isErrorWithMessage(undefined)).toBe(false);
    });
  });

  describe('toErrorWithMessage', () => {
    it('handles ApiError', () => {
      const apiError = new ApiError('API error', 404);
      expect(toErrorWithMessage(apiError)).toEqual({
        message: 'API error',
      });
    });

    it('handles Error objects', () => {
      const error = new Error('test error');
      expect(toErrorWithMessage(error)).toEqual({
        message: 'test error',
      });
    });

    it('handles string errors', () => {
      expect(toErrorWithMessage('test error')).toEqual({
        message: 'test error',
      });
    });

    it('handles objects with message property', () => {
      const error = { message: 'test error' };
      expect(toErrorWithMessage(error)).toEqual(error);
    });

    it('handles unknown error types', () => {
      expect(toErrorWithMessage({})).toEqual({
        message: 'An unexpected error occurred',
      });
      expect(toErrorWithMessage(123)).toEqual({
        message: 'An unexpected error occurred',
      });
      expect(toErrorWithMessage(null)).toEqual({
        message: 'An unexpected error occurred',
      });
    });

    it('handles errors during conversion', () => {
      const error = {
        get message() {
          throw new Error('Error accessing message');
        },
      };
      expect(toErrorWithMessage(error)).toEqual({
        message: 'An unexpected error occurred',
      });
    });
  });

  describe('getErrorMessage', () => {
    it('returns message from error object', () => {
      const error = new Error('test error');
      expect(getErrorMessage(error)).toBe('test error');
    });

    it('returns message from ApiError', () => {
      const error = new ApiError('API error', 404);
      expect(getErrorMessage(error)).toBe('API error');
    });

    it('returns message from string error', () => {
      expect(getErrorMessage('test error')).toBe('test error');
    });

    it('returns default message for unknown error types', () => {
      expect(getErrorMessage({})).toBe('An unexpected error occurred');
      expect(getErrorMessage(null)).toBe('An unexpected error occurred');
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
    });
  });
});
