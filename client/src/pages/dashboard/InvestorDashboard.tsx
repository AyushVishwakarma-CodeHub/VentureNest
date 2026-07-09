import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Bookmark, 
  Heart, 
  Calendar, 
  FileSpreadsheet, 
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/cards/StatCard';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { DataTable, Column } from '@/components/shared/DataTable';

interface PortfolioCompany {
  name: string;
  stage: string;
  investedAmount: number;
  equityOwned: number;
}

export function InvestorDashboard() {
  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ['investorAnalytics'],
    queryFn: () => analyticsService.getInvestorAnalytics(),
  });

  const analytics = analyticsRes?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = analytics?.stats || {
    bookmarksCount: 0,
    followsCount: 0,
    totalInvested: 0,
    activeProposals: 0,
    meetingsScheduled: 0
  };

  const industryData = analytics?.industryDistribution || [];
  const stageData = analytics?.stageDistribution || [];
  const portfolio: PortfolioCompany[] = analytics?.portfolioCompanies || [];

  const columns: Column<PortfolioCompany>[] = [
    {
      key: 'name',
      header: 'Company',
      sortable: true,
      cellClassName: 'font-bold text-gray-900 dark:text-white',
    },
    {
      key: 'stage',
      header: 'Stage',
      sortable: true,
      render: (row) => (
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
          {row.stage}
        </Badge>
      ),
    },
    {
      key: 'investedAmount',
      header: 'Invested Amount',
      sortable: true,
      render: (row) => formatCurrency(row.investedAmount),
      cellClassName: 'font-semibold text-gray-900 dark:text-white',
    },
    {
      key: 'equityOwned',
      header: 'Equity Owned',
      sortable: true,
      render: (row) => `${row.equityOwned}%`,
      cellClassName: 'font-semibold text-gray-900 dark:text-white',
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: () => (
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/meetings">Schedule Sync</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Investor Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track investments, portfolio health, and discover new deal flows.
          </p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/25">
          <Link to="/dashboard/discover" className="flex items-center gap-2">
            Explore Deals <ArrowUpRight size={18} />
          </Link>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          label="Deployed"
          value={formatCurrency(stats.totalInvested)}
          icon={Briefcase}
          colorClassName="bg-green-500/10 text-green-500"
        />
        <StatCard
          label="Bookmarks"
          value={stats.bookmarksCount}
          icon={Bookmark}
          colorClassName="bg-yellow-500/10 text-yellow-500"
        />
        <StatCard
          label="Following"
          value={stats.followsCount}
          icon={Heart}
          colorClassName="bg-red-500/10 text-red-500"
        />
        <StatCard
          label="Proposals"
          value={stats.activeProposals}
          icon={FileSpreadsheet}
          colorClassName="bg-primary/10 text-primary"
        />
        <StatCard
          label="Meetings"
          value={stats.meetingsScheduled}
          icon={Calendar}
          colorClassName="bg-blue-500/10 text-blue-500"
        />
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Industry Pie Chart */}
        <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-4 border-b border-gray-150 dark:border-gray-850">
            <PieIcon size={18} className="text-primary" /> Saved Startups by Sector
          </h3>
          <PieChart
            data={industryData}
            dataKey="value"
            nameKey="name"
          />
        </Card>

        {/* Stage Bar Chart */}
        <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-4 border-b border-gray-150 dark:border-gray-850">
            <BarChart3 size={18} className="text-primary" /> Saved Startups by Stage
          </h3>
          <BarChart
            data={stageData}
            dataKey="value"
            xAxisKey="name"
          />
        </Card>
      </div>

      {/* Portfolio Table */}
      <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-850 flex items-center gap-2">
          <Briefcase size={18} className="text-primary" /> Active Investment Portfolio
        </h3>
        <DataTable
          columns={columns}
          data={portfolio}
          emptyState="No active portfolio companies. Bookmarked startups will appear here once investment negotiations conclude."
        />
      </Card>
    </div>
  );
}
