import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import BarcodeInput from '../BarcodeInput';

const mockOnSubmit = jest.fn();

const setup = () => {
  render(<BarcodeInput onSubmit={mockOnSubmit} />);

  const input = screen.getByLabelText(/enter barcode/i);
  const submitButton = screen.getByRole('button', {
    name: /look up product/i,
  });

  return { input, submitButton };
};

describe('BarcodeInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<BarcodeInput onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('Enter Barcode')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /look up product/i })
    ).toBeInTheDocument();
  });

  it('handles valid barcode submission', async () => {
    render(<BarcodeInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText('Enter Barcode');
    const submitButton = screen.getByRole('button', {
      name: /look up product/i,
    });

    await userEvent.type(input, '12345678');
    await act(async () => {
      await userEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith('12345678');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows error for invalid barcode', async () => {
    render(<BarcodeInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText('Enter Barcode');
    const submitButton = screen.getByRole('button', {
      name: /look up product/i,
    });

    await userEvent.type(input, '123');
    await act(async () => {
      await userEvent.click(submitButton);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Barcode must be between 8 and 14 digits'
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error for empty barcode', async () => {
    const { input, submitButton } = setup();

    // Type a valid barcode and clear it to enable the submit button
    await act(async () => {
      await userEvent.type(input, '12345678');
      await userEvent.clear(input);
      await userEvent.click(submitButton);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Barcode is required'
      );
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('disables input and button when loading', () => {
    render(<BarcodeInput onSubmit={mockOnSubmit} isLoading={true} />);

    const input = screen.getByLabelText('Enter Barcode');
    const submitButton = screen.getByRole('button', { name: /loading/i });

    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('clears error when user starts typing', async () => {
    const { input, submitButton } = setup();

    // Type a valid barcode and clear it to enable the submit button
    await act(async () => {
      await userEvent.type(input, '12345678');
      await userEvent.clear(input);
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Barcode is required'
      );
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    // Start typing
    await act(async () => {
      await userEvent.type(input, '1');
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('trims whitespace from input', async () => {
    render(<BarcodeInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText('Enter Barcode');
    const submitButton = screen.getByRole('button', {
      name: /look up product/i,
    });

    await userEvent.type(input, '  12345678  ');
    await act(async () => {
      await userEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith('12345678');
  });
});
