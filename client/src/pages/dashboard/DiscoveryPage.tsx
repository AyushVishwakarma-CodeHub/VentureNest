import React, { useEffect } from 'react';
import { useStartupStore } from '@/stores/startupStore';
import { StartupCard } from '@/components/shared/StartupCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StartupCardSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  RefreshCw, 
  ArrowUpDown 
} from 'lucide-react';

const STAGES = ['Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'];
const INDUSTRIES = ['SaaS', 'Fintech', 'AI/ML', 'Healthtech', 'Edtech', 'E-commerce', 'Clean Energy', 'Web3'];

export function DiscoveryPage() {
  const {
    startups,
    isLoading,
    filters,
    pagination,
    setFilters,
    resetFilters,
    fetchStartups,
  } = useStartupStore();

  useEffect(() => {
    fetchStartups();
  }, [filters.search, filters.stage, filters.industry, filters.sort, filters.page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleStageSelect = (stage: string) => {
    const nextStage = filters.stage === stage ? '' : stage;
    setFilters({ stage: nextStage });
  };

  const handleIndustrySelect = (ind: string) => {
    const nextInd = filters.industry === ind ? '' : ind;
    setFilters({ industry: nextInd });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ sort: e.target.value });
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Discover Startups
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Explore and connect with high-potential startups raising capital.
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => fetchStartups()}>
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh Feed
        </Button>
      </div>

      {/* Search & Main Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="space-y-6 bg-white/40 dark:bg-slate-900/40 p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl h-fit">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200/60 dark:border-gray-800/80">
            <span className="font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <SlidersHorizontal size={18} />
              Filters
            </span>
            <button 
              onClick={resetFilters} 
              className="text-xs text-primary hover:underline font-semibold"
            >
              Clear All
            </button>
          </div>

          {/* Funding Stages */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Funding Stage</label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleStageSelect(stage)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    filters.stage === stage
                      ? 'bg-primary border-primary text-white shadow-md'
                      : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Industry Filters */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Industry</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => handleIndustrySelect(ind)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    filters.industry === ind
                      ? 'bg-accent border-accent text-white shadow-md'
                      : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-300 hover:border-accent/50'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Search and Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search startups, keywords, or industries..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-11 h-11 bg-white/80 dark:bg-slate-800/85"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown size={16} className="text-gray-400" />
              <select
                value={filters.sort}
                onChange={handleSortChange}
                className="h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-slate-850 px-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="fundingHigh">Funding goals high</option>
                <option value="views">Most viewed</option>
                <option value="followers">Most followed</option>
              </select>
            </div>
          </div>

          {/* Load state */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <StartupCardSkeleton key={i} />
              ))}
            </div>
          ) : startups.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No startups found"
              description="Try adjusting your filters, searching for a different keyword, or refreshing the feed."
            />
          ) : (
            <>
              {/* Startup Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startups.map((st) => (
                  <StartupCard key={st._id} startup={st} />
                ))}
              </div>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-8">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-semibold text-gray-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
