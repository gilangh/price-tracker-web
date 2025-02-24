'use client';

import Layout from '@/components/templates/Layout';
import ErrorMessage from '@/components/atoms/ErrorMessage';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Layout>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Something went wrong!
          </h2>
        </div>
        <ErrorMessage
          message="An unexpected error occurred. Please try again."
          onRetry={reset}
        />
      </div>
    </Layout>
  );
}
