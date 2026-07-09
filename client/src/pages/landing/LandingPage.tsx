import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star,
  ChevronDown,
  Play,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  ROUTES, 
  STATS, 
  TRUSTED_COMPANIES, 
  HOW_IT_WORKS, 
  FEATURES, 
  TESTIMONIALS, 
  PRICING_PLANS, 
  FAQ_ITEMS,
  FEATURED_STARTUPS
} from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function TiltCard({ children, className, initial, animate, whileInView, viewport, transition }: any) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    
    // Highly responsive 3D tilt angles (up to 15 degrees)
    const rX = -mouseY * 15;
    const rY = mouseX * 15;
    
    setTilt({ x: rX, y: rY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      className="relative w-full h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className={className}
      >
        {children}
      </div>
    </motion.div>
  );
}

export function ConstellationBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      if (!canvas) return;
      particles = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 70);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    handleResize();

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      
      ctx.strokeStyle = isDark ? 'rgba(108, 99, 255, 0.07)' : 'rgba(108, 99, 255, 0.05)';
      ctx.fillStyle = isDark ? 'rgba(108, 99, 255, 0.2)' : 'rgba(108, 99, 255, 0.12)';

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineWidth = (1 - dist / 110) * 0.45;
            ctx.stroke();
          }
        }
      }

      // Draw lines from mouse to close particles
      if (mouse.x !== -1000) {
        particles.forEach((p) => {
          const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.lineWidth = (1 - dist / 140) * 0.7;
            ctx.strokeStyle = isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)';
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
    />
  );
}

export function LandingPage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 relative bg-transparent">
        <ConstellationBackground />
        
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-8"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                  The #1 Platform for Startup Funding
                </motion.div>

                <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                  Where Great Ideas Meet{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">
                    Great Investors.
                  </span>
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Join the fastest growing network of founders, investors, and mentors. Raise capital, find deals, and build the future.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button size="xl" className="w-full sm:w-auto text-lg px-8 shadow-lg clay-primary hover:scale-[1.03] transition-all duration-300 rounded-2xl border-none" asChild>
                    <Link to={ROUTES.REGISTER}>
                      Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="xl" 
                    variant="outline" 
                    onClick={() => setIsVideoOpen(true)}
                    className="w-full sm:w-auto text-lg px-8 flex items-center gap-2 hover:scale-[1.03] transition-all duration-300 rounded-2xl clay border-none text-white bg-white/5"
                  >
                    <Play className="w-4 h-4 fill-primary-500/10 text-primary-500 shrink-0" /> Watch Demo
                  </Button>
                </motion.div>
                
                <motion.p variants={fadeInUp} className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                  No credit card required. Free for early-stage founders.
                </motion.p>
              </motion.div>
            </div>

            {/* Dashboard Mockup */}
              <TiltCard 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                className="relative rounded-[2.5rem] border-2 border-white/10 p-2 md:p-4 backdrop-blur-2xl shadow-2xl overflow-hidden cursor-pointer clay"
              >
                <div className="aspect-[16/9] rounded-xl bg-gray-100 dark:bg-slate-800 overflow-hidden relative border border-gray-200/50 dark:border-gray-700/50">
                  {/* Decorative window controls */}
                  <div className="absolute top-0 left-0 right-0 h-10 bg-gray-200/50 dark:bg-gray-900/50 flex items-center px-4 gap-2 backdrop-blur-md z-10">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  {/* Mockup content - Premium UI image */}
                  <div className="absolute inset-0 top-10 overflow-hidden">
                    <img 
                      src="/dashboard_mockup.jpg" 
                      alt="Startup Pitch Hub Dashboard Overview" 
                      className="w-full h-full object-cover object-top select-none pointer-events-none opacity-90 hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  {/* Overlay gradient for fade effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bgLight dark:from-bgDark via-transparent to-transparent z-20 pointer-events-none opacity-20" />
                </div>
              </TiltCard>
          </div>
        </section>

        {/* TRUSTED BY */}
        <section className="py-12 border border-white/10 bg-white/5 dark:bg-slate-900/30 backdrop-blur-xl rounded-[2.5rem] shadow-2xl max-w-6xl mx-auto my-12 overflow-hidden">
          <div className="container mx-auto px-4">
            <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
              Trusted by top investors from
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {TRUSTED_COMPANIES.map(company => (
                <span key={company} className="text-xl md:text-2xl font-bold font-serif text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-default">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-[2rem] clay hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <stat.icon size={24} />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-gray-505 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED STARTUPS */}
        <section className="py-24 relative overflow-hidden bg-white/30 dark:bg-slate-900/10 border-y border-gray-200/40 dark:border-gray-800/40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Featured Visionary Startups
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Discover next-gen companies leveraging high customer traction, strategic milestones, and robust validation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURED_STARTUPS.map((startup, idx) => (
                <TiltCard
                  key={startup.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass p-6 rounded-[2rem] relative overflow-hidden flex flex-col justify-between hover:shadow-glow-lg border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div>
                    {/* Header */}
                    <div className="flex gap-4 items-center mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
                        {startup.logo}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-955 dark:text-white text-base leading-tight">
                          {startup.name}
                        </h4>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{startup.industry}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-505 dark:text-gray-400 font-semibold leading-relaxed mb-6">
                      {startup.description}
                    </p>

                    <div className="flex gap-1.5 flex-wrap mb-6">
                      {startup.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[9px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-gray-100 dark:border-gray-850 pt-4">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-400">Raised capital</span>
                      <span className="text-primary font-bold">{startup.raised}</span>
                    </div>
                    <Button size="sm" className="w-full text-xs font-bold py-2 rounded-xl" asChild>
                      <Link to={ROUTES.DISCOVER}>View Pitch Details</Link>
                    </Button>
                  </div>
                </TiltCard>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="rounded-full font-bold px-8" asChild>
                <Link to={ROUTES.DISCOVER}>View All Startups</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 bg-transparent relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Everything you need to raise or deploy capital.
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                A complete suite of tools designed specifically for the venture ecosystem. 
                Stop juggling spreadsheets and emails.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature, index) => (
                <TiltCard 
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-[2rem] hover:shadow-glow-lg border border-white/10 hover:border-white/20 transition-all duration-300 group relative overflow-hidden cursor-pointer clay"
                >
                  <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className={cn("w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-white bg-gradient-to-br", feature.color)}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10 text-sm">
                    {feature.description}
                  </p>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                How it works
              </h2>
            </div>

            <div className="max-w-5xl mx-auto relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 -translate-y-1/2 z-0" />
              
              <div className="grid md:grid-cols-4 gap-8 relative z-10">
                {HOW_IT_WORKS.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="relative text-center"
                  >
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center relative mb-6 clay">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-20 animate-pulse-slow" />
                      <step.icon size={32} className="text-primary relative z-10" />
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gray-905 dark:bg-white text-white dark:text-gray-900 font-bold flex items-center justify-center text-sm shadow-md">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-24 bg-transparent relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Choose the plan that fits your needs. No hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {PRICING_PLANS.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "rounded-[2rem] p-8 relative flex flex-col h-full hover:-translate-y-2 transition-all duration-300",
                    plan.highlighted 
                      ? "clay-accent text-white scale-105 z-10 border-none hover:scale-[1.07] shadow-glow-lg"
                      : "glass text-gray-900 dark:text-white border border-white/10 hover:shadow-glow"
                  )}
                >
                  {plan.highlighted ? (
                    <div className="w-fit mx-auto mb-4 bg-gradient-to-r from-warning to-yellow-300 text-yellow-900 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      Most Popular
                    </div>
                  ) : (
                    <div className="h-[22px] mb-4" />
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={cn("text-sm mb-6 min-h-[40px]", plan.highlighted ? "text-primary-100" : "text-gray-505 dark:text-gray-400")}>
                    {plan.description}
                  </p>
                  <div className="mb-8">
                    <span className="text-5xl font-extrabold">${plan.price.monthly}</span>
                    <span className={cn("text-sm", plan.highlighted ? "text-primary-100" : "text-gray-500")}>/mo</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={20} className={cn("shrink-0 mt-0.5", plan.highlighted ? "text-white" : "text-primary")} />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={ROUTES.REGISTER} className="w-full mt-auto block">
                    <Button 
                      variant={plan.highlighted ? "secondary" : "default"} 
                      className={cn(
                        "w-full text-xs font-bold py-2.5 rounded-xl hover:scale-[1.03] transition-all",
                        plan.highlighted ? "bg-white text-primary hover:bg-slate-100 border-none shadow-md" : "clay-primary border-none"
                      )}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 relative overflow-hidden bg-white/20 dark:bg-slate-900/10 border-y border-gray-200/40 dark:border-gray-800/40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                What Our Venture Partners Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Read how founders, investors, and advisors are accelerating growth and closing capital rounds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, index) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-gray-200/50 dark:border-gray-800/50 hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex gap-1 text-yellow-450">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-500 fill-yellow-550" fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed font-semibold">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex gap-3 items-center mt-6 pt-4 border-t border-gray-100 dark:border-gray-855">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 dark:text-white leading-tight">
                        {t.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-semibold">{t.role}, {t.company}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="glass rounded-2xl border border-gray-200/50 dark:border-gray-800/50 px-6 hover:shadow-glass-sm transition-all duration-300">
                  <AccordionTrigger className="text-left font-bold text-base py-4 hover:no-underline hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary opacity-90" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
          
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to shape the future?
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-white/80">
              Join thousands of founders and investors already building the next generation of great companies.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto text-lg px-8 text-primary shadow-xl" asChild>
                <Link to={ROUTES.REGISTER}>Create Free Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Video Modal */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setIsVideoOpen(false)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-[16/9] bg-slate-950 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-2 right-2 m-2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-gray-800 text-gray-400 hover:text-white transition-colors z-30"
            >
              <X size={18} />
            </button>

            <video 
              src="https://assets.mixkit.co/videos/preview/mixkit-business-charts-on-a-tablet-screen-in-close-up-41943-large.mp4"
              controls
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
