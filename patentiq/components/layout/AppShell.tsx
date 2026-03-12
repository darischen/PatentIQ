'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
  projectId?: string;
}

export default function AppShell({ children, projectId }: AppShellProps) {
  const pathname = usePathname();

  // Don't show shell on welcome screen (just project creation)
  const isWelcome = projectId && pathname === `/project/${projectId}`;

  if (isWelcome) {
    return <>{children}</>;
  }

  // Show shell for all other app pages
  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      <Sidebar projectId={projectId} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
