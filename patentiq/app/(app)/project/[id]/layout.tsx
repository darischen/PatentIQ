'use client';

import { use } from 'react';
import AppShell from '@/components/layout/AppShell';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <AppShell projectId={id}>{children}</AppShell>;
}
