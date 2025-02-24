import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input', () => {
  const defaultProps = {
    label: 'Test Input',
    name: 'test',
  };

  it('renders with label', () => {
    render(<Input {...defaultProps} />);

    expect(screen.getByLabelText(defaultProps.label)).toBeInTheDocument();
  });

  it('handles value changes', async () => {
    const mockOnChange = jest.fn();
    render(<Input {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByLabelText(defaultProps.label);
    await userEvent.type(input, 'test value');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('shows error state', () => {
    const error = 'This field is required';
    render(<Input {...defaultProps} error={error} />);

    const input = screen.getByLabelText(defaultProps.label);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Input {...defaultProps} disabled />);

    expect(screen.getByLabelText(defaultProps.label)).toBeDisabled();
  });

  it('renders with placeholder', () => {
    const placeholder = 'Enter value';
    render(<Input {...defaultProps} placeholder={placeholder} />);

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('handles required attribute', () => {
    render(<Input {...defaultProps} required />);

    expect(screen.getByLabelText(defaultProps.label)).toBeRequired();
  });

  it('handles type attribute', () => {
    render(<Input {...defaultProps} type="number" />);

    expect(screen.getByLabelText(defaultProps.label)).toHaveAttribute(
      'type',
      'number'
    );
  });

  it('handles onBlur event', async () => {
    const mockOnBlur = jest.fn();
    render(<Input {...defaultProps} onBlur={mockOnBlur} />);

    const input = screen.getByLabelText(defaultProps.label);
    await userEvent.click(input);
    await userEvent.tab();

    expect(mockOnBlur).toHaveBeenCalled();
  });
});
