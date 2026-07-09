import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mentorService, Mentor } from '@/services/mentorService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Star, 
  MessageSquare, 
  Calendar, 
  UserCheck, 
  Award,
  Video
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MeetingScheduler } from '@/components/shared/MeetingScheduler';

export function MentorProfilePage() {
  const queryClient = useQueryClient();
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  
  const [reviewMentor, setReviewMentor] = useState<Mentor | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: mentorsRes, isLoading } = useQuery({
    queryKey: ['mentors'],
    queryFn: () => mentorService.listMentors(),
  });

  const mentors = mentorsRes?.data || [];

  const reviewMutation = useMutation({
    mutationFn: (data: { mentorId: string; rating: number; comment: string }) => 
      mentorService.submitReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast.success('Review submitted successfully');
      setReviewMentor(null);
      setComment('');
      setRating(5);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  });

  const handleOpenScheduler = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setSchedulerOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.length < 10) {
      toast.error('Comment must be at least 10 characters');
      return;
    }
    if (!reviewMentor) return;

    reviewMutation.mutate({
      mentorId: reviewMentor._id,
      rating,
      comment,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Award className="text-primary" /> Verified Mentors
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Receive professional support, pitch deck mock checks, and strategy session guidance from YC/VC veterans.
        </p>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mentors.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 text-gray-400">
            No mentors are currently listed. Please check back later.
          </div>
        ) : (
          mentors.map((mentor) => (
            <Card 
              key={mentor._id}
              className="p-6 border border-gray-200/60 bg-white/50 dark:border-gray-800/60 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl flex flex-col justify-between gap-6 hover:shadow-md transition-all duration-300"
            >
              {/* Profile Card Header */}
              <div className="flex gap-4 items-start">
                <Avatar className="h-16 w-16 border border-gray-200 dark:border-gray-850">
                  <img src={mentor.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${mentor.firstName}`} alt={mentor.firstName} />
                </Avatar>
                <div>
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-lg">
                    {mentor.firstName} {mentor.lastName}
                  </h3>
                  <p className="text-sm text-primary font-semibold mt-0.5">
                    {mentor.headline || "Industry Mentor & Advisor"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                    {mentor.bio || "Experienced product manager and strategy advisor specializing in early-stage software architecture and business roadmap scaling."}
                  </p>
                </div>
              </div>

              {/* Interests tag list */}
              {mentor.interests && mentor.interests.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {mentor.interests.map((int) => (
                    <Badge key={int} variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                      {int}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions & rating footer */}
              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-850 pt-4 mt-2">
                <div className="flex items-center gap-1 text-sm font-extrabold text-gray-900 dark:text-white">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  4.8 <span className="text-xs text-gray-400 font-normal">(12 reviews)</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs font-semibold py-2 px-3 h-auto"
                    onClick={() => setReviewMentor(mentor)}
                  >
                    <MessageSquare size={14} className="mr-1.5" /> Rate Mentor
                  </Button>
                  <Button 
                    size="sm"
                    className="text-xs font-semibold py-2 px-3 h-auto"
                    onClick={() => handleOpenScheduler(mentor)}
                  >
                    <Calendar size={14} className="mr-1.5" /> Book Sync
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Meeting Scheduler Integration */}
      {selectedMentor && (
        <MeetingScheduler
          attendeeId={selectedMentor._id}
          attendeeName={`${selectedMentor.firstName} ${selectedMentor.lastName}`}
          isOpen={schedulerOpen}
          onClose={() => setSchedulerOpen(false)}
        />
      )}

      {/* Review Dialog */}
      <Dialog open={reviewMentor !== null} onOpenChange={() => setReviewMentor(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border dark:border-gray-800 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="text-yellow-500 fill-current" size={20} /> Rate Mentor
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Submit your feedback rating for {reviewMentor?.firstName} {reviewMentor?.lastName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReviewSubmit} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block">Rating Stars</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-yellow-500 focus:outline-none"
                  >
                    <Star 
                      size={28} 
                      className={star <= rating ? "fill-current" : "text-gray-300 dark:text-gray-700"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block">Review Comments</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your session experience with this mentor. Minimum 10 characters..."
                rows={4}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-150 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={() => setReviewMentor(null)} disabled={reviewMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={reviewMutation.isPending}>
                Submit Rating
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default MentorProfilePage;
