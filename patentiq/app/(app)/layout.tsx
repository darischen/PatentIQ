'use client';

import { ProjectProvider } from '@/lib/context/ProjectContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by fetching their profile
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.status === 401) {
          // Not authenticated - redirect to login
          router.push('/login');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        // Default to allowing access - server-side auth will catch issues
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <ProjectProvider>{children}</ProjectProvider>;
}
