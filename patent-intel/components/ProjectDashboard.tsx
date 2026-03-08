
import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, ExternalLink, MoreHorizontal, Layout, Box, Globe, Grid, Play, AlertCircle, X, Share2, Copy, Heart, Trash2, FolderInput, Monitor } from 'lucide-react';
import { Project, Screen } from '../types';
import TopBar from './TopBar';

interface ProjectDashboardProps {
  username: string;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onAddProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
  onNavigate: (screen: Screen) => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ username, projects, onSelectProject, onAddProject, onDeleteProject, onNavigate }) => {
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
      onAddProject(newProjectName.trim());
      setShowModal(false);
      setNewProjectName('');
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col py-6 px-4">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-[#1e293b] rounded-lg flex items-center justify-center">
            <Grid className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">PatentIntel</span>
        </div>

        <nav className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 text-slate-900 font-semibold text-sm">
            <Layout size={18} /> Recents
          </button>
          <div className="flex items-center justify-between px-3 py-2.5 text-slate-500 font-medium text-sm hover:bg-slate-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-rose-500 text-white flex items-center justify-center rounded text-[10px] font-bold uppercase">S9</span>
              Personal
            </div>
            <span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight">Free</span>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 font-medium text-sm hover:bg-slate-50 rounded-lg">
            <Plus size={18} className="text-rose-500" /> Create a team
          </button>
        </nav>

        <button className="mt-auto flex items-center gap-2 px-3 py-2 text-slate-400 text-xs font-medium hover:text-slate-600 transition-colors">
          <Box size={14} /> Invite & earn
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar onNavigate={onNavigate} currentScreen="projects" />

        <div className="flex-1 p-10 overflow-y-auto">
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
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
            <button className="px-4 py-1.5 bg-[#1e293b] text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all border-2 border-slate-200">
              Upgrade to Pro
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-8">Recent Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Project List */}
            {projects.map((p) => (
              <div 
                key={p.id} 
                onClick={() => onSelectProject(p)}
                className="bg-white rounded-xl border border-slate-100 overflow-visible shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
              >
                <div className="h-24 bg-slate-50 flex items-center justify-center rounded-t-xl">
                  <Grid className="text-slate-200 group-hover:text-slate-300 transition-colors" size={32} />
                </div>
                <div className="p-4 relative">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate pr-6">{p.name}</h3>
                    <button 
                      onClick={(e) => toggleMenu(e, p.id)}
                      className="p-1 hover:bg-slate-100 rounded-md transition-colors absolute right-3 top-3.5 z-10"
                    >
                      <MoreHorizontal size={14} className="text-slate-400 group-hover:text-slate-600" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Edited {p.date}</p>

                  {/* Reference Style Context Menu */}
                  {activeMenuId === p.id && (
                    <div 
                      ref={menuRef}
                      className="absolute top-10 right-0 w-56 bg-[#1a1a1a] rounded-2xl shadow-2xl py-2 z-[100] border border-white/10 animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="px-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Show in project
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onSelectProject(p); }}
                          className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                        >
                          Open
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Open in new tab
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Open with preview disabled
                        </button>
                      </div>

                      <div className="h-[1px] bg-white/10 my-1 mx-4" />

                      <div className="px-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Add to your favorites
                        </button>
                      </div>

                      <div className="h-[1px] bg-white/10 my-1 mx-4" />

                      <div className="px-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Copy link
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Share
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Duplicate
                        </button>
                      </div>

                      <div className="h-[1px] bg-white/10 my-1 mx-4" />

                      <div className="px-1.5 space-y-0.5">
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Rename
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Move file...
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id); }}
                          className="w-full text-left px-3 py-2 text-[#ff4d4d] text-[13px] font-medium hover:bg-[#ff4d4d]/10 rounded-lg transition-colors flex items-center gap-3"
                        >
                          Move to trash
                        </button>
                        <button className="w-full text-left px-3 py-2 text-white text-[13px] font-medium hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3">
                          Remove from recent
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Static Tutorials Card (from image) */}
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
          <div className="w-full max-md bg-white rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">New Analysis Project</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
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
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100/50"
              >
                Create & Begin Discovery
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
