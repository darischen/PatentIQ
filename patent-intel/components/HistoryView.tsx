
import React from 'react';
import { Search, Filter, ChevronRight, FileText, TrendingUp, Calendar, Zap, MoreVertical, Eye } from 'lucide-react';
import { Screen } from '../types';

interface HistoryViewProps {
  onNavigate: (screen: Screen) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onNavigate }) => {
  const histories = [
    { id: 'h1', name: 'Quantum Battery Mesh', date: '2 hours ago', novelty: 85, confidence: 92, status: 'Completed', type: 'Concept' },
    { id: 'h2', name: 'Drone Propeller Optimization', date: 'Yesterday', novelty: 42, confidence: 98, status: 'Completed', type: 'Invalidity' },
    { id: 'h3', name: 'IoT Edge Node Security', date: '3 days ago', novelty: 91, confidence: 88, status: 'Completed', type: 'FTO' },
    { id: 'h4', name: 'Bio-mimetic Actuators', date: '1 week ago', novelty: 64, confidence: 95, status: 'Completed', type: 'Concept' },
    { id: 'h5', name: 'Smart Grid Controller', date: 'Jan 12, 2025', novelty: 22, confidence: 94, status: 'Completed', type: 'Concept' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analysis History</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Review your past sessions, novelty trends, and strategy exports.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-64">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="Search history..." className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none" />
           </div>
           <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm transition-all active:scale-95">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
        <div className="grid grid-cols-12 gap-4 px-8 py-6 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-4">Analysis Name</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-2 text-center">Novelty Score</div>
          <div className="col-span-2 text-center">Confidence</div>
          <div className="col-span-2 text-right">Date / Action</div>
        </div>

        <div className="divide-y divide-slate-50">
          {histories.map((h) => (
            <div key={h.id} className="grid grid-cols-12 gap-4 items-center px-8 py-6 hover:bg-slate-50/80 transition-all group cursor-pointer">
              <div className="col-span-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{h.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{h.status}</p>
                </div>
              </div>
              
              <div className="col-span-2 flex justify-center">
                <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                  {h.type}
                </span>
              </div>

              <div className="col-span-2 flex flex-col items-center">
                <span className={`text-sm font-black ${h.novelty > 70 ? 'text-emerald-500' : h.novelty > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {h.novelty}%
                </span>
                <div className="w-16 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                  <div className={`h-full ${h.novelty > 70 ? 'bg-emerald-500' : h.novelty > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${h.novelty}%` }} />
                </div>
              </div>

              <div className="col-span-2 text-center">
                <span className="text-sm font-black text-slate-400">{h.confidence}%</span>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400">{h.date}</p>
                </div>
                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-100 min-h-[220px]">
          <div>
            <TrendingUp size={24} className="mb-6 opacity-60" />
            <h3 className="text-xl font-black mb-2">Novelty Trends</h3>
            <p className="text-sm text-indigo-100 font-medium">Your invention novelty score has increased by 14% this month.</p>
          </div>
          <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest mt-8">
            View Analytics <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <Calendar size={24} className="mb-6 text-slate-300" />
            <h3 className="text-xl font-black text-slate-800 mb-2">Scheduled Reviews</h3>
            <p className="text-sm text-slate-400 font-medium">You have 2 patents pending monthly validation on Jan 28.</p>
          </div>
          <button className="flex items-center gap-2 text-[11px] font-black text-indigo-600 uppercase tracking-widest mt-8">
            Manage Schedule <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between min-h-[220px]">
          <div>
            <Zap size={24} className="mb-6 text-amber-400" />
            <h3 className="text-xl font-black mb-2">Model Version</h3>
            <p className="text-sm text-slate-400 font-medium">Currently using PatentPro Engine v4.2. Update available.</p>
          </div>
          <button className="flex items-center gap-2 text-[11px] font-black text-amber-400 uppercase tracking-widest mt-8">
            Check Updates <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
