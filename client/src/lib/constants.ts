import {
  Rocket,
  Users,
  TrendingUp,
  Shield,
  Zap,
  MessageSquare,
  Trophy,
  GraduationCap,
  BarChart3,
  Globe,
  Target,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export const APP_NAME = 'Startup Pitch Hub';
export const APP_TAGLINE = 'Where Great Ideas Meet Great Investors';
export const APP_DESCRIPTION =
  'The premier platform connecting visionary startups with strategic investors, experienced mentors, and game-changing opportunities.';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  DISCOVER: '/discover',
  STARTUPS: '/startups',
  INVESTORS: '/investors',
  COMPETITIONS: '/competitions',
  EVENTS: '/events',
  DASHBOARD: '/dashboard',
  DASHBOARD_OVERVIEW: '/dashboard/overview',
  DASHBOARD_PROFILE: '/dashboard/profile',
  DASHBOARD_STARTUPS: '/dashboard/startups',
  DASHBOARD_INVESTMENTS: '/dashboard/investments',
  DASHBOARD_MEETINGS: '/dashboard/meetings',
  DASHBOARD_MESSAGES: '/dashboard/messages',
  DASHBOARD_NOTIFICATIONS: '/dashboard/notifications',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE: '/auth/google',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    AVATAR: '/users/avatar',
  },
  STARTUPS: {
    BASE: '/startups',
    FEATURED: '/startups/featured',
    TRENDING: '/startups/trending',
  },
  INVESTMENTS: {
    BASE: '/investments',
  },
  MEETINGS: {
    BASE: '/meetings',
  },
  MESSAGES: {
    BASE: '/messages',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
  },
  REVIEWS: {
    BASE: '/reviews',
  },
  COMPETITIONS: {
    BASE: '/competitions',
  },
  EVENTS: {
    BASE: '/events',
  },
  FEED: {
    BASE: '/feed',
  },
} as const;

// Navigation Items
export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Discover', href: ROUTES.DISCOVER },
  { label: 'Investors', href: ROUTES.INVESTORS },
  { label: 'Competitions', href: ROUTES.COMPETITIONS },
  { label: 'Events', href: ROUTES.EVENTS },
];

// Color Palette
export const COLORS = {
  primary: '#6C63FF',
  secondary: '#3B82F6',
  accent: '#8B5CF6',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  bgLight: '#F8FAFC',
  bgDark: '#0F172A',
};

// Social Links
export const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://twitter.com/startuppitchhub' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/startuppitchhub' },
  { name: 'GitHub', href: 'https://github.com/startuppitchhub' },
  { name: 'YouTube', href: 'https://youtube.com/@startuppitchhub' },
];

// Features List
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export const FEATURES: Feature[] = [
  {
    icon: Rocket,
    title: 'Pitch Deck Upload',
    description:
      'Upload and share your pitch decks with our beautiful viewer. Track who views them, how long they spend on each slide, and gather real-time feedback.',
    color: 'from-primary-400 to-primary-600',
  },
  {
    icon: Target,
    title: 'Smart Investor Matching',
    description:
      'Our AI-powered algorithm analyzes your startup profile and connects you with investors whose portfolio and interests align perfectly with your vision.',
    color: 'from-secondary-400 to-secondary-600',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Analysis',
    description:
      'Get instant feedback on your pitch with our AI engine. Analyze market sizing, competitive landscape, financial projections, and team composition.',
    color: 'from-accent-400 to-accent-600',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Messaging',
    description:
      'Connect instantly with investors, mentors, and fellow founders. Schedule video calls, share documents, and collaborate—all within the platform.',
    color: 'from-success-400 to-success-600',
  },
  {
    icon: Trophy,
    title: 'Pitch Competitions',
    description:
      'Participate in weekly and monthly pitch competitions. Win prizes, gain exposure, and get featured in front of top-tier investors and media.',
    color: 'from-warning-400 to-warning-600',
  },
  {
    icon: GraduationCap,
    title: 'Expert Mentorship',
    description:
      'Access a curated network of seasoned entrepreneurs and industry experts. Book 1-on-1 sessions, join group workshops, and accelerate your growth.',
    color: 'from-danger-400 to-danger-500',
  },
];

// Pricing Plans
export interface PricingPlan {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for early-stage founders exploring the ecosystem.',
    features: [
      'Create your startup profile',
      'Upload 1 pitch deck',
      'Basic investor discovery',
      'Community forum access',
      'Monthly pitch events',
      'Email support',
    ],
    highlighted: false,
    cta: 'Get Started Free',
  },
  {
    name: 'Growth',
    price: { monthly: 49, yearly: 39 },
    description: 'For startups ready to scale their fundraising efforts.',
    features: [
      'Everything in Starter',
      'Unlimited pitch decks',
      'AI pitch analysis & feedback',
      'Smart investor matching',
      'Priority competition entry',
      'Analytics dashboard',
      'Direct messaging with investors',
      'Mentor network access',
      'Priority support',
    ],
    highlighted: true,
    cta: 'Start 14-day Free Trial',
  },
  {
    name: 'Enterprise',
    price: { monthly: 199, yearly: 159 },
    description: 'For accelerators, VCs, and large organizations.',
    features: [
      'Everything in Growth',
      'Custom branding & portal',
      'Bulk team management',
      'Advanced analytics & reporting',
      'API access & integrations',
      'Deal flow management',
      'Custom competition hosting',
      'Dedicated account manager',
      'SLA-backed uptime',
      'White-label options',
    ],
    highlighted: false,
    cta: 'Contact Sales',
  },
];

// FAQ Items
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How does Startup Pitch Hub match startups with investors?',
    answer:
      'Our proprietary AI algorithm analyzes over 50 data points from your startup profile—including industry, stage, traction metrics, team background, and funding goals—and cross-references them with investor preferences, portfolio history, and active mandates. You receive a curated list of investors ranked by compatibility, ensuring every introduction is warm and relevant.',
  },
  {
    question: 'Is my pitch deck and business information secure?',
    answer:
      'Absolutely. We use enterprise-grade AES-256 encryption for all stored data and TLS 1.3 for data in transit. Your pitch decks are shared only with investors you explicitly approve. We also offer NDA management tools, watermarking, and detailed access logs so you always know exactly who has viewed your materials.',
  },
  {
    question: 'What kind of startups are a good fit for the platform?',
    answer:
      'Startup Pitch Hub welcomes founders at every stage—from pre-seed with just an idea to Series B+ companies looking for strategic partners. We have active investors across technology, healthcare, fintech, consumer products, climate, and more. If you are building something innovative and seeking capital, mentorship, or visibility, you belong here.',
  },
  {
    question: 'How do pitch competitions work?',
    answer:
      'We host weekly themed competitions and a flagship monthly "Grand Pitch" event. Founders submit a 3-minute video pitch or present live to a panel of investors and industry experts. Winners receive cash prizes up to $25,000, featured placement on the platform, fast-tracked introductions to our investor network, and media coverage from our partner publications.',
  },
  {
    question: 'Can investors use the platform to source deals?',
    answer:
      'Yes! Investors get access to a curated deal flow pipeline with advanced filtering by industry, stage, geography, traction metrics, and team composition. You can save searches, set up alerts for new startups matching your criteria, manage your pipeline with our built-in CRM tools, and track all your interactions in one place.',
  },
  {
    question: 'What is included in the AI pitch analysis?',
    answer:
      'Our AI reviews your pitch deck slide-by-slide, providing scores and feedback across 12 dimensions: problem clarity, market size, solution differentiation, business model, traction, financial projections, team strength, competitive analysis, go-to-market strategy, scalability, risk factors, and overall investability. You receive actionable suggestions to strengthen each area.',
  },
  {
    question: 'Do you take equity or charge commissions on deals?',
    answer:
      'No. Startup Pitch Hub is a SaaS platform—we charge a transparent monthly or annual subscription fee and never take equity, carry, or commissions on any deals made through the platform. What you raise is entirely yours.',
  },
  {
    question: 'How can I cancel my subscription?',
    answer:
      'You can cancel at any time from your account settings. Your access continues until the end of your current billing period. We offer a 30-day money-back guarantee on all paid plans, no questions asked. We also offer a free plan that you can downgrade to if you want to keep your profile active.',
  },
];

// Testimonials
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Startup Pitch Hub completely transformed our fundraising process. Within three weeks of going live, we connected with the perfect lead investor for our Series A. The AI feedback on our deck was incredibly actionable.',
    name: 'Sarah Chen',
    role: 'CEO & Co-founder',
    company: 'NeuralFlow AI',
    avatar: 'SC',
    rating: 5,
  },
  {
    quote:
      'As an angel investor, I was drowning in cold pitches. This platform curates exactly the kind of deep-tech startups I want to see. I have made four investments through the platform in the last year—all high quality.',
    name: 'Marcus Rivera',
    role: 'Managing Partner',
    company: 'Horizon Ventures',
    avatar: 'MR',
    rating: 5,
  },
  {
    quote:
      'The pitch competition was a game-changer for us. Not only did we win the $25K grand prize, but three VCs in the audience reached out afterward. We closed our seed round within a month.',
    name: 'Aisha Patel',
    role: 'Founder',
    company: 'GreenGrid Energy',
    avatar: 'AP',
    rating: 5,
  },
  {
    quote:
      'I mentor early-stage founders and this platform makes it incredibly easy. The scheduling tools, video calls, and document sharing are all seamless. I can track my mentees\' progress and celebrate their milestones.',
    name: 'David Okonkwo',
    role: 'Serial Entrepreneur & Mentor',
    company: 'TechBridge Labs',
    avatar: 'DO',
    rating: 5,
  },
  {
    quote:
      'We run an accelerator and switched our entire deal flow and portfolio management to Startup Pitch Hub. The analytics alone saved us hundreds of hours. Best investment in our infrastructure this year.',
    name: 'Elena Vasquez',
    role: 'Program Director',
    company: 'Catalyst Accelerator',
    avatar: 'EV',
    rating: 5,
  },
  {
    quote:
      'The investor matching is uncanny. Every recommendation was spot-on for our fintech vertical. We got warm intros to investors we had been trying to reach for months. Closed our $4M seed in 6 weeks.',
    name: 'James Nakamura',
    role: 'CTO & Co-founder',
    company: 'PayLane',
    avatar: 'JN',
    rating: 5,
  },
];

// Stats
export interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  suffix: string;
}

export const STATS: StatItem[] = [
  { label: 'Active Startups', value: '10000', icon: Rocket, suffix: '+' },
  { label: 'Capital Raised', value: '500', icon: TrendingUp, suffix: 'M+' },
  { label: 'Active Investors', value: '2000', icon: Users, suffix: '+' },
  { label: 'Countries', value: '50', icon: Globe, suffix: '+' },
];

// Trusted Companies
export const TRUSTED_COMPANIES = [
  'Sequoia Capital',
  'Andreessen Horowitz',
  'Y Combinator',
  'Accel Partners',
  'Lightspeed Ventures',
  'Greylock Partners',
  'Benchmark',
  'Index Ventures',
];

// How It Works Steps
export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Create Your Profile',
    description:
      'Sign up in under two minutes. Tell us about your startup or investment thesis, upload your pitch deck, and set your preferences.',
    icon: Users,
  },
  {
    step: 2,
    title: 'Get Smart Matches',
    description:
      'Our AI analyzes your profile and connects you with the most relevant investors, startups, or mentors based on 50+ compatibility factors.',
    icon: Zap,
  },
  {
    step: 3,
    title: 'Connect & Collaborate',
    description:
      'Engage through real-time messaging, schedule video meetings, share documents securely, and build meaningful relationships.',
    icon: MessageSquare,
  },
  {
    step: 4,
    title: 'Grow & Succeed',
    description:
      'Close deals, track your progress with advanced analytics, enter competitions, and scale your venture with confidence.',
    icon: BarChart3,
  },
];

// Featured Startups (for landing page)
export interface FeaturedStartup {
  name: string;
  industry: string;
  stage: string;
  description: string;
  raised: string;
  logo: string;
  tags: string[];
}

export const FEATURED_STARTUPS: FeaturedStartup[] = [
  {
    name: 'NeuralFlow AI',
    industry: 'Artificial Intelligence',
    stage: 'Series A',
    description:
      'Building enterprise-grade AI agents that automate complex business workflows with human-level reasoning and reliability.',
    raised: '$4.2M',
    logo: 'NF',
    tags: ['AI/ML', 'Enterprise', 'SaaS'],
  },
  {
    name: 'GreenGrid Energy',
    industry: 'Clean Energy',
    stage: 'Seed',
    description:
      'Decentralized energy grid management platform enabling communities to trade renewable energy peer-to-peer.',
    raised: '$1.8M',
    logo: 'GG',
    tags: ['CleanTech', 'Energy', 'IoT'],
  },
  {
    name: 'MedVault',
    industry: 'Healthcare',
    stage: 'Series A',
    description:
      'HIPAA-compliant platform that gives patients full ownership of their medical records with blockchain-backed security.',
    raised: '$6.5M',
    logo: 'MV',
    tags: ['HealthTech', 'Blockchain', 'Privacy'],
  },
  {
    name: 'PayLane',
    industry: 'Fintech',
    stage: 'Seed',
    description:
      'Instant cross-border payment rails for emerging markets, reducing remittance costs by 80% with stablecoin technology.',
    raised: '$3.1M',
    logo: 'PL',
    tags: ['Fintech', 'Payments', 'Web3'],
  },
  {
    name: 'EduSpark',
    industry: 'Education',
    stage: 'Pre-Seed',
    description:
      'Personalized learning platform using adaptive AI to create custom curricula for K-12 students across 30+ subjects.',
    raised: '$750K',
    logo: 'ES',
    tags: ['EdTech', 'AI', 'K-12'],
  },
  {
    name: 'AgroSense',
    industry: 'Agriculture',
    stage: 'Seed',
    description:
      'Satellite-powered crop monitoring and yield prediction platform helping farmers increase productivity by up to 40%.',
    raised: '$2.3M',
    logo: 'AS',
    tags: ['AgTech', 'Satellite', 'Analytics'],
  },
];

// Footer Links
export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Competitions', href: '/competitions' },
      { label: 'Events', href: '/events' },
      { label: 'API', href: '/api-docs' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Guides', href: '/guides' },
      { label: 'Templates', href: '/templates' },
      { label: 'Community', href: '/community' },
      { label: 'Partners', href: '/partners' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security', href: '/security' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  },
];
