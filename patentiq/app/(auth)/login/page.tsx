'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Mail, Lock, User, EyeOff, Layout, FileText, BarChart3, Settings as SettingsIcon, Plus, Play } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email && password) {
      router.push('/projects');
    }
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] flex items-center justify-center p-4 md:p-10 font-sans">
      <div className="w-full max-w-[1400px] h-[850px] bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden">

        {/* Left Side: Login Form */}
        <div className="w-full lg:w-1/2 p-12 md:p-20 flex flex-col justify-between bg-white relative">
          <div>
            <div className="flex items-center gap-3 mb-20">
              <div className="w-10 h-10 bg-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-purple-100">
                <Grid className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1e293b] leading-none">PatentIQ</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">IP Management Suite</p>
              </div>
            </div>

            <div className="max-w-md">
              <h1 className="text-3xl font-bold text-[#1e293b] mb-2">Login to Dashboard</h1>
              <p className="text-slate-500 mb-12">Fill the below form to login</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1e293b]">Username</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full bg-white border border-slate-200 rounded-xl py-4 px-5 text-sm text-slate-900 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1e293b]">Email</label>
                  <div className="relative">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full bg-white border border-slate-200 rounded-xl py-4 px-5 text-sm text-slate-900 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-[#1e293b]">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      className="w-full bg-white border border-slate-200 rounded-xl py-4 px-5 pr-12 text-sm text-slate-900 focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all"
                    />
                    <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 cursor-pointer hover:text-slate-400" size={18} />
                  </div>
                </div>

                <div className="flex justify-start">
                  <button type="button" className="text-sm font-bold text-[#7c3aed] hover:underline transition-all">
                    Forget Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#7c3aed] text-white py-4 rounded-xl font-bold text-base hover:bg-[#6d28d9] transition-all shadow-xl shadow-purple-100 active:scale-[0.99] mt-4"
                >
                  Login
                </button>
              </form>
            </div>
          </div>

          <div className="text-slate-400 text-xs font-medium">
            &copy; 2025 PatentIQ. All rights reserved.
          </div>
        </div>

        {/* Right Side: Visual Preview */}
        <div className="hidden lg:flex w-1/2 bg-[#f1f5f9] relative p-12 items-center justify-center">
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-200/40 rounded-full blur-[100px]"></div>
          </div>

          <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="mb-10 space-y-2">
              <span className="bg-white/80 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">PatentIQ Overview</span>
              <h2 className="text-4xl font-bold text-slate-800 leading-tight">
                Manage your technical <br /> innovations <span className="text-[#7c3aed]">more professionally</span>
              </h2>
            </div>

            {/* Mock Dashboard Card */}
            <div className="bg-white rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-white flex overflow-hidden h-[500px]">
              {/* Sidebar Mock */}
              <div className="w-52 border-r border-slate-50 flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10">
                  <div className="w-6 h-6 bg-[#7c3aed] rounded-md flex items-center justify-center">
                    <Grid className="text-white w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">PatentIQ</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold">
                    <Layout size={14} /> Overview
                  </div>
                  <div className="flex items-center gap-3 p-2 text-slate-400 text-xs font-bold hover:bg-slate-50 rounded-lg">
                    <FileText size={14} /> My Patents
                  </div>
                  <div className="flex items-center gap-3 p-2 text-slate-400 text-xs font-bold hover:bg-slate-50 rounded-lg">
                    <BarChart3 size={14} /> Analytics
                  </div>
                  <div className="flex items-center gap-3 p-2 text-slate-400 text-xs font-bold hover:bg-slate-50 rounded-lg">
                    <SettingsIcon size={14} /> Project Settings
                  </div>
                </div>
              </div>

              {/* Content Mock */}
              <div className="flex-1 p-8 bg-white overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-bold text-slate-800">Welcome to Overview</h3>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-slate-100 rounded-full"></div>
                    <div className="w-6 h-6 bg-slate-100 rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventions</p>
                      <Plus size={10} className="text-slate-300" />
                    </div>
                    <p className="text-xl font-bold text-slate-800">29</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyses</p>
                      <BarChart3 size={10} className="text-slate-300" />
                    </div>
                    <p className="text-xl font-bold text-slate-800">142</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Activity</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-[11px] font-bold text-slate-700">Quantum Battery Mesh Analysis</span>
                      </div>
                      <span className="text-[9px] font-black text-purple-400">85% NOVELTY</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span className="text-[11px] font-bold text-slate-700">Drone Propeller Optimization</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400">FINISHED</span>
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
