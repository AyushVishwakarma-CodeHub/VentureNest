import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function AnalyticsPage() {
  const { user } = useAuthStore();
  const role = user?.role || 'entrepreneur';

  const stats = [
    { label: 'Views on Pitch Deck', value: '432', change: '+12%', icon: Users, color: 'text-primary-500 bg-primary-500/10' },
    { label: 'Investor Engagements', value: '28', change: '+24%', icon: TrendingUp, color: 'text-green-500 bg-green-500/10' },
    { label: 'Meeting requests', value: '8', change: '0%', icon: Calendar, color: 'text-warning-500 bg-warning-500/10' },
    { label: 'Total Funding Raised', value: '$120K', change: '+8%', icon: BarChart3, color: 'text-accent bg-accent/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track views, interactions, and funding performance for your startup profile.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">{stat.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</span>
                <span className={`text-xs font-semibold flex items-center ${
                  stat.change.startsWith('+') ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Engagement breakdown chart placeholder */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Deck Page Views</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <span>Slide 1: Executive Summary</span>
                <span>45% of total time spent</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <span>Slide 3: Market Size & Opportunities</span>
                <span>28% of total time spent</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <span>Slide 7: Financial Projections</span>
                <span>18% of total time spent</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                <span>Slide 9: Founders & Advisory Team</span>
                <span>9% of total time spent</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full" style={{ width: '9%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Top engaged list */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Engaged Investors</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Sequoia India</h4>
                <p className="text-[11px] text-gray-400">Viewed 12 times • Spent 28m</p>
              </div>
              <span className="text-green-500 bg-green-500/10 p-1.5 rounded-full flex items-center justify-center">
                <ArrowUpRight size={14} />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Accel Partners</h4>
                <p className="text-[11px] text-gray-400">Viewed 8 times • Spent 15m</p>
              </div>
              <span className="text-green-500 bg-green-500/10 p-1.5 rounded-full flex items-center justify-center">
                <ArrowUpRight size={14} />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Y Combinator</h4>
                <p className="text-[11px] text-gray-400">Viewed 4 times • Spent 9m</p>
              </div>
              <span className="text-green-500 bg-green-500/10 p-1.5 rounded-full flex items-center justify-center">
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
