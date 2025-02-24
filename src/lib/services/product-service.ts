import { Product } from '@/types';
import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../constants';

export const productService = {
  getByBarcode: async (barcode: string): Promise<Product> => {
    const response = await apiClient.get<Product>(
      `${API_ENDPOINTS.PRODUCT}/${barcode}`
    );
    return response.data!;
  },
};
