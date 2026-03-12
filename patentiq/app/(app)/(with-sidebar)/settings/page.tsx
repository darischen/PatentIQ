'use client';

import React, { useState } from 'react';
import { Settings, User, Shield, Key, CreditCard, Layout, Globe, Save } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: <Settings size={18} /> },
  { id: 'account', label: 'Account', icon: <User size={18} /> },
  { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
  { id: 'api', label: 'API & Keys', icon: <Key size={18} /> },
  { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage your platform preferences and legal analysis configurations.</p>
      </div>

      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Side: Tabs */}
        <div className="col-span-12 lg:col-span-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side: Content */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 space-y-12">
          {activeTab === 'general' && (
            <div className="space-y-10 animate-in fade-in duration-300">
               <section className="space-y-6">
                 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                   <Globe size={18} className="text-indigo-600" /> Region & Compliance
                 </h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Jurisdiction</label>
                       <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100">
                         <option>United States (USPTO)</option>
                         <option>Europe (EPO)</option>
                         <option>China (CNIPA)</option>
                         <option>Japan (JPO)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
                       <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-100">
                         <option>(GMT-08:00) Pacific Time</option>
                         <option>(GMT+00:00) London</option>
                         <option>(GMT+08:00) Singapore</option>
                       </select>
                    </div>
                 </div>
               </section>

               <section className="space-y-6">
                 <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                   <Layout size={18} className="text-indigo-600" /> Interface Preferences
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                       <div>
                         <p className="text-sm font-black text-slate-800">Compact Mode</p>
                         <p className="text-[11px] text-slate-400 font-medium">Reduce whitespace and use smaller text in tables.</p>
                       </div>
                       <div className="w-12 h-6 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                         <div className="w-4 h-4 bg-white rounded-full absolute left-1 shadow-sm" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                       <div>
                         <p className="text-sm font-black text-slate-800">Auto-save Strategy</p>
                         <p className="text-[11px] text-slate-400 font-medium">Automatically save Sandbox changes every 60 seconds.</p>
                       </div>
                       <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                         <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm" />
                       </div>
                    </div>
                 </div>
               </section>

               <div className="pt-6 border-t border-slate-50 flex justify-end">
                  <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 cursor-pointer">
                    <Save size={16} /> Save Changes
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                 <Key className="text-amber-600 flex-shrink-0" size={20} />
                 <p className="text-xs font-bold text-amber-700 leading-relaxed italic">
                   Keys are stored securely in your browser's local storage. We never transmit your API keys to our servers.
                 </p>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Active API Key</label>
                 <div className="flex gap-3">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-5 text-sm font-bold text-slate-800 outline-none"
                    />
                    <button className="px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 cursor-pointer">
                      Update Key
                    </button>
                 </div>
               </div>

               <div className="pt-10 space-y-6">
                 <h4 className="text-sm font-black text-slate-800">Advanced AI Configuration</h4>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Model Select</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 outline-none">
                        <option>Gemini 2.5 Flash</option>
                        <option>Gemini 3.0 Pro (Standard)</option>
                        <option>Gemini 3.0 Pro (Experimental)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Thinking Budget</label>
                      <input type="range" className="w-full accent-indigo-600 mt-2" min="0" max="32768" step="1024" />
                      <p className="text-[9px] text-slate-400 text-right">32768 tokens (Max)</p>
                    </div>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
