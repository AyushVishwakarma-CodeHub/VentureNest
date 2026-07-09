import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  Rocket, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Bell, 
  Settings,
  PieChart,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/lib/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuthStore();
  const role = user?.role || UserRole.ENTREPRENEUR;

  // Base navigation items for all users
  const topNavItems = [
    { label: 'Overview', href: ROUTES.DASHBOARD_OVERVIEW, icon: LayoutDashboard },
    { label: 'Profile', href: ROUTES.DASHBOARD_PROFILE, icon: UserCircle },
  ];

  // Role-specific navigation items
  const roleNavItems = [];
  
  if (role === UserRole.ENTREPRENEUR) {
    roleNavItems.push(
      { label: 'My Startups', href: ROUTES.DASHBOARD_STARTUPS, icon: Rocket },
      { label: 'Analytics', href: ROUTES.DASHBOARD_ANALYTICS, icon: PieChart }
    );
  } else if (role === UserRole.INVESTOR) {
    roleNavItems.push(
      { label: 'Portfolio', href: ROUTES.DASHBOARD_INVESTMENTS, icon: Briefcase },
      { label: 'Saved Startups', href: ROUTES.DASHBOARD_STARTUPS, icon: Rocket }
    );
  } else if (role === 'admin') {
    roleNavItems.push(
      { label: 'Admin Panel', href: '/dashboard/admin', icon: Shield }
    );
  }

  // Common interactive items
  const interactiveNavItems = [
    { label: 'Meetings', href: ROUTES.DASHBOARD_MEETINGS, icon: Calendar },
    { label: 'Messages', href: ROUTES.DASHBOARD_MESSAGES, icon: MessageSquare },
    { label: 'Notifications', href: ROUTES.DASHBOARD_NOTIFICATIONS, icon: Bell },
  ];

  const bottomNavItems = [
    { label: 'Settings', href: ROUTES.DASHBOARD_SETTINGS, icon: Settings },
  ];

  const NavLinkItem = ({ item }: { item: any }) => (
    <NavLink
      to={item.href}
      onClick={() => {
        if (window.innerWidth < 1024) onClose();
      }}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
          isActive
            ? 'text-white bg-gradient-to-r from-primary to-accent shadow-md'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
        )
      }
    >
      <item.icon className="w-5 h-5 shrink-0" />
      <span className="font-medium text-sm">{item.label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={cn(
          'fixed top-[73px] bottom-0 left-0 z-40 w-64 glass border-r border-gray-200/50 dark:border-gray-800/50 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full flex flex-col py-6 overflow-y-auto custom-scrollbar">
          
          <div className="px-4 mb-6">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-3">
              Dashboard
            </h2>
            <div className="space-y-1">
              {topNavItems.map((item) => <NavLinkItem key={item.href} item={item} />)}
            </div>
          </div>

          {roleNavItems.length > 0 && (
            <div className="px-4 mb-6">
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-3">
                {role === UserRole.ENTREPRENEUR ? 'Startups' : 'Investments'}
              </h2>
              <div className="space-y-1">
                {roleNavItems.map((item) => <NavLinkItem key={item.href} item={item} />)}
              </div>
            </div>
          )}

          <div className="px-4 mb-6 flex-1">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-3">
              Connect
            </h2>
            <div className="space-y-1">
              {interactiveNavItems.map((item) => <NavLinkItem key={item.href} item={item} />)}
            </div>
          </div>

          <div className="px-4 pt-4 border-t border-gray-200/20 dark:border-gray-800/50">
            <div className="space-y-1">
              {bottomNavItems.map((item) => <NavLinkItem key={item.href} item={item} />)}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
