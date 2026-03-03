'use client';

import { use } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pathname = usePathname();

  // When pathname is exactly /project/[id] (no sub-path), render without shell
  // so that the WelcomeScreen page renders standalone.
  const isWelcome = pathname === `/project/${id}`;

  if (isWelcome) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      <Sidebar projectId={id} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
