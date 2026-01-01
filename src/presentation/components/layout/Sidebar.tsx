'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: '대시보드',
    gradient: 'from-indigo-500 to-purple-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/posts',
    label: '글 관리',
    gradient: 'from-purple-500 to-pink-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/categories',
    label: '카테고리',
    gradient: 'from-pink-500 to-rose-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    href: '/tags',
    label: '태그',
    gradient: 'from-amber-500 to-orange-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  {
    href: '/media',
    label: '미디어',
    gradient: 'from-cyan-500 to-blue-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/projects',
    label: '프로젝트',
    gradient: 'from-emerald-500 to-teal-500',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-40 transition-colors duration-300 border-r"
      style={{
        background: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Logo - height matches header (h-16 = 64px) */}
      <div
        className="relative h-16 px-6 flex items-center border-b transition-colors duration-300"
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-3 group">
          {/* Logo icon with gradient background */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
              }}
            />
            <div
              className="relative w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>

          {/* Logo text */}
          <div>
            <span
              className="text-base font-bold block leading-tight"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Blog Admin
            </span>
            <span
              className="text-xs transition-colors duration-300"
              style={{ color: 'var(--sidebar-text-muted)' }}
            >
              Management
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative block"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Active indicator - gradient bar */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `linear-gradient(180deg, ${item.gradient.includes('indigo') ? '#6366f1' : item.gradient.includes('purple') ? '#a855f7' : item.gradient.includes('pink') ? '#ec4899' : item.gradient.includes('amber') ? '#f59e0b' : item.gradient.includes('cyan') ? '#06b6d4' : '#10b981'}, ${item.gradient.includes('purple') && item.gradient.includes('indigo') ? '#a855f7' : item.gradient.includes('pink') && item.gradient.includes('purple') ? '#ec4899' : item.gradient.includes('rose') ? '#f43f5e' : item.gradient.includes('orange') ? '#f97316' : item.gradient.includes('blue') ? '#3b82f6' : '#14b8a6'})`,
                }}
              />

              {/* Nav item container */}
              <div
                className="relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ml-2"
                style={{
                  color: isActive ? 'white' : 'var(--sidebar-text-muted)',
                }}
              >
                {/* Active background - solid color for better readability */}
                {isActive && (
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.gradient}`}
                    style={{ opacity: 0.9 }}
                  />
                )}

                {/* Hover background */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'var(--sidebar-hover)' }}
                  />
                )}

                {/* Icon container */}
                <div
                  className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--sidebar-hover)',
                    color: isActive ? 'white' : 'var(--sidebar-text-muted)',
                  }}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className="relative font-medium text-sm transition-colors duration-200"
                  style={{ color: isActive ? 'white' : 'var(--sidebar-text)' }}
                >
                  {item.label}
                </span>

                {/* Hover arrow indicator */}
                <svg
                  className={`relative w-4 h-4 ml-auto transition-all duration-200 ${
                    isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                  }`}
                  style={{ color: isActive ? 'white' : 'var(--sidebar-text-muted)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Divider with gradient */}
      <div
        className="mx-4 h-px transition-colors duration-300"
        style={{ background: 'var(--sidebar-border)' }}
      />

      {/* Footer */}
      <div className="relative p-4">
        {/* Version badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span
              className="text-xs transition-colors duration-300"
              style={{ color: 'var(--sidebar-text-muted)' }}
            >
              System Online
            </span>
          </div>
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{
              background: 'var(--sidebar-hover)',
              color: 'var(--primary)',
            }}
          >
            v1.0
          </span>
        </div>
      </div>
    </aside>
  );
}
