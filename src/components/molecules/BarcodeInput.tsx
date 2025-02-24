import { ChangeEvent, FormEvent, useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { BarcodeValidationResult } from '@/types';

interface BarcodeInputProps {
  onSubmit: (barcode: string) => void;
  isLoading?: boolean;
}

const validateBarcode = (barcode: string): BarcodeValidationResult => {
  if (!barcode) {
    return { isValid: false, error: 'Barcode is required' };
  }

  // Most common barcode formats are between 8 and 14 digits
  if (!/^\d{8,14}$/.test(barcode)) {
    return {
      isValid: false,
      error: 'Barcode must be between 8 and 14 digits',
    };
  }

  return { isValid: true };
};

const BarcodeInput = ({ onSubmit, isLoading = false }: BarcodeInputProps) => {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState<string>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setBarcode(value);

    // Clear error when user starts typing
    if (error) setError(undefined);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validation = validateBarcode(barcode);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    onSubmit(barcode);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <Input
        id="barcode"
        label="Enter Barcode"
        type="text"
        value={barcode}
        onChange={handleChange}
        placeholder="Enter barcode numbers"
        error={error}
        disabled={isLoading}
        inputMode="numeric"
        pattern="\d*"
        maxLength={14}
      />
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full"
      >
        Look up Product
      </Button>
    </form>
  );
};

export default BarcodeInput;
