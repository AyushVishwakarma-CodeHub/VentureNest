import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/authService';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Shield, UserCheck, UserX, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const { user: currentAdmin } = useAuthStore();

  const { data: usersRes, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => authService.getAllUsers(),
  });

  const users = usersRes?.data || [];

  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) => authService.toggleUserStatus(userId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(res.message || 'User status updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    }
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold capitalize">Admin</Badge>;
      case 'investor':
        return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold capitalize">Investor</Badge>;
      case 'mentor':
        return <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 font-bold capitalize">Mentor</Badge>;
      default:
        return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold capitalize">Entrepreneur</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 md:p-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <Shield className="text-red-500" /> Admin Console
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all registered system users, review account parameters, and toggle verification/active status.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()} 
          className="border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-slate-800/50 rounded-xl gap-1.5"
        >
          <RefreshCw size={14} /> Refresh Directory
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5 border border-gray-250/60 dark:border-gray-850 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Members</span>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 block">{users.length}</span>
        </Card>

        <Card className="p-5 border border-gray-250/60 dark:border-gray-850 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Entrepreneurs</span>
          <span className="text-3xl font-extrabold text-purple-400 mt-1 block">
            {users.filter(u => u.role === 'entrepreneur').length}
          </span>
        </Card>

        <Card className="p-5 border border-gray-250/60 dark:border-gray-850 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">VC Investors</span>
          <span className="text-3xl font-extrabold text-blue-400 mt-1 block">
            {users.filter(u => u.role === 'investor').length}
          </span>
        </Card>

        <Card className="p-5 border border-gray-250/60 dark:border-gray-850 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Active Admins</span>
          <span className="text-3xl font-extrabold text-red-400 mt-1 block">
            {users.filter(u => u.role === 'admin').length}
          </span>
        </Card>
      </div>

      {/* Users Directory Table */}
      <Card className="border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-slate-900/50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">User Profile</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6 text-center">Account Role</th>
                <th className="py-4 px-6 text-center">Verification Status</th>
                <th className="py-4 px-6 text-center">Deactivation Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-850">
              {users.map((member) => (
                <tr 
                  key={member._id}
                  className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  {/* Name and avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-gray-200">
                        <img 
                          src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member.firstName}`} 
                          alt={`${member.firstName} avatar`} 
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                          {member.firstName} {member.lastName}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-semibold block">Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {member.email}
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6 text-center">
                    {getRoleBadge(member.role)}
                  </td>

                  {/* Verified */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center items-center">
                      {member.isVerified ? (
                        <span className="text-green-500 flex items-center gap-1 text-xs font-semibold">
                          <CheckCircle size={14} /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-500 flex items-center gap-1 text-xs font-semibold">
                          <AlertCircle size={14} /> Pending
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Toggle Status Controls */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">
                      {member._id === currentAdmin?._id ? (
                        <span className="text-[10px] text-gray-400 italic font-medium">Active (Self)</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className={`h-7 px-3 rounded-lg text-[11px] font-bold border transition-all ${
                            member.isActive
                              ? 'text-red-500 hover:bg-red-500/5 border-red-500/20'
                              : 'text-green-500 hover:bg-green-500/5 border-green-500/20'
                          }`}
                          onClick={() => toggleStatusMutation.mutate(member._id)}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {member.isActive ? (
                            <span className="flex items-center gap-1"><UserX size={12} /> Deactivate</span>
                          ) : (
                            <span className="flex items-center gap-1"><UserCheck size={12} /> Activate</span>
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;
