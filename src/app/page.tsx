'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/templates/Layout';
import BarcodeInput from '@/components/molecules/BarcodeInput';
import ProductDisplay from '@/components/molecules/ProductDisplay';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useProduct } from '@/hooks/useProduct';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const preferredRegion = 'auto';

function LoadingFallback() {
  return (
    <div className="w-full max-w-md animate-pulse">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-2 h-8 w-48 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mx-auto h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="space-y-4">
        <div className="h-12 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-12 w-full rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

function HomeContent() {
  const { product, error, isLoading, lookupProduct, reset } = useProduct();
  const [hasSearched, setHasSearched] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle initial barcode from URL
  useEffect(() => {
    const barcode = searchParams.get('barcode');
    if (barcode && !hasSearched) {
      handleSubmit(barcode);
    }
  }, [searchParams]);

  const handleSubmit = async (barcode: string) => {
    setHasSearched(true);
    // Update URL with barcode
    router.push(`/?barcode=${barcode}`);
    await lookupProduct(barcode);
  };

  const handleSearchAgain = () => {
    setHasSearched(false);
    reset();
    // Remove barcode from URL
    router.push('/');
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] w-full flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Barcode Price Lookup
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a barcode to find product details and pricing
          </p>
        </div>

        {!hasSearched || (!product && !error) ? (
          <BarcodeInput onSubmit={handleSubmit} isLoading={isLoading} />
        ) : error ? (
          <div className="space-y-4">
            <ErrorMessage message={error} onRetry={handleSearchAgain} />
          </div>
        ) : (
          product && (
            <ProductDisplay
              product={product}
              onSearchAgain={handleSearchAgain}
            />
          )
        )}

        {/* Sample barcodes for testing */}
        {!hasSearched && (
          <div className="mt-8 text-center">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Try these sample barcodes:
            </p>
            <div className="space-x-4">
              <button
                onClick={() => handleSubmit('12345678')}
                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                12345678
              </button>
              <button
                onClick={() => handleSubmit('87654321')}
                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                87654321
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <HomeContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}
