'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/context/AuthContext';
import { Button } from '@/presentation/components/common/Button';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
        </div>

        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-gray-700 hidden sm:block">
              {user?.username}
            </span>
          </div>

          {/* Logout Button */}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
}
