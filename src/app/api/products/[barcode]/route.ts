import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// Route segment config
export const runtime = 'edge';
export const preferredRegion = 'auto';
export const revalidate = 3600; // Revalidate every hour

// Mock database
const products: Record<string, Product> = {
  '12345678': {
    barcode: '12345678',
    name: 'Sample Product 1',
    price: 19.99,
  },
  '87654321': {
    barcode: '87654321',
    name: 'Sample Product 2',
    price: 29.99,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { barcode: string } }
) {
  try {
    const barcode = await params.barcode;

    // Get cache tag for this product
    const cacheTag = `product-${barcode}`;

    // Add cache-control headers
    const headers = {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control':
        'public, s-maxage=3600, stale-while-revalidate=86400',
      'Vercel-CDN-Cache-Control':
        'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/json',
      Tag: cacheTag,
    };

    // Simulate network delay only in development
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Lookup product
    const product = products[barcode];

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        {
          status: 404,
          headers: {
            ...headers,
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
          },
        }
      );
    }

    return NextResponse.json(product, { headers });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
