import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types';
import { productService } from '@/lib/services/product-service';
import { ApiError } from '@/lib/api-client';
import { getErrorMessage } from '@/utils/error-handler';

interface UseProductReturn {
  product: Product | null;
  error: string | null;
  isLoading: boolean;
  lookupProduct: (barcode: string) => Promise<void>;
  reset: () => void;
}

interface CacheItem {
  data: Product;
  timestamp: number;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const useProduct = (): UseProductReturn => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, CacheItem>>(new Map());

  const cleanCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of cacheRef.current.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        cacheRef.current.delete(key);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setProduct(null);
    setError(null);
    setIsLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    cacheRef.current.clear();
  }, []);

  const lookupProduct = useCallback(
    async (barcode: string) => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);
      setProduct(null);

      try {
        // Clean up old cache entries
        cleanCache();

        // Check cache first
        const cached = cacheRef.current.get(barcode);
        if (cached && Date.now() - cached.timestamp <= CACHE_DURATION) {
          setProduct(cached.data);
          toast.success(`Found "${cached.data.name}" (cached)`);
          return;
        }

        const data = await productService.getByBarcode(barcode);

        // Update cache with timestamp
        cacheRef.current.set(barcode, {
          data,
          timestamp: Date.now(),
        });

        setProduct(data);
        toast.success(`Found "${data.name}"`);
      } catch (err) {
        // Ignore aborted requests
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        const errorMessage = getErrorMessage(err);
        setError(errorMessage);

        if (err instanceof ApiError) {
          if (err.status === 404) {
            toast.error('Product not found');
          } else {
            toast.error('Failed to fetch product information');
          }
        } else {
          toast.error('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [cleanCache]
  );

  return {
    product,
    error,
    isLoading,
    lookupProduct,
    reset,
  };
};
