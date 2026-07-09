import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionService, CompetitionSubmission } from '@/services/competitionService';
import { startupService } from '@/services/startupService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Trophy, 
  BookOpen, 
  FileText, 
  Play, 
  Sliders, 
  Check, 
  Star,
  Users,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

export function CompetitionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isJudge = ['investor', 'mentor', 'admin'].includes(user?.role || '');

  const [activeTab, setActiveTab] = useState<'overview' | 'submissions'>('overview');
  
  // Submit Entry Form State
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [pitchDeckUrl, setPitchDeckUrl] = useState('');
  const [videoDemoUrl, setVideoDemoUrl] = useState('');
  const [entryDescription, setEntryDescription] = useState('');

  // Judging score state
  const [votingSubmissionId, setVotingSubmissionId] = useState<string | null>(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  // 1. Fetch competition
  const { data: compRes, isLoading: compLoading } = useQuery({
    queryKey: ['competition', id],
    queryFn: () => id ? competitionService.getCompetition(id) : Promise.reject(),
    enabled: !!id,
  });

  const competition = compRes?.data;

  // 2. Fetch submissions
  const { data: subsRes, isLoading: subsLoading } = useQuery({
    queryKey: ['submissions', id],
    queryFn: () => id ? competitionService.getSubmissions(id) : Promise.reject(),
    enabled: !!id,
  });

  const submissions = subsRes?.data || [];

  // 3. Fetch current user's startups to fill submit dropdown
  const { data: startupRes } = useQuery({
    queryKey: ['my-startup'],
    queryFn: () => startupService.getMyStartup(),
    enabled: user?.role === 'entrepreneur',
  });

  const myStartup = startupRes?.data;

  // 4. Submit Entry Mutator
  const submitEntryMutation = useMutation({
    mutationFn: (data: {
      competitionId: string;
      startupId: string;
      pitchDeckUrl?: string;
      videoDemoUrl?: string;
      description?: string;
    }) => competitionService.submitEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', id] });
      queryClient.invalidateQueries({ queryKey: ['competition', id] });
      toast.success('Entry submitted to competition!');
      // Reset form
      setSelectedStartupId('');
      setPitchDeckUrl('');
      setVideoDemoUrl('');
      setEntryDescription('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to submit entry');
    }
  });

  // 5. Submit Judge Vote Mutator
  const voteMutation = useMutation({
    mutationFn: (data: { submissionId: string; score: number; comment?: string }) => 
      competitionService.voteSubmission(data.submissionId, data.score, data.comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions', id] });
      toast.success('Vote recorded successfully');
      setVotingSubmissionId(null);
      setScore(5);
      setComment('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to register vote');
    }
  });

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!selectedStartupId) {
      toast.error('Please select one of your startups');
      return;
    }

    submitEntryMutation.mutate({
      competitionId: id,
      startupId: selectedStartupId,
      pitchDeckUrl,
      videoDemoUrl,
      description: entryDescription,
    });
  };

  const handleVoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!votingSubmissionId) return;

    voteMutation.mutate({
      submissionId: votingSubmissionId,
      score,
      comment,
    });
  };

  if (compLoading || !competition) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-250/60 dark:border-gray-850">
        <div className="space-y-2">
          <Link to="/dashboard/competitions" className="text-xs text-primary font-bold hover:underline">
            &larr; Back to Competitions
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-primary" /> {competition.title}
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Organized by {competition.organizer.firstName} {competition.organizer.lastName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="text-xs px-3 py-1 font-semibold rounded-full capitalize" variant={competition.status === 'active' ? 'success' : 'default'}>
            {competition.status}
          </Badge>
          <div className="text-sm font-extrabold text-green-500 bg-green-500/10 px-3.5 py-1.5 rounded-full border border-green-500/20">
            Prize Pool: ${competition.prizePool.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Overview & Submissions
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'submissions'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Leaderboard & Judging ({submissions.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT/MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              {/* Competition Rules & Description */}
              <Card className="p-6 border border-gray-200/60 bg-white/50 dark:border-gray-800/60 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl space-y-4">
                <h3 className="font-extrabold text-gray-950 dark:text-white text-lg flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" /> Rules & Criteria
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                  {competition.description}
                </p>
                <div className="p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed font-medium">
                  {competition.rules}
                </div>
              </Card>

              {/* Startup Entry Submission form */}
              {user?.role === 'entrepreneur' && competition.status === 'active' && (
                <Card className="p-6 border border-gray-200/60 bg-white/50 dark:border-gray-800/60 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl space-y-4">
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-lg flex items-center gap-2">
                    <Trophy size={18} className="text-primary" /> Submit Startup Pitch
                  </h3>
                  <form onSubmit={handleEntrySubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block">Choose Startup</label>
                      <select
                        value={selectedStartupId}
                        onChange={(e) => setSelectedStartupId(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none font-bold"
                        required
                      >
                        <option value="">-- Select Startup --</option>
                        {myStartup && (
                          <option value={myStartup._id}>{myStartup.name}</option>
                        )}
                      </select>
                      {!myStartup && (
                        <p className="text-xs text-red-500 font-semibold mt-1">
                          No registered startup found. Create a startup profile first.
                        </p>
                      )}
                    </div>

                    <Input
                      label="Pitch Deck Document Link"
                      value={pitchDeckUrl}
                      onChange={(e) => setPitchDeckUrl(e.target.value)}
                      placeholder="e.g. Docsend or Google Drive URL"
                    />

                    <Input
                      label="Video Pitch/Demo Link"
                      value={videoDemoUrl}
                      onChange={(e) => setVideoDemoUrl(e.target.value)}
                      placeholder="e.g. Loom or YouTube video URL"
                    />

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider block">Brief Pitch Summary</label>
                      <textarea
                        value={entryDescription}
                        onChange={(e) => setEntryDescription(e.target.value)}
                        placeholder="Provide details on product, team, and problem solved..."
                        rows={4}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-800 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none"
                      />
                    </div>

                    <Button type="submit" disabled={submitEntryMutation.isPending} className="w-full">
                      Submit Project Entry
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Submissions list / Leaderboard */}
              {submissions.length === 0 ? (
                <Card className="p-8 text-center text-gray-450 rounded-3xl border border-dashed bg-white/20">
                  No startup entries have been submitted to this competition.
                </Card>
              ) : (
                submissions.map((sub, idx) => (
                  <Card 
                    key={sub._id}
                    className="p-5 border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex gap-4 items-start">
                      {/* Rank Indicator */}
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-150">
                            <img src={sub.startup.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${sub.startup.name}`} alt={sub.startup.name} />
                          </Avatar>
                          <div>
                            <Link to={`/dashboard/startups/${sub.startup.slug}`} className="font-extrabold text-gray-950 dark:text-white hover:text-primary transition-colors text-base leading-tight">
                              {sub.startup.name}
                            </Link>
                            <p className="text-xs text-gray-450 dark:text-gray-400 font-semibold">{sub.startup.tagline}</p>
                          </div>
                        </div>

                        {sub.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
                            "{sub.description}"
                          </p>
                        )}

                        {/* Resource links */}
                        <div className="flex gap-2.5">
                          {sub.pitchDeckUrl && (
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 rounded-lg text-primary hover:bg-primary/5 gap-1" onClick={() => window.open(sub.pitchDeckUrl, '_blank')}>
                              <FileText size={12} /> Deck Document
                            </Button>
                          )}
                          {sub.videoDemoUrl && (
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 rounded-lg text-green-500 hover:bg-green-500/5 gap-1" onClick={() => window.open(sub.videoDemoUrl, '_blank')}>
                              <Play size={12} /> Pitch Video
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-end gap-3 w-full md:w-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-800">
                      <div className="text-right space-y-0.5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Average Score</span>
                        <div className="flex items-center gap-1 font-extrabold text-gray-900 dark:text-white text-lg">
                          <Star size={16} className="text-yellow-500 fill-current" />
                          {sub.score}/10
                        </div>
                      </div>
                      
                      {isJudge && competition.status === 'active' && (
                        <Button size="sm" className="text-[10px] h-7 px-2.5 rounded-lg" onClick={() => setVotingSubmissionId(sub._id)}>
                          <Sliders size={12} className="mr-1" /> Score
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT INFO CARD COLUMN */}
        <div className="space-y-6">
          <Card className="p-6 border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-150 dark:border-gray-850">
              <Award size={18} className="text-primary" /> Competition Details
            </h3>
            
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Status</span>
                <span className="capitalize font-bold text-gray-900 dark:text-white">{competition.status}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Prize Pool</span>
                <span className="text-green-500 font-bold">${competition.prizePool.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Total Entries</span>
                <span className="text-gray-900 dark:text-white font-bold">{competition.participantsCount}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Start Date</span>
                <span className="text-gray-900 dark:text-white font-bold">{new Date(competition.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">End Date</span>
                <span className="text-gray-900 dark:text-white font-bold">{new Date(competition.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Judging Vote Dialog */}
      <Dialog open={votingSubmissionId !== null} onOpenChange={() => setVotingSubmissionId(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border dark:border-gray-800 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sliders className="text-primary" size={20} /> Submission Scorecard
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Rate the deck and demo material for this startup from 1 to 10 stars.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVoteSubmit} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider block">Score Stars ({score}/10)</label>
              <div className="flex gap-1.5 justify-center py-2 bg-gray-50 dark:bg-slate-800/40 rounded-2xl border">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setScore(star)}
                    className="text-yellow-500 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={20} 
                      className={star <= score ? "fill-current" : "text-gray-300 dark:text-gray-700"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider block">Feedback Comments</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write feedback comments for the founder..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-150 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={() => setVotingSubmissionId(null)} disabled={voteMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={voteMutation.isPending}>
                Submit Score
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CompetitionDetailsPage;
