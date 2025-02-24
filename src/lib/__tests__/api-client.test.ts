import { apiClient, ApiError } from '../api-client';
import { API_TIMEOUT } from '../constants';

describe('apiClient', () => {
  const mockEndpoint = '/test';
  const mockData = { test: 'data' };

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  describe('get', () => {
    it('makes successful GET request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const response = await apiClient.get(mockEndpoint);

      expect(response).toEqual({
        data: mockData,
        status: 200,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(mockEndpoint),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('handles API error response', async () => {
      const errorResponse = {
        message: 'Not Found',
        status: 404,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => errorResponse,
      });

      await expect(apiClient.get(mockEndpoint)).rejects.toThrow('Not Found');
    });

    it('handles network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(apiClient.get(mockEndpoint)).rejects.toThrow(
        'Network error'
      );
    });

    it('handles timeout', async () => {
      jest.useFakeTimers();

      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);

      const fetchPromise = apiClient.get(mockEndpoint);
      jest.advanceTimersByTime(API_TIMEOUT);

      await expect(fetchPromise).rejects.toThrow('Request timeout');

      jest.useRealTimers();
    });
  });

  describe('post', () => {
    it('makes successful POST request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const response = await apiClient.post(mockEndpoint, mockData);

      expect(response).toEqual({
        data: mockData,
        status: 200,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(mockEndpoint),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockData),
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('handles API error response', async () => {
      const errorResponse = {
        message: 'Bad Request',
        status: 400,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => errorResponse,
      });

      await expect(apiClient.post(mockEndpoint, mockData)).rejects.toThrow(
        'Bad Request'
      );
    });

    it('handles network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(apiClient.post(mockEndpoint, mockData)).rejects.toThrow(
        'Network error'
      );
    });

    it('handles timeout', async () => {
      jest.useFakeTimers();

      const abortError = new Error('The operation was aborted');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValueOnce(abortError);

      const fetchPromise = apiClient.post(mockEndpoint, mockData);
      jest.advanceTimersByTime(API_TIMEOUT);

      await expect(fetchPromise).rejects.toThrow('Request timeout');

      jest.useRealTimers();
    });
  });

  describe('ApiError', () => {
    it('creates error with message and status', () => {
      const error = new ApiError('Test error', 400);

      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.name).toBe('ApiError');
    });

    it('creates error with optional data', () => {
      const data = { details: 'error details' };
      const error = new ApiError('Test error', 400, data);

      expect(error.data).toBe(data);
    });
  });
});
