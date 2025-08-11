import React from 'react';
import { useDataStore } from '../../store/dataStore';

const tabs = [
  { id: 'toc', name: 'TOC', description: 'Table of Contents' },
  { id: 'fsr', name: 'FSR', description: 'Faculty-Student Ratio' },
  { id: 'ifr', name: 'IFR', description: 'International Faculty Ratio' },
  { id: 'isr', name: 'ISR', description: 'International Student Ratio' },
];

export const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useDataStore();

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-5 px-8 border-b-4 font-semibold text-sm transition-all duration-200 rounded-t-xl cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-800 bg-indigo-100 shadow-sm'
                  : 'border-transparent text-slate-600 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm'
              }`}
            >
              <div className="text-center">
                <div className="font-bold text-lg">{tab.name}</div>
                <div className="text-xs opacity-90 font-medium mt-1">{tab.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};