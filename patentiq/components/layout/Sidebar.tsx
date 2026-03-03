'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  Layers,
  FileSearch,
  LogOut,
  Grid,
  History,
  HelpCircle,
  Settings,
  Trash2,
} from 'lucide-react';

interface SidebarProps {
  projectId: string;
}

export default function Sidebar({ projectId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    {
      label: 'Baseline Summary',
      href: `/project/${projectId}/dashboard`,
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: 'Strategy Sandbox',
      href: `/project/${projectId}/sandbox`,
      icon: <Compass size={20} />,
    },
    {
      label: 'Feature Heatmap',
      href: `/project/${projectId}/heatmap`,
      icon: <Layers size={20} />,
    },
    {
      label: 'Prior Art Explorer',
      href: `/project/${projectId}/explorer`,
      icon: <FileSearch size={20} />,
    },
  ];

  const otherItems = [
    { label: 'Analysis History', href: '/history', icon: <History size={20} /> },
    { label: 'Trash', href: '/projects/trash', icon: <Trash2 size={20} /> },
    { label: 'Help & Docs', href: '/help', icon: <HelpCircle size={20} /> },
    { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <aside className="w-72 h-full bg-white border-r border-slate-100 flex flex-col py-8 px-6 shadow-sm z-10">
      {/* Logo */}
      <Link
        href="/projects"
        className="flex items-center gap-3 mb-12 px-2 cursor-pointer group"
      >
        <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
          <Grid className="text-white w-6 h-6" />
        </div>
        <span className="text-[#1e293b] font-bold text-xl tracking-tight group-hover:text-indigo-600 transition-colors">
          PatentIQ
        </span>
      </Link>

      <div className="flex-1 space-y-10">
        {/* Navigation */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
            Navigation
          </p>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-[#1e293b] text-white shadow-lg shadow-slate-200'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Others */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
            Others
          </p>
          <div className="space-y-1">
            {otherItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-[#1e293b] text-white shadow-lg shadow-slate-200'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-medium text-sm mt-auto active:scale-95 cursor-pointer"
      >
        <LogOut size={20} />
        Log Out
      </button>
    </aside>
  );
}
