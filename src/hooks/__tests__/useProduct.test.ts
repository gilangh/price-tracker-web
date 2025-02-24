import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { toast } from 'sonner';
import { useProduct } from '../useProduct';
import { productService } from '@/lib/services/product-service';
import { ApiError } from '@/lib/api-client';

// Mock the product service and toast
jest.mock('@/lib/services/product-service', () => ({
  productService: {
    getByBarcode: jest.fn(),
  },
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useProduct', () => {
  const mockProduct = {
    barcode: '12345678',
    name: 'Test Product',
    price: 19.99,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useProduct());

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBeFalsy();
  });

  it('successfully fetches product', async () => {
    (productService.getByBarcode as jest.Mock).mockResolvedValueOnce(
      mockProduct
    );
    const { result } = renderHook(() => useProduct());

    await act(async () => {
      await result.current.lookupProduct('12345678');
    });

    await waitFor(() => {
      expect(result.current.product).toEqual(mockProduct);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBeFalsy();
      expect(toast.success).toHaveBeenCalledWith(`Found "${mockProduct.name}"`);
    });
  });

  it('handles product not found error', async () => {
    const error = new ApiError('Product not found', 404);
    (productService.getByBarcode as jest.Mock).mockRejectedValueOnce(error);
    const { result } = renderHook(() => useProduct());

    await act(async () => {
      await result.current.lookupProduct('12345678');
    });

    await waitFor(() => {
      expect(result.current.product).toBeNull();
      expect(result.current.error).toBe('Product not found');
      expect(result.current.isLoading).toBeFalsy();
      expect(toast.error).toHaveBeenCalledWith('Product not found');
    });
  });

  it('handles network error', async () => {
    const error = new ApiError('Network error', 500);
    (productService.getByBarcode as jest.Mock).mockRejectedValueOnce(error);
    const { result } = renderHook(() => useProduct());

    await act(async () => {
      await result.current.lookupProduct('12345678');
    });

    await waitFor(() => {
      expect(result.current.product).toBeNull();
      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBeFalsy();
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to fetch product information'
      );
    });
  });

  it('handles unexpected error', async () => {
    const error = new Error('Unexpected error');
    (productService.getByBarcode as jest.Mock).mockRejectedValueOnce(error);
    const { result } = renderHook(() => useProduct());

    await act(async () => {
      await result.current.lookupProduct('12345678');
    });

    await waitFor(() => {
      expect(result.current.product).toBeNull();
      expect(result.current.error).toBe('Unexpected error');
      expect(result.current.isLoading).toBeFalsy();
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred');
    });
  });

  it('resets state', async () => {
    const { result } = renderHook(() => useProduct());

    await act(async () => {
      result.current.reset();
    });

    expect(result.current.product).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBeFalsy();
  });

  it('uses cached product data', async () => {
    (productService.getByBarcode as jest.Mock).mockResolvedValueOnce(
      mockProduct
    );
    const { result } = renderHook(() => useProduct());

    // First call to populate cache
    await act(async () => {
      await result.current.lookupProduct('12345678');
    });

    // Reset mock to verify it's not called again
    (productService.getByBarcode as jest.Mock).mockClear();

    // Second call should use cached data
    await act(async () => {
      await result.current.lookupProduct('12345678');
    });

    await waitFor(() => {
      expect(result.current.product).toEqual(mockProduct);
      expect(productService.getByBarcode).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        `Found "${mockProduct.name}" (cached)`
      );
    });
  });

  it('aborts previous request when new request is made', async () => {
    const abortController = new AbortController();
    const abortSpy = jest.spyOn(abortController, 'abort');
    global.AbortController = jest.fn(
      () => abortController
    ) as unknown as typeof AbortController;

    // Mock a delayed response for the first request
    (productService.getByBarcode as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() => useProduct());

    // Start first request (will be aborted)
    const firstRequest = act(async () => {
      await result.current.lookupProduct('12345678');
    });

    // Start second request before first one completes
    await act(async () => {
      await result.current.lookupProduct('87654321');
    });

    // Ensure first request was aborted
    expect(abortSpy).toHaveBeenCalled();

    // Clean up first request
    await firstRequest;
  });
});
