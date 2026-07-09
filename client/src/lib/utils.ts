import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  compact: boolean = false
): string {
  if (compact) {
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a date string */
export function formatDate(
  date: string | Date,
  formatStr: string = 'MMM d, yyyy'
): string {
  return format(new Date(date), formatStr);
}

/** Format date as relative time */
export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/** Format a number with commas */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/** Format number in compact form */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Truncate text with ellipsis */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/** Generate a gradient string based on a seed */
export function generateGradient(seed: string): string {
  const gradients = [
    'from-primary-400 to-accent-500',
    'from-secondary-400 to-primary-500',
    'from-accent-400 to-secondary-500',
    'from-primary-400 to-secondary-500',
    'from-success-400 to-secondary-500',
    'from-warning-400 to-danger-500',
    'from-accent-400 to-primary-500',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

/** Get a tailwind color class for a status */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400',
    funded: 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400',
    draft: 'bg-dark-200 text-dark-600 dark:bg-dark-700 dark:text-dark-300',
    closed: 'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400',
    scheduled: 'bg-secondary-100 text-secondary-600 dark:bg-secondary-500/20 dark:text-secondary-400',
    completed: 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400',
    cancelled: 'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400',
    pending: 'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400',
    interested: 'bg-accent-100 text-accent-600 dark:bg-accent-500/20 dark:text-accent-400',
    'due-diligence': 'bg-secondary-100 text-secondary-600 dark:bg-secondary-500/20 dark:text-secondary-400',
    negotiation: 'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400',
    committed: 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400',
    declined: 'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400',
    upcoming: 'bg-secondary-100 text-secondary-600 dark:bg-secondary-500/20 dark:text-secondary-400',
    open: 'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400',
    judging: 'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400',
  };
  return colors[status] || 'bg-dark-100 text-dark-600 dark:bg-dark-700 dark:text-dark-300';
}

/** Capitalize the first letter of a string */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Delay utility */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
