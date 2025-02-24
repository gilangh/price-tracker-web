export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_TIMEOUT = Number(process.env.API_TIMEOUT) || 5000;

export const API_ENDPOINTS = {
  PRODUCT: '/products',
} as const;

export const CACHE_KEYS = {
  PRODUCT: 'product',
} as const;
