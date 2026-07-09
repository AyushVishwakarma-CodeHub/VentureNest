import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStartupStore } from '@/stores/startupStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { 
  Building, 
  DollarSign, 
  Users, 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  FileText,
  Video,
  UploadCloud
} from 'lucide-react';

const STAGES = ['Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth'];
const INDUSTRIES = ['SaaS', 'Fintech', 'AI/ML', 'Healthtech', 'Edtech', 'E-commerce', 'Clean Energy', 'Web3', 'Hardware', 'Other'];

export function CreateStartupPage() {
  const navigate = useNavigate();
  const { createStartup, uploadLogo, uploadPitchDeck, uploadVideo } = useStartupStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdStartupId, setCreatedStartupId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState<string[]>([]);
  const [stage, setStage] = useState('Idea');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [teamSize, setTeamSize] = useState(1);
  const [fundingGoal, setFundingGoal] = useState(0);
  const [equityOffered, setEquityOffered] = useState<number | undefined>(undefined);
  const [valuation, setValuation] = useState<number | undefined>(undefined);
  const [minInvestment, setMinInvestment] = useState<number | undefined>(undefined);
  const [revenueModel, setRevenueModel] = useState('');
  const [monthlyRecurringRevenue, setMonthlyRecurringRevenue] = useState<number | undefined>(undefined);
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  // Media files state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [deckFile, setDeckFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleNext = () => {
    // Basic validation per step
    if (step === 1) {
      if (!name.trim()) return toast.error('Startup name is required');
      if (headline.trim().length < 10) return toast.error('Headline must be at least 10 characters');
      if (industry.length === 0) return toast.error('Please select at least one industry');
      if (!location.trim()) return toast.error('Location is required');
    }
    if (step === 2) {
      if (description.trim().length < 50) return toast.error('Description must be at least 50 characters');
      if (teamSize < 1) return toast.error('Team size must be at least 1');
    }
    if (step === 3) {
      if (fundingGoal < 0) return toast.error('Funding goal cannot be negative');
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleIndustryToggle = (ind: string) => {
    setIndustry((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const handleCreateProfile = async () => {
    setIsSubmitting(true);
    try {
      const startup = await createStartup({
        name,
        headline,
        description,
        industry,
        stage: stage as any,
        location,
        website,
        teamSize,
        fundingGoal,
        equityOffered,
        valuation,
        minInvestment,
        revenueModel,
        monthlyRecurringRevenue,
        socials: { linkedin, twitter },
      });

      setCreatedStartupId(startup._id);
      toast.success('Startup profile created! Now upload pitch materials.');
      setStep(4); // Move to upload materials step
    } catch (err: any) {
      toast.error(err.message || 'Failed to create startup profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadFiles = async () => {
    if (!createdStartupId) return;
    setIsSubmitting(true);
    try {
      if (logoFile) {
        await uploadLogo(createdStartupId, logoFile);
        toast.success('Logo uploaded!');
      }
      if (deckFile) {
        await uploadPitchDeck(createdStartupId, deckFile);
        toast.success('Pitch deck document uploaded!');
      }
      if (videoFile) {
        await uploadVideo(createdStartupId, videoFile);
        toast.success('Video demo uploaded!');
      }
      toast.success('All files processed! Onboarding complete.');
      navigate(`/dashboard/overview`);
    } catch (err: any) {
      toast.error(err.message || 'Error uploading pitch files');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Register Your Startup
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Let's set up your profile and get you in front of world-class investors.
        </p>
      </div>

      {/* Progress timeline */}
      <div className="flex items-center justify-between px-4 max-w-lg mx-auto">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                step >= s
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
              }`}
            >
              {step > s ? <Check size={18} /> : s}
            </div>
            {s < 4 && (
              <div
                className={`h-1 w-16 md:w-24 transition-all duration-300 ${
                  step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-800'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden p-6 md:p-8 rounded-3xl">
        <CardContent className="p-0 space-y-6">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-800">
                <Building size={20} className="text-primary" />
                1. Company Basics
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Startup Name</label>
                <Input
                  type="text"
                  placeholder="e.g. Acme Corporation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/80 dark:bg-slate-850"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Headline (One-liner)</label>
                <Input
                  type="text"
                  placeholder="e.g. Next-gen collaboration workspace powered by AI."
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="bg-white/80 dark:bg-slate-850"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Industry Sector</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => handleIndustryToggle(ind)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                        industry.includes(ind)
                          ? 'bg-primary border-primary text-white shadow-md'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
                  <Input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Funding Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full h-11 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-slate-850 px-4 text-sm font-semibold text-gray-700 dark:text-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-800">
                <Users size={20} className="text-primary" />
                2. Product & Team
              </h2>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Detailed Description</label>
                <textarea
                  placeholder="Provide a detailed explanation of your problem statement, solution, target audience, and product details. (Markdown supported)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-40 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/85 dark:bg-slate-850 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Website URL</label>
                  <Input
                    type="url"
                    placeholder="https://yourstartup.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team Size</label>
                  <Input
                    type="number"
                    min={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: FINANCIALS */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-800">
                <DollarSign size={20} className="text-primary" />
                3. Financials & Socials
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Funding Goal ($ USD)</label>
                  <Input
                    type="number"
                    min={0}
                    value={fundingGoal}
                    onChange={(e) => setFundingGoal(Number(e.target.value))}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Equity Offered (%)</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 5"
                    value={equityOffered || ''}
                    onChange={(e) => setEquityOffered(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Valuation ($ USD)</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 2000000"
                    value={valuation || ''}
                    onChange={(e) => setValuation(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Min Investment ($ USD)</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 10000"
                    value={minInvestment || ''}
                    onChange={(e) => setMinInvestment(e.target.value ? Number(e.target.value) : undefined)}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">LinkedIn Profile URL</label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/company/..."
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Twitter Profile URL</label>
                  <Input
                    type="url"
                    placeholder="https://twitter.com/..."
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="bg-white/80 dark:bg-slate-850"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PITCH MATERIALS */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white pb-3 border-b border-gray-150 dark:border-gray-800">
                <Globe size={20} className="text-primary" />
                4. Upload Pitch Materials
              </h2>

              {/* Logo File */}
              <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white/30 dark:bg-slate-850/30">
                <UploadCloud className="text-gray-400 mb-2" size={28} />
                <label className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                  Choose Company Logo File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  />
                </label>
                {logoFile && <span className="text-xs text-green-500 mt-1 font-medium">{logoFile.name}</span>}
              </div>

              {/* Pitch Deck */}
              <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white/30 dark:bg-slate-850/30">
                <FileText className="text-gray-400 mb-2" size={28} />
                <label className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                  Choose Pitch Deck Document (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setDeckFile(e.target.files?.[0] || null)}
                  />
                </label>
                {deckFile && <span className="text-xs text-green-500 mt-1 font-medium">{deckFile.name}</span>}
              </div>

              {/* Video Demo */}
              <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white/30 dark:bg-slate-850/30">
                <Video className="text-gray-400 mb-2" size={28} />
                <label className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                  Choose Video Demo File (MP4/WebM)
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </label>
                {videoFile && <span className="text-xs text-green-500 mt-1 font-medium">{videoFile.name}</span>}
              </div>
            </motion.div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between gap-4 pt-6 border-t border-gray-150 dark:border-gray-800">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting || step === 4} // Block back once profile is created
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
            )}
            <div className="ml-auto">
              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="flex items-center gap-2">
                  Continue
                  <ArrowRight size={16} />
                </Button>
              ) : step === 3 ? (
                <Button 
                  type="button" 
                  onClick={handleCreateProfile} 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? 'Registering...' : 'Create Startup Profile'}
                  <Check size={16} />
                </Button>
              ) : (
                <Button 
                  type="button" 
                  onClick={handleUploadFiles} 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? 'Uploading Pitch Media...' : 'Complete Onboarding'}
                  <Check size={16} />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
