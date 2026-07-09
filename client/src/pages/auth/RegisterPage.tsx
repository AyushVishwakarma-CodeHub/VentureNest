import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Briefcase, 
  TrendingUp, 
  Users, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import authService from '@/services/authService';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'entrepreneur' | 'investor' | 'mentor'>('entrepreneur');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRoleSelect = (selectedRole: 'entrepreneur' | 'investor' | 'mentor') => {
    setRole(selectedRole);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep2 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and Last name are required');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/;
    if (!complexityRegex.test(formData.password)) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role
      });
      toast.success('Registration successful! Please check your email to verify your account.');
      setStep(3);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 relative z-10">
        
        {/* Left Side: Branding / Details */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-accent to-secondary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <Link to={ROUTES.HOME} className="text-2xl font-bold text-white mb-8 block">
              Startup Pitch Hub
            </Link>
            
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl font-bold mb-4 mt-12 leading-tight">
                    Choose your pathway.
                  </h2>
                  <p className="text-primary-100 mb-8 max-w-sm">
                    Select the role that fits your goals on the platform. You can present pitches, review opportunities, or mentor founders.
                  </p>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="step2-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl font-bold mb-4 mt-12 leading-tight">
                    Create your profile.
                  </h2>
                  <p className="text-primary-100 mb-8 max-w-sm">
                    Fill in your account credentials to register. We will verify your email to ensure platform safety.
                  </p>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="step3-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl font-bold mb-4 mt-12 leading-tight">
                    You're almost there!
                  </h2>
                  <p className="text-primary-100 mb-8 max-w-sm">
                    We've sent a verification link to your email. Verify your account to access all features.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative z-10 text-primary-200 text-sm">
            © {new Date().getFullYear()} Startup Pitch Hub.
          </div>
        </div>

        {/* Right Side: Step-by-Step Forms */}
        <div className="p-8 md:p-12 flex flex-col justify-center min-h-[500px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <div className="text-xs text-primary-500 font-bold uppercase tracking-wider mb-2">Step 1 of 2</div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Join as</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to={ROUTES.LOGIN} className="text-primary-500 hover:underline font-medium">
                      Log in
                    </Link>
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Entrepreneur Role Card */}
                  <div 
                    onClick={() => handleRoleSelect('entrepreneur')}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
                      role === 'entrepreneur'
                        ? "border-primary-500 bg-primary-500/10 dark:bg-primary-500/20 shadow-md"
                        : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                      role === 'entrepreneur' ? "bg-primary-500" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                    )}>
                      <Briefcase size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-950 dark:text-white text-sm">Entrepreneur / Founder</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Launch a startup, upload pitches, and raise capital</p>
                    </div>
                  </div>

                  {/* Investor Role Card */}
                  <div 
                    onClick={() => handleRoleSelect('investor')}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
                      role === 'investor'
                        ? "border-primary-500 bg-primary-500/10 dark:bg-primary-500/20 shadow-md"
                        : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                      role === 'investor' ? "bg-primary-500" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                    )}>
                      <TrendingUp size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-955 dark:text-white text-sm">Investor / VC</h3>
                      <p className="text-xs text-gray-505 dark:text-gray-400">Discover startups, track rounds, and make investments</p>
                    </div>
                  </div>

                  {/* Mentor Role Card */}
                  <div 
                    onClick={() => handleRoleSelect('mentor')}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5",
                      role === 'mentor'
                        ? "border-primary-500 bg-primary-500/10 dark:bg-primary-500/20 shadow-md"
                        : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                      role === 'mentor' ? "bg-primary-500" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                    )}>
                      <Users size={22} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-955 dark:text-white text-sm">Mentor / Advisor</h3>
                      <p className="text-xs text-gray-505 dark:text-gray-400">Provide guidance, review proposals, and conduct feedback</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setStep(2)}
                  className="w-full h-12 text-md mt-6"
                >
                  Continue <ArrowRight size={18} className="ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-500 mb-3 font-semibold"
                  >
                    <ArrowLeft size={14} /> Back to roles
                  </button>
                  <div className="text-xs text-primary-500 font-bold uppercase tracking-wider mb-2">Step 2 of 2</div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Enter your details</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Signing up as a <span className="font-bold text-primary-500 capitalize">{role}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">First Name</label>
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email</label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
                      <Input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                      <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 text-md mt-4" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle size={36} />
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed font-semibold">
                    We've sent a verification link to <span className="font-bold text-primary-500">{formData.email}</span>. Click the link in the email to activate your account.
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <Link to={ROUTES.LOGIN} className="block">
                    <Button className="w-full h-11 text-md">Go to Login</Button>
                  </Link>
                  <button 
                    onClick={() => setStep(1)}
                    className="text-xs text-gray-500 hover:text-primary-500 hover:underline font-bold"
                  >
                    Start registration again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Reset email sent successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-gray-150 dark:border-slate-700 relative z-10 text-center">
        {!isSubmitted ? (
          <>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Forgot Password</h1>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Enter your registered email below, and we will send a password reset link to your inbox.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11 mt-4" disabled={isLoading}>
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-6 py-4">
            <div className="mx-auto w-14 h-14 bg-green-100 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your inbox</h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
                We've sent a password reset email to <span className="font-bold text-primary-500">{email}</span>. Please click the link inside to set a new password.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-750">
          <Link to={ROUTES.LOGIN} className="text-xs text-primary-500 hover:underline font-bold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid password reset token.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setIsSuccess(true);
      toast.success('Password reset successful!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Token may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 relative overflow-hidden">
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-gray-150 dark:border-slate-700 relative z-10 text-center">
        {!isSuccess ? (
          <>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Reset Password</h1>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Enter your new password below to reset access to your Startup Pitch Hub profile.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11"
                />
              </div>

              <Button type="submit" className="w-full h-11 mt-4" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-6 py-4">
            <div className="mx-auto w-14 h-14 bg-green-100 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password reset</h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
                Your password has been reset successfully. You can now use your new credentials to log in.
              </p>
            </div>
            <Link to={ROUTES.LOGIN} className="block">
              <Button className="w-full h-11">Go to Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Invalid or missing email verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        toast.success('Email verified successfully!');
      } catch (error: any) {
        setStatus('error');
        setErrorMsg(error.response?.data?.message || 'Verification link is invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-gray-150 dark:border-slate-700 relative z-10 text-center py-12">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-gray-905 dark:text-white">Verifying email address...</h2>
            <p className="text-xs text-slate-400">Please wait while we validate your credentials with platform security.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="mx-auto w-14 h-14 bg-green-100 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified</h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xs mx-auto">
                Thank you for verifying your email address. Your Startup Pitch Hub account is now active.
              </p>
            </div>
            <Link to={ROUTES.LOGIN} className="block pt-2">
              <Button className="w-full h-11">Go to Login</Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="mx-auto w-14 h-14 bg-red-100 dark:bg-red-950 text-red-500 rounded-full flex items-center justify-center">
              <AlertCircle size={30} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
              <p className="text-xs text-red-500 font-bold leading-relaxed max-w-xs mx-auto">
                {errorMsg}
              </p>
            </div>
            <Link to={ROUTES.HOME} className="block pt-2">
              <Button variant="outline" className="w-full h-11">Return Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
