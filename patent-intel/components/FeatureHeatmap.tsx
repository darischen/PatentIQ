
import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Share2, 
  Info, 
  ChevronRight, 
  AlertCircle, 
  FileText, 
  Maximize2 
} from 'lucide-react';
import { AnalysisResult, Screen, PatentFeature } from '../types';

interface FeatureHeatmapProps {
  data: AnalysisResult;
  onNavigate: (screen: Screen) => void;
}

const FeatureHeatmap: React.FC<FeatureHeatmapProps> = ({ data, onNavigate }) => {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>(data.features[0]?.id || '1');

  const selectedFeature = data.features.find(f => f.id === selectedFeatureId) || data.features[0];

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'unique': return 'bg-[#e7f9ed] text-[#10b981]';
      case 'partial': return 'bg-[#fffbeb] text-[#f59e0b]';
      case 'high-risk': return 'bg-[#fee2e2] text-[#ef4444]';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusDot = (status: string) => {
    switch(status) {
      case 'unique': return 'bg-[#10b981]';
      case 'partial': return 'bg-[#f59e0b]';
      case 'high-risk': return 'bg-[#ef4444]';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-[#1e293b] tracking-tight">Feature Heatmap</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Pinpoint risk by mapping invention features to prior art.</p>
        </div>
        <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Unique</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">High Risk</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Invention Diagnostic View */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 relative">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Search size={20} />
                </div>
                <h2 className="text-xl font-black text-[#1e293b]">Invention Diagnostic View</h2>
              </div>
              <div className="flex gap-4">
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><Search size={18} /></button>
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><Download size={18} /></button>
              </div>
            </div>

            <div className="space-y-8 text-slate-600 leading-relaxed text-[15px] font-medium">
              <p>
                <span className="text-slate-300 font-bold text-xs mr-4">[001]</span>
                A system for <span 
                  onClick={() => setSelectedFeatureId('1')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all hover:scale-105 inline-block ${getStatusBg('high-risk')}`}
                >autonomous navigation</span> comprising a <span 
                  onClick={() => setSelectedFeatureId('2')}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all hover:scale-105 inline-block ${getStatusBg('unique')}`}
                >hybrid LIDAR-radar sensor array</span> configured to detect obstacles in real-time environmental conditions. The sensor array is mounted on a rotatable platform...
              </p>

              <p>
                <span className="text-slate-300 font-bold text-xs mr-4">[002]</span>
                The system further includes a <span 
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all hover:scale-105 inline-block ${getStatusBg('partial')}`}
                >predictive path planning module</span> utilizing a recurrent neural network to estimate trajectory vectors of moving objects.
              </p>

              <p>
                <span className="text-slate-300 font-bold text-xs mr-4">[003]</span>
                Wherein said <span 
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all hover:scale-105 inline-block ${getStatusBg('high-risk')}`}
                >low-latency bus</span> operates at a frequency exceeding 5GHz to ensure synchronized data transmission, minimizing reaction delay to under 10 milliseconds.
              </p>

              <p>
                <span className="text-slate-300 font-bold text-xs mr-4">[004]</span>
                Additionally, the apparatus comprises a failsafe mechanism engaged when confidence scores from the <span 
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all hover:scale-105 inline-block ${getStatusBg('unique')}`}
                >hybrid sensor fusion</span> drop below a threshold.
              </p>

              <p>
                <span className="text-slate-300 font-bold text-xs mr-4">[005]</span>
                The rotatable platform includes a <span 
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all hover:scale-105 inline-block ${getStatusBg('partial')}`}
                >self-cleaning mechanism</span> using high-pressure air bursts.
              </p>
            </div>
          </div>

          {/* Extracted Features Diagnostic Table */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800">Extracted Features Diagnostic</h3>
              <button className="text-indigo-600 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                View All Features <ChevronRight size={14} />
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-4 pb-4 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                <div>Feature Name</div>
                <div className="text-center">Risk Level</div>
                <div>Novelty Confidence</div>
                <div className="text-right">Action</div>
              </div>

              <div className="space-y-1 mt-4">
                {data.features.map((feature) => (
                  <div 
                    key={feature.id}
                    onClick={() => setSelectedFeatureId(feature.id)}
                    className={`grid grid-cols-4 items-center p-4 rounded-2xl transition-all cursor-pointer ${selectedFeatureId === feature.id ? 'bg-indigo-50/50 ring-1 ring-indigo-100 shadow-sm' : 'hover:bg-slate-50'}`}
                  >
                    <div className="font-bold text-slate-800 text-sm">{feature.name}</div>
                    <div className="flex justify-center">
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusBg(feature.status)}`}>
                        {feature.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${getStatusDot(feature.status)}`}
                          style={{ width: feature.status === 'unique' ? '92%' : feature.status === 'partial' ? '45%' : '15%' }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">
                        {feature.status === 'unique' ? '92%' : feature.status === 'partial' ? '45%' : '15%'}
                      </span>
                    </div>
                    <div className="text-right">
                      <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Analysis Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-50 overflow-hidden flex flex-col min-h-[800px]">
            {/* Pink Status Header */}
            <div className={`p-10 transition-colors duration-500 ${selectedFeature.status === 'high-risk' ? 'bg-[#ff2d55]' : selectedFeature.status === 'unique' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
              <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-4">Diagnostic Analysis</p>
              <h2 className="text-3xl font-black text-white leading-tight mb-8">
                {selectedFeature.name}
              </h2>
              
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                <AlertCircle size={14} />
                {selectedFeature.status === 'high-risk' 
                  ? 'Critical Risk: High Prior Art Overlap' 
                  : selectedFeature.status === 'unique' 
                  ? 'Novel Discovery: Minimal Overlap' 
                  : 'Moderate Risk: Partial Alignment'}
              </div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
              {/* Stat Boxes */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Overlapping Patents</p>
                  <p className="text-4xl font-black text-slate-800">142</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sector Saturation</p>
                  <p className="text-4xl font-black text-slate-800">98%</p>
                </div>
              </div>

              {/* Diagnostic Explanation */}
              <div className="bg-rose-50/30 rounded-2xl p-6 border border-rose-100/50 mb-10 relative">
                <div className="absolute -top-3 left-6 bg-white px-3 py-1 border border-rose-100 rounded-full flex items-center gap-2">
                   <Maximize2 size={12} className="text-[#ff2d55]" />
                   <span className="text-[10px] font-black text-[#ff2d55] uppercase tracking-wider">Diagnostic Explanation</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium mt-2">
                  This feature appears in <span className="font-bold text-slate-900">98% of prior art</span> in the automotive sector. The "{selectedFeature.name}" core concept is widely commoditized.
                </p>
              </div>

              {/* Primary Risk Sources */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Risk Sources</p>
                <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-xl group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">US-9823-B2</h4>
                    <p className="text-[11px] font-medium text-slate-400">Waymo LLC • 2019</p>
                  </div>
                </div>
              </div>

              {/* Floating Action Buttons */}
              <div className="mt-auto pt-10 flex justify-end gap-3">
                <button className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-lg">
                  <Share2 size={18} />
                </button>
                <button className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-lg">
                  <Download size={18} />
                </button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-[#1e293b] p-6 flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/60 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                <Maximize2 size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Risk Exposure Map</h4>
                <p className="text-[10px] font-medium text-white/40">View global heat clusters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureHeatmap;
