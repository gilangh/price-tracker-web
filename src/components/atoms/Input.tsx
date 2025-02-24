import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, helpText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-secondary-900 dark:text-secondary-200 mb-1.5 block text-sm font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`text-secondary-900 placeholder-secondary-400 focus:border-primary-500 focus:ring-primary-500 disabled:bg-secondary-50 disabled:text-secondary-500 dark:border-secondary-700 dark:bg-secondary-900 dark:text-secondary-100 dark:placeholder-secondary-500 dark:focus:border-primary-400 dark:focus:ring-primary-400 dark:disabled:bg-secondary-800 w-full rounded-lg border bg-white px-4 py-2.5 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 disabled:cursor-not-allowed ${error ? 'border-red-500 dark:border-red-500' : 'border-secondary-300'} ${className} `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helpText
                  ? `${inputId}-help`
                  : undefined
            }
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {helpText && !error && (
          <p
            id={`${inputId}-help`}
            className="text-secondary-500 dark:text-secondary-400 mt-1.5 text-sm"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
