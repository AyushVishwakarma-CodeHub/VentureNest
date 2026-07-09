import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glass?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, glass, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-dark-700 dark:text-dark-200"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-dark-400 dark:text-dark-500">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm text-dark-900 placeholder:text-dark-400 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-400',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:bg-dark-800 dark:text-dark-100 dark:placeholder:text-dark-500 dark:border-dark-600 dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
              glass &&
                'bg-white/60 dark:bg-dark-800/60 backdrop-blur-lg border-white/20 dark:border-dark-700/30',
              error
                ? 'border-danger-400 focus:ring-danger-400/30 focus:border-danger-400 dark:border-danger-400'
                : 'border-dark-200 dark:border-dark-600',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-dark-400 dark:text-dark-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-danger-500 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-sm text-dark-400 dark:text-dark-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
