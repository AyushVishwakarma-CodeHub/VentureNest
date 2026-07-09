import React, { useState } from 'react';
import { Bell, Lock, Shield, Eye, EyeOff, Save, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [notifyNewPitches, setNotifyNewPitches] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyMeetings, setNotifyMeetings] = useState(true);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    toast.success(`Theme switched to ${nextTheme} mode!`);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsChangingPass(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // simulate api
    toast.success('Password changed successfully!');
    
    // clear fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPass(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure platform options, notifications, and security keys.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Left Side: General and Notification settings */}
        <div className="space-y-6">
          {/* Theme card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              Appearance
            </h3>
            <p className="text-xs text-gray-450 dark:text-gray-400 mb-6 leading-relaxed">
              Customize the look and feel of your workspace.
            </p>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-750/30 border border-gray-100 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="text-primary-500 w-5 h-5 shrink-0" />
                ) : (
                  <Sun className="text-warning-500 w-5 h-5 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</h4>
                  <p className="text-xs text-gray-400">Reduce eye strain in low-light environments.</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                  theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-500" /> Notifications
            </h3>
            <p className="text-xs text-gray-450 dark:text-gray-400 mb-6 leading-relaxed">
              Select which notifications you would like to receive.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700/50">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">New Pitch Submissions</h4>
                  <p className="text-[11px] text-gray-400">Notify when startups post new pitch decks matching criteria.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyNewPitches} 
                  onChange={(e) => setNotifyNewPitches(e.target.checked)} 
                  className="rounded border-gray-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500 h-4 w-4" 
                />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700/50">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Chat Messages</h4>
                  <p className="text-[11px] text-gray-400">Notify when you receive a message in discussion threads.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyMessages} 
                  onChange={(e) => setNotifyMessages(e.target.checked)} 
                  className="rounded border-gray-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500 h-4 w-4" 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Meeting Invites</h4>
                  <p className="text-[11px] text-gray-400">Notify when an advisor or investor schedules a meeting round.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyMeetings} 
                  onChange={(e) => setNotifyMeetings(e.target.checked)} 
                  className="rounded border-gray-300 dark:border-slate-600 text-primary-500 focus:ring-primary-500 h-4 w-4" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Security settings */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary-500" /> Security
          </h3>
          <p className="text-xs text-gray-450 dark:text-gray-400 mb-6 leading-relaxed">
            Update your authentication password credentials regularly.
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                className="flex items-center gap-2 h-11 px-6 text-sm font-semibold"
                disabled={isChangingPass}
              >
                <Save size={16} />
                {isChangingPass ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
