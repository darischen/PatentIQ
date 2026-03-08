
import React, { useState, useRef, useEffect } from 'react';
import { Search, FileText, Upload, ArrowLeft, ArrowRight, Grid, MessageSquare, Sparkles, User, Bot, X, AlertTriangle, RefreshCw, Key, Loader2, CloudUpload, ShieldAlert, Target, Sparkle, LayoutDashboard, BrainCircuit, PlayCircle, Eye } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Screen, AnalysisType, ChatMessage } from '../types';
import TopBar from './TopBar';

interface WelcomeScreenProps {
  projectName?: string;
  initialHistory?: ChatMessage[];
  hasExistingAnalysis?: boolean;
  onAnalyze: (data: AnalysisResult, history: ChatMessage[]) => void;
  onUpdateHistory?: (history: ChatMessage[]) => void;
  onGoBackToAnalysis?: () => void;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ projectName, initialHistory, hasExistingAnalysis, onAnalyze, onUpdateHistory, onGoBackToAnalysis, onBack, onNavigate }) => {
  const [activeAgent, setActiveAgent] = useState<AnalysisType>('concept');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSource, setAnalysisSource] = useState<'chat' | 'upload' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [focusedMode, setFocusedMode] = useState<'chat' | 'upload' | 'none'>('none');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<{ message: string; isQuota: boolean; needsKey?: boolean } | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateChatHistory = (newHistory: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    setChatHistory(prev => {
      const next = typeof newHistory === 'function' ? newHistory(prev) : newHistory;
      onUpdateHistory?.(next);
      return next;
    });
  };

  const isDirty = initialHistory ? chatHistory.length > initialHistory.length : chatHistory.length > 1;

  useEffect(() => {
    if (initialHistory && initialHistory.length > 0) {
      setChatHistory(initialHistory);
      setFocusedMode('chat');
    } else {
      const initialPrompts: Record<AnalysisType, string> = {
        concept: "Hello! I'm your Concept Agent. Tell me about your early-stage idea or the technical problem you're solving."
      };
      const initialHist: ChatMessage[] = [{ role: 'bot', content: initialPrompts[activeAgent] }];
      setChatHistory(initialHist);
      onUpdateHistory?.(initialHist);
    }
  }, [activeAgent, projectName]); // Re-run when activeAgent or the current project changes

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleOpenKeySelector = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && typeof aistudio.openSelectKey === 'function') {
      await aistudio.openSelectKey();
      setError(null);
    }
  };

  const handleLoadDemo = () => {
    const demoData: AnalysisResult = {
      noveltyScore: 82,
      confidence: 94,
      summary: "A revolutionary decentralized coordination system for autonomous agents using high-frequency mesh synchronization and ledger-based location verification. This enables swarms to operate without a central authority while maintaining sub-10ms latency for safety-critical tasks.",
      features: [
        { id: '1', name: 'Ledger-based positioning', status: 'high-risk', description: 'Blockchain-like verification for node coordinates', domain: 'Security', category: 'Core' },
        { id: '2', name: 'Hybrid Sensor Fusion', status: 'unique', description: 'Real-time merging of LIDAR and Radar logic', domain: 'Sensors', category: 'Core' },
        { id: '3', name: 'Low-latency Data Bus', status: 'partial', description: '5GHz synchronized communication backplane', domain: 'Hardware', category: 'Technical' },
        { id: '4', name: 'Neural Path Predictor', status: 'unique', description: 'RNN-based obstacle trajectory estimation', domain: 'Processing', category: 'Secondary' },
        { id: '5', name: 'Bio-mimetic Swarm Logic', status: 'unique', description: 'Organic flight patterns for drag reduction', domain: 'Control', category: 'Secondary' }
      ],
      topRiskFeature: 'Ledger-based positioning',
      closestPriorArt: 'US-9,821,445-B2',
      featuresAnalyzed: 14,
      similarPatents: 128,
      analysisType: activeAgent
    };
    onAnalyze(demoData, chatHistory);
  };

  const callGeminiAnalysis = async (content: string, finalHistory: ChatMessage[], source: 'chat' | 'upload') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `You are a world-class patent attorney agent specializing in early-stage idea exploration, identifying technical themes and directional novelty. 
    Analyze the provided technical content. Return a strictly valid JSON response.`;

    try {
      setIsAnalyzing(true);
      setAnalysisSource(source);
      setError(null);

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Technical Content:\n\n${content}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              noveltyScore: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER },
              summary: { type: Type.STRING },
              features: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['unique', 'partial', 'high-risk', 'standard'] },
                    description: { type: Type.STRING },
                    domain: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['Core', 'Secondary', 'Technical'] }
                  },
                  required: ['id', 'name', 'status', 'description', 'domain', 'category']
                }
              },
              topRiskFeature: { type: Type.STRING },
              closestPriorArt: { type: Type.STRING },
              featuresAnalyzed: { type: Type.INTEGER },
              similarPatents: { type: Type.INTEGER }
            },
            required: ['noveltyScore', 'confidence', 'summary', 'features', 'topRiskFeature', 'closestPriorArt', 'featuresAnalyzed', 'similarPatents']
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const result = JSON.parse(responseText) as AnalysisResult;
        result.analysisType = activeAgent;
        onAnalyze(result, finalHistory);
      } else {
        throw new Error("Analysis failed: No content generated.");
      }
    } catch (err: any) {
      console.error("AI Analysis Error:", err);
      const errText = err.message?.toLowerCase() || "";
      const isQuota = errText.includes('429') || errText.includes('quota') || errText.includes('resource_exhausted');
      
      setError({ 
        message: isQuota 
          ? "The shared API quota has been exhausted. You can use your own API key or continue with Demo Mode to see the dashboard immediately." 
          : "An unexpected error occurred. Please try again.", 
        isQuota, 
        needsKey: isQuota 
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisSource(null);
    }
  };

  const handleChatSubmit = async () => {
    if (chatInput.trim().length < 2 || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    updateChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `User Input: ${userMsg}. Ask one deep technical follow-up.`,
      });
      updateChatHistory(prev => [...prev, { role: 'bot', content: response.text || "Could you elaborate on the technical mechanism?" }]);
    } catch (err: any) {
       const errText = err.message?.toLowerCase() || "";
       if (errText.includes('429') || errText.includes('quota')) {
         setError({ message: "Quota Exhausted. Switch to your own key or use Demo Mode.", isQuota: true, needsKey: true });
       }
       updateChatHistory(prev => [...prev, { role: 'bot', content: "Communication error. Check your API quota." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setAnalysisSource('upload');
    setError(null);

    try {
      const reader = new FileReader();
      const content = await new Promise<string>((resolve, reject) => {
        reader.onload = (event) => resolve(event.target?.result as string || "");
        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
      });

      if (!content || content.trim().length < 50) {
        throw new Error("Document content too short.");
      }

      await new Promise(r => setTimeout(r, 1000));
      setIsUploading(false);
      await callGeminiAnalysis(content, chatHistory, 'upload');
    } catch (err: any) {
      setError({ message: err.message || "Failed to parse document.", isQuota: false });
      setIsUploading(false);
      setAnalysisSource(null);
    }
  };

  const handleStartFinalAnalysis = () => {
    const fullTranscript = chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    callGeminiAnalysis(fullTranscript, chatHistory, 'chat');
  };

  const isSatisfied = chatHistory.filter(m => m.role === 'user').length >= 2 || chatInput.length > 100;

  return (
    <div className="min-h-screen bg-[#f5f8ff] flex flex-col items-center overflow-x-hidden font-sans">
      <TopBar onNavigate={onNavigate} currentScreen="welcome" />

      {/* Hero Header */}
      <div className={`text-center mt-12 transition-all duration-700 ${focusedMode !== 'none' ? 'scale-90 opacity-40' : 'mb-8'}`}>
        <h1 className="text-[42px] text-slate-900 font-bold tracking-tight mb-2">
          <span className="font-serif italic font-medium">Hello, Inventor</span> 👋
        </h1>
        
        {projectName ? (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-2">
            <p className="text-slate-500 font-medium text-base tracking-tight">
              Technical discovery for <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">'{projectName}'</span>
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
            focusedMode === 'chat' ? 'flex-[1.8] ring-1 ring-slate-100' : focusedMode === 'upload' ? 'flex-[0.5] opacity-20' : 'flex-1'
          }`}
        >
          {focusedMode === 'chat' && (
            <button onClick={(e) => { e.stopPropagation(); setFocusedMode('none'); }} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 rounded-full z-30"><X size={18} /></button>
          )}

          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar flex-shrink-0">
            <div className="flex bg-slate-50/50 p-1 rounded-full border border-slate-100/50">
              <div className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-xs font-bold whitespace-nowrap capitalize bg-white shadow-sm text-slate-900 ring-1 ring-slate-100`}>
                <Sparkles size={14} className="text-blue-500" />
                Concept Agent
              </div>
            </div>
          </div>

          <div 
            className={`flex-1 bg-[#f8fbff] rounded-[2.5rem] p-8 flex flex-col border transition-all duration-500 overflow-hidden relative ${
              focusedMode === 'chat' ? 'border-blue-100/40 shadow-[0_0_50px_rgba(59,130,246,0.06)] bg-white' : 'border-[#edf3ff]'
            }`}
          >
            {isAnalyzing && analysisSource === 'chat' && (
              <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200 animate-pulse">
                  <BrainCircuit size={32} className="animate-spin-slow" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Analyzing Session...</h3>
                <p className="text-sm text-slate-500 font-medium max-w-[280px]">Connecting to Patent Intel engine and assessing prior art.</p>
              </div>
            )}

            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100">
                  <MessageSquare size={16} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-slate-900 capitalize">Concept Discovery</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Conversational AI</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar scroll-smooth">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#232d42] text-white' : 'bg-[#f1f5f9] text-slate-800 border border-slate-100'}`}>
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
                  <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Enter to Send</span>
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
                {hasExistingAnalysis ? (
                  <button 
                    onClick={onGoBackToAnalysis}
                    className="text-slate-500 px-5 py-3 rounded-full flex items-center gap-2 hover:bg-slate-50 transition-all text-xs font-bold border border-slate-200"
                  >
                    <Eye size={14} className="text-slate-400" /> Go Back to Baseline Summary
                  </button>
                ) : (
                  <button 
                    onClick={handleLoadDemo}
                    className="text-slate-500 px-5 py-3 rounded-full flex items-center gap-2 hover:bg-slate-50 transition-all text-xs font-bold border border-slate-200"
                  >
                    <Eye size={14} className="text-slate-400" /> Simulate (Demo)
                  </button>
                )}
                <button 
                  onClick={handleStartFinalAnalysis}
                  disabled={isAnalyzing || !isSatisfied}
                  className="bg-[#0f172a] text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-slate-800 transition-all text-xs font-bold shadow-xl disabled:opacity-20 active:scale-95"
                >
                  {isAnalyzing && analysisSource === 'chat' ? "Running..." : "Run AI Analysis"} <Sparkles size={14} className="text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Document Upload */}
        <div 
          onClick={() => setFocusedMode('upload')}
          className={`bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white flex flex-col transition-all duration-700 relative cursor-pointer overflow-hidden ${
            focusedMode === 'upload' ? 'flex-[1.8]' : focusedMode === 'chat' ? 'flex-[0.5] opacity-20' : 'flex-1'
          }`}
        >
          {focusedMode === 'upload' && (
            <button onClick={(e) => { e.stopPropagation(); setFocusedMode('none'); }} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 rounded-full z-30"><X size={18} /></button>
          )}

          <div className="flex items-center gap-3 mb-8 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center border border-blue-100/50">
              <FileText size={16} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-900 leading-none">Technical Disclosure</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">AI Extraction</p>
            </div>
          </div>

          <div className="bg-[#f8fbff] border border-[#edf3ff] rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10 flex-1 group/box relative overflow-hidden transition-all duration-500">
            {(isAnalyzing || isUploading) && analysisSource === 'upload' ? (
              <div className="flex flex-col items-center animate-in fade-in duration-500 z-10">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-xl border border-blue-50 text-blue-500 animate-pulse">
                    <RefreshCw size={36} className="animate-spin duration-[4s]" />
                  </div>
                </div>
                <h3 className="text-[20px] font-black text-slate-900 mb-2 tracking-tight">Parsing Document...</h3>
                <p className="text-slate-400 text-[11px] font-bold max-w-[260px] leading-relaxed uppercase tracking-widest">
                  Mapping claims to prior art database.
                </p>
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
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.md,.doc,.docx,.pdf" />
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
        Patent Intel • Enterprise AI Engine
      </footer>

      {error && (
        <div className="fixed bottom-10 left-10 max-w-lg bg-white p-8 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-rose-100 flex flex-col gap-6 animate-in slide-in-from-left-4 z-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">Analysis Interrupted</h4>
              <p className="text-[14px] font-medium text-slate-600 leading-relaxed">{error.message}</p>
            </div>
            <button onClick={() => setError(null)} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {error.needsKey && (
              <button 
                onClick={handleOpenKeySelector} 
                className="flex-1 bg-[#0f172a] text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Key size={14} /> Use My API Key
              </button>
            )}
            <button 
              onClick={handleLoadDemo} 
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <PlayCircle size={14} /> Bypass to Dashboard (Demo)
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default WelcomeScreen;
