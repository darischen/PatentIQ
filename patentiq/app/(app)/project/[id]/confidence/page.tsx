'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/lib/context/ProjectContext';
import {
  ChevronRight,
  Info,
  TrendingUp,
  Clock,
  AlertTriangle,
  Sparkles,
  Zap,
  Thermometer,
  Database,
  CheckCircle2,
  Wand2
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts';

export default function ConfidencePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { analysisData, activeProject } = useProject();

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
  const projectName = activeProject?.name;

  const chartData = [
    { name: 'Confidence', value: data.confidence },
    { name: 'Remaining', value: 100 - data.confidence },
  ];

  const historyData = [
    { time: '10:00', score: 82 },
    { time: '10:15', score: 85 },
    { time: '10:30', score: 84 },
    { time: '10:45', score: 89 },
    { time: '11:00', score: 91 },
    { time: '11:15', score: 92.4 },
  ];

  const factors = [
    { name: 'Feature-Claim Alignment', score: 96, desc: 'Semantic overlap with invention disclosure', color: '#0f172a' },
    { name: 'Prior Art Coverage', score: 88, desc: 'Breadth of databases scanned (US, EP, JP, CN)', color: '#f59e0b' },
    { name: 'Data Quality Score', score: 91, desc: 'Clarity and completeness of input text', color: '#10b981' },
    { name: 'Citation Density', score: 74, desc: 'Relevance of cited references in similar art', color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Breadcrumbs & Title Row */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <span className="hover:text-slate-600 cursor-pointer" onClick={() => router.push(`/project/${id}/dashboard`)}>Analysis</span>
            <ChevronRight size={10} />
            <span className="text-slate-500">{projectName || 'Project Alpha'}</span>
            <ChevronRight size={10} />
            <span className="text-slate-800">Confidence Details</span>
          </nav>
          <h1 className="text-[34px] font-black text-slate-900 tracking-tight">Model Confidence Breakdown</h1>
          <p className="text-slate-500 text-base font-medium">Detailed analysis of the factors contributing to the {data.confidence}% confidence score.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
            <Zap size={14} fill="currentColor" /> AI Model v4.2
          </div>
          <div className="bg-slate-50 text-slate-400 px-5 py-2.5 rounded-full text-[11px] font-bold border border-slate-100 flex items-center gap-2">
            <Clock size={14} /> Updated 2 mins ago
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-stretch">

        {/* Left Column: Overall Score & Parameters */}
        <div className="col-span-12 lg:col-span-4 space-y-8 flex flex-col">
          {/* Main Score Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col items-center justify-center flex-1 min-h-[460px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Overall Confidence Score</p>

            <div className="relative w-64 h-64 mb-10 group">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={105}
                    startAngle={90}
                    endAngle={450}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#6366f1" />
                    <Cell fill="#f1f5f9" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform group-hover:scale-105 duration-500">
                <div className="flex items-baseline">
                  <span className="text-6xl font-black text-[#0f172a] tracking-tighter">{data.confidence}</span>
                  <span className="text-3xl font-bold text-slate-300 ml-1">%</span>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest">
                  <TrendingUp size={12} /> +1.2%
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 leading-relaxed max-w-[280px] font-medium">
              The AI model exhibits <span className="text-indigo-600 font-bold">high certainty</span> based on strong alignment with verified prior art clusters and robust feature extraction.
            </p>
          </div>

          {/* Model Parameters Sub-card */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <Database size={14} /> Model Parameters
              </div>
              <Info size={14} className="text-slate-200 cursor-help" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Temperature</p>
                  <p className="text-sm font-black text-slate-800">0.3 (Precise)</p>
                </div>
                <Thermometer size={16} className="text-blue-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Corpus Size</p>
                  <p className="text-sm font-black text-slate-800">14.2M Patents</p>
                </div>
                <Database size={16} className="text-amber-400" />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Validation</p>
                  <p className="text-sm font-black text-slate-800">Pass (99.8%)</p>
                </div>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Factors & History */}
        <div className="col-span-12 lg:col-span-8 space-y-8 flex flex-col">
          {/* Confidence Factors Table Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex-1">
            <h3 className="text-xl font-black text-slate-900 mb-10">Confidence Factors</h3>

            <div className="space-y-10">
              {factors.map((f, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-[15px] font-black text-slate-900">{f.name}</h4>
                      <p className="text-[11px] font-medium text-slate-400">{f.desc}</p>
                    </div>
                    <span className="text-lg font-black text-slate-900">{f.score}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${f.score}%`, backgroundColor: f.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Warning Message Box */}
            <div className="mt-12 bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <p className="text-xs font-semibold text-amber-700 leading-relaxed italic">
                Low density in citation network suggests potential novelty or missed niche references. We recommend verifying manual search keywords.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8 h-[360px]">
            {/* History Sparkline */}
            <div className="col-span-12 lg:col-span-7 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-black text-slate-900">Confidence History</h3>
                <div className="bg-slate-50 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                  Last 1 Hour <ChevronRight size={10} className="inline ml-1" />
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={4}
                      dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Start</p>
                  <p className="text-sm font-black text-slate-800">82%</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-emerald-500">Peak</p>
                  <p className="text-sm font-black text-emerald-500">94.1%</p>
                </div>
              </div>
            </div>

            {/* AI Recommendation Card */}
            <div className="col-span-12 lg:col-span-5 bg-[#1e293b] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-amber-400 text-slate-900 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} fill="currentColor" />
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-[0.15em]">AI Recommendation</h3>
                </div>

                <p className="text-[15px] font-medium leading-relaxed text-slate-300">
                  To increase confidence to <span className="text-white font-black">{'>'}95%</span>, consider elaborating on the <span className="text-white font-black underline decoration-indigo-400 underline-offset-4">"Swarm Logic Coordination"</span> section specifically regarding latency handling.
                </p>
              </div>

              <button className="w-full bg-white text-slate-900 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all group-hover:shadow-xl active:scale-[0.98]">
                <Wand2 size={16} className="text-indigo-600" /> Auto-Refine Description
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
