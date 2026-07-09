import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionService, Competition } from '@/services/competitionService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Trophy, 
  Calendar, 
  DollarSign, 
  Users, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function CompetitionsListPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isOrganizer = ['admin', 'mentor'].includes(user?.role || '');

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [prizePool, setPrizePool] = useState(10000);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: competitionsRes, isLoading } = useQuery({
    queryKey: ['competitions'],
    queryFn: () => competitionService.listCompetitions(),
  });

  const competitions = competitionsRes?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      rules: string;
      prizePool: number;
      startDate: string;
      endDate: string;
    }) => competitionService.createCompetition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competitions'] });
      toast.success('Pitch competition launched!');
      setCreateOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setRules('');
      setPrizePool(10000);
      setStartDate('');
      setEndDate('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to launch competition');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !rules.trim()) {
      toast.error('All text fields are required');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Start and end dates are required');
      return;
    }

    createMutation.mutate({
      title,
      description,
      rules,
      prizePool,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success">Active Now</Badge>;
      case 'completed': return <Badge variant="secondary">Completed</Badge>;
      default: return <Badge variant="default">Upcoming</Badge>;
    }
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-primary" /> Pitch Competitions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Browse hackathons, launch project demos, and vote on community startup products.
          </p>
        </div>
        {isOrganizer && (
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5 font-bold rounded-2xl">
            <Plus size={16} /> Launch Arena
          </Button>
        )}
      </div>

      {/* Competitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {competitions.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 text-gray-450">
            No pitch competitions scheduled. Check back later or notify organizers.
          </div>
        ) : (
          competitions.map((comp) => (
            <Card 
              key={comp._id}
              className="p-6 border border-gray-200/60 bg-white/50 dark:border-gray-800/60 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl flex flex-col justify-between gap-5 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  {getStatusBadge(comp.status)}
                  <div className="flex items-center gap-1 text-sm font-extrabold text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <DollarSign size={14} className="-mr-0.5" />
                    {formatCurrency(comp.prizePool)} Pool
                  </div>
                </div>

                <h3 className="font-extrabold text-gray-950 dark:text-white text-lg">
                  {comp.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-850 pt-4 mt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <Calendar size={12} />
                    {new Date(comp.startDate).toLocaleDateString()} - {new Date(comp.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-semibold">
                    <Users size={12} className="text-primary" />
                    {comp.participantsCount} entries submitted
                  </div>
                </div>
                <Button size="sm" asChild className="rounded-xl h-9 text-xs px-3.5">
                  <Link to={`/dashboard/competitions/${comp._id}`} className="gap-1 flex items-center">
                    Enter Arena <ArrowRight size={14} />
                  </Link>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Creation Dialog for Organizers */}
      <Dialog open={createOpen} onOpenChange={() => setCreateOpen(false)}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border dark:border-gray-800 rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Trophy className="text-primary" size={20} /> Launch Pitch Competition
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Set up a hackathon arena or mock deck review competition for startups.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              label="Competition Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. YC Demo Mock Day"
              required
            />
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Overview summary..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Rules & Criteria</label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Pitch deck format constraints, video length limits..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-800/80 p-3 text-sm focus:ring-2 focus:ring-primary/20 dark:text-white focus:outline-none"
                required
              />
            </div>
            <Input
              type="number"
              label="Cash Prize Pool ($)"
              value={prizePool}
              onChange={(e) => setPrizePool(Number(e.target.value))}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-150 dark:border-gray-800">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={createMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                Launch Arena
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CompetitionsListPage;
