'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  Filter,
  X,
  Bookmark,
  ExternalLink,
  AlertTriangle,
  FileText,
  Target,
  Zap,
  ArrowRight,
  ShieldAlert,
  Hash,
  Building2,
  CalendarDays,
  Globe
} from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';

interface MockPatent {
  id: string;
  patentId: string;
  match: number;
  title: string;
  assignee: string;
  tags: string[];
  filingDate: string;
  abstract: string;
}

export default function SimilarPatentsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { analysisData } = useProject();

  const [selectedId, setSelectedId] = useState<string>('2');

  // Convert real patents to display format
  const displayPatents: MockPatent[] = (analysisData?.similarPatentsList || []).map((patent: any, idx: number) => ({
    id: patent.id || `patent-${idx}`,
    patentId: patent.id || 'Unknown',
    match: Math.round((patent.similarity_score || 0) * 100),
    title: patent.title || 'Unknown Patent',
    assignee: 'Patent Database',
    tags: ['Similar Patent'],
    filingDate: 'Database Record',
    abstract: patent.abstract || 'No abstract available.',
  }));

  // Fallback to mock data if no real patents
  const patents = displayPatents.length > 0 ? displayPatents : [];
  const selectedPatent = patents.find(p => p.id === selectedId) || patents[0];

  if (!analysisData || !patents || patents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 text-sm font-medium">No analysis data or similar patents found. Run an analysis first.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Top Similar Patents</h1>
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{analysisData.similarPatents} Global Matches</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">AI-driven semantic clustering of the competitive patent landscape.</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-white border border-slate-200 text-slate-800 px-6 py-2.5 rounded-xl text-xs font-black shadow-sm hover:border-slate-300 transition-all flex items-center gap-2 active:scale-95">
            <FileText size={16} className="text-indigo-500" /> Export Competitive Audit
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Left Side: Search & Grid */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            <span
              className="cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => router.push(`/project/${id}/dashboard`)}
            >
              Analysis Pipeline
            </span>
            <ChevronRight size={12} />
            <span className="text-slate-800 tracking-tight">Competitive Landscape</span>
          </nav>

          {/* Filters Bar */}
          <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 border-r border-slate-100">
                <Filter size={14} className="text-indigo-400" /> Filters
              </div>
              <div className="flex items-center gap-2">
                {['Jurisdiction', 'Assignees', 'Grant Status'].map(f => (
                  <button key={f} className="bg-slate-50/50 px-4 py-2 rounded-full text-[10px] font-black text-slate-600 flex items-center gap-3 hover:bg-slate-100 transition-all uppercase tracking-tight border border-slate-100">
                    {f} <ChevronDown size={12} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors px-6">
              Clear All
            </button>
          </div>

          {/* Patent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 pb-12">
            {patents.map((patent) => (
              <div
                key={patent.id}
                onClick={() => setSelectedId(patent.id)}
                className={`bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-300 cursor-pointer relative group flex flex-col justify-between h-[360px] ${
                  selectedId === patent.id
                    ? 'border-[#0f172a] shadow-2xl shadow-slate-200 -translate-y-1'
                    : 'border-white shadow-sm hover:border-slate-100 hover:-translate-y-0.5'
                }`}
              >
                {patent.match > 90 && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#0f172a] text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                    Critical Match
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <Hash size={12} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {patent.patentId}
                      </span>
                    </div>
                    <div className={`flex flex-col items-end ${
                      patent.match > 85 ? 'text-emerald-500' : patent.match > 60 ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      <span className="text-[22px] font-black tracking-tighter leading-none">{patent.match}%</span>
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Match</span>
                    </div>
                  </div>

                  <h3 className="text-[19px] font-black text-slate-900 leading-[1.2] mb-3 group-hover:text-indigo-600 transition-colors tracking-tight">
                    {patent.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[12px] text-slate-400 font-bold mb-8">
                    <Building2 size={12} className="text-slate-300" /> {patent.assignee}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {patent.tags.map(tag => (
                      <span key={tag} className="bg-indigo-50/50 text-indigo-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end text-[9px] font-black text-slate-300 uppercase tracking-widest px-1">
                    <span>Similarity Cluster</span>
                    <span className={patent.match > 85 ? 'text-emerald-500' : 'text-slate-400'}>{patent.match}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-[1px]">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px] ${
                        patent.match > 85
                          ? 'bg-emerald-500 shadow-emerald-200'
                          : patent.match > 60
                            ? 'bg-amber-400 shadow-amber-200'
                            : 'bg-slate-300 shadow-slate-100'
                      }`}
                      style={{ width: `${patent.match}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Detailed Intelligence Sidebar */}
        <div className="w-[480px] bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col sticky top-0 h-[calc(100vh-170px)] overflow-hidden">
          {/* Enhanced Animated Header */}
          <div className="relative overflow-hidden flex-shrink-0">
            <div className={`absolute inset-0 opacity-10 blur-3xl transition-colors duration-500 ${selectedPatent.match > 85 ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
            <div className="p-10 pb-6 relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-900 text-white rounded-xl shadow-lg shadow-indigo-100">
                    <Target size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block leading-none">Intelligence Deep-Dive</span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Ref #{selectedPatent.id}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedId('')} className="p-2.5 bg-slate-50 text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all rounded-full border border-slate-100">
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-[28px] font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
                {selectedPatent.title}
              </h2>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <Building2 size={14} />
                  <span className="text-[12px] font-black text-slate-600 uppercase tracking-tight">{selectedPatent.assignee}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CalendarDays size={14} />
                  <span className="text-[12px] font-black text-slate-600 uppercase tracking-tight">{selectedPatent.filingDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-10 flex-1 overflow-y-auto custom-scrollbar pb-10 space-y-12">
            {/* Score Highlight Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 flex flex-col justify-between h-[120px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Docket Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-[16px] font-black text-slate-800">Granted Patent</p>
                </div>
              </div>
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 flex flex-col justify-between h-[120px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Jurisdiction</p>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <p className="text-[16px] font-black text-slate-800">US-Federal</p>
                </div>
              </div>
            </div>

            {/* Critical Overlap Zone */}
            <div className="bg-[#fef2f2] rounded-[2.5rem] p-8 border border-rose-100 relative overflow-hidden group/risk">
              <div className="absolute -right-8 -bottom-8 text-rose-500/5 group-hover/risk:scale-110 transition-transform duration-700">
                <ShieldAlert size={160} />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-rose-600">
                  <AlertTriangle size={20} className="animate-pulse" />
                  <span className="text-[12px] font-black uppercase tracking-[0.2em]">Risk Exposure Map</span>
                </div>
                <span className="bg-white/60 px-3 py-1 rounded-full text-[9px] font-black text-rose-500 uppercase tracking-widest border border-rose-100/50">Level: High</span>
              </div>
              <p className="text-[15px] text-rose-950 font-semibold leading-[1.6] relative z-10">
                Claims 14-18 regarding <span className="text-rose-900 font-black underline decoration-rose-300 decoration-2 underline-offset-4 tracking-tight italic">"decentralized mesh synchronization for swarm logic"</span> directly mirror your primary innovation block.
              </p>
            </div>

            {/* Detailed Abstract Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText size={16} className="text-indigo-400" /> Full Abstract Insight
                </p>
                <button className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1">
                  More <ChevronDown size={14} />
                </button>
              </div>
              <div className="relative">
                <div className="absolute -left-5 top-0 bottom-0 w-1.5 bg-indigo-50 rounded-full" />
                <p className="text-[15px] text-slate-600 font-medium leading-[1.8] italic bg-slate-50/30 p-4 rounded-2xl">
                  "{selectedPatent.abstract}"
                </p>
              </div>
            </div>

            {/* Semantic Relevance Metrics */}
            <div className="space-y-5 pt-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Semantic Match Intensity</span>
                  <span className="text-[12px] font-bold text-slate-500">Based on vector embedding analysis</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-600">
                  <span className="text-[24px] font-black tracking-tighter">{selectedPatent.match}%</span>
                  <Zap size={18} fill="currentColor" />
                </div>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-100 p-0.5">
                <div
                  className="h-full bg-[#0f172a] rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${selectedPatent.match}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Action Footer */}
          <div className="px-10 pt-5 pb-14 bg-white border-t border-slate-100 flex items-center gap-4 flex-shrink-0">
            <button className="flex-1 h-[72px] bg-[#0f172a] text-white rounded-[1.75rem] font-black text-[14px] uppercase tracking-[0.15em] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all shadow-[0_20px_40px_rgba(15,23,42,0.2)] active:scale-[0.97] group/main relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/main:translate-x-full transition-transform duration-1000" />
              <FileText size={20} className="text-indigo-400" />
              View Full Patent
              <ArrowRight size={18} className="group-hover/main:translate-x-1.5 transition-transform" />
            </button>
            <button className="w-[72px] h-[72px] bg-slate-50 border border-slate-200 text-slate-400 rounded-[1.75rem] hover:text-indigo-600 hover:border-indigo-100 hover:bg-white transition-all shadow-sm active:scale-90 flex items-center justify-center group/bookmark">
              <Bookmark size={24} className="group-hover/bookmark:fill-indigo-600 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
