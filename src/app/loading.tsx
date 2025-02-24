import Layout from '@/components/templates/Layout';

export default function Loading() {
  return (
    <Layout>
      <div className="w-full max-w-md animate-pulse">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-2 h-8 w-48 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-64 rounded bg-gray-200" />
        </div>

        <div className="space-y-4">
          <div className="h-12 w-full rounded bg-gray-200" />
          <div className="h-12 w-full rounded bg-gray-200" />
        </div>
      </div>
    </Layout>
  );
}
