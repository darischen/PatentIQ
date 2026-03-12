
import React from 'react';
import { 
  ChevronRight, 
  Lightbulb, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { AnalysisResult, Screen } from '../types';

interface FeatureOverlapProps {
  data: AnalysisResult;
  onNavigate: (screen: Screen) => void;
}

const FeatureOverlap: React.FC<FeatureOverlapProps> = ({ data, onNavigate }) => {
  const uniqueFeatures = data.features.filter(f => f.status === 'unique');
  const partialFeatures = data.features.filter(f => f.status === 'partial');
  const highRiskFeatures = data.features.filter(f => f.status === 'high-risk');

  const total = data.features.length;
  const uniqueWidth = (uniqueFeatures.length / total) * 100;
  const partialWidth = (partialFeatures.length / total) * 100;
  const highRiskWidth = (highRiskFeatures.length / total) * 100;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'unique': return 'bg-[#e7f9ed] text-[#10b981]';
      case 'partial': return 'bg-[#fff7ed] text-[#f97316]';
      case 'high-risk': return 'bg-[#fef2f2] text-[#ef4444]';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'unique': return 'UNIQUE';
      case 'partial': return 'PARTIAL';
      case 'high-risk': return 'HIGH RISK';
      default: return 'STANDARD';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs & Header */}
      <div className="space-y-2">
        <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="hover:text-slate-600 cursor-pointer" onClick={() => onNavigate('dashboard')}>Baseline Summary</span>
          <ChevronRight size={12} />
          <span className="text-slate-800">Feature Overlap</span>
        </nav>
        <h1 className="text-4xl font-black text-[#1e293b] tracking-tight">Feature Overlap Analysis</h1>
        <p className="text-slate-500 text-sm font-medium max-w-2xl leading-relaxed">
          Feature-level similarity across existing patents. Each extracted feature is independently compared against prior art to assess novelty and risk.
        </p>
      </div>

      {/* Aggregate Analysis Profile Card */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Aggregate Analysis Profile</p>
        
        <div className="grid grid-cols-12 gap-8">
          {/* Stats Grid */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-[#f8fafc] rounded-3xl p-6 border border-slate-50">
              <span className="text-4xl font-black text-slate-900 block mb-1">{data.featuresAnalyzed}</span>
              <span className="text-[11px] font-black text-slate-800 uppercase block">Total Features Analyzed</span>
            </div>
            <div className="bg-[#f8fafc] rounded-3xl p-6 border border-slate-50">
              <span className="text-4xl font-black text-[#10b981] block mb-1">{uniqueFeatures.length}</span>
              <span className="text-[11px] font-black text-[#10b981] uppercase block">Unique Features</span>
              <span className="text-[9px] font-medium text-slate-400 mt-1 block">No close matches found</span>
            </div>
            <div className="bg-[#f8fafc] rounded-3xl p-6 border border-slate-50">
              <span className="text-4xl font-black text-[#f97316] block mb-1">{partialFeatures.length}</span>
              <span className="text-[11px] font-black text-[#f97316] uppercase block">Partial Overlap</span>
              <span className="text-[9px] font-medium text-slate-400 mt-1 block">Review matches found</span>
            </div>
            <div className="bg-[#f8fafc] rounded-3xl p-6 border border-slate-50">
              <span className="text-4xl font-black text-[#ef4444] block mb-1">{highRiskFeatures.length}</span>
              <span className="text-[11px] font-black text-[#ef4444] uppercase block">High-Risk Features</span>
              <span className="text-[9px] font-medium text-slate-400 mt-1 block">Critical similarity detected</span>
            </div>
          </div>

          {/* Overall Risk Profile */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center px-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Overall Risk Profile</h3>
                <p className="text-xs font-medium text-slate-400">Distribution of novelty across components</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-[#f97316] block">Moderate Risk</span>
                <span className="text-[10px] font-medium text-slate-300">Confidence: {data.confidence}%</span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="h-16 w-full flex rounded-2xl overflow-hidden shadow-inner border border-slate-50">
              <div 
                className="bg-[#10b981] h-full flex items-center justify-center text-white font-black transition-all duration-1000" 
                style={{ width: `${uniqueWidth}%` }}
              >
                {uniqueFeatures.length}
              </div>
              <div 
                className="bg-[#f97316] h-full flex items-center justify-center text-white font-black transition-all duration-1000" 
                style={{ width: `${partialWidth}%` }}
              >
                {partialFeatures.length}
              </div>
              <div 
                className="bg-[#ef4444] h-full flex items-center justify-center text-white font-black transition-all duration-1000" 
                style={{ width: `${highRiskWidth}%` }}
              >
                {highRiskFeatures.length}
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unique</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f97316]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">High Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-[#f1f5f9] rounded-2xl p-6 flex items-center gap-4 border border-slate-100">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 flex-shrink-0">
          <Lightbulb size={20} />
        </div>
        <p className="text-xs font-medium text-slate-500 leading-relaxed">
          Feature overlap evaluates individual invention components, not entire patents. A patent may be dissimilar overall but still share overlapping features.
        </p>
      </div>

      {/* Feature Quick-View Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900">Feature Quick-View</h2>
          <span className="bg-[#f1f5f9] text-slate-500 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider">{data.featuresAnalyzed} Features Found</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.features.map((feature) => (
            <div 
              key={feature.id}
              onClick={() => onNavigate('heatmap')}
              className="bg-white rounded-[2rem] p-8 border border-slate-50 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-[200px]"
            >
              <h3 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                {feature.name}
              </h3>
              
              <div className="flex justify-between items-center">
                <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusBadge(feature.status)}`}>
                  {getStatusText(feature.status)}
                </span>
                <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                  <ExternalLink size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureOverlap;
