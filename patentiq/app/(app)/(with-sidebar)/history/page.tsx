'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  ChevronRight,
  FileText,
  TrendingUp,
  Calendar,
  Zap,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';
import { formatRelativeTime } from '@/lib/utils/formatTime';

export default function HistoryPage() {
  const { projects } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filter projects with analysis results
  const analyzedProjects = useMemo(() => {
    return projects
      .filter(p => p.analysisResult)
      .map(p => ({
        id: p.id,
        name: p.name,
        createdAt: p.createdAt,
        novelty: p.analysisResult?.noveltyScore || 0,
        confidence: p.analysisResult?.confidence || 0,
        status: 'Completed' as const,
        type: 'Analysis' as const,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [projects]);

  // Search and filter
  const filteredHistories = useMemo(() => {
    return analyzedProjects.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !filterType || h.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [analyzedProjects, searchQuery, filterType]);

  // Calculate analytics
  const analytics = useMemo(() => {
    if (analyzedProjects.length === 0) return { avgNovelty: 0, trend: 0 };
    const avgNovelty = Math.round(
      analyzedProjects.reduce((sum, p) => sum + p.novelty, 0) / analyzedProjects.length
    );
    const recent = analyzedProjects.slice(0, 3);
    const older = analyzedProjects.slice(3, 6);
    const recentAvg = recent.length > 0 ? recent.reduce((sum, p) => sum + p.novelty, 0) / recent.length : 0;
    const olderAvg = older.length > 0 ? older.reduce((sum, p) => sum + p.novelty, 0) / older.length : 0;
    const trend = Math.round(recentAvg - olderAvg);
    return { avgNovelty, trend };
  }, [analyzedProjects]);


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with search and filter */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analysis History</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Review your {analyzedProjects.length} completed analyses and track novelty trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm transition-all active:scale-95">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
        <div className="grid grid-cols-12 gap-4 px-8 py-6 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-4">Analysis Name</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-2 text-center">Novelty Score</div>
          <div className="col-span-2 text-center">Confidence</div>
          <div className="col-span-2 text-right">Date / Action</div>
        </div>
        <div className="divide-y divide-slate-50">
          {filteredHistories.length > 0 ? (
            filteredHistories.map((h) => (
              <Link
                key={h.id}
                href={`/project/${h.id}`}
                className="grid grid-cols-12 gap-4 items-center px-8 py-6 hover:bg-slate-50/80 transition-all group cursor-pointer"
              >
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {h.name}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{h.status}</p>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    {h.type}
                  </span>
                </div>
                <div className="col-span-2 flex flex-col items-center">
                  <span
                    className={`text-sm font-black ${
                      h.novelty > 70
                        ? 'text-emerald-500'
                        : h.novelty > 40
                        ? 'text-amber-500'
                        : 'text-rose-500'
                    }`}
                  >
                    {h.novelty}%
                  </span>
                  <div className="w-16 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${
                        h.novelty > 70
                          ? 'bg-emerald-500'
                          : h.novelty > 40
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${h.novelty}%` }}
                    />
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sm font-black text-slate-400">{h.confidence}%</span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400">{formatRelativeTime(h.createdAt)}</p>
                  </div>
                  <button
                    className="p-2 text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
                    title="View project"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-8 py-12 text-center">
              <p className="text-slate-400 font-medium">
                {searchQuery ? 'No analyses match your search.' : 'No analyses yet. Run an analysis to see it here.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-100 min-h-[220px]">
          <div>
            <TrendingUp size={24} className="mb-6 opacity-60" />
            <h3 className="text-xl font-black mb-2">Novelty Trends</h3>
            <p className="text-sm text-indigo-100 font-medium">
              Your average novelty score is <span className="font-black text-white">{analytics.avgNovelty}%</span>
            </p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div>
            <FileText size={24} className="mb-6 text-slate-300" />
            <h3 className="text-xl font-black text-slate-800 mb-2">Total Analyses</h3>
            <p className="text-sm text-slate-400 font-medium">
              You have completed <span className="font-black text-slate-800">{analyzedProjects.length}</span> {analyzedProjects.length === 1 ? 'analysis' : 'analyses'}.
            </p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between min-h-[220px]">
          <div>
            <Zap size={24} className="mb-6 text-amber-400" />
            <h3 className="text-xl font-black mb-2">Most Recent</h3>
            <p className="text-sm text-slate-400 font-medium">
              {analyzedProjects.length > 0
                ? `Last analyzed: ${analyzedProjects[0].name}`
                : 'No analyses yet'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
