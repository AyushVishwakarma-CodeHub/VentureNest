import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentService } from '@/services/investmentService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  DollarSign, 
  PieChart as PieIcon, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from '@/components/cards/StatCard';
import { PieChart } from '@/components/charts/PieChart';
import { DataTable, Column } from '@/components/shared/DataTable';
import { useAuthStore } from '@/stores/authStore';

export function PortfolioPage() {
  const { user } = useAuthStore();
  const isInvestor = user?.role === 'investor';

  const { data: proposalsRes, isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => investmentService.getProposals(),
  });

  const proposals = proposalsRes?.data || [];
  const acceptedProposals = proposals.filter((p) => p.status === 'accepted');

  // Compute stats
  const totalAmount = acceptedProposals.reduce((sum, p) => sum + p.amount, 0);
  const averageEquity = acceptedProposals.length > 0 
    ? Math.round((acceptedProposals.reduce((sum, p) => sum + p.equityOffered, 0) / acceptedProposals.length) * 10) / 10
    : 0;

  // Sector allocation data for Pie Chart
  const sectorMap: Record<string, number> = {};
  acceptedProposals.forEach((p) => {
    p.startup.industry?.forEach((ind) => {
      sectorMap[ind] = (sectorMap[ind] || 0) + p.amount;
    });
  });

  const chartData = Object.keys(sectorMap).map((name) => ({
    name,
    value: sectorMap[name],
  }));

  const columns: Column<any>[] = [
    {
      key: isInvestor ? 'startupName' : 'investorName',
      header: isInvestor ? 'Company' : 'Investor',
      sortable: true,
      render: (row) => (
        isInvestor ? (
          <Link to={`/dashboard/startups/${row.startup.slug}`} className="font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
            {row.startup.name}
          </Link>
        ) : (
          <span className="font-bold text-gray-900 dark:text-white">
            {row.investor.firstName} {row.investor.lastName}
          </span>
        )
      )
    },
    {
      key: 'industry',
      header: 'Sector',
      render: (row) => (
        <div className="flex gap-1.5 flex-wrap">
          {row.startup.industry?.slice(0, 2).map((ind: string) => (
            <Badge key={ind} variant="outline" className="text-[10px] py-0 px-2">{ind}</Badge>
          ))}
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount Deployed',
      sortable: true,
      render: (row) => formatCurrency(row.amount),
      cellClassName: 'font-semibold text-gray-950 dark:text-white'
    },
    {
      key: 'equityOffered',
      header: 'Equity Owned',
      sortable: true,
      render: (row) => `${row.equityOffered}%`,
      cellClassName: 'font-semibold text-gray-950 dark:text-white'
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: () => (
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/meetings" className="gap-1 flex items-center justify-end">
            Sync Call <ArrowUpRight size={14} />
          </Link>
        </Button>
      )
    }
  ];

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
            <Briefcase className="text-primary" /> Capital & Equity Portfolio
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isInvestor 
              ? "Track equity allocations and active capital deployments."
              : "Monitor cap table entries and locked venture partner terms."}
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label={isInvestor ? "Total Capital Deployed" : "Total Funding Secured"}
          value={formatCurrency(totalAmount)}
          icon={DollarSign}
          colorClassName="bg-green-500/10 text-green-500"
        />
        <StatCard
          label={isInvestor ? "Venture Holdings" : "Equity Exchanged"}
          value={acceptedProposals.length}
          icon={Briefcase}
          colorClassName="bg-primary/10 text-primary"
        />
        <StatCard
          label="Average Equity Size"
          value={`${averageEquity}%`}
          icon={TrendingUp}
          colorClassName="bg-blue-500/10 text-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio allocations list table */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase size={18} className="text-primary" /> Cap Table Logs
            </h3>
            <DataTable
              columns={columns}
              data={acceptedProposals}
              emptyState={
                isInvestor
                  ? "No active investments. Bids accepted by founders will appear here."
                  : "No VC funding logs locked. Submitted proposals will show here once accepted."
              }
            />
          </Card>
        </div>

        {/* Industry pie allocation */}
        <Card className="p-6 border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 rounded-3xl space-y-4 h-fit">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 pb-2 border-b border-gray-150 dark:border-gray-850">
            <PieIcon size={18} className="text-primary" /> Sector Weighting
          </h3>
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              Sector distributions will display once investments are finalized.
            </div>
          ) : (
            <PieChart
              data={chartData}
              dataKey="value"
              nameKey="name"
              height={250}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
export default PortfolioPage;
