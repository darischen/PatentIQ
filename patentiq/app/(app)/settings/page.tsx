'use client';

import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Key,
  CreditCard,
  ChevronRight,
  Bell,
  Globe,
  Palette,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Plus,
  Check,
} from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: <Settings size={16} /> },
  { id: 'account', label: 'Account', icon: <User size={16} /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield size={16} /> },
  { id: 'api', label: 'API & Keys', icon: <Key size={16} /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard size={16} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [theme, setTheme] = useState('system');
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText('piq_sk_live_****************************a3f2');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage your account, preferences, and API configuration.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Tabs */}
          <div className="w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <ChevronRight size={14} className="ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <>
                {/* Appearance */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette size={20} className="text-slate-400" />
                    <h3 className="text-lg font-black text-slate-900">Appearance</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', label: 'Light', icon: <Sun size={20} /> },
                      { id: 'dark', label: 'Dark', icon: <Moon size={20} /> },
                      { id: 'system', label: 'System', icon: <Monitor size={20} /> },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                          theme === option.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                            : 'border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {option.icon}
                        <span className="text-xs font-bold">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell size={20} className="text-slate-400" />
                    <h3 className="text-lg font-black text-slate-900">Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        label: 'Email Notifications',
                        desc: 'Receive email when analysis completes',
                        defaultChecked: true,
                      },
                      {
                        label: 'Patent Alerts',
                        desc: 'Notify when new relevant patents are published',
                        defaultChecked: true,
                      },
                      {
                        label: 'Weekly Digest',
                        desc: 'Summary of patent landscape changes',
                        defaultChecked: false,
                      },
                      {
                        label: 'Marketing Emails',
                        desc: 'Product updates and feature announcements',
                        defaultChecked: false,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={item.defaultChecked}
                          />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language & Region */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Globe size={20} className="text-slate-400" />
                    <h3 className="text-lg font-black text-slate-900">Language & Region</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Language
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Japanese</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Timezone
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (CET)</option>
                        <option>UTC+9 (JST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* API & Keys Tab */}
            {activeTab === 'api' && (
              <>
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-2">API Keys</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    Manage your API keys for programmatic access to PatentIQ.
                  </p>

                  {/* Existing Key */}
                  <div className="bg-slate-50 rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-800">Production Key</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Created Jan 15, 2025 -- Last used 2 hours ago
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-white border border-slate-100 rounded-lg px-4 py-2.5 font-mono text-xs text-slate-600">
                        {showApiKey
                          ? 'piq_sk_live_a8f3k29d4m5n6p7q8r9s0t1u2v3w4x5y6za3f2'
                          : 'piq_sk_live_****************************a3f2'}
                      </div>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={handleCopyKey}
                        className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {copiedKey ? (
                          <Check size={16} className="text-emerald-500" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                      <button className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <RefreshCw size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Generate New Key */}
                  <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors active:scale-95">
                    <Plus size={16} />
                    Generate New Key
                  </button>
                </div>

                {/* Usage */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-2">API Usage</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    Current billing period: Jan 1 - Jan 31, 2025
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-slate-50 rounded-xl p-5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Requests
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">1,247</p>
                      <p className="text-xs text-slate-400 mt-1">of 10,000</p>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-[12.47%]" />
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Analyses
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">23</p>
                      <p className="text-xs text-slate-400 mt-1">of 100</p>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[23%]" />
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Storage
                      </p>
                      <p className="text-2xl font-black text-slate-900 mt-1">156 MB</p>
                      <p className="text-xs text-slate-400 mt-1">of 5 GB</p>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[3.12%]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Webhooks */}
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 mb-2">Webhooks</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    Configure webhook endpoints for real-time event notifications.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-6 text-center">
                    <p className="text-sm text-slate-400 font-medium">No webhooks configured</p>
                    <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                      + Add Webhook Endpoint
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Coming Soon tabs */}
            {(activeTab === 'account' ||
              activeTab === 'privacy' ||
              activeTab === 'billing') && (
              <div className="bg-white rounded-2xl p-12 border border-slate-100 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'account' && <User size={28} />}
                  {activeTab === 'privacy' && <Shield size={28} />}
                  {activeTab === 'billing' && <CreditCard size={28} />}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {activeTab === 'account' && 'Account Settings'}
                  {activeTab === 'privacy' && 'Privacy & Security'}
                  {activeTab === 'billing' && 'Billing & Plans'}
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  This section is coming soon. We&apos;re working on bringing you full control over
                  your{' '}
                  {activeTab === 'account'
                    ? 'account details and profile'
                    : activeTab === 'privacy'
                    ? 'privacy settings and data management'
                    : 'subscription, invoices, and payment methods'}
                  .
                </p>
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                  Coming Soon
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
