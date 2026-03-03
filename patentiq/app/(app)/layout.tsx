'use client';

import { ProjectProvider } from '@/lib/context/ProjectContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <ProjectProvider>{children}</ProjectProvider>;
}
