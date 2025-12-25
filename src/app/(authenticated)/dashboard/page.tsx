'use client';

import { StatsCard, RecentPosts, QuickActions } from '@/presentation/components/dashboard';
import { useDashboardStats } from '@/presentation/hooks/useDashboardStats';

export default function DashboardPage() {
  const stats = useDashboardStats();

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-1">블로그 관리 현황을 확인하세요.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="전체 글"
          value={stats.isLoading ? '-' : stats.totalPosts}
          description={`발행 ${stats.publishedPosts} / 임시저장 ${stats.draftPosts}`}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <StatsCard
          title="카테고리"
          value={stats.isLoading ? '-' : stats.totalCategories}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <StatsCard
          title="태그"
          value={stats.isLoading ? '-' : stats.totalTags}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          }
        />
        <StatsCard
          title="프로젝트"
          value={stats.isLoading ? '-' : stats.totalProjects}
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPosts />

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">시스템 정보</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">미디어 파일</span>
              <span className="font-medium">{stats.isLoading ? '-' : stats.totalMedia}개</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">발행된 글</span>
              <span className="font-medium text-green-600">
                {stats.isLoading ? '-' : stats.publishedPosts}개
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">임시저장 글</span>
              <span className="font-medium text-yellow-600">
                {stats.isLoading ? '-' : stats.draftPosts}개
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
