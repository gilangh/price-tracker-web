export interface Product {
  barcode: string;
  name: string;
  price: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface BarcodeValidationResult {
  isValid: boolean;
  error?: string;
}
