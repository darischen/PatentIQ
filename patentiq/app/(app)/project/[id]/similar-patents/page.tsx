'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  Filter,
  X,
  Bookmark,
  AlertTriangle,
  FileText,
  Target,
  Zap,
  ArrowRight,
  ShieldAlert,
  Hash,
  CheckCircle2
} from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';

interface MockPatent {
  id: string;
  patentId: string;
  match: number;
  title: string;
  tags: string[];
  abstract: string;
  reasoning: string;
  recommendation?: 'Proceed' | 'Refine' | 'Caution';
  recommendation_reasoning?: string;
  match_level?: 'HIGH' | 'MEDIUM' | 'LOW' | 'POOR';
}

export default function SimilarPatentsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { analysisData } = useProject();

  const [selectedId, setSelectedId] = useState<string>('2');

  // Convert real patents to display format
  const displayPatents: MockPatent[] = (analysisData?.similarPatentsList || []).map((patent: any, idx: number) => ({
    id: patent.id || `patent-${idx}`,
    patentId: patent.application_number || patent.id || 'Unknown',
    match: Math.round((patent.similarity_score || 0) * 100),
    title: patent.title || 'Unknown Patent',
    tags: ['Similar Patent'],
    abstract: patent.abstract || 'No abstract available.',
    reasoning: patent.reasoning || '',
    recommendation: patent.recommendation,
    recommendation_reasoning: patent.recommendation_reasoning,
    match_level: patent.match_level,
  }));

  // Fallback to mock data if no real patents
  const patents = displayPatents.length > 0 ? displayPatents : [];
  const selectedPatent = patents.find(p => p.id === selectedId) || patents[0];

  // Helper to get recommendation styling
  const getRecommendationStyles = (recommendation?: string) => {
    switch(recommendation) {
      case 'Proceed':
        return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', icon: 'text-emerald-500', badge: 'bg-emerald-100/50 text-emerald-700', label: 'text-emerald-500 border-emerald-100/50' };
      case 'Refine':
        return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600', icon: 'text-amber-500', badge: 'bg-amber-100/50 text-amber-700', label: 'text-amber-500 border-amber-100/50' };
      case 'Caution':
        return { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600', icon: 'text-rose-500', badge: 'bg-rose-100/50 text-rose-700', label: 'text-rose-500 border-rose-100/50' };
      default:
        return { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-600', icon: 'text-slate-500', badge: 'bg-slate-100/50 text-slate-700', label: 'text-slate-500 border-slate-100/50' };
    }
  };

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
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{analysisData.similarPatents} Local Matches</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium">AI-driven semantic clustering of the competitive patent landscape.</p>
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
              </div>

              <h2 className="text-[28px] font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
                {selectedPatent.title}
              </h2>

            </div>
          </div>

          <div className="px-10 flex-1 overflow-y-auto custom-scrollbar pb-20 space-y-12">
            {/* Strategic Recommendation Card */}
            {selectedPatent.recommendation && (() => {
              const styles = getRecommendationStyles(selectedPatent.recommendation);
              const icons = {
                'Proceed': <CheckCircle2 size={20} />,
                'Refine': <AlertTriangle size={20} />,
                'Caution': <AlertTriangle size={20} className="animate-pulse" />,
              };
              return (
                <div className={`${styles.bg} rounded-[2.5rem] p-8 border ${styles.border} relative overflow-hidden group/rec`}>
                  <div className={`absolute -right-8 -bottom-8 ${styles.icon}/5 group-hover/rec:scale-110 transition-transform duration-700`}>
                    <Target size={160} />
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex items-center gap-3 ${styles.text}`}>
                      {icons[selectedPatent.recommendation as keyof typeof icons]}
                      <span className="text-[12px] font-black uppercase tracking-[0.2em]">Strategic Recommendation</span>
                    </div>
                    <span className={`${styles.badge} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles.label}`}>
                      {selectedPatent.recommendation}
                    </span>
                  </div>
                  <p className={`text-[15px] font-semibold leading-[1.6] relative z-10 ${styles.text === 'text-rose-600' ? 'text-rose-950' : styles.text === 'text-amber-600' ? 'text-amber-950' : 'text-emerald-950'}`}>
                    {selectedPatent.recommendation_reasoning || `This patent represents a ${selectedPatent.recommendation.toLowerCase()} case for your invention.`}
                  </p>
                  {selectedPatent.match_level && (
                    <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-900">Match Level</p>
                      <p className="text-[13px] font-bold text-slate-900">{selectedPatent.match_level}</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Critical Overlap Zone */}
            {(() => {
              const riskLevel = selectedPatent.match > 85 ? 'High' : selectedPatent.match > 60 ? 'Medium' : 'Low';
              const riskColors = {
                High: { bg: 'bg-[#fef2f2]', border: 'border-rose-100', icon: 'text-rose-500/5', text: 'text-rose-600', label: 'text-rose-500 border-rose-100/50', body: 'text-rose-950' },
                Medium: { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'text-amber-500/5', text: 'text-amber-600', label: 'text-amber-500 border-amber-100/50', body: 'text-amber-950' },
                Low: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'text-emerald-500/5', text: 'text-emerald-600', label: 'text-emerald-500 border-emerald-100/50', body: 'text-emerald-950' },
              };
              const colors = riskColors[riskLevel];
              return (
                <div className={`${colors.bg} rounded-[2.5rem] p-8 border ${colors.border} relative overflow-hidden group/risk`}>
                  <div className={`absolute -right-8 -bottom-8 ${colors.icon} group-hover/risk:scale-110 transition-transform duration-700`}>
                    <ShieldAlert size={160} />
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex items-center gap-3 ${colors.text}`}>
                      <AlertTriangle size={20} className={riskLevel === 'High' ? 'animate-pulse' : ''} />
                      <span className="text-[12px] font-black uppercase tracking-[0.2em]">Risk Exposure Map</span>
                    </div>
                    <span className={`bg-white/60 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${colors.label}`}>Level: {riskLevel}</span>
                  </div>
                  <p className={`text-[15px] ${colors.body} font-semibold leading-[1.6] relative z-10`}>
                    {selectedPatent.reasoning || 'No risk reasoning available for this patent. Run a new analysis to generate detailed overlap insights.'}
                  </p>
                </div>
              );
            })()}

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

          {/* Sidebar Spacing Footer */}
          <div className="h-6 bg-white flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
}