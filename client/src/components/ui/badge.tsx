import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400',
        secondary: 'bg-dark-100 text-dark-600 dark:bg-dark-700 dark:text-dark-300',
        success: 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400',
        warning: 'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400',
        danger: 'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400',
        outline:
          'border border-dark-200 text-dark-600 dark:border-dark-600 dark:text-dark-300 bg-transparent',
        gradient:
          'bg-gradient-to-r from-primary-400 to-accent-500 text-white shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
