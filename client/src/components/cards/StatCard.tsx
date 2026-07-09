import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  colorClassName?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  colorClassName = 'bg-primary/10 text-primary',
  className,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full p-6 border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4",
        className
      )}>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", colorClassName)}>
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider block truncate">
            {label}
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5 block truncate">
            {value}
          </span>
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block truncate">
              {description}
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
