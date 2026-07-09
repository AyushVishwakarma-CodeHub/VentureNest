import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { analyticsService, EntrepreneurAnalyticsData } from '@/services/analyticsService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Heart, 
  Bookmark, 
  DollarSign, 
  Rocket, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Target 
} from 'lucide-react';
import { 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/cards/StatCard';
import { AreaChart } from '@/components/charts/AreaChart';

export function EntrepreneurDashboard() {
  const { data: analyticsRes, isLoading, refetch } = useQuery({
    queryKey: ['entrepreneurAnalytics'],
    queryFn: () => analyticsService.getEntrepreneurAnalytics(),
  });

  const analytics = analyticsRes?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics || !analytics.hasStartup) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-6 mt-10">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto text-primary animate-bounce">
          <Rocket size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Launch Your Startup Profile
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          You haven't registered a startup on our platform yet. Create a stunning company profile to share your pitch deck and video demo with global venture capital and angel investors.
        </p>
        <Button size="xl" asChild className="shadow-lg shadow-primary/20">
          <Link to="/dashboard/startups/new">
            Register Startup <Plus className="ml-2 w-5 h-5" />
          </Link>
        </Button>
      </div>
    );
  }

  const { stats, viewsOverTime, industryBenchmarks, milestonesSummary } = analytics;

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Founder Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Analyzing statistics for <Link to={`/dashboard/startups/${analytics.slug}`} className="text-primary font-bold hover:underline">{analytics.startupName}</Link>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link to={`/dashboard/startups/${analytics.slug}`}>View Public Profile</Link>
          </Button>
          <Button asChild>
            <Link to={`/dashboard/startups/${analytics.slug}`} className="flex items-center gap-1">
              <Plus size={16} /> Log Traction
            </Link>
          </Button>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Profile Views"
          value={stats.views}
          icon={Eye}
          colorClassName="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          label="Followers"
          value={stats.followers}
          icon={Heart}
          colorClassName="bg-red-500/10 text-red-500"
        />
        <StatCard
          label="Bookmarks"
          value={stats.bookmarks}
          icon={Bookmark}
          colorClassName="bg-yellow-500/10 text-yellow-500"
        />
        <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block">Funding Progress</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white mt-0.5 block">
                {formatCurrency(stats.fundingRaised)} / {stats.fundingProgress}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, stats.fundingProgress)}%` }} />
          </div>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-150 dark:border-gray-800/50">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Traffic & Engagement
            </h3>
            <span className="text-xs text-gray-400 font-semibold uppercase">Monthly views</span>
          </div>
          <AreaChart
            data={viewsOverTime}
            dataKey="views"
            xAxisKey="name"
          />
        </Card>

        {/* Milestone summary & benchmarks */}
        <div className="space-y-8">
          {/* Milestone roadmap summary */}
          <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" /> Milestone Tracking
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center py-2">
              <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                <span className="text-green-500 text-3xl font-extrabold">{milestonesSummary.completed}</span>
                <span className="text-gray-400 text-xs block font-semibold uppercase mt-1">Completed</span>
              </div>
              <div className="p-4 bg-gray-500/5 rounded-2xl border border-gray-500/10">
                <span className="text-gray-400 text-3xl font-extrabold">{milestonesSummary.pending}</span>
                <span className="text-gray-400 text-xs block font-semibold uppercase mt-1">Pending</span>
              </div>
            </div>
            <Button className="w-full text-xs font-semibold py-2.5 h-auto" variant="outline" asChild>
              <Link to={`/dashboard/startups/${analytics.slug}`}>Manage Roadmap</Link>
            </Button>
          </Card>

          {/* Industry Radar Benchmarks */}
          <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target size={18} className="text-red-500" /> Competitor Benchmark
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="75%" data={industryBenchmarks}>
                  <PolarGrid stroke="#888888" opacity={0.2} />
                  <PolarAngleAxis dataKey="subject" fontSize={10} stroke="#888888" />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} fontSize={8} stroke="#888888" />
                  <Radar name="My Startup" dataKey="startupValue" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.3} />
                  <Radar name="Industry Avg" dataKey="averageValue" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
