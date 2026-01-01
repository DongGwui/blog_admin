'use client';

import { StatsCard, RecentPosts, QuickActions } from '@/presentation/components/dashboard';
import { useDashboardStats } from '@/presentation/hooks/useDashboardStats';

export default function DashboardPage() {
  const stats = useDashboardStats();

  return (
    <div className="space-y-6 pt-2">
      {/* Page Header */}
      <div className="animate-fade-in-up ml-2">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
            }}
          >
            <svg
              className="w-6 h-6"
              style={{ color: 'var(--primary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              대시보드
            </h1>
            <p
              className="text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              블로그 관리 현황을 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-fade-in-up animate-delay-100">
          <StatsCard
            title="전체 글"
            value={stats.isLoading ? '-' : stats.totalPosts}
            description={`발행 ${stats.publishedPosts} / 임시저장 ${stats.draftPosts}`}
            color="indigo"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </div>
        <div className="animate-fade-in-up animate-delay-200">
          <StatsCard
            title="카테고리"
            value={stats.isLoading ? '-' : stats.totalCategories}
            color="emerald"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />
        </div>
        <div className="animate-fade-in-up animate-delay-300">
          <StatsCard
            title="태그"
            value={stats.isLoading ? '-' : stats.totalTags}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            }
          />
        </div>
        <div className="animate-fade-in-up animate-delay-400">
          <StatsCard
            title="프로젝트"
            value={stats.isLoading ? '-' : stats.totalProjects}
            color="amber"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up animate-delay-500">
        <QuickActions />
      </div>

      {/* Recent Posts & System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in-up animate-delay-600">
          <RecentPosts />
        </div>

        {/* System Info */}
        <div
          className="rounded-2xl animate-fade-in-up animate-delay-700"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))',
              }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: 'var(--accent-cyan)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                시스템 정보
              </h3>
              <p
                className="text-sm"
                style={{ color: 'var(--text-tertiary)' }}
              >
                콘텐츠 현황 요약
              </p>
            </div>
          </div>

          {/* Stats List */}
          <div className="p-6 space-y-4">
            {/* Media Files */}
            <div
              className="flex justify-between items-center p-4 rounded-xl transition-colors duration-200 hover:bg-[var(--surface-hover)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(168, 85, 247, 0.1)' }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: 'var(--secondary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>미디어 파일</span>
              </div>
              <span
                className="font-semibold text-lg"
                style={{ color: 'var(--text-primary)' }}
              >
                {stats.isLoading ? '-' : stats.totalMedia}
                <span
                  className="text-sm font-normal ml-1"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  개
                </span>
              </span>
            </div>

            {/* Published Posts */}
            <div
              className="flex justify-between items-center p-4 rounded-xl transition-colors duration-200 hover:bg-[var(--surface-hover)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(16, 185, 129, 0.1)' }}
                >
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>발행된 글</span>
              </div>
              <span className="font-semibold text-lg text-emerald-500">
                {stats.isLoading ? '-' : stats.publishedPosts}
                <span
                  className="text-sm font-normal ml-1"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  개
                </span>
              </span>
            </div>

            {/* Draft Posts */}
            <div
              className="flex justify-between items-center p-4 rounded-xl transition-colors duration-200 hover:bg-[var(--surface-hover)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(245, 158, 11, 0.1)' }}
                >
                  <svg
                    className="w-5 h-5 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>임시저장 글</span>
              </div>
              <span className="font-semibold text-lg text-amber-500">
                {stats.isLoading ? '-' : stats.draftPosts}
                <span
                  className="text-sm font-normal ml-1"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  개
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
