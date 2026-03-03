'use client';

import React from 'react';
import {
  Brain,
  Search,
  Shield,
  Zap,
  FileText,
  BarChart3,
  Layers,
  GitBranch,
  ChevronRight,
  Lightbulb,
  Target,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Globe,
  Lock,
  TrendingUp,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Mini-dashboard preview (static, no framer-motion)                 */
/* ------------------------------------------------------------------ */
function MiniDashboard({ type }: { type: 'novelty' | 'heatmap' | 'sandbox' }) {
  if (type === 'novelty') {
    return (
      <div className="bg-slate-900 rounded-2xl p-5 text-white w-full max-w-[280px] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            XNS Score
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">LIVE</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-black text-white">87</span>
          <span className="text-emerald-400 text-sm font-bold mb-1">+12%</span>
        </div>
        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full w-[87%]" />
        </div>
        <div className="flex justify-between mt-2 text-[9px] text-slate-500 font-medium">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    );
  }

  if (type === 'heatmap') {
    const cells = [85, 42, 91, 64, 72, 38, 95, 56, 88, 45, 77, 63];
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100 w-full max-w-[280px] shadow-xl">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Feature Heatmap
        </span>
        <div className="grid grid-cols-4 gap-1.5 mt-3">
          {cells.map((val, i) => (
            <div
              key={i}
              className={`h-8 rounded-lg transition-colors duration-200 hover:scale-110 hover:shadow-md cursor-pointer ${
                val > 80
                  ? 'bg-emerald-400'
                  : val > 60
                  ? 'bg-emerald-200'
                  : val > 40
                  ? 'bg-amber-200'
                  : 'bg-rose-200'
              }`}
              title={`${val}%`}
            />
          ))}
        </div>
      </div>
    );
  }

  // sandbox
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 w-full max-w-[280px] shadow-xl">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        Feature Toggles
      </span>
      <div className="space-y-2 mt-3">
        {['Quantum Mesh', 'Battery Core', 'Neural Link'].map((f, i) => (
          <div
            key={f}
            className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-700">{f}</span>
            <div
              className={`w-8 h-4 rounded-full ${
                i < 2 ? 'bg-indigo-500' : 'bg-slate-300'
              } relative`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${
                  i < 2 ? 'left-4' : 'left-0.5'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Help Page                                                    */
/* ------------------------------------------------------------------ */
export default function HelpPage() {
  const capabilities = [
    {
      icon: <Brain size={24} />,
      title: 'AI-Powered Novelty Analysis',
      description:
        'Our proprietary XNS (eXtended Novelty Score) engine analyzes your invention against millions of patents using advanced NLP and semantic similarity algorithms.',
      dashboard: 'novelty' as const,
    },
    {
      icon: <Layers size={24} />,
      title: 'Feature-Level Heatmapping',
      description:
        'Visualize which features of your invention are truly novel and which overlap with existing prior art. Each feature is independently scored and color-coded.',
      dashboard: 'heatmap' as const,
    },
    {
      icon: <GitBranch size={24} />,
      title: 'Strategy Sandbox',
      description:
        'Toggle features on and off to see how your novelty score changes in real-time. Explore different claim strategies before filing.',
      dashboard: 'sandbox' as const,
    },
  ];

  const actions = [
    {
      icon: <Lightbulb size={20} />,
      title: 'Describe Your Invention',
      description: 'Use our guided interview or paste your technical description to begin analysis.',
    },
    {
      icon: <Search size={20} />,
      title: 'Explore Prior Art',
      description: 'Browse related patents, filter by relevance, and understand the competitive landscape.',
    },
    {
      icon: <Target size={20} />,
      title: 'Optimize Your Claims',
      description: 'Use the sandbox to refine which features to emphasize in your patent application.',
    },
    {
      icon: <FileText size={20} />,
      title: 'Generate Reports',
      description: 'Export professional patent landscape reports for your attorney or filing team.',
    },
    {
      icon: <Shield size={20} />,
      title: 'Monitor & Protect',
      description: 'Set up alerts for new patents that may affect your claims or competitive position.',
    },
    {
      icon: <BarChart3 size={20} />,
      title: 'Track Trends',
      description: 'View novelty score trends over time as the patent landscape evolves.',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Input Your Invention',
      description: 'Describe your invention through our guided interview, document upload, or direct text input.',
      color: 'bg-indigo-500',
    },
    {
      step: '02',
      title: 'AI Feature Extraction',
      description: 'Our engine identifies key technical features and maps them to patent classification codes.',
      color: 'bg-violet-500',
    },
    {
      step: '03',
      title: 'Patent Retrieval & Comparison',
      description: 'Millions of patents are searched and semantically compared against your features.',
      color: 'bg-purple-500',
    },
    {
      step: '04',
      title: 'Novelty Scoring & Explainability',
      description: 'Each feature receives an XNS score with full transparency into how it was calculated.',
      color: 'bg-fuchsia-500',
    },
    {
      step: '05',
      title: 'Strategy & Export',
      description: 'Use the sandbox to optimize, then export reports for your patent filing team.',
      color: 'bg-pink-500',
    },
  ];

  const benefits = [
    { icon: <Zap size={20} />, title: 'Speed', description: 'Get results in minutes, not weeks' },
    { icon: <Globe size={20} />, title: 'Coverage', description: 'Millions of patents analyzed' },
    { icon: <Lock size={20} />, title: 'Security', description: 'Your ideas stay confidential' },
    { icon: <TrendingUp size={20} />, title: 'Accuracy', description: 'Continuously improving AI models' },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="max-w-6xl mx-auto p-8 space-y-16">
        {/* Hero Header */}
        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6">
            <Sparkles size={14} className="text-indigo-500" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Help & Documentation
            </span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
            Welcome to PatentIQ
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            The AI-powered patent intelligence platform that helps inventors, attorneys, and R&D
            teams understand the novelty of their innovations before filing.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">What is PatentIQ?</h2>
              <p className="text-slate-500 leading-relaxed">
                PatentIQ is an AI-powered patent analysis platform that uses advanced natural
                language processing and machine learning to evaluate the novelty of your invention.
                By analyzing your technical description against millions of existing patents, we
                provide actionable insights that help you make informed decisions about your patent
                strategy. Whether you&apos;re an independent inventor, a patent attorney, or part of
                a large R&D team, PatentIQ gives you the intelligence you need to file smarter.
              </p>
            </div>
          </div>
        </div>

        {/* Core Capabilities with Mini Dashboards */}
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Core Capabilities
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            Powerful tools designed for patent intelligence
          </p>
          <div className="space-y-6">
            {capabilities.map((cap, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center gap-8 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    {cap.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{cap.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{cap.description}</p>
                </div>
                <div className="hidden lg:block">
                  <MiniDashboard type={cap.dashboard} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What You Can Do */}
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            What You Can Do
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            Everything you need for patent intelligence
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {action.icon}
                </div>
                <h3 className="text-sm font-black text-slate-900 mb-1">{action.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Steps */}
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">How It Works</h2>
          <p className="text-slate-500 font-medium mb-8">
            From idea to actionable patent intelligence in five steps
          </p>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${step.color} text-white flex items-center justify-center text-lg font-black shrink-0`}
                >
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight size={20} className="text-slate-300 shrink-0 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-slate-900 rounded-[2rem] p-10">
          <h2 className="text-3xl font-black text-white tracking-tight mb-8 text-center">
            Why PatentIQ?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                  {benefit.icon}
                </div>
                <h4 className="text-sm font-black text-white mb-1">{benefit.title}</h4>
                <p className="text-xs text-slate-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[2rem] p-10 text-white">
            <CheckCircle2 size={32} className="mx-auto mb-4 opacity-60" />
            <h2 className="text-2xl font-black mb-2">Ready to Get Started?</h2>
            <p className="text-indigo-100 font-medium mb-6 max-w-lg mx-auto">
              Create a new project and describe your invention to receive your first AI-powered
              novelty analysis.
            </p>
            <button
              onClick={() => (window.location.href = '/projects')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-50 transition-colors active:scale-95"
            >
              Go to Projects <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
