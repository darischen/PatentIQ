'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Award, Calendar, FileText, Zap, ChevronRight, Edit3, Grid, Camera } from 'lucide-react';

export default function ProfilePage() {
  const stats = [
    { label: 'Analyses Run', value: '142', icon: <FileText size={18} />, color: 'indigo' },
    { label: 'Novelty Found', value: '82%', icon: <Zap size={18} />, color: 'amber' },
    { label: 'Saved Drafts', value: '29', icon: <Edit3 size={18} />, color: 'rose' },
    { label: 'Team Rank', value: 'Expert', icon: <Award size={18} />, color: 'emerald' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-slate-50 overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 relative">
          <button className="absolute bottom-6 right-10 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer">
            <Camera size={14} /> Update Cover
          </button>
        </div>

        <div className="px-12 pb-12 relative">
          <div className="flex justify-between items-end">
             <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 rounded-[2.5rem] border-8 border-white bg-slate-100 overflow-hidden shadow-xl">
                  <img src="https://picsum.photos/seed/patent-pro-expert/200/200" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-1 right-1 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  <Camera size={16} />
                </button>
             </div>

             <div className="flex gap-4 mb-4">
               <button className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 cursor-pointer">
                 Edit Profile
               </button>
               <Link href="/settings" className="bg-white border border-slate-100 text-slate-500 p-3.5 rounded-xl hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center">
                 <Grid size={18} />
               </Link>
             </div>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Johnathan Inventor</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              Senior Patent Strategist at <span className="text-indigo-600 font-bold underline underline-offset-4">Innovate Labs</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-slate-50">
            {stats.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className={`flex items-center gap-2 text-[10px] font-black text-${s.color}-500 uppercase tracking-widest`}>
                  {s.icon} {s.label}
                </div>
                <div className="text-3xl font-black text-slate-900">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <h2 className="text-xl font-black text-slate-900">Personal Information</h2>
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 space-y-10 shadow-sm">
             <div className="grid grid-cols-2 gap-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                  <p className="text-sm font-bold text-slate-800">Johnathan Montgomery Inventor</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-slate-800">john.inventor@innovatelabs.io</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-sm font-bold text-slate-800">+1 (555) 012-3456</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-slate-800">San Francisco, CA</p>
                </div>
             </div>

             <div className="pt-10 border-t border-slate-50">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Professional Bio</p>
               <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                 "Specializing in decentralized technologies and autonomous systems. I have filed over 12 patents using Patent Intel's advanced discovery engine, maintaining a 92% grant success rate."
               </p>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-8">
           <h2 className="text-xl font-black text-slate-900">Security & Activity</h2>
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">2-Factor Auth</p>
                    <p className="text-[10px] text-emerald-500 font-black uppercase">Enabled</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">Last Login</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Today, 10:42 AM</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </div>

              <div className="pt-4 px-2">
                <Link href="/history" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  View Analysis Activity <ChevronRight size={14} />
                </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
