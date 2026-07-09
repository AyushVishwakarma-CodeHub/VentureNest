import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentService, InvestmentProposal } from '@/services/investmentService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  X, 
  Check, 
  Clock, 
  Briefcase 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export function InvestmentProposalPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isInvestor = user?.role === 'investor';

  const { data: proposalsRes, isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => investmentService.getProposals(),
  });

  const proposals = proposalsRes?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, comment }: { id: string; status: 'accepted' | 'rejected' | 'withdrawn'; comment?: string }) => 
      investmentService.updateProposalStatus(id, status, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast.success(`Proposal ${variables.status} successfully`);
    },
    onError: () => {
      toast.error('Failed to update proposal status');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return <Badge variant="success" className="capitalize">Accepted</Badge>;
      case 'rejected': return <Badge variant="danger" className="capitalize">Rejected</Badge>;
      case 'withdrawn': return <Badge variant="outline" className="text-gray-400 capitalize border-gray-300">Withdrawn</Badge>;
      default: return <Badge variant="warning" className="capitalize">Pending Review</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <Briefcase className="text-primary" /> Investment Proposals
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {isInvestor 
            ? "Track proposals you have submitted to active startups."
            : "Review funding term proposals submitted by prospective partners."}
        </p>
      </div>

      {/* Proposals list */}
      <div className="space-y-6">
        {proposals.length === 0 ? (
          <Card className="border border-dashed border-gray-300 dark:border-gray-800 bg-white/20 dark:bg-slate-900/20 p-12 text-center rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-gray-400 mb-4">
              <DollarSign size={28} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">No active proposals</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-md mx-auto">
              {isInvestor 
                ? "You haven't submitted any investment proposals yet. Browse startups in the discovery feed to submit bids."
                : "You haven't received any investment proposals yet. Ensure your pitch deck and traction statistics are fully populated."}
            </p>
          </Card>
        ) : (
          proposals.map((prop) => {
            const displayTitle = isInvestor ? prop.startup.name : `${prop.investor.firstName} ${prop.investor.lastName}`;
            const displaySubtitle = isInvestor ? "Target Startup" : "Prospective Investor";

            return (
              <Card 
                key={prop._id}
                className="p-6 border border-gray-200/60 bg-white/50 dark:border-gray-800/60 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl space-y-6 transition-all duration-300 hover:shadow-md"
              >
                {/* Meta details */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-850">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      {isInvestor ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                        {displayTitle}
                      </h3>
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5 block">
                        {displaySubtitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(prop.status)}
                  </div>
                </div>

                {/* Terms Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Investment Value</span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white mt-1 block">
                      {formatCurrency(prop.amount)}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Equity Stake</span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white mt-1 block">
                      {prop.equityOffered}%
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Implied Valuation</span>
                    <span className="text-xl font-extrabold text-gray-900 dark:text-white mt-1 block">
                      {formatCurrency(Math.round((prop.amount / prop.equityOffered) * 100))}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl border">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Proposing Date</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white mt-2 block">
                      {new Date(prop.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Accompanying Message */}
                {prop.message && (
                  <div className="p-4 bg-gray-50/30 dark:bg-slate-850/30 rounded-2xl border border-gray-150 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-355 italic">
                    "{prop.message}"
                  </div>
                )}

                {/* Timeline status track */}
                {prop.timeline.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wider">Negotiation History</h4>
                    <div className="space-y-3 relative pl-4 border-l border-gray-200 dark:border-gray-800 ml-2 py-1">
                      {prop.timeline.map((event, idx) => (
                        <div key={idx} className="relative text-xs">
                          {/* Dot indicator */}
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white dark:border-slate-900" />
                          <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                            <span className="capitalize">{event.status}</span>
                            <span className="text-[10px] text-gray-400 font-normal">{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          {event.comment && <p className="text-gray-500 dark:text-gray-400 mt-0.5">{event.comment}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {prop.status === 'pending' && (
                  <div className="flex gap-3 justify-end border-t border-gray-100 dark:border-gray-800 pt-4">
                    {isInvestor ? (
                      <Button 
                        variant="outline" 
                        className="text-danger hover:bg-danger/5 border-danger/25"
                        onClick={() => updateStatusMutation.mutate({ id: prop._id, status: 'withdrawn', comment: "Withdrawn by investor" })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <X size={16} className="mr-1.5" /> Withdraw Proposal
                      </Button>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="text-danger hover:bg-danger/5 border-danger/25"
                          onClick={() => updateStatusMutation.mutate({ id: prop._id, status: 'rejected', comment: "Rejected by founder" })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <X size={16} className="mr-1.5" /> Decline
                        </Button>
                        <Button 
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => updateStatusMutation.mutate({ id: prop._id, status: 'accepted', comment: "Accepted by founder! Funding terms locked." })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <Check size={16} className="mr-1.5" /> Accept Terms
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
export default InvestmentProposalPage;
