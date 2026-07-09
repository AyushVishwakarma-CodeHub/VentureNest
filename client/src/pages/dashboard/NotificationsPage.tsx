import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { NotificationCard } from '@/components/cards/NotificationCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, CheckSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notificationsRes, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  const { notifications = [], unreadCount = 0 } = notificationsRes?.data || {};

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    },
    onError: () => {
      toast.error('Failed to delete notification');
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to clear notifications');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Bell className="text-primary" /> Notifications
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            You have {unreadCount} unread message{unreadCount !== 1 && 's'}.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button 
            onClick={() => markAllReadMutation.mutate()} 
            disabled={markAllReadMutation.isPending}
            className="flex items-center gap-2"
          >
            <CheckSquare size={16} /> Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="border border-dashed border-gray-300 dark:border-gray-800 bg-white/20 dark:bg-slate-900/20 p-12 text-center rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400 mb-4">
              <Bell size={28} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">All Caught Up!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-md mx-auto">
              You don't have any notifications right now. We'll let you know when investors message you, request meetings, or pitch decks get reviewed.
            </p>
          </Card>
        ) : (
          notifications.map((item) => (
            <NotificationCard
              key={item._id}
              notification={item}
              onMarkAsRead={(id) => markReadMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
export default NotificationsPage;
