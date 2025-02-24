import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  const mockOnRetry = jest.fn();
  const defaultMessage = 'An error occurred';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error message', () => {
    render(<ErrorMessage message={defaultMessage} />);

    expect(screen.getByText(defaultMessage)).toBeInTheDocument();
  });

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorMessage message={defaultMessage} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message={defaultMessage} />);

    const retryButton = screen.queryByRole('button', { name: /try again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    render(<ErrorMessage message={defaultMessage} onRetry={mockOnRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('renders with alert role', () => {
    render(<ErrorMessage message={defaultMessage} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders error icon', () => {
    render(<ErrorMessage message={defaultMessage} />);

    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('text-red-400', 'dark:text-red-300');
  });
});
