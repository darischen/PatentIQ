'use client';

import React from 'react';
import Link from 'next/link';
import {
  Camera,
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  Globe,
  Shield,
  Key,
  Smartphone,
  Clock,
  ChevronRight,
  Edit3,
  ExternalLink,
  Award,
  FileText,
  TrendingUp,
  Zap,
} from 'lucide-react';

export default function ProfilePage() {
  const stats = [
    { label: 'Analyses', value: '47', icon: <FileText size={18} />, color: 'text-indigo-500' },
    { label: 'Avg. Novelty', value: '78%', icon: <TrendingUp size={18} />, color: 'text-emerald-500' },
    { label: 'Patents Found', value: '1.2K', icon: <Zap size={18} />, color: 'text-amber-500' },
    { label: 'Pro Member', value: 'Since 2024', icon: <Award size={18} />, color: 'text-violet-500' },
  ];

  const personalInfo = [
    { label: 'Full Name', value: 'Dr. Sarah Chen', icon: <Edit3 size={14} /> },
    { label: 'Email', value: 'sarah.chen@innovate.io', icon: <Mail size={14} /> },
    { label: 'Role', value: 'Senior Patent Strategist', icon: <Briefcase size={14} /> },
    { label: 'Organization', value: 'InnovateTech Labs', icon: <Globe size={14} /> },
    { label: 'Location', value: 'San Francisco, CA', icon: <MapPin size={14} /> },
    { label: 'Member Since', value: 'January 2024', icon: <Calendar size={14} /> },
  ];

  const securityItems = [
    {
      icon: <Shield size={20} />,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      status: 'Enabled',
      statusColor: 'text-emerald-500 bg-emerald-50',
    },
    {
      icon: <Key size={20} />,
      title: 'API Keys',
      description: '1 active key -- Last used 2 hours ago',
      status: 'Active',
      statusColor: 'text-indigo-500 bg-indigo-50',
    },
    {
      icon: <Smartphone size={20} />,
      title: 'Trusted Devices',
      description: '3 devices currently authorized',
      status: '3 Devices',
      statusColor: 'text-slate-500 bg-slate-50',
    },
    {
      icon: <Clock size={20} />,
      title: 'Recent Activity',
      description: 'Last login: Today at 9:42 AM from San Francisco',
      status: 'View Log',
      statusColor: 'text-slate-500 bg-slate-50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="max-w-5xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Profile Header with Cover */}
        <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDJjLTQuNDE4IDAtOC0zLjU4Mi04LThzMy41ODItOCA4LTggOCAzLjU4MiA4IDgtMy41ODIgOC04IDh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
              <Camera size={18} />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex items-end gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-[1.5rem] bg-white p-1.5 shadow-xl">
                <div className="w-full h-full rounded-[1.2rem] bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-4xl font-black">
                  SC
                </div>
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-black text-slate-900">Dr. Sarah Chen</h1>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-wider">
                    Pro
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Senior Patent Strategist at InnovateTech Labs
                </p>
              </div>
              <div className="flex gap-3 pb-2">
                <Link
                  href="/settings"
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors active:scale-95"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/history"
                  className="px-5 py-2.5 bg-white border border-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors active:scale-95"
                >
                  View History
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className={`${stat.color} mx-auto mb-3`}>{stat.icon}</div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
                Edit <ExternalLink size={12} />
              </button>
            </div>
            <div className="space-y-4">
              {personalInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Activity */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900">Security & Activity</h3>
              <Link
                href="/settings"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                Manage <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-4">
              {securityItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
