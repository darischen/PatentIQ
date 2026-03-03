'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/lib/context/ProjectContext';
import {
  Filter,
  Download,
  ChevronRight,
  Cpu,
  Layers,
  Search,
  Network
} from 'lucide-react';

export default function FeaturesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { analysisData } = useProject();

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <p className="text-slate-500 text-lg font-medium">No analysis data available.</p>
          <button
            onClick={() => router.push(`/project/${id}/dashboard`)}
            className="text-indigo-600 text-sm font-bold hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const data = analysisData;

  // Mocking some extra metadata for the features if not present
  const enrichedFeatures = data.features.map((f, i) => ({
    ...f,
    domain: f.domain || (i % 2 === 0 ? 'Processing' : 'Comms'),
    category: f.category || (i === 0 ? 'Core' : 'Secondary')
  }));

  const coreCount = enrichedFeatures.filter(f => f.category === 'Core').length;
  const secondaryCount = enrichedFeatures.filter(f => f.category === 'Secondary').length;
  const technicalCount = enrichedFeatures.filter(f => f.category === 'Technical').length;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'unique': return 'bg-[#e7f9ed] text-[#10b981]';
      case 'partial': return 'bg-[#fff7ed] text-[#f97316]';
      case 'high-risk': return 'bg-[#fef2f2] text-[#ef4444]';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getCategoryStyle = (cat: string) => {
    switch(cat) {
      case 'Core': return 'bg-slate-800 text-white';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs & Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => router.push(`/project/${id}/dashboard`)}>Baseline Summary</span>
            <ChevronRight size={12} />
            <span className="text-slate-800">Features Analyzed</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Features Analyzed</h1>
          <p className="text-slate-500 text-sm font-medium">
            Detailed breakdown of the {data.featuresAnalyzed} invention components identified in your submission.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-12 gap-8">
        {/* Total Components Card */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 relative overflow-hidden flex flex-col justify-between h-[320px]">
          <div className="absolute top-8 right-8 bg-[#e7f9ed] text-[#10b981] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            +2 new
          </div>
          <div>
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
              <Layers size={28} />
            </div>
            <div className="space-y-1">
              <span className="text-7xl font-black text-slate-900">{data.featuresAnalyzed}</span>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Components Identified</p>
            </div>
          </div>
          <div className="space-y-3 pt-6 border-t border-slate-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-xs font-bold text-slate-500">Core Features</span>
              </div>
              <span className="text-sm font-black text-slate-900">{coreCount || 6}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-xs font-bold text-slate-500">Secondary</span>
              </div>
              <span className="text-sm font-black text-slate-900">{secondaryCount || 5}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-xs font-bold text-slate-500">Technical</span>
              </div>
              <span className="text-sm font-black text-slate-900">{technicalCount || 3}</span>
            </div>
          </div>
        </div>

        {/* Technical Domain Breakdown Card */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 h-[320px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900">Technical Domain Breakdown</h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Comms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hardware</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 h-[160px]">
            <div className="col-span-2 bg-indigo-50/30 rounded-[2rem] p-8 border border-indigo-100/50 flex flex-col justify-between">
              <h4 className="text-sm font-black text-indigo-700">Data Processing Methods</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-900">45%</span>
                <span className="text-[10px] font-bold text-indigo-400 uppercase">6 Components</span>
              </div>
            </div>
            <div className="bg-emerald-50/30 rounded-[2rem] p-6 border border-emerald-100/50 flex flex-col justify-between">
              <h4 className="text-[11px] font-black text-emerald-700 leading-tight">Swarm Communication</h4>
              <div>
                <span className="text-3xl font-black text-slate-900 block">30%</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase">4 Components</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-amber-50/30 rounded-3xl p-5 border border-amber-100/50 flex-1 flex flex-col justify-between">
                <h4 className="text-[10px] font-black text-amber-700 uppercase">Sensors</h4>
                <span className="text-2xl font-black text-slate-900">15%</span>
              </div>
              <div className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 flex-1 flex flex-col justify-between">
                <h4 className="text-[10px] font-black text-slate-400 uppercase">Other</h4>
                <span className="text-2xl font-black text-slate-900">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Breakdown Table */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-black text-slate-900">Component Breakdown</h3>
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              type="text"
              placeholder="Filter components..."
              className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-12 gap-4 px-6 pb-6 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            <div className="col-span-4">Component Name</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2 text-center">Domain</div>
            <div className="col-span-2 text-center">Novelty Status</div>
            <div className="col-span-1 text-right">Category</div>
          </div>

          <div className="divide-y divide-slate-50">
            {enrichedFeatures.map((feature) => (
              <div
                key={feature.id}
                className="grid grid-cols-12 gap-4 items-center px-6 py-6 hover:bg-slate-50/80 transition-all rounded-2xl group cursor-pointer"
              >
                <div className="col-span-4 flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                    feature.domain === 'Processing' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {feature.domain === 'Processing' ? <Cpu size={20} /> : <Network size={20} />}
                  </div>
                  <span className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                    {feature.name}
                  </span>
                </div>

                <div className="col-span-3">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>

                <div className="col-span-2 text-center">
                  <span className="text-[11px] font-bold text-slate-400">{feature.domain}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusStyle(feature.status)}`}>
                    {feature.status === 'unique' ? 'Unique' : feature.status === 'partial' ? 'Partial Overlap' : 'High Overlap'}
                  </span>
                </div>

                <div className="col-span-1 flex justify-end">
                  <span className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter text-center leading-none min-w-[70px] ${getCategoryStyle(feature.category!)}`}>
                    {feature.category} <br/> <span className="opacity-60">Feature</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
