import { productService } from '../product-service';
import { ApiError } from '../../api-client';
import { API_BASE_URL } from '../../constants';

describe('productService', () => {
  const mockProduct = {
    barcode: '12345678',
    name: 'Test Product',
    price: 19.99,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
    // Mock the global fetch function
    global.fetch = jest.fn();
  });

  it('fetches product by barcode successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockProduct,
    });

    const result = await productService.getByBarcode('12345678');

    expect(result).toEqual(mockProduct);
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/products/12345678`,
      expect.objectContaining({
        signal: expect.any(Object),
      })
    );
  });

  it('handles 404 error when product is not found', async () => {
    const error = { message: 'Product not found' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => error,
    });

    await expect(productService.getByBarcode('12345678')).rejects.toThrow(
      'Product not found'
    );
  });

  it('handles network error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(productService.getByBarcode('12345678')).rejects.toThrow(
      'Network error'
    );
  });

  it('handles server error', async () => {
    const error = { message: 'Internal Server Error' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => error,
    });

    await expect(productService.getByBarcode('12345678')).rejects.toThrow(
      'Internal Server Error'
    );
  });

  it('handles invalid JSON response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    await expect(productService.getByBarcode('12345678')).rejects.toThrow(
      'Invalid JSON'
    );
  });

  it('handles API timeout', async () => {
    const timeoutError = new ApiError('Request timeout', 408);
    (global.fetch as jest.Mock).mockRejectedValueOnce(timeoutError);

    await expect(productService.getByBarcode('12345678')).rejects.toThrow(
      'Request timeout'
    );
  });
});
