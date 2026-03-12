
import React from 'react';
import { Search, Book, Video, MessageCircle, ChevronRight, HelpCircle, FileText, Zap, ExternalLink } from 'lucide-react';
import { Screen } from '../types';

interface HelpViewProps {
  onNavigate: (screen: Screen) => void;
}

const HelpView: React.FC<HelpViewProps> = ({ onNavigate }) => {
  const categories = [
    { title: 'Platform Basics', icon: <Book size={20} />, count: 12, color: 'indigo' },
    { title: 'Analysis Engine', icon: <Zap size={20} />, count: 8, color: 'amber' },
    { title: 'Video Tutorials', icon: <Video size={20} />, count: 15, color: 'rose' },
    { title: 'Legal Compliance', icon: <FileText size={20} />, count: 6, color: 'emerald' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center max-w-2xl mx-auto space-y-6 mt-8">
        <h1 className="text-[40px] font-black text-slate-900 tracking-tight">How can we help?</h1>
        <div className="relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documentation, guides, and FAQs..." 
            className="w-full h-16 bg-white border border-slate-100 rounded-[2rem] pl-16 pr-8 text-sm font-medium focus:ring-4 focus:ring-indigo-100 outline-none shadow-xl shadow-slate-200/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50 hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
            <div className={`w-12 h-12 bg-${cat.color}-50 text-${cat.color}-600 rounded-2xl flex items-center justify-center mb-8 transition-colors group-hover:bg-slate-900 group-hover:text-white`}>
              {cat.icon}
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1">{cat.title}</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{cat.count} Articles</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-10 mt-12 px-4">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <HelpCircle size={20} className="text-indigo-600" />
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              "How does the AI novelty score work?",
              "What databases are included in the Prior Art Explorer?",
              "Can I export my Strategy Sandbox as a legal draft?",
              "How do I manage multi-user team projects?",
              "Is my technical data encrypted and private?"
            ].map((q, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-100 transition-colors">
                <span className="text-sm font-bold text-slate-700">{q}</span>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="bg-[#1e293b] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
             <MessageCircle size={32} className="text-indigo-400 mb-8" />
             <h3 className="text-2xl font-black mb-4 leading-tight">Need direct support?</h3>
             <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">Our legal tech experts are available 24/7 for Enterprise customers.</p>
             <button className="w-full bg-white text-slate-900 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all active:scale-95">
               Start Chat <ExternalLink size={14} />
             </button>
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Latest Documentation Updates</h4>
             <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">New FTO Agent Logic v2.5</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Jan 14, 2025</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Bulk Patent Import Guide</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Jan 10, 2025</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HelpView;
