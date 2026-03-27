'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Trash2, RotateCcw, ArrowLeft, Grid, Clock, Layout, LogOut } from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';
import { formatRelativeTime } from '@/lib/utils/formatTime';

export default function TrashPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { trash, restoreProject, permanentDeleteProject, logout } = useProject();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 h-full bg-white border-r border-slate-100 flex flex-col py-8 px-6 shadow-sm z-10">
        <Link
          href="/projects"
          className="flex items-center gap-3 mb-12 px-2 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
            <Grid className="text-white w-6 h-6" />
          </div>
          <span className="text-[#1e293b] font-bold text-xl tracking-tight group-hover:text-indigo-600 transition-colors">
            PatentIQ
          </span>
        </Link>

        <div className="flex-1 space-y-10">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
              Workspace
            </p>
            <div className="space-y-1">
              <button
                onClick={() => router.push('/projects')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm active:scale-95 cursor-pointer ${pathname === '/projects' ? 'bg-[#1e293b] text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Layout size={20} /> Recents
              </button>
              <div className="flex items-center justify-between px-4 py-3 text-slate-500 font-medium text-sm hover:bg-slate-50 rounded-xl cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-rose-500 text-white flex items-center justify-center rounded text-[10px] font-bold uppercase">S9</span>
                  Personal
                </div>
                <span className="bg-slate-100 text-slate-400 text-[9px] px-2 py-1 rounded font-bold uppercase tracking-tight">Free</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
              Others
            </p>
            <div className="space-y-1">
              <button
                onClick={() => router.push('/projects/trash')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm active:scale-95 cursor-pointer ${pathname === '/projects/trash' ? 'bg-[#1e293b] text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                <Trash2 size={20} /> Trash
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-medium text-sm mt-auto active:scale-95 cursor-pointer"
        >
          <LogOut size={20} /> Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TopBar - Projects style */}
        <div className="w-full px-4 pt-6 pb-2 flex justify-center flex-shrink-0">
          <div className="bg-[#232d42] rounded-full h-[54px] flex items-center px-10 shadow-2xl border border-white/5">
            <div className="flex items-center justify-center gap-8 md:gap-14">
              <button
                onClick={() => router.push('/projects')}
                className="text-[13px] font-medium transition-all text-white cursor-pointer"
              >
                Projects
              </button>
              <button
                onClick={() => router.push('/history')}
                className="text-[13px] font-medium transition-all text-slate-400 hover:text-white cursor-pointer"
              >
                History
              </button>
              <button
                onClick={() => router.push('/help')}
                className="text-[13px] font-medium transition-all text-slate-400 hover:text-white cursor-pointer"
              >
                Help
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="text-[13px] font-medium transition-all text-slate-400 hover:text-white cursor-pointer"
              >
                Settings
              </button>
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
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Deleted {p.deletedAt ? formatRelativeTime(p.deletedAt) : 'Unknown'}</p>
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
