import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingService } from '@/services/meetingService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Video } from 'lucide-react';
import toast from 'react-hot-toast';

interface MeetingSchedulerProps {
  attendeeId: string;
  attendeeName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function MeetingScheduler({
  attendeeId,
  attendeeName,
  isOpen,
  onClose,
}: MeetingSchedulerProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);

  const scheduleMutation = useMutation({
    mutationFn: (data: {
      attendeeId: string;
      title: string;
      description?: string;
      date: string;
      duration: number;
    }) => meetingService.scheduleMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('Sync meeting scheduled successfully');
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setDuration(30);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to schedule meeting');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Meeting title is required');
      return;
    }
    if (!date || !time) {
      toast.error('Date and time are required');
      return;
    }

    const combinedDateTime = new Date(`${date}T${time}`).toISOString();

    scheduleMutation.mutate({
      attendeeId,
      title,
      description,
      date: combinedDateTime,
      duration,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border dark:border-gray-800 rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="text-primary" size={20} /> Schedule Sync Meeting
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
            Book a 1-on-1 virtual call with {attendeeName}. We will autogenerate a secure Jitsi Video link for you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            label="Meeting Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Acme Pitch Deck review"
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Reviewing traction metrics, roadmaps, and capitalization table..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              type="time"
              label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Duration (minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none font-medium"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={scheduleMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={scheduleMutation.isPending} className="gap-2">
              <Video size={16} /> Schedule Sync
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default MeetingScheduler;
