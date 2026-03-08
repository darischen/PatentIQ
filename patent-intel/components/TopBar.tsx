
import React from 'react';
import { Grid } from 'lucide-react';
import { Screen } from '../types';

interface TopBarProps {
  onNavigate: (screen: Screen) => void;
  currentScreen?: Screen;
}

const TopBar: React.FC<TopBarProps> = ({ onNavigate, currentScreen }) => {
  const isProjectPage = currentScreen === 'projects';

  // Styles for the Home/Input (Welcome) page - Logo Left, Pill Center, Profile Right
  if (!isProjectPage) {
    return (
      <div className="w-full px-12 pt-8 pb-2 flex items-center justify-between flex-shrink-0">
        {/* Left Section: Brand */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('projects')}
        >
          <div className="w-10 h-10 bg-[#4f46e5] rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
            <Grid className="text-white w-5 h-5" />
          </div>
          <span className="text-slate-900 font-bold text-[18px] tracking-tight hidden sm:block">PatentIntel</span>
        </div>

        {/* Center Section: Dark Navigation Pill */}
        <div className="bg-[#424b6e] rounded-full h-[54px] flex items-center px-10 shadow-xl border border-white/5">
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <button 
              onClick={() => onNavigate('projects')}
              className={`text-[13px] font-medium transition-all ${currentScreen === 'projects' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => onNavigate('welcome')}
              className={`text-[13px] font-medium transition-all ${currentScreen === 'welcome' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Home/Input
            </button>
            <button 
              onClick={() => onNavigate('history')}
              className={`text-[13px] font-medium transition-all ${currentScreen === 'history' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              History
            </button>
            <button 
              onClick={() => onNavigate('help')}
              className={`text-[13px] font-medium transition-all ${currentScreen === 'help' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Help
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className={`text-[13px] font-medium transition-all ${currentScreen === 'settings' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Right Section: Profile */}
        <div className="flex items-center justify-end">
          <div 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-full border-4 border-white overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-200 transition-all shadow-xl group relative"
          >
            <img 
              src="https://picsum.photos/seed/intel-user-88/100/100" 
              alt="User" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
            />
            <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    );
  }

  // Styles for the Projects page
  return (
    <div className="w-full px-4 pt-6 pb-2 flex justify-center flex-shrink-0">
      <div className="bg-[#232d42] rounded-full h-[54px] flex items-center px-10 shadow-2xl border border-white/5">
        <div className="flex items-center justify-center gap-8 md:gap-14">
          <button 
            onClick={() => onNavigate('projects')}
            className={`text-[13px] font-medium transition-all ${
              currentScreen === 'projects' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Projects
          </button>
          <button 
            onClick={() => onNavigate('history')}
            className={`text-[13px] font-medium transition-all ${
              currentScreen === 'history' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            History
          </button>
          <button 
            onClick={() => onNavigate('help')}
            className={`text-[13px] font-medium transition-all ${
              currentScreen === 'help' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Help
          </button>
          <button 
            onClick={() => onNavigate('settings')}
            className={`text-[13px] font-medium transition-all ${
              currentScreen === 'settings' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
