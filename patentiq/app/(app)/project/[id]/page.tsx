'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search, FileText, Upload, ArrowRight, Grid, MessageSquare,
  Sparkles, X, AlertTriangle, RefreshCw, Loader2, CloudUpload,
  BrainCircuit, Eye, Zap
} from 'lucide-react';
import { useProject } from '@/lib/context/ProjectContext';
import type { AnalysisResult, AnalysisType, ChatMessage } from '@/lib/types/project';

export default function ProjectWelcomePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    projects,
    activeProject,
    selectProject,
    analysisData,
    updateProjectAnalysis,
    updateChatHistory: updateContextHistory,
  } = useProject();

  // Sync activeProject from URL param
  useEffect(() => {
    if (!activeProject || activeProject.id !== id) {
      const found = projects.find((p) => p.id === id);
      if (found) selectProject(found);
    }
  }, [id, activeProject, projects, selectProject]);

  const projectName = activeProject?.name ?? '';
  const hasExistingAnalysis = !!activeProject?.analysisResult;

  const [activeAgent] = useState<AnalysisType>('concept');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<'chat' | 'upload' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [focusedMode, setFocusedMode] = useState<'chat' | 'upload' | 'none'>('none');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isQuota: boolean } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateChatHistoryLocal = (newHistory: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    setChatHistory(newHistory);
  };

  // Sync local chat history to context
  useEffect(() => {
    if (chatHistory.length > 0) {
      updateContextHistory(chatHistory);
    }
  }, [chatHistory, updateContextHistory]);

  // Initialize chat history and analysis
  useEffect(() => {
    if (activeProject?.chatHistory && activeProject.chatHistory.length > 0) {
      setChatHistory(activeProject.chatHistory);
      // Only focus chat if there's NO analysis yet - if analysis exists, show that instead
      if (!activeProject.analysisResult) {
        setFocusedMode('chat');
      }
    } else {
      const initialPrompts: Record<AnalysisType, string> = {
        concept:
          "Hello! I'm your Concept Agent. Tell me about your early-stage idea or the technical problem you're solving.",
      };
      const initialHist: ChatMessage[] = [{ role: 'bot', content: initialPrompts[activeAgent] }];
      setChatHistory(initialHist);
      updateContextHistory(initialHist);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAgent, activeProject?.id]);

  // Initialize analysis data when project loads
  useEffect(() => {
    if (activeProject?.analysisResult) {
      // Analysis already exists, it should be available via context's analysisData
      // This ensures the dashboard/explorer pages can display previous results
    }
  }, [activeProject?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // --- Chat submit via API ---
  const handleChatSubmit = async () => {
    if (chatInput.trim().length < 2 || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    updateChatHistoryLocal((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, projectId: id, history: chatHistory }),
      });

      if (!res.ok) throw new Error(`Chat API error: ${res.status}`);

      const data = await res.json();
      updateChatHistoryLocal((prev) => [
        ...prev,
        { role: 'bot', content: data.reply || 'Could you elaborate on the technical mechanism?' },
      ]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      updateChatHistoryLocal((prev) => [
        ...prev,
        { role: 'bot', content: 'Communication error. Please try again.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- Analysis submit via API ---
  const callAnalysisAPI = async (content: string, finalHistory: ChatMessage[], source: 'chat' | 'upload') => {
    try {
      setIsAnalyzing(true);
      setAnalysisSource(source);
      setError(null);

      const res = await fetch('/api/chat/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, projectId: id, analysisType: activeAgent }),
      });

      if (!res.ok) throw new Error(`Analysis API error: ${res.status}`);

      const result: AnalysisResult = await res.json();
      result.analysisType = activeAgent;
      // Pass the updated timestamp from the API response (milliseconds)
      const updatedAt = (result as any)._projectUpdatedAt;
      updateProjectAnalysis(result, finalHistory, updatedAt);
      router.push(`/project/${id}/dashboard`);
    } catch (err: unknown) {
      console.error('AI Analysis Error:', err);
      setError({
        message: 'Analysis failed. Please try again later.',
        isQuota: false,
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisSource(null);
    }
  };

  // --- File upload ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setAnalysisSource('upload');
    setError(null);

    try {
      // Create FormData and send to parsing API
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to parse document.');
      }

      const { content } = await res.json();

      await new Promise((r) => setTimeout(r, 1500));
      setIsUploading(false);
      await callAnalysisAPI(content, chatHistory, 'upload');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse document.';
      setError({ message: msg, isQuota: false });
      setIsUploading(false);
      setAnalysisSource(null);
    }
  };

  // --- Run analysis from chat transcript ---
  const handleStartFinalAnalysis = () => {
    const fullTranscript = chatHistory.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    callAnalysisAPI(fullTranscript, chatHistory, 'chat');
  };

  const isSatisfied = hasExistingAnalysis || chatHistory.filter((m) => m.role === 'user').length >= 2 || chatInput.length > 100;

  return (
    <div className="min-h-screen bg-[#f5f8ff] flex flex-col items-center overflow-x-hidden font-sans">
      {/* TopBar - Welcome/Home style */}
      <div className="w-full px-12 pt-8 pb-2 flex items-center justify-between flex-shrink-0">
        {/* Left Section: Brand */}
        <Link href="/projects" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#4f46e5] rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
            <Grid className="text-white w-5 h-5" />
          </div>
          <span className="text-slate-900 font-bold text-[18px] tracking-tight hidden sm:block">PatentIQ</span>
        </Link>

        {/* Center Section: Dark Navigation Pill */}
        <div className="bg-[#232d42] rounded-full h-[54px] flex items-center px-10 shadow-xl border border-white/5">
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <Link href="/projects" className="text-[13px] font-medium transition-all text-slate-400 hover:text-white">
              Projects
            </Link>
            <span className="text-[13px] font-medium text-white">
              Input
            </span>
            <Link href="/history" className="text-[13px] font-medium transition-all text-slate-400 hover:text-white">
              History
            </Link>
            <Link href="/help" className="text-[13px] font-medium transition-all text-slate-400 hover:text-white">
              Help
            </Link>
            <Link href="/settings" className="text-[13px] font-medium transition-all text-slate-400 hover:text-white">
              Settings
            </Link>
          </div>
        </div>

        {/* Right Section: Profile */}
        <div className="flex items-center justify-end">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full border-4 border-white overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-200 transition-all shadow-xl group relative"
          >
            <img
              src="https://picsum.photos/seed/intel-user-88/100/100"
              alt="User"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div
        className={`text-center mt-12 transition-all duration-700 ${
          focusedMode !== 'none' ? 'scale-90 opacity-40' : 'mb-8'
        }`}
      >
        <h1 className="text-[42px] text-slate-900 font-bold tracking-tight mb-2">
          <span className="font-serif italic font-medium">Hello, Inventor</span>
        </h1>

        {projectName ? (
          <div className="flex flex-col items-center">
            <p className="text-slate-500 font-medium text-base tracking-tight">
              Technical discovery for{' '}
              <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                &apos;{projectName}&apos;
              </span>
            </p>
          </div>
        ) : (
          <p className="text-slate-400 font-medium mt-2">
            Describe your idea to begin your technical analysis.
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1200px] h-[640px] items-stretch px-6 pb-12">
        {/* Left Card: Guided Chat */}
        <div
          onClick={() => setFocusedMode('chat')}
          className={`bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white relative flex flex-col transition-all duration-700 cursor-pointer overflow-hidden ${
            focusedMode === 'chat'
              ? 'flex-[1.8] ring-1 ring-slate-100'
              : focusedMode === 'upload'
              ? 'flex-[0.5] opacity-20'
              : 'flex-1'
          }`}
        >
          {focusedMode === 'chat' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFocusedMode('none');
              }}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 rounded-full z-30"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex items-center gap-2 mb-6 overflow-x-auto flex-shrink-0">
            <div className="flex bg-slate-50/50 p-1 rounded-full border border-slate-100/50">
              <div className="flex items-center gap-2 px-6 py-2 rounded-full transition-all text-xs font-bold whitespace-nowrap capitalize bg-white shadow-sm text-slate-900 ring-1 ring-slate-100">
                <Sparkles size={14} className="text-blue-500" />
                Concept Agent
              </div>
            </div>
          </div>

          <div
            className={`flex-1 bg-[#f8fbff] rounded-[2.5rem] p-8 flex flex-col border transition-all duration-500 overflow-hidden relative ${
              focusedMode === 'chat'
                ? 'border-blue-100/40 shadow-[0_0_50px_rgba(59,130,246,0.06)] bg-white'
                : 'border-[#edf3ff]'
            }`}
          >
            {/* CHAT LOADING OVERLAY: NEURAL PULSE */}
            {isAnalyzing && analysisSource === 'chat' && (
              <div className="absolute inset-0 z-50 bg-[#1e293b]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping-slow scale-150" />
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping-slower scale-[2.5]" />
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] relative z-10 animate-float-slow">
                    <BrainCircuit size={48} className="animate-pulse" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Neural Syncing...</h3>
                <p className="text-sm text-blue-200/60 font-medium max-w-[320px] leading-relaxed uppercase tracking-[0.15em]">
                  Deconstructing conversation context and mapping technical nodes
                </p>

                <div className="mt-12 flex gap-1.5 h-8 items-end">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-blue-400/30 rounded-full animate-wave"
                      style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                  <MessageSquare size={16} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 capitalize">Concept Discovery</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Conversational AI
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar scroll-smooth">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#232d42] text-white'
                        : 'bg-[#f1f5f9] text-slate-800 border border-slate-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic px-2">
                  <Loader2 size={12} className="animate-spin" /> Agent is thinking...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {focusedMode === 'chat' && (
              <div className="relative mt-auto flex-shrink-0">
                <textarea
                  autoFocus
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Describe your technical novelty..."
                  className="w-full bg-slate-50/50 rounded-2xl p-5 border border-slate-100 text-slate-900 text-[14px] font-medium leading-relaxed resize-none focus:ring-[3px] focus:ring-blue-100/40 focus:border-blue-200 focus:bg-white outline-none transition-all min-h-[100px] max-h-[140px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSubmit();
                    }
                  }}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                    Enter to Send
                  </span>
                  <button
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-30"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 flex-shrink-0 gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSatisfied ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isSatisfied ? 'Analysis Ready' : 'Detail Required'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {hasExistingAnalysis && (
                  <button
                    onClick={() => router.push(`/project/${id}/dashboard`)}
                    className="text-slate-500 px-5 py-3 rounded-full flex items-center gap-2 hover:bg-slate-50 transition-all text-xs font-bold border border-slate-200"
                  >
                    <Eye size={14} className="text-slate-400" /> Go Back to Baseline Summary
                  </button>
                )}
                <button
                  onClick={handleStartFinalAnalysis}
                  disabled={isAnalyzing || !isSatisfied}
                  className="bg-[#0f172a] text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-slate-800 transition-all text-xs font-bold shadow-xl disabled:opacity-20 active:scale-95"
                >
                  {isAnalyzing && analysisSource === 'chat' ? 'Running...' : 'Run AI Analysis'}{' '}
                  <Sparkles size={14} className="text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Document Upload */}
        <div
          onClick={() => setFocusedMode('upload')}
          className={`bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white flex flex-col transition-all duration-700 relative cursor-pointer overflow-hidden ${
            focusedMode === 'upload'
              ? 'flex-[1.8]'
              : focusedMode === 'chat'
              ? 'flex-[0.5] opacity-20'
              : 'flex-1'
          }`}
        >
          {focusedMode === 'upload' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFocusedMode('none');
              }}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 rounded-full z-30"
            >
              <X size={18} />
            </button>
          )}

          <div className="flex items-center gap-3 mb-8 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center border border-blue-100/50">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-900 leading-none">Technical Disclosure</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">
                AI Extraction
              </p>
            </div>
          </div>

          <div className="bg-[#f8fbff] border border-[#edf3ff] rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10 flex-1 group/box relative overflow-hidden transition-all duration-500">
            {/* DOCUMENT LOADING OVERLAY: PRECISION LASER SCAN */}
            {(isAnalyzing || isUploading) && analysisSource === 'upload' ? (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center z-50">
                <div className="relative w-48 h-64 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-inner mb-8 overflow-hidden">
                  <div className="p-6 space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-2 bg-slate-200 rounded-full"
                        style={{ width: `${Math.random() * 40 + 60}%` }}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,1)] animate-laser-scan" />
                  <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  {isUploading ? 'Uploading Disclosure...' : 'Extracting Taxonomy...'}
                </h3>
                <p className="text-slate-400 text-xs font-bold max-w-[280px] leading-relaxed uppercase tracking-[0.2em]">
                  Mapping technical disclosure to global prior art landscape
                </p>

                <div className="mt-8 flex items-center gap-3 bg-slate-50 px-5 py-2 rounded-full border border-slate-100">
                  <RefreshCw size={14} className="text-blue-500 animate-spin" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Active Core Scan
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl border border-slate-50 group-hover/box:scale-105 transition-transform text-blue-500">
                  <CloudUpload size={32} />
                </div>
                <h3 className="text-[22px] font-black text-slate-900 mb-2 tracking-tight">Upload File</h3>
                <p className="text-slate-400 text-xs font-medium max-w-[240px] leading-relaxed mb-8">
                  Submit technical papers or draft claims for immediate deep analysis.
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".txt,.md,.doc,.docx,.pdf"
                />
                <button
                  disabled={isAnalyzing}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#0f172a] text-white px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.1em] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                >
                  Browse Document
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-auto py-6 text-slate-300 font-bold text-[10px] tracking-[0.3em] uppercase">
        PatentIQ &bull; Enterprise AI Engine
      </footer>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-10 left-10 max-w-lg bg-white p-8 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-rose-100 flex flex-col gap-6 z-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">
                Analysis Interrupted
              </h4>
              <p className="text-[14px] font-medium text-slate-600 leading-relaxed">{error.message}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setError(null)}
              className="flex-1 bg-slate-500 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-100"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes laser-scan {
          0%, 100% { top: 0%; opacity: 0; }
          5%, 95% { opacity: 1; }
          50% { top: 100%; opacity: 1; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes ping-slower {
          0% { transform: scale(1); opacity: 0.1; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-laser-scan { animation: laser-scan 3s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-ping-slower { animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-wave { animation: wave 1.2s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
}
