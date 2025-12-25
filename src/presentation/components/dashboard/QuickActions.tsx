'use client';

import Link from 'next/link';

interface QuickAction {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const actions: QuickAction[] = [
  {
    href: '/posts/new',
    label: '새 글 작성',
    description: '블로그에 새 글을 작성합니다',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    href: '/media',
    label: '미디어 업로드',
    description: '이미지를 업로드합니다',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    href: '/projects',
    label: '프로젝트 추가',
    description: '포트폴리오 프로젝트를 추가합니다',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">빠른 작업</h3>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} text-white rounded-lg p-4 transition-colors`}
          >
            <div className="flex items-center gap-3">
              {action.icon}
              <div>
                <p className="font-medium">{action.label}</p>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
