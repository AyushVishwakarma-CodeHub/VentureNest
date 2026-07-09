import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants';

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthStore();

  // Basic route protection
  if (!isLoading && !isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark flex flex-col">
      <Navbar />
      
      {/* Secondary top bar for mobile to toggle sidebar */}
      <div className="lg:hidden fixed top-[73px] left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>
        <span className="ml-2 font-medium text-sm text-gray-900 dark:text-white">Dashboard Menu</span>
      </div>

      <div className="flex flex-1 pt-[73px]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 w-full lg:pl-64 transition-all duration-300 relative min-h-[calc(100vh-73px)] mt-12 lg:mt-0">
          <div className="p-4 md:p-8 max-w-7xl mx-auto h-full animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
