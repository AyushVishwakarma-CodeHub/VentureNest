import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Video, Clock, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { toast } from 'react-hot-toast';

const INITIAL_EVENTS_DATA = [
  {
    id: 1,
    title: "Global Tech Venture Summit 2026",
    description: "Join over 500+ founders and 200+ venture capitalists for panel discussions, live pitches, and speed-networking rounds.",
    date: "July 24, 2026",
    time: "10:00 AM EST",
    location: "San Francisco, CA / Hybrid",
    type: "Summit",
    slotsLeft: 12
  },
  {
    id: 2,
    title: "Web3 & Fintech Demo Day",
    description: "Watch 10 curated pre-seed and seed stage fintech startups showcase their traction and MVP models to active angel syndicates.",
    date: "August 05, 2026",
    time: "02:00 PM EST",
    location: "Virtual (Jitsi Room)",
    type: "Demo Day",
    slotsLeft: 4
  },
  {
    id: 3,
    title: "AI Growth & Valuation Masterclass",
    description: "An intensive workshop hosted by General Partners on how early-stage AI startups are being evaluated in today's venture market.",
    date: "August 18, 2026",
    time: "11:00 AM EST",
    location: "Virtual Webinar",
    type: "Workshop",
    slotsLeft: 45
  }
];

export function EventsPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [registeredIds, setRegisteredIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('registeredEvents');
    return saved ? JSON.parse(saved) : [];
  });

  const handleRegister = (eventId: number, eventTitle: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to register for events.');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1200);
      return;
    }

    let nextIds: number[];
    if (registeredIds.includes(eventId)) {
      nextIds = registeredIds.filter(id => id !== eventId);
      toast.success(`Cancelled registration for ${eventTitle}`);
    } else {
      nextIds = [...registeredIds, eventId];
      toast.success(`Successfully registered for ${eventTitle}! Check your profile for updates.`);
    }
    setRegisteredIds(nextIds);
    localStorage.setItem('registeredEvents', JSON.stringify(nextIds));
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto py-12 animate-in fade-in duration-300">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Venture Events & Webinars
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Participate in webinars, live demo days, and masterclasses to grow your network and raise capital.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_EVENTS_DATA.map((event) => {
          const isRegistered = registeredIds.includes(event.id);
          const currentSlots = isRegistered ? event.slotsLeft - 1 : event.slotsLeft;

          return (
            <Card key={event.id} className="border border-gray-250/60 dark:border-gray-850 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="px-2.5 py-1 rounded-full text-xs font-semibold">
                    {event.type}
                  </Badge>
                  {currentSlots <= 15 && (
                    <span className="text-[10px] text-red-500 font-bold animate-pulse">
                      Only {currentSlots} slots left!
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-gray-950 dark:text-white text-base leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                    {event.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="space-y-2 border-t border-gray-100 dark:border-gray-850 pt-4 text-[11px] text-gray-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" /> {event.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" /> {event.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" /> {event.location}
                  </div>
                </div>

                <Button 
                  onClick={() => handleRegister(event.id, event.title)}
                  className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    isRegistered 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                      : ''
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle size={14} /> Registered
                    </>
                  ) : (
                    'Register Event'
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
export default EventsPage;
