import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  Trophy, 
  Award,
  Trash2,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Notification } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const TYPE_CONFIG = {
  investment: { icon: DollarSign, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  meeting: { icon: Calendar, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  message: { icon: MessageSquare, color: 'bg-primary/10 text-primary border-primary/20' },
  review: { icon: Award, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  competition: { icon: Trophy, color: 'bg-accent/10 text-accent border-accent/20' },
  system: { icon: Bell, color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' },
};

export function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const Icon = config.icon;

  const cardContent = (
    <div className="flex gap-4 items-start">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", config.color)}>
        <Icon size={18} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className={cn("font-bold text-sm leading-snug", notification.read ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-white")}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0 mt-0.5">
            {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full text-primary hover:text-primary-600 hover:bg-primary/5"
            onClick={(e) => {
              e.preventDefault();
              onMarkAsRead(notification._id);
            }}
            title="Mark as read"
          >
            <Circle size={14} fill="currentColor" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-danger hover:bg-danger/5"
          onClick={(e) => {
            e.preventDefault();
            onDelete(notification._id);
          }}
          title="Delete alert"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "p-4 border transition-all duration-200 rounded-2xl overflow-hidden",
        notification.read 
          ? "border-gray-200/40 bg-white/20 dark:border-gray-800/40 dark:bg-slate-900/20 opacity-75" 
          : "border-gray-250 bg-white/60 dark:border-gray-850 dark:bg-slate-900/60 shadow-sm border-l-4 border-l-primary"
      )}>
        {notification.actionUrl ? (
          <Link to={notification.actionUrl} className="block hover:opacity-90">
            {cardContent}
          </Link>
        ) : (
          <div>{cardContent}</div>
        )}
      </Card>
    </motion.div>
  );
}
