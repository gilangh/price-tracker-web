import { Product } from '@/types';
import Button from '../atoms/Button';

interface ProductDisplayProps {
  product: Product;
  onSearchAgain: () => void;
}

const ProductDisplay = ({ product, onSearchAgain }: ProductDisplayProps) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  return (
    <div className="animate-slide-up border-secondary-200 dark:border-secondary-700 dark:bg-secondary-800 w-full max-w-md overflow-hidden rounded-lg border bg-white shadow-sm transition-colors duration-200">
      <div className="border-secondary-200 bg-secondary-50 dark:border-secondary-700 dark:bg-secondary-900 border-b px-6 py-4">
        <h3 className="text-secondary-900 dark:text-secondary-100 text-lg font-medium">
          Product Details
        </h3>
      </div>
      <div className="p-6">
        <dl className="space-y-6">
          <div>
            <dt className="text-secondary-500 dark:text-secondary-400 text-sm font-medium">
              Product Name
            </dt>
            <dd className="text-secondary-900 dark:text-secondary-100 mt-1 text-lg font-semibold">
              {product.name}
            </dd>
          </div>

          <div>
            <dt className="text-secondary-500 dark:text-secondary-400 text-sm font-medium">
              Barcode
            </dt>
            <dd className="text-secondary-900 dark:text-secondary-100 mt-1 font-mono text-base">
              {product.barcode}
            </dd>
          </div>

          <div>
            <dt className="text-secondary-500 dark:text-secondary-400 text-sm font-medium">
              Price
            </dt>
            <dd className="text-primary-600 dark:text-primary-400 mt-1 text-2xl font-bold">
              {formattedPrice}
            </dd>
          </div>
        </dl>

        <div className="mt-8">
          <Button variant="outline" onClick={onSearchAgain} className="w-full">
            Search Another Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
