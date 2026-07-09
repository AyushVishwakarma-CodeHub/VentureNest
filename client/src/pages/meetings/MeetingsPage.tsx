import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingService, Meeting } from '@/services/meetingService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Video, 
  XCircle, 
  CheckCircle, 
  Plus,
  CalendarDays
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

export function MeetingsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: meetingsRes, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: () => meetingService.getMeetings(),
  });

  const meetings = meetingsRes?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'completed' | 'cancelled' }) => 
      meetingService.updateMeetingStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success(`Meeting marked as ${variables.status}`);
    },
    onError: () => {
      toast.error('Failed to update meeting status');
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
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <CalendarDays className="text-primary" /> Meeting Board
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Synchronize calls with partners, mentors, and prospective VC partners.
        </p>
      </div>

      {/* Meetings list */}
      <div className="space-y-4">
        {meetings.length === 0 ? (
          <Card className="border border-dashed border-gray-300 dark:border-gray-800 bg-white/20 dark:bg-slate-900/20 p-12 text-center rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400 mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">No syncs scheduled</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-md mx-auto">
              You don't have any video conferences scheduled. You can initiate calls directly from founder/investor profile cards.
            </p>
          </Card>
        ) : (
          meetings.map((meeting) => {
            const isHost = String(meeting.host._id) === String(user?._id);
            const otherParty = isHost ? meeting.attendee : meeting.host;
            const meetingDate = new Date(meeting.date);

            return (
              <Card 
                key={meeting._id}
                className="p-5 md:p-6 border border-gray-250/70 bg-white/50 dark:border-gray-850 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex gap-4 items-start md:items-center">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-800">
                      <img src={otherParty.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${otherParty.firstName}`} alt={otherParty.firstName} />
                    </Avatar>
                    <Badge 
                      className="absolute -bottom-1.5 -right-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      variant={otherParty.role === 'investor' ? 'default' : 'secondary'}
                    >
                      {otherParty.role}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                      {meeting.title}
                    </h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Syncing with {otherParty.firstName} {otherParty.lastName} ({otherParty.email})
                    </p>
                    {meeting.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-lg italic line-clamp-1">
                        "{meeting.description}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-200/50 dark:border-gray-800">
                  <div className="space-y-1 text-left md:text-right shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-semibold">
                      <Calendar size={14} className="text-primary" />
                      {meetingDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <Clock size={14} />
                      {meetingDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} ({meeting.duration}m)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {meeting.status === 'scheduled' ? (
                      <>
                        {meeting.videoLink && (
                          <Button 
                            className="bg-green-500 hover:bg-green-600 text-white gap-1.5 py-2.5 h-auto text-xs"
                            onClick={() => window.open(meeting.videoLink, '_blank')}
                          >
                            <Video size={14} /> Launch Jitsi
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-9 w-9 p-0 text-danger hover:bg-danger/5 rounded-full"
                          title="Cancel meeting"
                          onClick={() => updateStatusMutation.mutate({ id: meeting._id, status: 'cancelled' })}
                        >
                          <XCircle size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-9 w-9 p-0 text-green-500 hover:bg-green-500/5 rounded-full"
                          title="Mark completed"
                          onClick={() => updateStatusMutation.mutate({ id: meeting._id, status: 'completed' })}
                        >
                          <CheckCircle size={18} />
                        </Button>
                      </>
                    ) : (
                      <Badge 
                        variant={meeting.status === 'completed' ? 'success' : 'danger'}
                        className="capitalize font-semibold text-xs py-1 px-3 rounded-full"
                      >
                        {meeting.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
export default MeetingsPage;
