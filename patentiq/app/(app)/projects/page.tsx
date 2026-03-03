'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, ExternalLink, MoreHorizontal, Layout, Grid, Play, X, Trash2, LogOut, Clock, ArrowRight } from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, addProject, deleteProject, selectProject, logout } = useProject();
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const newProject = addProject(newProjectName.trim());
      setShowModal(false);
      setNewProjectName('');
      router.push(`/project/${newProject.id}`);
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleSelectProject = (project: typeof projects[0]) => {
    selectProject(project);
    router.push(`/project/${project.id}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-50/30 border-r border-indigo-100/50 flex flex-col py-8 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
        <div
          onClick={() => router.push('/projects')}
          className="relative z-10 flex items-center gap-3 px-3 mb-12 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Grid className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg group-hover:text-indigo-600 transition-colors">PatentIQ</span>
        </div>

        <nav className="relative z-10 space-y-1.5">
          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4 px-4">Navigation</p>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-indigo-600 font-bold text-[13px] transition-all shadow-sm border border-indigo-100/50 cursor-pointer">
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
              onClick={() => router.push('/projects/trash')}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 font-medium text-[13px] hover:bg-white/80 rounded-xl transition-all mt-2 cursor-pointer"
            >
              <Trash2 size={18} className="text-slate-400" /> Trash
            </button>
          </div>
        </nav>

        <div className="relative z-10 mt-auto pt-6 border-t border-indigo-100/50 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 transition-all font-bold text-[13px] active:scale-95 cursor-pointer"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* TopBar - Projects style */}
        <div className="w-full px-12 pt-8 pb-2 flex justify-center flex-shrink-0">
          <div className="bg-slate-900 rounded-full h-[54px] flex items-center px-10 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50"></div>
            <div className="flex items-center justify-center gap-8 md:gap-14 relative z-10">
              <button
                className="text-[12px] font-black uppercase tracking-widest transition-all text-white"
              >
                Projects
              </button>
              <button
                onClick={() => router.push('/history')}
                className="text-[12px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-white cursor-pointer"
              >
                History
              </button>
              <button
                onClick={() => router.push('/help')}
                className="text-[12px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-white cursor-pointer"
              >
                Help
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="text-[12px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-white cursor-pointer"
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
          {/* Top Actions Row */}
          <div className="flex items-center justify-between mb-12">
            <div className="relative w-[480px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search for a project, idea, or component..."
                className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 text-[13px] font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 outline-none text-slate-800 shadow-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[13px] font-bold hover:bg-slate-800 transition-all flex items-center gap-2.5 shadow-xl shadow-slate-200 active:scale-95 cursor-pointer"
              >
                <Plus size={16} /> New Project
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Projects</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><Grid size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><Layout size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Project List */}
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectProject(p)}
                className="bg-white rounded-[2rem] border border-slate-100 overflow-visible shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative"
              >
                <div className="h-32 bg-slate-50/50 flex items-center justify-center rounded-t-[2rem] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Grid className="text-slate-200 group-hover:text-indigo-200 transition-all duration-500 group-hover:scale-110" size={48} />
                  {p.thumbnail && (
                    <img src={p.thumbnail} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="p-6 relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-[15px] group-hover:text-indigo-600 transition-colors truncate pr-8 leading-tight">{p.name}</h3>
                    <button
                      onClick={(e) => toggleMenu(e, p.id)}
                      className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors absolute right-4 top-5.5 z-10 cursor-pointer"
                    >
                      <MoreHorizontal size={16} className="text-slate-400 group-hover:text-slate-600" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-slate-300" />
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Edited {p.date}</p>
                  </div>

                  {/* Reference Style Context Menu */}
                  {activeMenuId === p.id && (
                    <div
                      ref={menuRef}
                      className="absolute top-10 right-0 w-56 bg-[#1a1a1a] rounded-2xl shadow-2xl py-2 z-[100] border border-white/10 animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="px-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Show in project
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelectProject(p); }}
                          className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          Open
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Open in new tab
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Open with preview disabled
                        </button>
                      </div>

                      <div className="h-[1px] bg-white/10 my-1 mx-4" />

                      <div className="px-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Add to your favorites
                        </button>
                      </div>

                      <div className="h-[1px] bg-white/10 my-1 mx-4" />

                      <div className="px-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Copy link
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Share
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Duplicate
                        </button>
                      </div>

                      <div className="h-[1px] bg-white/10 my-1 mx-4" />

                      <div className="px-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Rename
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Move file...
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProject(p.id); setActiveMenuId(null); }}
                          className="w-full text-left px-3 py-2 text-[#ff4d4d] text-[13px] font-medium hover:bg-[#ff4d4d]/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          Move to trash
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer">
                          Remove from recent
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Static Tutorials Card (from image) */}
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative group cursor-pointer lg:col-span-2 min-h-[160px] flex flex-col justify-end p-8">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                alt="Tutorials"
                className="absolute inset-0 h-full w-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="relative z-20">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                      <Play size={16} fill="white" className="text-white ml-0.5" />
                    </div>
                    <h3 className="text-white font-bold text-lg tracking-tight">Getting Started Tutorials</h3>
                  </div>
                  <ExternalLink className="text-white/40 group-hover:text-white transition-colors" size={18} />
                </div>
                <p className="text-slate-400 text-[13px] font-medium max-w-sm mb-4">Master the PatentIQ platform with our curated video guides on AI analysis and prior art discovery.</p>
                <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                  10 deep-dive videos
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">New Analysis Project</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Intellectual Property Discovery</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 rounded-full cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Invention Nickname</label>
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">Required</span>
                </div>
                <div className="relative group">
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g. Quantum Battery Mesh"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-100 transition-all outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-1">This name will be used to organize your AI analysis and generated reports.</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                >
                  Create & Begin Discovery <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
