import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary-400 via-accent-500 to-secondary-500 text-white shadow-lg shadow-primary-400/25 hover:shadow-xl hover:shadow-primary-400/30 hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'bg-dark-100 text-dark-900 hover:bg-dark-200 dark:bg-dark-700 dark:text-dark-100 dark:hover:bg-dark-600 shadow-sm hover:shadow-md',
        outline:
          'border-2 border-primary-400/30 text-primary-500 hover:bg-primary-50 hover:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-500/10 dark:border-primary-400/30 dark:hover:border-primary-400',
        ghost:
          'text-dark-600 hover:bg-dark-100 hover:text-dark-900 dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-dark-100',
        danger:
          'bg-danger-500 text-white shadow-lg shadow-danger-500/25 hover:bg-danger-600 hover:shadow-xl hover:shadow-danger-500/30 hover:-translate-y-0.5',
        success:
          'bg-success-500 text-white shadow-lg shadow-success-500/25 hover:bg-success-600 hover:shadow-xl hover:shadow-success-500/30 hover:-translate-y-0.5',
        link: 'text-primary-500 underline-offset-4 hover:underline dark:text-primary-400 p-0 h-auto',
      },
      size: {
        sm: 'h-9 px-4 text-sm rounded-lg',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.97 }}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
