'use client';

import Link from 'next/link';
import { usePosts } from '@/presentation/hooks/queries/usePostQueries';

export function RecentPosts() {
  const { data, isLoading, error } = usePosts({ limit: 5 });

  if (isLoading) {
    return (
      <div
        className="rounded-2xl"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="p-6 border-b border-[var(--border)]">
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            최근 글
          </h3>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-shimmer rounded-lg p-4">
              <div
                className="h-4 rounded w-3/4 mb-2"
                style={{ background: 'var(--border)' }}
              />
              <div
                className="h-3 rounded w-1/2"
                style={{ background: 'var(--border-light)' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="text-center py-8"
          style={{ color: 'var(--error)' }}
        >
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>글을 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  const posts = data?.posts || [];

  return (
    <div
      className="rounded-2xl"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
            }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--secondary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              최근 글
            </h3>
            <p
              className="text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              최근 작성된 글 목록
            </p>
          </div>
        </div>
        <Link
          href="/posts"
          className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          style={{
            color: 'var(--primary)',
            background: 'rgba(124, 58, 237, 0.1)',
          }}
        >
          전체 보기
        </Link>
      </div>

      {/* Posts List */}
      {posts.length > 0 ? (
        <ul className="divide-y divide-[var(--border)]">
          {posts.map((post, index) => (
            <li
              key={post.id}
              className="group"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <Link
                href={`/posts/${post.id}/edit`}
                className="block p-5 transition-colors duration-200 hover:bg-[var(--surface-hover)]"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <p
                      className="font-medium truncate group-hover:text-[var(--primary)] transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {post.title}
                    </p>
                    {/* Date */}
                    <p
                      className="text-sm mt-1"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {post.status === 'published' ? '발행됨' : '임시저장'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-12 text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
            }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: 'var(--text-tertiary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p
            className="mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            아직 작성된 글이 없습니다
          </p>
          <Link
            href="/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            첫 글 작성하기
          </Link>
        </div>
      )}
    </div>
  );
}
