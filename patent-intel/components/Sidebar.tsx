
import React from 'react';
import { LayoutDashboard, Compass, Layers, FileSearch, FileBarChart, Save, Settings, LogOut, Grid, History, HelpCircle } from 'lucide-react';
import { Screen } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Baseline Summary', icon: <LayoutDashboard size={20} /> },
    { id: 'sandbox', label: 'Strategy Sandbox', icon: <Compass size={20} /> },
    { id: 'heatmap', label: 'Feature Heatmap', icon: <Layers size={20} /> },
    { id: 'explorer', label: 'Prior art explorer', icon: <FileSearch size={20} /> },
  ];

  const otherItems = [
    { id: 'history', label: 'Analysis History', icon: <History size={20} /> },
    { id: 'help', label: 'Help & Docs', icon: <HelpCircle size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-72 h-full bg-white border-r border-slate-100 flex flex-col py-8 px-6 shadow-sm z-10">
      <div 
        className="flex items-center gap-3 mb-12 px-2 cursor-pointer group"
        onClick={() => onNavigate('projects')}
      >
        <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
          <Grid className="text-white w-6 h-6" />
        </div>
        <span className="text-[#1e293b] font-bold text-xl tracking-tight group-hover:text-indigo-600 transition-colors">Patent Intel</span>
      </div>

      <div className="flex-1 space-y-10">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Navigation</p>
          <div className="space-y-1">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as Screen)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm active:scale-95 ${
                  currentScreen === item.id 
                    ? 'bg-[#1e293b] text-white shadow-lg shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Others</p>
          <div className="space-y-1">
            {otherItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as Screen)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm active:scale-95 ${
                  currentScreen === item.id 
                    ? 'bg-[#1e293b] text-white shadow-lg shadow-slate-200' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={() => window.location.reload()}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-medium text-sm mt-auto active:scale-95"
      >
        <LogOut size={20} />
        Log Out
      </button>
    </aside>
  );
};

export default Sidebar;
