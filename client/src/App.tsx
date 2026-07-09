import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ROUTES } from '@/lib/constants';
import { startupService } from '@/services/startupService';

// Layouts
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Pages
import { LandingPage } from '@/pages/landing/LandingPage';
import { EventsPage } from '@/pages/landing/EventsPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from '@/pages/auth/RegisterPage';
import { NotFoundPage, ServerErrorPage } from '@/pages/errors/NotFoundPage';

// Discovery & Startup Pages
import { DiscoveryPage } from '@/pages/dashboard/DiscoveryPage';
import { CreateStartupPage } from '@/pages/dashboard/startups/CreateStartupPage';
import { StartupProfilePage } from '@/pages/dashboard/startups/StartupProfilePage';

import { EntrepreneurDashboard } from '@/pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from '@/pages/dashboard/InvestorDashboard';
import { MentorDashboard } from '@/pages/dashboard/MentorDashboard';
import { NotificationsPage } from '@/pages/dashboard/NotificationsPage';
import { ProfilePage } from '@/pages/dashboard/ProfilePage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage';
import { useAuthStore } from '@/stores/authStore';

// Phase 4 System Pages
import { MeetingsPage } from '@/pages/meetings/MeetingsPage';
import { InvestmentProposalPage } from '@/pages/investments/InvestmentProposalPage';
import { PortfolioPage } from '@/pages/investments/PortfolioPage';
import { MentorProfilePage } from '@/pages/mentors/MentorProfilePage';

// Phase 5 Messaging Pages
import { ChatPage } from '@/pages/dashboard/ChatPage';
import { FeedPage } from '@/pages/dashboard/FeedPage';
import { AdminDashboard } from '@/pages/dashboard/AdminDashboard';

// Phase 6 Competition Pages
import { CompetitionsListPage } from '@/pages/competitions/CompetitionsListPage';
import { CompetitionDetailsPage } from '@/pages/competitions/CompetitionDetailsPage';

// Simple wrappers for public views with navbar/footer
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-bgLight dark:bg-bgDark overflow-hidden flex flex-col pt-20">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

// Dashboard Overview router
const DashboardOverview = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'entrepreneur';

  if (role === 'entrepreneur') return <EntrepreneurDashboard />;
  if (role === 'investor') return <InvestorDashboard />;
  if (role === 'mentor') return <MentorDashboard />;
  if (role === 'admin') return <AdminDashboard />;
  return <EntrepreneurDashboard />;
};

// Manage startups routing redirector
const DashboardStartupRedirect = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'entrepreneur';

  const { data: startupRes, isLoading } = useQuery({
    queryKey: ['myStartup'],
    queryFn: () => startupService.getMyStartup(),
    enabled: role === 'entrepreneur',
    retry: false,
  });

  if (role !== 'entrepreneur') {
    return <Navigate to="/dashboard/discover" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const startup = startupRes?.data;
  if (startup) {
    return <Navigate to={`/dashboard/startups/${startup.slug}`} replace />;
  }

  return <Navigate to="/dashboard/startups/new" replace />;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          
          {/* Public Discovery (with navbar/footer) */}
          <Route path={ROUTES.DISCOVER} element={<PublicLayout><DiscoveryPage /></PublicLayout>} />
          <Route path={ROUTES.STARTUPS} element={<PublicLayout><DiscoveryPage /></PublicLayout>} />
          <Route path={ROUTES.INVESTORS} element={<PublicLayout><MentorProfilePage /></PublicLayout>} />
          <Route path={ROUTES.COMPETITIONS} element={<PublicLayout><CompetitionsListPage /></PublicLayout>} />
          <Route path={ROUTES.EVENTS} element={<PublicLayout><EventsPage /></PublicLayout>} />
          <Route path="/startups/:slug" element={<PublicLayout><StartupProfilePage /></PublicLayout>} />
          
          {/* Protected Dashboard Routes */}
          <Route path={ROUTES.DASHBOARD} element={<DashboardLayout />}>
            <Route index element={<Navigate to={ROUTES.DASHBOARD_OVERVIEW} replace />} />
            <Route path={ROUTES.DASHBOARD_OVERVIEW} element={<DashboardOverview />} />
            <Route path="/dashboard/discover" element={<DiscoveryPage />} />
            <Route path={ROUTES.DASHBOARD_STARTUPS} element={<DashboardStartupRedirect />} />
            <Route path="/dashboard/startups/new" element={<CreateStartupPage />} />
            <Route path="/dashboard/startups/:slug" element={<StartupProfilePage />} />
            <Route path={ROUTES.DASHBOARD_NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={ROUTES.DASHBOARD_MEETINGS} element={<MeetingsPage />} />
            <Route path="/dashboard/investments" element={<InvestmentProposalPage />} />
            <Route path="/dashboard/portfolio" element={<PortfolioPage />} />
            <Route path="/dashboard/mentors" element={<MentorProfilePage />} />
            <Route path={ROUTES.DASHBOARD_MESSAGES} element={<ChatPage />} />
            <Route path={ROUTES.DASHBOARD_PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.DASHBOARD_SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTES.DASHBOARD_ANALYTICS} element={<AnalyticsPage />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/feed" element={<FeedPage />} />
            <Route path="/dashboard/competitions" element={<CompetitionsListPage />} />
            <Route path="/dashboard/competitions/:id" element={<CompetitionDetailsPage />} />
          </Route>

          {/* Error Routes */}
          <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
