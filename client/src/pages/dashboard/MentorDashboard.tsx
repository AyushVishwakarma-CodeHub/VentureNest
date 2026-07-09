import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Users, 
  Calendar, 
  MessageSquare,
  Award,
  Video
} from 'lucide-react';
import { StatCard } from '@/components/cards/StatCard';
import { BarChart } from '@/components/charts/BarChart';

export function MentorDashboard() {
  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['mentorAnalytics'],
    queryFn: () => analyticsService.getMentorAnalytics(),
  });

  const analytics = analyticsRes?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = analytics || {
    averageRating: 0,
    totalReviews: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    ratingDistribution: [],
    growthData: []
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Mentor Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor your ratings, reviews, and track upcoming mentoring sessions.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Average Rating"
          value={`${stats.averageRating} ★`}
          icon={Star}
          colorClassName="bg-yellow-500/10 text-yellow-500"
        />
        <StatCard
          label="Total Reviews"
          value={stats.totalReviews}
          icon={MessageSquare}
          colorClassName="bg-primary/10 text-primary"
        />
        <StatCard
          label="Completed Sessions"
          value={stats.completedSessions}
          icon={Award}
          colorClassName="bg-green-500/10 text-green-500"
        />
        <StatCard
          label="Upcoming Sessions"
          value={stats.upcomingSessions}
          icon={Calendar}
          colorClassName="bg-blue-500/10 text-blue-500"
        />
      </div>

      {/* Sessions Growth and Star Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sessions Activity Bar Chart */}
        <Card className="lg:col-span-2 border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-4 border-b border-gray-150 dark:border-gray-850">
            <Calendar size={18} className="text-primary" /> Session Activity History
          </h3>
          <BarChart
            data={stats.growthData}
            dataKey="sessions"
            xAxisKey="name"
          />
        </Card>

        {/* Rating Breakdown list */}
        <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-850 flex items-center gap-2">
            <Star size={18} className="text-yellow-500" /> Review Breakdown
          </h3>
          <div className="space-y-3 pt-2">
            {stats.ratingDistribution?.map((dist: any) => (
              <div key={dist.star} className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 w-8">{dist.star}</span>
                <div className="flex-1 bg-gray-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-500 h-full rounded-full" 
                    style={{ 
                      width: `${stats.totalReviews > 0 ? (dist.count / stats.totalReviews) * 100 : 0}%` 
                    }} 
                  />
                </div>
                <span className="text-xs font-bold text-gray-500 w-4 text-right">{dist.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Mentoring Schedule */}
      <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-850 flex items-center gap-2">
          <Users size={18} className="text-primary" /> Upcoming Sessions
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-850/50 border rounded-2xl">
            <div className="flex items-center gap-3">
              <Calendar className="text-primary" size={20} />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Acme Corp - Pitch Deck Review</h4>
                <p className="text-xs text-gray-400 mt-0.5">July 12, 2026 at 2:00 PM (GMT+5:30)</p>
              </div>
            </div>
            <Button size="sm" className="gap-1">
              <Video size={14} /> Join Call
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-850/50 border rounded-2xl">
            <div className="flex items-center gap-3">
              <Calendar className="text-primary" size={20} />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">FintechX - Seed Strategy Session</h4>
                <p className="text-xs text-gray-400 mt-0.5">July 15, 2026 at 4:30 PM (GMT+5:30)</p>
              </div>
            </div>
            <Button size="sm" className="gap-1">
              <Video size={14} /> Join Call
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
