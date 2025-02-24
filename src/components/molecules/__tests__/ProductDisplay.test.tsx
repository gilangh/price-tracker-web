import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDisplay from '../ProductDisplay';

describe('ProductDisplay', () => {
  const mockProduct = {
    barcode: '12345678',
    name: 'Test Product',
    price: 19.99,
  };

  const mockOnSearchAgain = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(
      <ProductDisplay product={mockProduct} onSearchAgain={mockOnSearchAgain} />
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.barcode)).toBeInTheDocument();
  });

  it('calls onSearchAgain when search button is clicked', async () => {
    render(
      <ProductDisplay product={mockProduct} onSearchAgain={mockOnSearchAgain} />
    );

    const searchButton = screen.getByRole('button', {
      name: /search another product/i,
    });
    await userEvent.click(searchButton);

    expect(mockOnSearchAgain).toHaveBeenCalledTimes(1);
  });

  it('renders product details section header', () => {
    render(
      <ProductDisplay product={mockProduct} onSearchAgain={mockOnSearchAgain} />
    );

    expect(screen.getByText('Product Details')).toBeInTheDocument();
  });

  it('renders labels for product information', () => {
    render(
      <ProductDisplay product={mockProduct} onSearchAgain={mockOnSearchAgain} />
    );

    expect(screen.getByText('Product Name')).toBeInTheDocument();
    expect(screen.getByText('Barcode')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
  });
});
