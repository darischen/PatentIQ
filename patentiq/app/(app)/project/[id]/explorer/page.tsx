'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';

interface PatentResult {
  id: string;
  title: string;
  abstract: string;
  similarity_score: number;
  reasoning: string;
}

export default function ExplorerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { analysisData } = useProject();

  const [selectedId, setSelectedId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PatentResult[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      if (!res.ok) {
        console.error('Search failed:', await res.text());
        return;
      }

      const { results } = await res.json();
      setSearchResults(results);
      if (results.length > 0) {
        setSelectedId(results[0].id);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const priorArt = searchResults;
  const activeArt = priorArt.find(a => a.id === selectedId) || priorArt[0];

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 text-sm font-medium">No analysis data. Run an analysis first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Top Search & Filter Bar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-slate-800">Prior Art Explorer</h1>
          <span className="bg-slate-100 text-slate-500 text-[11px] font-black px-3 py-1 rounded-full uppercase">{priorArt.length} Results</span>
        </div>
        <img src="https://picsum.photos/seed/pat-88/100/100" alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search patents, claims, assignees, IPC codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none shadow-sm placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all disabled:bg-slate-400"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          <button type="button" className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={14} /> Filters
          </button>
          {['Risk Level', 'Status', 'Jurisdiction', 'Date Range'].map(f => (
            <button key={f} type="button" className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              {f}
            </button>
          ))}
        </div>
      </form>

      <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Baseline Summary</span>
        <ChevronRight size={14} />
        <span className="text-slate-800">Prior Art Explorer</span>
      </nav>

      <div className="grid grid-cols-12 gap-8 h-[calc(100vh-280px)]">

        {/* Left Column: Patent List */}
        <div className="col-span-12 lg:col-span-4 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
          {priorArt.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm font-medium">Search for patents to see results</p>
            </div>
          ) : (
            priorArt.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedId(art.id)}
                className={`bg-white rounded-[1.5rem] p-6 border-2 transition-all cursor-pointer relative group ${selectedId === art.id ? 'border-indigo-500 shadow-xl' : 'border-white shadow-sm hover:border-slate-100'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-slate-50 text-slate-400 text-[9px] font-black px-2 py-1 rounded border border-slate-100">{art.id}</span>
                  <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tight ${Math.round(art.similarity_score * 100) > 75 ? 'text-rose-500' : 'text-amber-500'}`}>
                    <AlertCircle size={12} /> {Math.round(art.similarity_score * 100) > 75 ? 'HIGH RISK' : 'MODERATE'}
                  </div>
                </div>

                <h3 className="text-sm font-black text-slate-800 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                  {art.title}
                </h3>

                <div className="bg-[#fffbeb] p-4 rounded-xl mb-6 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                  <div className="flex gap-3">
                    <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={14} />
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      {art.reasoning}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <p className="text-[8px] font-black text-slate-300 uppercase">Similarity</p>
                    <p className="text-xs font-black text-slate-800">{Math.round(art.similarity_score * 100)}%</p>
                  </div>
                  <button className="text-indigo-600 text-[10px] font-black uppercase flex items-center gap-1 hover:gap-2 transition-all">
                    View Details <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Deep-Dive Detailed View */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-y-auto custom-scrollbar p-10">
          {!activeArt ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500 text-sm font-medium">Select a patent from the list to view details</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${Math.round(activeArt.similarity_score * 100) > 75 ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                      <AlertCircle size={14} /> {Math.round(activeArt.similarity_score * 100) > 75 ? 'HIGH RISK' : 'MODERATE'}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Similarity: <span className="text-slate-800">{Math.round(activeArt.similarity_score * 100)}%</span></span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tight max-w-2xl">
                    {activeArt.title}
                  </h2>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">ID: {activeArt.id}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Abstract</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeArt.abstract}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest mb-4">
                    <AlertCircle size={14} /> AI Analysis
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeArt.reasoning}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
