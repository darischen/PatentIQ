
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  Layers,
  FileText,
  GitCompare
} from 'lucide-react';
import { AnalysisResult, Screen } from '../types';

interface PriorArtExplorerProps {
  data: AnalysisResult;
  onNavigate: (screen: Screen) => void;
}

interface PriorArtItem {
  id: string;
  number: string;
  status: 'GRANTED' | 'PENDING';
  risk: 'HIGH RISK' | 'PARTIAL RISK';
  title: string;
  assignee: string;
  location: string;
  overlapSummary: string;
  overlaps: number;
  similarity: number;
  matchScore: number;
  filedDate: string;
  publishedDate: string;
  grantedDate: string;
  relevance: string[];
  safeAreas: string[];
  comparison: {
    mine: string;
    mineDesc: string;
    theirs: string;
    theirsDesc: string;
  };
}

const PriorArtExplorer: React.FC<PriorArtExplorerProps> = ({ data, onNavigate }) => {
  const [selectedId, setSelectedId] = useState<string>('1');

  const priorArt: PriorArtItem[] = [
    {
      id: '1',
      number: 'US-9,821,445-B2',
      status: 'GRANTED',
      risk: 'HIGH RISK',
      title: 'Decentralized Consensus for Autonomous Swarm Coordination',
      assignee: 'Skynet Dynamics',
      location: 'US',
      overlapSummary: 'This patent directly overlaps with your "Ledger-based positioning" feature. It describes a method for validating relative coordinates using a distributed blockchain-like ledger.',
      overlaps: 3,
      similarity: 88,
      matchScore: 88,
      filedDate: '2019-02-10',
      publishedDate: '2020-08-15',
      grantedDate: '2021-05-12',
      relevance: [
        'Claims 1-4 cover distributed ledger usage for coordinate validation.',
        'Explicitly mentions "swarm consensus" without a central server.',
        'Uses similar cryptographic proof-of-location methods.'
      ],
      safeAreas: [
        'Does not cover "Power Management" optimizations.',
        'Does not mention "Bio-mimetic" movement patterns.'
      ],
      comparison: {
        mine: 'Ledger-based Coordinate Validation',
        mineDesc: 'Proposed implementation uses lightweight local consensus optimized for <10ms latency.',
        theirs: 'Distributed Consensus Ledger',
        theirsDesc: 'Both systems use a distributed ledger to validate the position of agents in a swarm. The prior art specifically focuses on "coordinate trust" which is central to your invention.'
      }
    },
    {
      id: '2',
      number: 'EP-3341-A1',
      status: 'PENDING',
      risk: 'PARTIAL RISK',
      title: 'Mesh Networking Protocols for High-Latency Environments',
      assignee: 'CommGlobal Systems',
      location: 'EP',
      overlapSummary: 'Partially overlaps with your mesh networking implementation but focuses on high-latency satellite links rather than local drone-to-drone comms.',
      overlaps: 1,
      similarity: 45,
      matchScore: 45,
      filedDate: '2021-06-12',
      publishedDate: '2022-12-01',
      grantedDate: 'Pending',
      relevance: [
        'Shares conceptual mesh logic.',
        'Focuses on adaptive retry mechanisms.'
      ],
      safeAreas: [
        'Distinct protocol stack layer.',
        'Different hardware abstraction.'
      ],
      comparison: {
        mine: 'Mesh Network Logic',
        mineDesc: 'High-speed local peer-to-peer relay.',
        theirs: 'Wide-Area Mesh',
        theirsDesc: 'Overlap is purely conceptual at the protocol layer.'
      }
    }
  ];

  const activeArt = priorArt.find(a => a.id === selectedId) || priorArt[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Top Search & Filter Bar */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-slate-800">Prior Art Explorer</h1>
          <span className="bg-slate-100 text-slate-500 text-[11px] font-black px-3 py-1 rounded-full uppercase">3 Results</span>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img src="https://picsum.photos/seed/pat-88/100/100" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search patents, claims, assignees, IPC codes..."
            className="w-full bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 outline-none shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={14} /> Filters
          </button>
          {['Risk Level', 'Status', 'Jurisdiction', 'Date Range'].map(f => (
            <button key={f} className="bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
              {f}
            </button>
          ))}
        </div>
      </div>

      <nav className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Baseline Summary</span>
        <ChevronRight size={14} />
        <span className="text-slate-800">Prior Art Explorer</span>
      </nav>

      <div className="grid grid-cols-12 gap-8 h-[calc(100vh-280px)]">
        
        {/* Left Column: Patent List */}
        <div className="col-span-12 lg:col-span-4 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
          {priorArt.map((art) => (
            <div 
              key={art.id}
              onClick={() => setSelectedId(art.id)}
              className={`bg-white rounded-[1.5rem] p-6 border-2 transition-all cursor-pointer relative group ${selectedId === art.id ? 'border-indigo-500 shadow-xl' : 'border-white shadow-sm hover:border-slate-100'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="bg-slate-50 text-slate-400 text-[9px] font-black px-2 py-1 rounded border border-slate-100">{art.number}</span>
                  <span className="bg-slate-50 text-slate-400 text-[9px] font-black px-2 py-1 rounded border border-slate-100">{art.status}</span>
                </div>
                <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tight ${art.risk === 'HIGH RISK' ? 'text-rose-500' : 'text-amber-500'}`}>
                  <AlertCircle size={12} /> {art.risk}
                </div>
              </div>

              <h3 className="text-sm font-black text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                {art.title}
              </h3>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mb-6">
                <div className="flex items-center gap-1"><FileText size={12} /> {art.assignee}</div>
                <div className="flex items-center gap-1"><Layers size={12} /> {art.location}</div>
              </div>

              <div className="bg-[#fffbeb] p-4 rounded-xl mb-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                <div className="flex gap-3">
                  <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={14} />
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    {art.overlapSummary}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[8px] font-black text-slate-300 uppercase">Overlaps</p>
                    <p className="text-xs font-black text-slate-800">{art.overlaps} Features</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-300 uppercase">Similarity</p>
                    <p className="text-xs font-black text-slate-800">{art.similarity}%</p>
                  </div>
                </div>
                <button className="text-indigo-600 text-[10px] font-black uppercase flex items-center gap-1 hover:gap-2 transition-all">
                  View Details <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Deep-Dive Detailed View */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-y-auto custom-scrollbar p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${activeArt.risk === 'HIGH RISK' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                  <AlertCircle size={14} /> {activeArt.risk}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Match Score: <span className="text-slate-800">{activeArt.matchScore}%</span></span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tight max-w-2xl">
                {activeArt.title}
              </h2>
              <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold">
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">{activeArt.number}</span>
                <span>Filed: {activeArt.filedDate}</span>
                <span>Assignee: {activeArt.assignee}</span>
              </div>
            </div>
            <button className="p-3 text-slate-300 hover:text-indigo-600 transition-colors bg-slate-50 rounded-xl">
              <ExternalLink size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                <AlertCircle size={14} /> Why it's relevant
              </div>
              <ul className="space-y-3">
                {activeArt.relevance.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed font-medium">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                <CheckCircle2 size={14} /> Safe Areas
              </div>
              <ul className="space-y-3">
                {activeArt.safeAreas.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed font-medium">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-6 mb-12">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</p>
            <div className="relative pt-2">
              <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-slate-100" />
              <div className="flex justify-between relative">
                {[
                  { label: 'Filed', date: activeArt.filedDate, active: true, color: 'indigo' },
                  { label: 'Published', date: activeArt.publishedDate, active: true, color: 'indigo' },
                  { label: 'Granted', date: activeArt.grantedDate, active: activeArt.status === 'GRANTED', color: 'emerald' }
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm mb-3 z-10 transition-colors ${step.active ? (step.color === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                    <p className="text-[9px] font-black text-slate-300 uppercase mb-1">{step.label}</p>
                    <p className="text-[10px] font-bold text-slate-600">{step.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <GitCompare className="text-slate-400" size={18} />
              <h4 className="text-lg font-bold text-slate-800">Compared Against Your Invention</h4>
            </div>

            <div className="grid grid-cols-2 gap-8 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-md z-10 text-[10px] font-black text-slate-300">
                VS
              </div>

              <div className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100/50">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Your Invention</p>
                <h5 className="text-lg font-black text-slate-900 mb-4">{activeArt.comparison.mine}</h5>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {activeArt.comparison.mineDesc}
                </p>
              </div>

              <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Prior Art</p>
                <h5 className="text-lg font-black text-slate-900 mb-4">{activeArt.comparison.theirs}</h5>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {activeArt.comparison.theirsDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PriorArtExplorer;
