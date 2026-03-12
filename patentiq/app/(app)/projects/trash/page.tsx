'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, RotateCcw, ArrowLeft, Grid, Clock, Layout, LogOut } from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';

export default function TrashPage() {
  const router = useRouter();
  const { trash, restoreProject, permanentDeleteProject, logout } = useProject();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-50/30 border-r border-indigo-100/50 flex flex-col py-8 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3 px-3 mb-12">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Grid className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg">PatentIQ</span>
        </div>

        <nav className="relative z-10 space-y-1.5">
          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4 px-4">Navigation</p>
          <button
            onClick={() => router.push('/projects')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white/80 font-medium text-[13px] transition-all"
          >
            <Layout size={18} /> Recents
          </button>

          <div className="pt-6">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4 px-4">Workspaces</p>
            <div className="flex items-center justify-between px-4 py-3 text-slate-500 font-medium text-[13px] hover:bg-white/80 rounded-xl cursor-pointer transition-all group">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-indigo-500 text-white flex items-center justify-center rounded-md text-[9px] font-black uppercase shadow-sm group-hover:scale-110 transition-transform">S9</span>
                Personal
              </div>
              <span className="bg-indigo-100/50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider">Free</span>
            </div>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-indigo-600 font-bold text-[13px] transition-all mt-2 shadow-sm border border-indigo-100/50"
            >
              <Trash2 size={18} className="text-rose-500" /> Trash
            </button>
          </div>
        </nav>

        <div className="relative z-10 mt-auto pt-6 border-t border-indigo-100/50 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 transition-all font-bold text-[13px] active:scale-95"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TopBar - Trash style (same as non-project TopBar) */}
        <div className="w-full px-12 pt-8 pb-2 flex items-center justify-center flex-shrink-0 relative">
          {/* Left Section: Brand */}
          <div
            className="absolute left-12 flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/projects')}
          >
            <div className="w-10 h-10 bg-[#4f46e5] rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
              <Grid className="text-white w-5 h-5" />
            </div>
            <span className="text-slate-900 font-bold text-[18px] tracking-tight hidden sm:block">PatentIQ</span>
          </div>

          {/* Center Section: Dark Navigation Pill */}
          <div className="bg-[#424b6e] rounded-full h-[54px] flex items-center px-10 shadow-xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50"></div>
            <div className="flex items-center justify-center gap-8 md:gap-12 relative z-10">
              <button
                onClick={() => router.push('/projects')}
                className="text-[13px] font-medium transition-all text-slate-400 hover:text-white"
              >
                Projects
              </button>
              <button
                onClick={() => router.push('/projects')}
                className="text-[13px] font-medium transition-all text-slate-400 hover:text-white"
              >
                Home
              </button>
              <button
                onClick={() => router.push('/projects')}
                className="text-[13px] font-medium transition-all text-slate-400 hover:text-white"
              >
                History
              </button>
              <button
                onClick={() => router.push('/projects')}
                className="text-[13px] font-medium transition-all text-slate-400 hover:text-white"
              >
                Help
              </button>
              <button
                onClick={() => router.push('/projects')}
                className="text-[13px] font-medium transition-all text-slate-400 hover:text-white"
              >
                Settings
              </button>
            </div>
          </div>

          {/* Right Section: Profile */}
          <div className="absolute right-12 flex items-center justify-end">
            <div
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

        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/projects')}
                className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trash</h2>
                <p className="text-slate-400 text-[13px] font-medium">Items in trash will be permanently deleted after 30 days.</p>
              </div>
            </div>
          </div>

          {trash.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100">
                <Trash2 size={32} className="text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Trash is empty</h3>
              <p className="text-slate-400 text-sm max-w-xs">When you delete projects, they will appear here for 30 days before being permanently removed.</p>
              <button
                onClick={() => router.push('/projects')}
                className="mt-8 text-indigo-600 font-bold text-sm hover:underline"
              >
                Back to Projects
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trash.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group relative"
                >
                  <div className="h-32 bg-slate-50/50 flex items-center justify-center relative overflow-hidden">
                    <Grid className="text-slate-200 group-hover:scale-110 transition-transform duration-500" size={48} />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => restoreProject(p.id)}
                        className="p-3 bg-white text-slate-900 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-lg"
                        title="Restore"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button
                        onClick={() => permanentDeleteProject(p.id)}
                        className="p-3 bg-white text-rose-500 rounded-xl hover:bg-rose-50 transition-all shadow-lg"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 text-[15px] truncate mb-2 leading-tight">{p.name}</h3>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-slate-300" />
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Deleted {p.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
