import { Metadata } from 'next';
import { Product } from '@/types';

export function generateMetadata(product?: Product): Metadata {
  const baseTitle = process.env.NEXT_PUBLIC_APP_NAME || 'Barcode Price Tracker';

  if (!product) {
    return {
      title: baseTitle,
      description: 'Look up product prices by entering a barcode',
    };
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const title = `${product.name} - ${formattedPrice} | ${baseTitle}`;
  const description = `Price information for ${product.name} (Barcode: ${product.barcode})`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og?barcode=${product.barcode}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
