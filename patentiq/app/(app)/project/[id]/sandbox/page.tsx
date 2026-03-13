'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronRight,
  RefreshCw,
  FileText,
  Sparkles,
  Zap,
  Target,
  ShieldAlert,
  Award,
  Cpu,
  Layers,
  Info,
  Plus,
  FileDown,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useProject } from '@/lib/context/ProjectContext';
import { ExportReportMenu } from '@/components/ExportReportMenu';
import type { PatentFeature, AnalysisResult } from '@/lib/types/project';

interface SandboxFeature extends PatentFeature {
  enabled: boolean;
}

type StrategyProfile = 'Balanced' | 'Aggressive' | 'Risk-Averse' | 'Minimalist' | 'Maximum-Breadth' | 'Disruptive' | 'Defensive';

export default function SandboxPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { analysisData } = useProject();

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 text-sm font-medium">No analysis data. Run an analysis first.</p>
      </div>
    );
  }

  return <SandboxContent data={analysisData} id={id} />;
}

function SandboxContent({ data, id }: { data: AnalysisResult; id: string }) {
  const router = useRouter();
  const [features, setFeatures] = useState<SandboxFeature[]>(
    data.features.map((f, idx) => ({ ...f, id: f.id || `feature-${idx}`, enabled: true }))
  );
  const [activeProfile, setActiveProfile] = useState<StrategyProfile>('Balanced');

  const metrics = useMemo(() => {
    const activeFeatures = features.filter(f => f.enabled);
    if (activeFeatures.length === 0) return { novelty: 0, confidence: 0 };

    // If all features are enabled, use the original analysis values
    if (activeFeatures.length === data.features.length) {
      return { novelty: data.noveltyScore, confidence: data.confidence };
    }

    // Otherwise, calculate based on enabled features
    const statusWeights: Record<string, number> = {
      'unique': 100,
      'partial': 65,
      'high-risk': 25,
      'standard': 15
    };

    const totalWeight = activeFeatures.reduce((acc, f) => acc + (statusWeights[f.status] || 0), 0);
    const avgNovelty = Math.round(totalWeight / activeFeatures.length);
    const confidence = Math.min(99, Math.round(avgNovelty * 0.85 + (activeFeatures.length * 3)));

    return { novelty: avgNovelty, confidence };
  }, [features, data.noveltyScore, data.confidence, data.features.length]);

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const handleShuffle = () => {
    const profiles: StrategyProfile[] = ['Balanced', 'Aggressive', 'Risk-Averse', 'Minimalist', 'Maximum-Breadth', 'Disruptive', 'Defensive'];
    const nextProfile = profiles[(profiles.indexOf(activeProfile) + 1) % profiles.length];
    setActiveProfile(nextProfile);

    setFeatures(prev => prev.map((f, idx) => {
      switch (nextProfile) {
        case 'Aggressive': return { ...f, status: 'unique' as const, enabled: true };
        case 'Risk-Averse': return { ...f, status: f.status === 'high-risk' ? 'standard' as const : f.status, enabled: true };
        case 'Minimalist': return { ...f, enabled: idx === 0 };
        case 'Maximum-Breadth': return { ...f, status: 'partial' as const, enabled: true };
        case 'Disruptive': return { ...f, status: Math.random() > 0.5 ? 'unique' as const : 'high-risk' as const, enabled: Math.random() > 0.3 };
        case 'Defensive': return { ...f, status: 'standard' as const, enabled: true };
        default: return { ...f, status: data.features[idx]?.status ?? f.status, enabled: true };
      }
    }));
  };

  const chartData = [
    { name: 'Novelty', value: metrics.novelty },
    { name: 'Remaining', value: Math.max(0.1, 100 - metrics.novelty) },
  ];

  const getStatusStyles = (status: string, enabled: boolean) => {
    if (!enabled) return 'bg-slate-100 text-slate-400 grayscale opacity-40';
    switch (status) {
      case 'unique': return 'bg-emerald-500 text-white';
      case 'partial': return 'bg-amber-500 text-white';
      case 'high-risk': return 'bg-rose-500 text-white';
      case 'standard': return 'bg-sky-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  const getStatusBgBox = (status: string) => {
    switch (status) {
      case 'unique': return 'bg-emerald-50 border-emerald-100 text-emerald-900';
      case 'partial': return 'bg-amber-50 border-amber-100 text-amber-900';
      case 'high-risk': return 'bg-rose-50 border-rose-100 text-rose-900';
      default: return 'bg-sky-50 border-sky-100 text-sky-900';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'unique': return 'text-emerald-500';
      case 'partial': return 'text-amber-500';
      case 'high-risk': return 'text-rose-500';
      default: return 'text-sky-500';
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'unique': return <Zap size={20} />;
      case 'partial': return <Target size={20} />;
      case 'high-risk': return <ShieldAlert size={20} />;
      case 'standard': return <Award size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  const activeFeatures = features.filter(f => f.enabled);

  const patentTitle = useMemo(() => {
    if (activeFeatures.length === 0) return 'New Technical Innovation';
    if (activeFeatures.length === 1) return `${activeFeatures[0].name} System`;
    const coreFeatures = activeFeatures.filter(f => f.category === 'Core');
    const displayFeatures = coreFeatures.length > 0 ? coreFeatures : activeFeatures;
    return `${displayFeatures[0].name} with ${displayFeatures[1]?.name || 'Adaptive'} Logic`;
  }, [activeFeatures]);

  const getNoveltyQuality = (score: number) => {
    if (score > 75) return { text: 'EXCELLENT', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (score > 50) return { text: 'MODERATE', color: 'text-amber-500', bg: 'bg-amber-50' };
    return { text: 'RISKY', color: 'text-rose-500', bg: 'bg-rose-50' };
  };

  const noveltyQuality = getNoveltyQuality(metrics.novelty);

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <div className="flex justify-between items-center px-2">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            <span
              className="cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => router.push(`/project/${id}/dashboard`)}
            >
              Project Index
            </span>
            <ChevronRight size={10} />
            <span className="text-slate-600">Strategy Sandbox</span>
          </nav>
          <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">Strategy Sandbox</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Simulate claim architecture and novelty by toggling specific modules.</p>
        </div>
        <div className="bg-[#1e293b] px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-3 shadow-xl shadow-slate-200">
          <Sparkles size={14} className="text-amber-400" />
          {activeProfile} Mode
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Claim Architecture Controls */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-1">
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Claim Architecture</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configure technical scope</p>
              </div>
              <button
                onClick={handleShuffle}
                className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-indigo-50/50 rounded-xl hover:bg-indigo-50 transition-all active:scale-95"
              >
                Shuffle Strategy <RefreshCw size={12} />
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md cursor-pointer group flex items-center gap-4 ${!feature.enabled && 'opacity-50'}`}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 transition-all ${getStatusStyles(feature.status, feature.enabled)}`}>
                    {getIcon(feature.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-black transition-colors ${feature.enabled ? 'text-slate-800' : 'text-slate-400'}`}>
                        {feature.name}
                      </h3>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${feature.enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                        <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${feature.enabled ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <p className={`text-[10px] font-medium line-clamp-1 ${feature.enabled ? 'text-slate-500' : 'text-slate-300'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Novelty Probability Widget */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-between h-[240px]">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <TrendingUp size={12} className="text-indigo-400" /> Novelty Probability
              </div>

              <div className="relative w-32 h-32 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={56}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={10}
                    >
                      {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#f8fafc'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Track background circle for visual depth */}
                <div className="absolute inset-0 border-[8px] border-slate-50 rounded-full scale-95" />
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{metrics.novelty}%</span>
                  <div className={`mt-2 px-2 py-0.5 rounded-md text-[8px] font-black ${noveltyQuality.bg} ${noveltyQuality.color}`}>
                    {noveltyQuality.text}
                  </div>
                </div>
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Invention Threshold</p>
            </div>

            {/* Grant Confidence Widget */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between h-[240px]">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={12} className="text-indigo-400" /> Grant Confidence
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{metrics.confidence}</span>
                  <span className="text-xl font-bold text-slate-300">%</span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 leading-tight">AI assurance based on claim complexity</p>
              </div>

              <div className="space-y-3">
                {/* Segmented Progress Bar */}
                <div className="flex gap-1 h-2.5 w-full">
                  {[...Array(10)].map((_, i) => {
                    const threshold = (i + 1) * 10;
                    const isActive = metrics.confidence >= threshold;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm transition-all duration-500 ${isActive ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]' : 'bg-slate-100'}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  <span>Audited</span>
                  <span className="text-indigo-400">AI Assurance Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Detailed Report (Output Window) */}
        <div className="col-span-12 lg:col-span-7 h-[800px]">
          <div className="bg-white rounded-[3rem] h-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative">
            {/* Report Header (Fixed) */}
            <div className="bg-[#f0f9c1] p-10 relative flex-shrink-0 border-b border-slate-200/50">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">
                <Cpu size={14} className="text-slate-500" />
                Structured Technical Report • Project Intel
              </div>

              <div className="flex justify-between items-start">
                <div className="max-w-[75%]">
                  <h2 className="text-[28px] font-black text-slate-900 leading-[1.2] tracking-tight mb-6">
                    System and Method for {patentTitle}
                  </h2>
                  <div className="flex gap-2">
                    <span className="bg-[#dcf388] px-3 py-1 rounded-full text-[9px] font-black uppercase text-slate-700 tracking-wider">Class IPC B64C</span>
                    <span className="bg-[#dcf388] px-3 py-1 rounded-full text-[9px] font-black uppercase text-slate-700 tracking-wider">Analysis Profile: {activeProfile}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="bg-white px-6 py-6 rounded-[2rem] shadow-xl flex flex-col items-center border border-slate-100">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-2">
                      <FileDown size={18} />
                    </div>
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Export</p>
                  </div>
                  <ExportReportMenu queryId={id} />
                </div>
              </div>
            </div>

            {/* Document Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
              <div className="px-10 py-12 space-y-16 max-w-4xl mx-auto">

                {/* Abstract Section */}
                <div className="flex gap-8 group">
                  <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-2xl flex flex-shrink-0 items-center justify-center border border-slate-100 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-400">
                    <FileText size={18} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Abstract</h4>
                    <div className="text-[15px] text-slate-600 leading-[1.8] font-medium">
                      {activeFeatures.length > 0 ? (
                        <p>
                          A system and method for coordinating <span className="text-slate-900 font-bold">{activeFeatures[0].name.toLowerCase()}</span> within a technical environment.
                          The invention utilizes {activeFeatures.length > 1 ? <span className="text-slate-900 font-bold">{activeFeatures[1].name.toLowerCase()}</span> : 'adaptive coordination logic'} to
                          manage intra-node communication and operational integrity. By integrating
                          {activeFeatures.slice(0, 3).map((f, i) => (
                            <React.Fragment key={f.id}>
                              <span className="text-indigo-600 font-bold"> {f.name.toLowerCase()}</span>
                              {i < Math.min(activeFeatures.length, 3) - 1 ? ',' : ''}
                            </React.Fragment>
                          ))} modules, the architecture achieves synchronized data transmission with reduced latency.
                        </p>
                      ) : (
                        <p className="text-slate-300 italic">No features enabled in claim architecture. Abstract remains undefined.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical Field Section */}
                <div className="flex gap-8 group">
                  <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-2xl flex flex-shrink-0 items-center justify-center border border-slate-100 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-400">
                    <Layers size={18} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Technical Field</h4>
                    <p className="text-[15px] text-slate-600 leading-[1.8] font-medium">
                      The present disclosure relates generally to {activeFeatures[0]?.domain || 'autonomous'} systems, and more particularly to systems and methods for {activeFeatures.map(f => f.name.toLowerCase()).slice(0, 2).join(' and ')} in technical environments requiring precision coordination.
                    </p>
                  </div>
                </div>

                {/* Background Section */}
                <div className="flex gap-8 group">
                  <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-2xl flex flex-shrink-0 items-center justify-center border border-slate-100 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-400">
                    <Info size={18} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Background</h4>
                    <p className="text-[15px] text-slate-600 leading-[1.8] font-medium">
                      Conventional technical swarms rely heavily on centralized ground control and static signaling protocols.
                      This creates a single point of failure and vulnerability to external signal spoofing.
                      Furthermore, operational resilience is strictly limited by traditional battery and communication bottlenecks.
                      <br /><br />
                      Therefore, there is a clear technical need for a more autonomous, decentralized architecture capable of operating in safety-critical or GPS-denied environments.
                    </p>
                  </div>
                </div>

                {/* Detailed Description Section */}
                <div className="flex gap-8 group">
                  <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-2xl flex flex-shrink-0 items-center justify-center border border-slate-100 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-400">
                    <Sparkles size={18} />
                  </div>
                  <div className="space-y-8 flex-1">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Detailed Description</h4>
                    <p className="text-[15px] text-slate-600 leading-[1.8] font-medium mb-6">
                      Embodiments of the invention describe a fleet of drones or nodes operating on a shared technical backbone.
                    </p>

                    <div className="space-y-4">
                      {activeFeatures.length > 0 ? activeFeatures.map((f) => (
                        <div key={f.id} className={`p-8 rounded-[2rem] border-2 transition-all shadow-sm ${getStatusBgBox(f.status)}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={getStatusIndicator(f.status)}>
                              {getIcon(f.status)}
                            </div>
                            <h5 className="font-black text-[15px] uppercase tracking-wide">{f.name} Implementation</h5>
                          </div>
                          <p className="text-[14px] font-medium leading-[1.6] text-slate-700/80">
                            {f.description}. In various embodiments, this module calculates its vector based on neighbors within a defined proximity radius, ensuring no two nodes occupy the same coordinate while maintaining high-speed mesh synchronization.
                          </p>
                        </div>
                      )) : (
                        <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 font-bold italic">
                          No active feature modules to describe.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Patent Claims Section */}
                <div className="flex gap-8 group pb-24">
                  <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-2xl flex flex-shrink-0 items-center justify-center border border-slate-100 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-400">
                    <ShieldAlert size={18} />
                  </div>
                  <div className="space-y-10 flex-1">
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Patent Claims</h4>

                    <div className="space-y-12">
                      {/* Claim 1 */}
                      <div className="relative">
                        <div className="flex gap-6">
                          <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs">1</div>
                          <div className="space-y-6 flex-1">
                            <p className="text-[16px] text-slate-900 leading-relaxed font-bold">
                              A system comprising: <span className="font-normal">a plurality of aerial vehicles; each vehicle comprising a processor and a memory; wherein the processor is configured to execute instructions to establish a mesh network...</span>
                            </p>

                            {activeFeatures.length > 0 && (
                              <div className="space-y-2 pt-2 border-l-2 border-slate-100 pl-6">
                                {activeFeatures.map((f) => (
                                  <div key={f.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-all hover:translate-x-1 ${getStatusBgBox(f.status)}`}>
                                    <Plus size={14} className="opacity-40" />
                                    <p className="text-[13px] font-bold">further comprising {f.name.toLowerCase()} configured for {f.description.toLowerCase()}...</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Dependent Claims */}
                      <div className="flex gap-6">
                        <div className="w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs">2</div>
                        <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
                          <span className="font-black text-slate-900">The system of Claim 1,</span> wherein said mesh network dynamically reroutes data packets to bypass nodes exhibiting high latency or signal interference based on a predictive latency model.
                        </p>
                      </div>

                      <div className="flex gap-6">
                        <div className="w-8 h-8 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xs">3</div>
                        <p className="text-[15px] text-slate-700 leading-relaxed font-medium">
                          <span className="font-black text-slate-900">The system of Claim 1,</span> wherein the decentralized protocol utilizes a proof-of-proximity algorithm to validate relative positions of adjacent aerial vehicles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
