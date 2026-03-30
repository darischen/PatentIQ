'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Plus, ExternalLink, MoreHorizontal, Layout, Grid, Play, X, Trash2, LogOut, AlertCircle, Box } from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';
import { formatRelativeTime } from '@/lib/utils/formatTime';

export default function ProjectsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { projects, addProject, deleteProject, selectProject, renameProject, logout } = useProject();
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renameProjectId, setRenameProjectId] = useState<string | null>(null);
  const [renameProjectName, setRenameProjectName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

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
    if (activeMenuId === id) {
      setActiveMenuId(null);
    } else {
      setActiveMenuId(id);
      // Calculate menu position based on button position
      const button = e.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  };

  const handleSelectProject = (project: typeof projects[0]) => {
    selectProject(project);
    router.push(`/project/${project.id}`);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleOpenInNewTab = (projectId: string) => {
    window.open(`/project/${projectId}`, '_blank');
    setActiveMenuId(null);
  };

  const handleDuplicate = (project: typeof projects[0]) => {
    const newProject = addProject(`${project.name} (Copy)`);
    if (project.analysisResult) {
      newProject.analysisResult = project.analysisResult;
    }
    setActiveMenuId(null);
  };

  const handleRenameClick = (projectId: string, currentName: string) => {
    setRenameProjectId(projectId);
    setRenameProjectName(currentName);
    setActiveMenuId(null);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (renameProjectName.trim() && renameProjectId) {
      renameProject(renameProjectId, renameProjectName.trim());
      setRenameProjectId(null);
      setRenameProjectName('');
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
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
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm active:scale-95 cursor-pointer ${pathname === '/projects' ? 'bg-[#1e293b] text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
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

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-medium text-sm mt-auto active:scale-95 cursor-pointer">
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

        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          {/* Top Actions Row */}
          <div className="flex items-center justify-between mb-10">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search for a project or a component"
                className="w-full bg-white border border-slate-100 rounded-lg py-2.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-slate-200 outline-none text-slate-800 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 cursor-pointer"
              >
                <Plus size={14} /> New Project
              </button>
            </div>
          </div>

          {/* Pro Banner */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 mb-10 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                <AlertCircle size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-800">You have {projects.length} project{projects.length !== 1 ? 's' : ''} active <span className="text-slate-400 font-normal ml-2 underline cursor-pointer">Get Pro for unlimited access</span></p>
            </div>
            <button className="px-4 py-1.5 bg-[#1e293b] text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all border-2 border-slate-200 cursor-pointer">
              Upgrade to Pro
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-0">Recent Projects</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><Grid size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><Layout size={18} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Project List */}
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => handleSelectProject(p)}
                className="bg-white rounded-xl border border-slate-100 overflow-visible shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
              >
                <div className="h-24 bg-slate-50 flex items-center justify-center rounded-t-xl">
                  <Grid className="text-slate-200 group-hover:text-slate-300 transition-colors" size={32} />
                  {p.thumbnail && (
                    <img src={p.thumbnail} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate">{p.name}</h3>
                    <button
                      onClick={(e) => toggleMenu(e, p.id)}
                      className="p-1 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <MoreHorizontal size={14} className="text-slate-400 group-hover:text-slate-600" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Edited {formatRelativeTime(p.updatedAt || p.createdAt)}</p>

                  {/* Reference Style Context Menu */}
                  {activeMenuId === p.id && (
                    <div
                      ref={menuRef}
                      className="fixed w-56 bg-[#1a1a1a] rounded-2xl shadow-2xl py-2 z-50 border border-white/10 animate-in fade-in zoom-in-95 duration-200"
                      style={{
                        top: `${menuPosition.top}px`,
                        right: `${menuPosition.right}px`,
                      }}
                    >
                      <div className="px-1.5 space-y-0.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelectProject(p); }}
                          className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          Show in project
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelectProject(p); }}
                          className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          Open
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenInNewTab(p.id); }}
                          className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          Open in new tab
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
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDuplicate(p); }}
                          className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          Duplicate
                        </button>
                      </div>

                      <div className="h-[1px] bg-white/10 my-1 mx-4" />

                      <div className="px-1.5 space-y-0.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRenameClick(p.id, p.name); }}
                          className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          Rename
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteProject(p.id); setActiveMenuId(null); }}
                          className="w-full text-left px-3 py-2 text-[#ff4d4d] text-[13px] font-medium hover:bg-[#ff4d4d]/10 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                        >
                          Move to trash
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Static Tutorials Card */}
            <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-sm relative group cursor-pointer lg:col-span-2 min-h-[140px]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e293b] via-[#1e293b]/60 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                alt="Tutorials"
                className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-60"
              />
              <div className="relative z-20 p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold text-base">Getting Started Tutorials</h3>
                  <ExternalLink className="text-white opacity-60 group-hover:opacity-100 transition-opacity" size={16} />
                </div>
                <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-8">
                  <Play size={12} fill="white" className="text-white" /> 10 videos
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1e293b]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">New Analysis Project</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Invention Nickname</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Quantum Battery Mesh"
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100/50 cursor-pointer"
              >
                Create & Begin Discovery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rename Project Modal */}
      {renameProjectId && (
        <div className="fixed inset-0 bg-[#1e293b]/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Rename Project</h3>
              <button onClick={() => setRenameProjectId(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRenameSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={renameProjectName}
                  onChange={(e) => setRenameProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-sm text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100/50 cursor-pointer"
              >
                Save Name
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
