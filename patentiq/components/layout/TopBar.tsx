'use client';

import Link from 'next/link';
import { Search, Zap, Bell } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="text-slate-400" size={18} />
        </div>
        <input
          type="text"
          placeholder="Search patents, ideas, or prior art..."
          className="w-full h-11 bg-slate-50 border border-slate-100 rounded-full pl-11 pr-6 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="flex items-center gap-2.5 bg-[#0f172a] hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-lg active:scale-95 cursor-pointer group"
        >
          <Zap
            size={14}
            className="fill-white text-white group-hover:scale-110 transition-transform"
          />
          Analyze New Idea
        </Link>

        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all cursor-pointer">
          <Bell size={18} />
        </button>

        <Link
          href="/profile"
          className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all ml-1 relative group"
        >
          <img
            src="https://picsum.photos/seed/patent-pro-expert/100/100"
            alt="User Avatar"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
          <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </header>
  );
}
