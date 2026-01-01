'use client';

import Link from 'next/link';

interface QuickAction {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
}

const actions: QuickAction[] = [
  {
    href: '/posts/new',
    label: '새 글 작성',
    description: '블로그에 새 글을 작성합니다',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    shadowColor: 'rgba(99, 102, 241, 0.4)',
  },
  {
    href: '/media',
    label: '미디어 업로드',
    description: '이미지를 업로드합니다',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-cyan-500 to-blue-500',
    shadowColor: 'rgba(6, 182, 212, 0.4)',
  },
  {
    href: '/projects',
    label: '프로젝트 추가',
    description: '포트폴리오 프로젝트를 추가합니다',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-teal-500',
    shadowColor: 'rgba(16, 185, 129, 0.4)',
  },
];

export function QuickActions() {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
          }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: 'var(--primary)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            빠른 작업
          </h3>
          <p
            className="text-sm"
            style={{ color: 'var(--text-tertiary)' }}
          >
            자주 사용하는 기능에 빠르게 접근하세요
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            }}
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Shine effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
              }}
            />

            {/* Glow effect on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                boxShadow: `0 20px 40px ${action.shadowColor}`,
              }}
            />

            {/* Content */}
            <div className="relative flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                {action.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="font-semibold text-white">{action.label}</p>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-white/60 transform group-hover:translate-x-1 group-hover:text-white transition-all duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
