'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, ArrowRight, RefreshCw, Maximize2, Sparkles, Clock,
  FileText, Bell, File, Layers, Info, Zap, Loader2, X, Download
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { renderAsync } from 'docx-preview';
import { useProject } from '@/lib/context/ProjectContext';

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { projects, activeProject, selectProject, analysisData } = useProject();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [reports, setReports] = useState<{ novelty?: Blob; claims?: Blob }>({});
  const [reportModal, setReportModal] = useState<{ type: 'novelty' | 'claims'; blob: Blob } | null>(null);
  const docxContainerRef = useRef<HTMLDivElement>(null);

  // Sync activeProject from URL param
  useEffect(() => {
    if (!activeProject || activeProject.id !== id) {
      const found = projects.find((p) => p.id === id);
      if (found) selectProject(found);
    }
  }, [id, activeProject, projects, selectProject]);

  // No analysis data fallback
  if (!analysisData) {
    return (
      <div className="min-h-screen bg-[#f5f8ff] flex flex-col items-center justify-center gap-6 font-sans">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-50 text-center max-w-md">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-slate-300" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No Analysis Data</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Run an AI analysis or use Demo Mode from the project welcome page to populate the dashboard.
          </p>
          <Link
            href={`/project/${id}`}
            className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-xl"
          >
            <ArrowRight size={16} /> Go to Discovery
          </Link>
        </div>
      </div>
    );
  }

  const data = analysisData;

  const chartData = [
    { name: 'Novelty', value: data.noveltyScore },
    { name: 'Remaining', value: 100 - data.noveltyScore },
  ];

  const COLORS = ['#f59e0b', '#f1f5f9'];

  const getHighlightStyles = (status: string) => {
    switch (status) {
      case 'unique':
        return 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-400/50 hover:bg-emerald-100';
      case 'partial':
        return 'bg-amber-50 text-amber-700 border-b-2 border-amber-400/50 hover:bg-amber-100';
      case 'high-risk':
        return 'bg-rose-50 text-rose-700 border-b-2 border-rose-400/50 hover:bg-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 hover:bg-slate-100';
    }
  };

  const getRecommendation = () => {
    if (data.noveltyScore > 80) {
      return `Your core innovation in "${data.features[0]?.name || 'the system'}" is highly distinct. Focus on broad independent claims to maximize protection.`;
    }
    return `Consider refining "${data.topRiskFeature}" claims to specifically reduce technical overlap with ${data.closestPriorArt}.`;
  };

  const fetchAndStoreReport = async (type: 'novelty' | 'claims') => {
    if (!analysisData) return null;

    try {
      const endpoint = type === 'novelty' ? '/api/generate-novelty-audit' : '/api/generate-draft-claims';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisData,
          projectName: activeProject?.name || 'Invention Analysis',
        }),
      });

      if (!res.ok) throw new Error(`Failed to generate ${type} report`);

      const blob = await res.blob();
      setReports((prev) => ({
        ...prev,
        [type]: blob,
      }));
      return blob;
    } catch (err) {
      console.error(`Error generating ${type}:`, err);
      alert(`Failed to generate ${type} report. Please try again.`);
      return null;
    }
  };

  const handleReportClick = async (type: 'novelty' | 'claims') => {
    // If report already exists, show modal
    if (reports[type]) {
      setReportModal({ type, blob: reports[type] });
      return;
    }

    // Otherwise generate and show modal
    if (!analysisData) return;
    setGeneratingReport(type);
    const blob = await fetchAndStoreReport(type);
    setGeneratingReport(null);
    if (blob && reports[type]) {
      setReportModal({ type, blob: reports[type] });
    }
  };

  const handleRefreshReport = async (type: 'novelty' | 'claims') => {
    if (!analysisData) return;
    setGeneratingReport(type);
    const blob = await fetchAndStoreReport(type);
    setGeneratingReport(null);
    if (blob && reports[type]) {
      setReportModal({ type, blob: reports[type] });
    }
  };

  const downloadReport = async (type: 'novelty' | 'claims') => {
    if (!analysisData) return;
    setGeneratingReport(type);
    try {
      const endpoint = type === 'novelty' ? '/api/generate-novelty-audit' : '/api/generate-draft-claims';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisData,
          projectName: activeProject?.name || 'Invention Analysis',
        }),
      });

      if (!res.ok) throw new Error('Failed to download');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'novelty' ? `novelty-audit-${activeProject?.name || 'report'}.pdf` : `draft-claims-${activeProject?.name || 'claims'}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file. Please try again.');
    } finally {
      setGeneratingReport(null);
    }
  };

  const statCards = [
    {
      id: 'features',
      label: 'Features Analyzed',
      value: data.featuresAnalyzed,
      sub: 'Invention components identified',
      href: `/project/${id}/features`,
      icon: <Sparkles size={14} />,
    },
    {
      id: 'overlap',
      label: 'Feature Overlap',
      value: null,
      sub: null,
      href: `/project/${id}/overlap`,
      icon: <Clock size={14} />,
      customValue: (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">
              {data.features.filter((f) => f.status === 'unique').length}
            </span>
            <span className="text-slate-400 text-xs font-medium">Unique</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-rose-500 font-bold">
              {data.features.filter((f) => f.status === 'high-risk').length}
            </span>
            <span className="text-slate-400 text-xs font-medium">High Risk</span>
          </div>
        </div>
      ),
    },
    {
      id: 'similar-patents',
      label: 'Similar Patents',
      value: data.similarPatents,
      sub: 'Found in local database',
      href: `/project/${id}/similar-patents`,
      icon: <FileText size={14} />,
    },
    {
      id: 'confidence',
      label: 'Confidence',
      value: `${data.confidence}%`,
      sub: 'Model certainty index',
      href: `/project/${id}/confidence`,
      icon: <Bell size={14} />,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 lg:p-10 font-sans">
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column Stats */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {statCards.map((stat, i) => (
            <Link
              key={stat.id}
              href={stat.href}
              className="block bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 relative group cursor-pointer hover:shadow-md transition-all hover:ring-2 hover:ring-indigo-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="p-1.5 bg-slate-50 rounded-lg">{stat.icon}</span>
                  {stat.label}
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-300 group-hover:text-slate-600 transition-colors"
                />
              </div>
              {stat.customValue ? (
                <div className="text-4xl font-extrabold text-[#1e293b] mb-1">{stat.customValue}</div>
              ) : (
                <>
                  <div className="text-4xl font-extrabold text-[#1e293b] mb-1">{stat.value}</div>
                  {stat.sub && (
                    <div className="text-[10px] text-slate-400 font-medium leading-relaxed">{stat.sub}</div>
                  )}
                </>
              )}
              {i === 0 && <div className="h-1 w-12 bg-indigo-600 rounded-full mt-4" />}
            </Link>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-9 space-y-8">
          {/* Summary Card */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <Sparkles className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1e293b]">Baseline Summary</h2>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                      Generated from Discovery Session
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                      <Layers size={10} /> {data.analysisType.toUpperCase()} Agent v2.5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                  <Maximize2 size={18} />
                </button>
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="relative w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      startAngle={90}
                      endAngle={450}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-[#1e293b]">{data.noveltyScore}%</span>
                  <div className="mt-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight">
                    {data.noveltyScore > 75
                      ? 'High Novelty'
                      : data.noveltyScore > 50
                      ? 'Moderate Novelty'
                      : 'Low Novelty'}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "{data.summary}"
                </p>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Primary Conflict
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-rose-500 rounded-full" />
                      <span className="font-bold text-slate-800">{data.topRiskFeature}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Closest Reference
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-indigo-600 font-bold">
                        <FileText size={16} />
                        <span>{data.closestPriorArt}</span>
                      </div>
                      {data.similarPatentsList && data.similarPatentsList[0]?.application_number && (
                        <div className="text-xs text-slate-500">
                          Appl. #: {data.similarPatentsList[0].application_number}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/project/${id}/sandbox`}
                  className="inline-flex bg-[#1e293b] text-white px-6 py-3 rounded-2xl items-center gap-3 hover:bg-slate-800 transition-all font-bold group shadow-lg shadow-slate-200"
                >
                  <Sparkles size={18} />
                  Explore Strategy Sandbox
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feature Heatmap Preview */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-bold text-[#1e293b] tracking-tight">Feature Heatmap Preview</h3>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span className="text-[11px] font-bold text-slate-500 tracking-tight">Unique</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="text-[11px] font-bold text-slate-500 tracking-tight">Partial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="text-[11px] font-bold text-slate-500 tracking-tight">High Risk</span>
                </div>
              </div>
            </div>

            <Link
              href={`/project/${id}/heatmap`}
              className="block bg-slate-50/80 rounded-[2.5rem] p-12 border border-slate-100 relative group overflow-hidden cursor-pointer transition-all hover:bg-slate-100/80"
            >
              {/* Blurred Text Narrative */}
              <div className="text-slate-500 leading-loose text-[16px] font-medium relative z-10 transition-all duration-500 group-hover:blur-[6px] group-hover:opacity-40">
                The proposed system implements a{' '}
                {data.features.slice(0, 3).map((feature, i) => (
                  <React.Fragment key={feature.id || `feature-${i}`}>
                    <span
                      className={`inline-block px-3 py-0.5 mx-1 rounded-lg font-bold shadow-sm ${getHighlightStyles(
                        feature.status
                      )}`}
                    >
                      {feature.name}
                    </span>
                    {i === 2 ? '.' : ', '}
                  </React.Fragment>
                ))}
                {' '}This integrated approach addresses technical conflicts identified in{' '}
                <span className="text-indigo-600 font-bold underline decoration-indigo-200 underline-offset-4">
                  {data.closestPriorArt}
                </span>
                .
              </div>

              {/* Center Pill Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
                <div className="bg-white px-8 py-4 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.08)] flex items-center gap-3 transition-transform group-hover:scale-105 active:scale-95">
                  <span className="text-slate-900 font-bold text-[14px]">View Full Heatmap Analysis</span>
                  <ArrowRight size={18} className="text-slate-900" />
                </div>
              </div>
            </Link>

            <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <Info size={14} />
              Hover to explore specific feature-level risk clusters and prior art matches.
            </div>
          </div>

          {/* Bottom Row - Recommendations & Reports */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-6 bg-[#1e293b] rounded-[2.5rem] p-8 text-white relative overflow-hidden group h-[220px] flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-400" size={16} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  AI Recommendation
                </p>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                "{getRecommendation()}"
              </p>
              <Link
                href={`/project/${id}/sandbox`}
                className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all text-white"
              >
                Refine in Sandbox <ArrowRight size={14} />
              </Link>
            </div>

            <div className="col-span-12 lg:col-span-6 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col h-[220px]">
              <div className="flex items-center gap-3 mb-4">
                <File className="text-slate-400" size={18} />
                <h4 className="font-bold text-slate-800">Available Reports</h4>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="relative">
                  <button
                    onClick={() => handleReportClick('novelty')}
                    disabled={generatingReport === 'novelty'}
                    className="w-full bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer group/report disabled:opacity-50"
                  >
                    <div className="w-10 h-12 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[8px] font-black text-rose-500">PDF</span>
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="text-sm font-bold text-slate-700 truncate">Novelty Audit</p>
                      <p className="text-[10px] text-slate-400">{generatingReport === 'novelty' ? 'Generating...' : reports.novelty ? 'Ready' : 'Generate'}</p>
                    </div>
                    {generatingReport === 'novelty' ? (
                      <Loader2 size={14} className="text-slate-400 animate-spin" />
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefreshReport('novelty');
                        }}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        <RefreshCw
                          size={14}
                          className="text-slate-300 hover:text-slate-600 transition-transform duration-700"
                        />
                      </button>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <button
                    onClick={() => handleReportClick('claims')}
                    disabled={generatingReport === 'claims'}
                    className="w-full bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer group/report disabled:opacity-50"
                  >
                    <div className="w-10 h-12 bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[8px] font-black text-blue-500">DOC</span>
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="text-sm font-bold text-slate-700 truncate">Draft Claims Summary</p>
                      <p className="text-[10px] text-slate-400">{generatingReport === 'claims' ? 'Generating...' : reports.claims ? 'Ready' : 'Generate'}</p>
                    </div>
                    {generatingReport === 'claims' ? (
                      <Loader2 size={14} className="text-slate-400 animate-spin" />
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefreshReport('claims');
                        }}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        <RefreshCw
                          size={14}
                          className="text-slate-300 hover:text-slate-600 transition-transform duration-700"
                        />
                      </button>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModal && (
        <ReportModal
          reportModal={reportModal}
          generatingReport={generatingReport}
          downloadReport={downloadReport}
          setReportModal={setReportModal}
          docxContainerRef={docxContainerRef}
        />
      )}

      {/* Scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
}

function ReportModal({
  reportModal,
  generatingReport,
  downloadReport,
  setReportModal,
  docxContainerRef,
}: {
  reportModal: { type: 'novelty' | 'claims'; blob: Blob };
  generatingReport: string | null;
  downloadReport: (type: 'novelty' | 'claims') => Promise<void>;
  setReportModal: (modal: null) => void;
  docxContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    if (reportModal.type === 'novelty') {
      // For PDF, create blob URL
      const url = URL.createObjectURL(reportModal.blob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (reportModal.type === 'claims' && docxContainerRef.current) {
      // For DOCX, render using docx-preview
      renderAsync(reportModal.blob, docxContainerRef.current).catch((err) => {
        console.error('Error rendering DOCX:', err);
      });
    }
  }, [reportModal, docxContainerRef]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl">
        <div className="shrink-0 flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">
            {reportModal.type === 'novelty' ? 'Novelty Audit Report' : 'Draft Claims Summary'}
          </h3>
          <button
            onClick={() => setReportModal(null)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-slate-50">
          {reportModal.type === 'novelty' && pdfUrl ? (
            <iframe src={pdfUrl} className="w-full h-full border-0" />
          ) : (
            <div ref={docxContainerRef} className="w-full h-full p-6 overflow-auto" />
          )}
        </div>

        <div className="shrink-0 flex gap-3 p-6 border-t border-slate-100">
          <button
            onClick={() => {
              downloadReport(reportModal.type);
              setReportModal(null);
            }}
            disabled={generatingReport === reportModal.type}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {generatingReport === reportModal.type ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Downloading...
              </>
            ) : (
              <>
                <Download size={16} /> Download {reportModal.type === 'novelty' ? 'PDF' : 'DOCX'}
              </>
            )}
          </button>
          <button
            onClick={() => setReportModal(null)}
            className="flex-1 bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
