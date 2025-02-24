import { NextResponse } from 'next/server';
import { productService } from '@/lib/services/product-service';
import { generateMetadata } from '@/app/metadata';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get('barcode');

  if (!barcode) {
    return NextResponse.json(generateMetadata());
  }

  try {
    const product = await productService.getByBarcode(barcode);
    return NextResponse.json(generateMetadata(product));
  } catch {
    return NextResponse.json(generateMetadata());
  }
}
