import React, { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { useDataStore } from './store/dataStore';
import { AuthForm } from './components/auth/AuthForm';
import { Header } from './components/layout/Header';
import { TabNavigation } from './components/layout/TabNavigation';
import { TOCTab } from './components/tabs/TOCTab';
import { FSRTab } from './components/tabs/FSRTab';
import { IFRTab } from './components/tabs/IFRTab';
import { ISRTab } from './components/tabs/ISRTab';

function App() {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const { activeTab, setActiveTab } = useDataStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  useEffect(() => {
    // Persist active tab in localStorage
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab && ['toc', 'fsr', 'ifr', 'isr'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, [setActiveTab]);

  useEffect(() => {
    // Save active tab to localStorage
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'toc':
        return <TOCTab />;
      case 'fsr':
        return <FSRTab />;
      case 'ifr':
        return <IFRTab />;
      case 'isr':
        return <ISRTab />;
      default:
        return <TOCTab />;
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show auth form if user is not authenticated
  if (!user) {
    return <AuthForm onSuccess={() => {}} />;
  }

  // Show main application if user is authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <TabNavigation />
      <main>
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;