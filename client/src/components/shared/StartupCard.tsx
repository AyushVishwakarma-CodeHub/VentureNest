import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Heart, Eye, MapPin, Tag, TrendingUp } from 'lucide-react';
import { Startup } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useStartupStore } from '@/stores/startupStore';
import { useAuthStore } from '@/stores/authStore';

interface StartupCardProps {
  startup: Startup;
}

export function StartupCard({ startup }: StartupCardProps) {
  const { toggleBookmark, toggleFollow } = useStartupStore();
  const { isAuthenticated } = useAuthStore();

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return; // Add auth check/toast in real app
    toggleBookmark(startup);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    toggleFollow(startup);
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Link to={`/dashboard/startups/${startup.slug}`}>
        <Card className="h-full flex flex-col justify-between overflow-hidden border border-gray-200/50 dark:border-gray-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300">
          <div className="p-6 space-y-4">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {startup.logo ? (
                  <img
                    src={startup.logo}
                    alt={`${startup.name} logo`}
                    className="w-14 h-14 rounded-2xl object-cover border border-gray-200 dark:border-gray-700 bg-white"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                    {startup.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                    {startup.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                    <MapPin size={14} className="shrink-0" />
                    <span>{startup.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 rounded-full",
                    startup.isBookmarked 
                      ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30" 
                      : "text-gray-400 hover:text-yellow-500"
                  )}
                  onClick={handleBookmark}
                >
                  <Bookmark size={16} fill={startup.isBookmarked ? "currentColor" : "none"} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 rounded-full",
                    startup.isFollowing 
                      ? "text-red-500 bg-red-50 dark:bg-red-950/30" 
                      : "text-gray-400 hover:text-red-500"
                  )}
                  onClick={handleFollow}
                >
                  <Heart size={16} fill={startup.isFollowing ? "currentColor" : "none"} />
                </Button>
              </div>
            </div>

            {/* Headline */}
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 min-h-[40px] leading-relaxed">
              {startup.headline}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                {startup.stage}
              </Badge>
              {startup.industry.slice(0, 2).map((ind) => (
                <Badge key={ind} variant="secondary" className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700">
                  {ind}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bottom stats / Funding details */}
          <div className="border-t border-gray-100 dark:border-gray-800/80 p-5 bg-gray-50/50 dark:bg-slate-900/30">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-400 dark:text-gray-500 block text-xs uppercase font-semibold tracking-wider">Raised</span>
                <span className="font-bold text-gray-900 dark:text-white mt-0.5 block">
                  {formatCurrency(startup.fundingRaised)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 dark:text-gray-500 block text-xs uppercase font-semibold tracking-wider">Goal</span>
                <span className="font-bold text-primary mt-0.5 block">
                  {formatCurrency(startup.fundingGoal)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    startup.fundingGoal > 0 ? (startup.fundingRaised / startup.fundingGoal) * 100 : 0
                  )}%`,
                }}
              />
            </div>

            <CardFooter className="p-0 pt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-none bg-transparent">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {startup.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={14} />
                  {startup.followersCount}
                </span>
              </div>
              <span className="text-primary hover:underline font-semibold flex items-center gap-1">
                View Pitch <TrendingUp size={12} />
              </span>
            </CardFooter>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
