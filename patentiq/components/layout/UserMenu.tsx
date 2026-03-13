'use client';

import Link from 'next/link';
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserInfo {
  name?: string;
  email?: string;
  picture?: string;
}

interface UserMenuProps {
  onClose: () => void;
}

export default function UserMenu({ onClose }: UserMenuProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from the session endpoint
    const fetchUser = async () => {
      try {
        const response = await fetch('/auth/profile');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
      {/* User Info */}
      <div className="p-4 border-b border-slate-100">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
        ) : user ? (
          <>
            <p className="font-semibold text-slate-900 text-sm">{user.name || 'User'}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </>
        ) : null}
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <UserIcon size={16} />
          Profile
        </Link>

        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Settings size={16} />
          Settings
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-100 p-2">
        <a
          href="/auth/logout"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded"
        >
          <LogOut size={16} />
          Logout
        </a>
      </div>
    </div>
  );
}
