import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { aiService } from '@/services/aiService';
import { chatService } from '@/services/chatService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ThumbsUp, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  MessageSquare,
  Compass,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StartupAiInsightsViewProps {
  startupId: string;
}

export function StartupAiInsightsView({ startupId }: StartupAiInsightsViewProps) {
  const navigate = useNavigate();

  // 1. Fetch AI Feedback & SWOT
  const { data: feedbackRes, isLoading: feedbackLoading } = useQuery({
    queryKey: ['ai-feedback', startupId],
    queryFn: () => aiService.getAiFeedback(startupId),
  });

  // 2. Fetch matched investors
  const { data: matchesRes, isLoading: matchesLoading } = useQuery({
    queryKey: ['investor-matches', startupId],
    queryFn: () => aiService.getInvestorMatches(startupId),
  });

  const feedback = feedbackRes?.data;
  const matches = matchesRes?.data || [];

  // 3. Chat Room Creation Mutator
  const startChatMutation = useMutation({
    mutationFn: (recipientId: string) => chatService.createChat(recipientId),
    onSuccess: (res) => {
      toast.success('Chat tunnel created!');
      navigate('/dashboard/messages');
    },
    onError: () => {
      toast.error('Failed to initiate chat room');
    }
  });

  if (feedbackLoading || matchesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Readiness & SWOT summary */}
      {feedback && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Readiness Card */}
            <Card className="p-6 border border-gray-250/60 dark:border-gray-850 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl md:col-span-1 flex flex-col justify-center items-center text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-4">Investment Readiness</span>
              
              <div className="relative flex items-center justify-center">
                {/* Progress Circle Ring */}
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="54" strokeWidth="8" stroke="currentColor" className="text-gray-100 dark:text-slate-800" fill="transparent" />
                  <circle 
                    cx="64" 
                    cy="64" 
                    r="54" 
                    strokeWidth="8" 
                    stroke="currentColor" 
                    className="text-primary" 
                    fill="transparent" 
                    strokeDasharray={339}
                    strokeDashoffset={339 - (339 * feedback.readinessScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-3xl font-extrabold text-gray-900 dark:text-white">
                  {feedback.readinessScore}%
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-xs font-semibold text-primary flex items-center gap-1 justify-center">
                  <Zap size={14} /> AI Evaluation
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 italic px-2">
                  "{feedback.recommendation}"
                </p>
              </div>
            </Card>

            {/* AI Recommendation Summary */}
            <Card className="p-6 border border-gray-250/60 dark:border-gray-850 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl md:col-span-2 flex flex-col justify-center">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base mb-2 flex items-center gap-2">
                <Sparkles className="text-primary" size={18} /> SWOT Strategy Report
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                Our artificial intelligence heuristics matching sweeps traction checkpoints, descriptions parameters, and milestones timelines to assess your SWOT parameters. Below is a summarized outlook to help refine your presentation material for capital proposals.
              </p>
            </Card>
          </div>

          {/* SWOT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <Card className="p-5 border border-green-500/20 bg-green-500/5 dark:bg-green-500/5 rounded-3xl space-y-3">
              <h4 className="font-bold text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                <ThumbsUp size={16} /> Strengths
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc pl-4 font-medium leading-relaxed">
                {feedback.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Card>

            {/* Weaknesses */}
            <Card className="p-5 border border-red-500/20 bg-red-500/5 dark:bg-red-500/5 rounded-3xl space-y-3">
              <h4 className="font-bold text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle size={16} /> Weaknesses
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc pl-4 font-medium leading-relaxed">
                {feedback.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </Card>

            {/* Opportunities */}
            <Card className="p-5 border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/5 rounded-3xl space-y-3">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                <Lightbulb size={16} /> Opportunities
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc pl-4 font-medium leading-relaxed">
                {feedback.swot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </Card>

            {/* Threats */}
            <Card className="p-5 border border-yellow-500/20 bg-yellow-500/5 dark:bg-yellow-500/5 rounded-3xl space-y-3">
              <h4 className="font-bold text-yellow-600 dark:text-yellow-400 text-sm flex items-center gap-2">
                <TrendingUp size={16} /> Threats
              </h4>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 list-disc pl-4 font-medium leading-relaxed">
                {feedback.swot.threats.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* 2. Matchmaking matches */}
      <Card className="p-6 border border-gray-250/60 dark:border-gray-850 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl space-y-4">
        <h3 className="font-extrabold text-gray-900 dark:text-white text-base pb-3 border-b border-gray-100 dark:border-gray-850 flex items-center gap-2">
          <Compass size={18} className="text-primary" /> Venture Capital Matchmaking
        </h3>
        
        <div className="space-y-4">
          {matches.length === 0 ? (
            <p className="text-center py-6 text-xs text-gray-400">
              No matching VCs found. Startups must contain industry tags matching investor interests.
            </p>
          ) : (
            matches.map((match, idx) => (
              <div 
                key={match.investor._id}
                className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/20 border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors hover:bg-white/60 dark:hover:bg-slate-800/30"
              >
                <div className="flex gap-3 items-center">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <img src={match.investor.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${match.investor.firstName}`} alt={match.investor.firstName} />
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm text-gray-950 dark:text-white leading-tight">
                      {match.investor.firstName} {match.investor.lastName}
                    </h4>
                    <p className="text-[11px] text-gray-505 dark:text-gray-400 font-semibold mt-0.5">{match.headline}</p>
                    {match.matchingSectors.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {match.matchingSectors.map((sec) => (
                          <Badge key={sec} variant="outline" className="text-[9px] px-1.5 py-0">
                            {sec}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-850">
                  <div className="text-left md:text-right">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Match Rating</span>
                    <div className="font-extrabold text-primary text-base">
                      {match.matchScore}% Match
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-8 text-xs font-semibold rounded-lg gap-1.5"
                    onClick={() => startChatMutation.mutate(match.investor._id)}
                    disabled={startChatMutation.isPending}
                  >
                    <MessageSquare size={12} /> Contact VC
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
export default StartupAiInsightsView;
