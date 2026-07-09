import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, CheckCircle2, Save, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const EVENTS_DATA = [
  {
    id: 1,
    title: "Global Tech Venture Summit 2026",
    date: "July 24, 2026",
    time: "10:00 AM EST",
    location: "San Francisco, CA / Hybrid",
  },
  {
    id: 2,
    title: "Web3 & Fintech Demo Day",
    date: "August 05, 2026",
    time: "02:00 PM EST",
    location: "Virtual (Jitsi Room)",
  },
  {
    id: 3,
    title: "AI Growth & Valuation Masterclass",
    date: "August 18, 2026",
    time: "11:00 AM EST",
    location: "Virtual Webinar",
  }
];

export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (user) {
      setUser({
        ...user,
        firstName,
        lastName,
      });
      toast.success('Profile updated successfully!');
    }
    setIsSubmitting(false);
  };

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your personal details and account settings.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Side: Avatar Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 text-center shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white text-3xl font-extrabold shadow-lg mb-4">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {firstName} {lastName}
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-500 dark:text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            <Shield size={12} />
            {user?.role || 'Entrepreneur'}
          </div>
          
          <div className="w-full pt-4 border-t border-gray-100 dark:border-slate-700/50 space-y-3 text-left">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Status</span>
              <span className="flex items-center gap-1 text-green-500 font-semibold">
                <CheckCircle2 size={12} /> Verified
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Member Since</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">July 2026</span>
            </div>
          </div>
        </div>

        {/* Right Side: Account Details Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-slate-700/50 pb-3">
            Account Details
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">First Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400">
                    <User size={16} />
                  </span>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10"
                    placeholder="Enter first name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-gray-400">
                    <User size={16} />
                  </span>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <Mail size={16} />
                </span>
                <Input
                  type="email"
                  value={user?.email || ''}
                  className="pl-10 bg-gray-50 dark:bg-slate-700/30 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-slate-700"
                  disabled
                  readOnly
                />
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Email address cannot be changed. Contact platform support to request modifications.
              </p>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                className="flex items-center gap-2 h-11 px-6 text-sm font-semibold"
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Registered Events Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm mt-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-slate-700/50 pb-3 flex items-center gap-2">
          <Calendar className="text-primary-500 w-5 h-5" /> Registered Events
        </h3>

        {(() => {
          const savedIds = localStorage.getItem('registeredEvents');
          const registeredIds: number[] = savedIds ? JSON.parse(savedIds) : [];
          const registeredEvents = EVENTS_DATA.filter(event => registeredIds.includes(event.id));

          if (registeredEvents.length === 0) {
            return (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  You haven't registered for any events yet.
                </p>
                <Link to="/events">
                  <Button className="text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 mx-auto">
                    Explore Events <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            );
          }

          return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {registeredEvents.map(event => (
                <div 
                  key={event.id}
                  className="p-5 rounded-2xl border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30 flex flex-col justify-between"
                >
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                      {event.title}
                    </h4>
                    <div className="space-y-1 text-xs text-gray-400 dark:text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary-500" /> {event.date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-primary-500" /> {event.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-primary-500" /> {event.location}
                      </div>
                    </div>
                  </div>
                  <Link to="/events">
                    <Button variant="outline" className="w-full text-xs font-semibold py-1.5 rounded-lg border-gray-200 dark:border-slate-700">
                      Manage Registration
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
