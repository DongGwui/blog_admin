'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/context/AuthContext';
import { ThemeToggle, useTheme } from '@/presentation/context/ThemeContext';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 transition-colors duration-300"
      style={{
        background: 'var(--sidebar-bg)',
        borderBottom: '1px solid var(--sidebar-border)',
      }}
    >

      <div className="h-full px-6 flex justify-between items-center relative">
        {/* Title Section */}
        <div className="flex items-center gap-4">
          {title && (
            <h1
              className="text-xl font-bold"
              style={{
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #c7d2fe 0%, #e9d5ff 50%, #fce7f3 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {title}
            </h1>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle size="sm" variant={theme === 'dark' ? 'dark' : 'light'} />

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--sidebar-border)]" />

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Avatar with gradient border */}
            <div className="relative group">
              <div
                className="absolute -inset-0.5 rounded-full opacity-75 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                }}
              />
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            {/* Username */}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--sidebar-text)]">
                {user?.username}
              </p>
              <p className="text-xs text-[var(--sidebar-text-muted)]">
                Administrator
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--sidebar-border)] hidden sm:block" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-[var(--sidebar-hover)] group text-[var(--sidebar-text-muted)]"
          >
            <svg
              className="w-5 h-5 transition-colors duration-200 group-hover:text-rose-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm font-medium hidden sm:inline group-hover:text-rose-400 transition-colors duration-200">
              로그아웃
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
