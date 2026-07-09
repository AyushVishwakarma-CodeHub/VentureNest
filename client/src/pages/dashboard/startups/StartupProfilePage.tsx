import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStartupStore } from '@/stores/startupStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { investmentService } from '@/services/investmentService';
import { 
  Building, 
  MapPin, 
  Users, 
  Globe, 
  DollarSign, 
  Bookmark, 
  Heart,
  TrendingUp,
  FileText,
  Video,
  Plus,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';
import { StartupAiInsightsView } from '@/components/shared/StartupAiInsightsView';

export function StartupProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { 
    activeStartup, 
    isLoading, 
    fetchStartupBySlug, 
    toggleBookmark, 
    toggleFollow,
    addTraction,
    addMilestone
  } = useStartupStore();
  const { user, isAuthenticated } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'pitch' | 'traction' | 'roadmap' | 'ai-insights'>('overview');

  // Form states for adding traction and milestone (Founder actions)
  const [metricName, setMetricName] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [metricDate, setMetricDate] = useState('');
  const [isAddingTraction, setIsAddingTraction] = useState(false);

  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDesc, setMilestoneDesc] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  // Form states for submitting investment proposals (Investor action)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalEquity, setProposalEquity] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStartup) return;
    const amt = parseFloat(proposalAmount);
    const eq = parseFloat(proposalEquity);
    
    if (!amt || amt <= 0 || !eq || eq <= 0) {
      return toast.error('Please enter valid amount and equity values.');
    }

    try {
      setIsSubmittingProposal(true);
      await investmentService.submitProposal({
        startupId: activeStartup._id,
        amount: amt,
        equityOffered: eq,
        message: proposalMessage
      });
      toast.success('Investment proposal submitted successfully!');
      setProposalAmount('');
      setProposalEquity('');
      setProposalMessage('');
      setIsProposalModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit investment proposal.');
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchStartupBySlug(slug);
    }
  }, [slug]);

  if (isLoading || !activeStartup) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isFounder = activeStartup.founder && (
    typeof activeStartup.founder === 'string' 
      ? activeStartup.founder === user?._id 
      : activeStartup.founder._id === user?._id
  );

  const handleAddTractionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricName.trim() || !metricValue.trim() || !metricDate) {
      return toast.error('All metric fields are required');
    }
    try {
      await addTraction(activeStartup._id, {
        metricName,
        metricValue,
        date: new Date(metricDate).toISOString()
      });
      toast.success('Traction metric added successfully!');
      setMetricName('');
      setMetricValue('');
      setMetricDate('');
      setIsAddingTraction(false);
    } catch (err: any) {
      toast.error(err.message || 'Error adding traction');
    }
  };

  const handleAddMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim() || !milestoneDate) {
      return toast.error('Title and Date are required');
    }
    try {
      await addMilestone(activeStartup._id, {
        title: milestoneTitle,
        description: milestoneDesc,
        date: new Date(milestoneDate).toISOString(),
        completed: false
      });
      toast.success('Milestone added successfully!');
      setMilestoneTitle('');
      setMilestoneDesc('');
      setMilestoneDate('');
      setIsAddingMilestone(false);
    } catch (err: any) {
      toast.error(err.message || 'Error adding milestone');
    }
  };

  // Prepare traction chart data
  const chartData = activeStartup.traction
    ?.map(t => ({
      name: new Date(t.date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
      value: parseFloat(t.metricValue) || 0,
      label: t.metricName
    }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* ─── Profile Header ─── */}
      <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            {activeStartup.logo ? (
              <img
                src={activeStartup.logo}
                alt={`${activeStartup.name} logo`}
                className="w-20 h-20 rounded-3xl object-cover border border-gray-200 dark:border-gray-700 bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-3xl">
                {activeStartup.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {activeStartup.name}
                </h1>
                {activeStartup.isVerified && (
                  <Badge className="bg-green-500 text-white hover:bg-green-600">Verified</Badge>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-lg font-medium">
                {activeStartup.headline}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mt-3">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {activeStartup.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} /> {activeStartup.teamSize} team members
                </span>
                {activeStartup.website && (
                  <a href={activeStartup.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline font-semibold">
                    <Globe size={14} /> Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Social actions / follow */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "rounded-full gap-2",
                activeStartup.isBookmarked && "border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/30 text-yellow-600"
              )}
              onClick={() => isAuthenticated && toggleBookmark(activeStartup)}
            >
              <Bookmark size={18} fill={activeStartup.isBookmarked ? "currentColor" : "none"} />
              {activeStartup.isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "rounded-full gap-2",
                activeStartup.isFollowing && "border-red-500/50 bg-red-50/50 dark:bg-red-950/30 text-red-600"
              )}
              onClick={() => isAuthenticated && toggleFollow(activeStartup)}
            >
              <Heart size={18} fill={activeStartup.isFollowing ? "currentColor" : "none"} />
              {activeStartup.isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>
        </div>
      </Card>

      {/* ─── Profile Navigation Tabs ─── */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        {(['overview', 'pitch', 'traction', 'roadmap', 'ai-insights'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-3 font-semibold text-sm capitalize border-b-2 transition-all duration-200",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── Tabs Content ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main tabs view */}
        <div className="lg:col-span-2 space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Building size={20} className="text-primary" /> About {activeStartup.name}
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {activeStartup.description}
              </div>
              <div className="pt-4 border-t border-gray-150 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {activeStartup.industry.map((ind) => (
                    <Badge key={ind} variant="secondary" className="px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: PITCH DECK & VIDEO */}
          {activeTab === 'pitch' && (
            <div className="space-y-6">
              {/* Pitch video */}
              {activeStartup.videoDemo ? (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-black overflow-hidden rounded-3xl shadow-xl">
                  <video
                    src={activeStartup.videoDemo}
                    controls
                    className="w-full aspect-video object-cover"
                  />
                </Card>
              ) : (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl text-center space-y-4">
                  <Video size={48} className="mx-auto text-gray-400" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">No Video Pitch Uploaded</h3>
                  <p className="text-gray-500 text-sm">The founder hasn't uploaded a video demo yet.</p>
                </Card>
              )}

              {/* Pitch deck document */}
              {activeStartup.pitchDeck ? (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={32} className="text-red-500" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Pitch Deck Presentation</h4>
                      <p className="text-gray-400 text-xs mt-0.5">PDF Document Format</p>
                    </div>
                  </div>
                  <Button asChild>
                    <a href={activeStartup.pitchDeck} target="_blank" rel="noopener noreferrer">
                      Download Deck
                    </a>
                  </Button>
                </Card>
              ) : (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl text-center space-y-4">
                  <FileText size={48} className="mx-auto text-gray-400" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">No Pitch Deck Uploaded</h3>
                  <p className="text-gray-500 text-sm">The founder hasn't uploaded a deck presentation yet.</p>
                </Card>
              )}
            </div>
          )}

          {/* TAB 3: TRACTION METRICS */}
          {activeTab === 'traction' && (
            <div className="space-y-6">
              {chartData && chartData.length > 0 ? (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" /> Key Growth Metrics
                  </h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="var(--color-primary, #6C63FF)" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              ) : (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl text-center space-y-4">
                  <TrendingUp size={48} className="mx-auto text-gray-400" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">No Traction Data Available</h3>
                  <p className="text-gray-500 text-sm">The startup hasn't logged any traction figures yet.</p>
                </Card>
              )}

              {/* Founder: Add Traction Metric Form */}
              {isFounder && (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-slate-900/50 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Manage Traction Figures</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsAddingTraction(!isAddingTraction)}
                      className="gap-1.5"
                    >
                      <Plus size={16} />
                      {isAddingTraction ? 'Cancel' : 'Add Metric'}
                    </Button>
                  </div>

                  {isAddingTraction && (
                    <form onSubmit={handleAddTractionSubmit} className="space-y-4 pt-2">
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          type="text"
                          placeholder="e.g. Monthly Revenue, Active Users"
                          value={metricName}
                          onChange={(e) => setMetricName(e.target.value)}
                        />
                        <Input
                          type="text"
                          placeholder="e.g. 50000, 12000"
                          value={metricValue}
                          onChange={(e) => setMetricValue(e.target.value)}
                        />
                        <Input
                          type="date"
                          value={metricDate}
                          onChange={(e) => setMetricDate(e.target.value)}
                        />
                      </div>
                      <Button type="submit">Submit Metric</Button>
                    </form>
                  )}
                </Card>
              )}
            </div>
          )}

          {/* TAB 4: ROADMAP / MILESTONES */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              {activeStartup.milestones && activeStartup.milestones.length > 0 ? (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl space-y-6">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Layers size={20} className="text-primary" /> Roadmap Timeline
                  </h3>
                  <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-800 space-y-6">
                    {activeStartup.milestones.map((m, i) => (
                      <div key={i} className="relative">
                        <div className={cn(
                          "absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-bgLight dark:border-bgDark",
                          m.completed ? "bg-green-500" : "bg-gray-300 dark:bg-slate-700"
                        )} />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 dark:text-white">{m.title}</h4>
                            <Badge variant={m.completed ? "success" : "outline"} className="text-xs">
                              {m.completed ? 'Completed' : 'Planned'}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                            <Calendar size={12} /> {new Date(m.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                          </span>
                          {m.description && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{m.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl text-center space-y-4">
                  <Layers size={48} className="mx-auto text-gray-400" />
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">No Milestones Logged</h3>
                  <p className="text-gray-500 text-sm">The startup hasn't published their roadmap milestones yet.</p>
                </Card>
              )}

              {/* Founder: Add Milestone Form */}
              {isFounder && (
                <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-slate-900/50 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 dark:text-white">Manage Milestones</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsAddingMilestone(!isAddingMilestone)}
                      className="gap-1.5"
                    >
                      <Plus size={16} />
                      {isAddingMilestone ? 'Cancel' : 'Add Milestone'}
                    </Button>
                  </div>

                  {isAddingMilestone && (
                    <form onSubmit={handleAddMilestoneSubmit} className="space-y-4 pt-2">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="e.g. Launching Beta V2"
                          value={milestoneTitle}
                          onChange={(e) => setMilestoneTitle(e.target.value)}
                        />
                        <Input
                          type="date"
                          value={milestoneDate}
                          onChange={(e) => setMilestoneDate(e.target.value)}
                        />
                      </div>
                      <Input
                        type="text"
                        placeholder="Description (optional)"
                        value={milestoneDesc}
                        onChange={(e) => setMilestoneDesc(e.target.value)}
                      />
                      <Button type="submit">Submit Milestone</Button>
                    </form>
                  )}
                </Card>
              )}
            </div>
          )}

          {activeTab === 'ai-insights' && (
            <StartupAiInsightsView startupId={activeStartup._id} />
          )}
        </div>

        {/* Sidebar details (Financials & Founder) */}
        <div className="space-y-8">
          {/* Investment Details */}
          <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl space-y-6">
            <h3 className="font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-850 flex items-center gap-2">
              <DollarSign size={18} className="text-primary" /> Financial Snapshot
            </h3>

            {/* Fundraiser Status */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Stage</span>
                <span className="font-bold text-gray-900 dark:text-white">{activeStartup.stage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Raised</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(activeStartup.fundingRaised)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Goal</span>
                <span className="font-bold text-primary">{formatCurrency(activeStartup.fundingGoal)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      activeStartup.fundingGoal > 0 ? (activeStartup.fundingRaised / activeStartup.fundingGoal) * 100 : 0
                    )}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 font-semibold block text-right">
                {activeStartup.fundingGoal > 0 ? Math.round((activeStartup.fundingRaised / activeStartup.fundingGoal) * 100) : 0}% Raised
              </span>
            </div>

            {/* Premium Investor Info */}
            <div className="space-y-3 pt-4 border-t border-gray-150 dark:border-gray-850">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Equity Offered</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {activeStartup.equityOffered ? `${activeStartup.equityOffered}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Valuation</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {activeStartup.valuation ? formatCurrency(activeStartup.valuation) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Min. Investment</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {activeStartup.minInvestment ? formatCurrency(activeStartup.minInvestment) : 'N/A'}
                </span>
              </div>
            </div>

            {user?.role === 'investor' && (
              <Button 
                className="w-full h-12 text-md shadow-lg clay-primary border-none text-white hover:scale-[1.02] transition-all duration-300"
                onClick={() => setIsProposalModalOpen(true)}
              >
                Invest in Startup
              </Button>
            )}
          </Card>

          {/* Founder Profile Card */}
          <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-850">
              Founder Profile
            </h3>
            {activeStartup.founder && typeof activeStartup.founder !== 'string' ? (
              <div className="flex items-center gap-4">
                {activeStartup.founder.avatar ? (
                  <img
                    src={activeStartup.founder.avatar}
                    alt={`${activeStartup.founder.firstName} avatar`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {activeStartup.founder.firstName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {activeStartup.founder.firstName} {activeStartup.founder.lastName}
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Primary Founder</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-505">Founder details unavailable</div>
            )}
          </Card>
        </div>
      </div>

      {/* Submit Proposal Modal */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="clay p-8 max-w-md w-full relative space-y-6 text-white bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight">Propose Funding Terms</h3>
              <p className="text-gray-400 text-xs mt-1">Submit your term sheet details for {activeStartup.name}.</p>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Investment Value ($)</label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={proposalAmount}
                  onChange={(e) => setProposalAmount(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Equity Stake Offered (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 5"
                  value={proposalEquity}
                  onChange={(e) => setProposalEquity(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Cover Message</label>
                <textarea
                  rows={4}
                  placeholder="Write a message outlining your strategic value addition, terms, or contact options..."
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10"
                  onClick={() => setIsProposalModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 rounded-xl clay-primary border-none text-white hover:scale-[1.02] transition-all"
                  disabled={isSubmittingProposal}
                >
                  {isSubmittingProposal ? 'Submitting...' : 'Send Proposal'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
