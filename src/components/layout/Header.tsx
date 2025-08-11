import React from 'react';
import { GraduationCap, LogOut, User } from 'lucide-react';
import { signOut } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <header className="bg-white shadow-lg border-b border-slate-200 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              University Ranking System
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded-lg">
              <User className="h-4 w-4 text-indigo-600" />
              <span className="font-medium">{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};