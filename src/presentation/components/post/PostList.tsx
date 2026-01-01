'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post, PostStatus } from '@/domain/entities/Post';
import { PostStatusBadge } from './PostStatusBadge';
import { Button } from '@/presentation/components/common/Button';
import { usePosts, useDeletePost, usePublishPost } from '@/presentation/hooks/queries/usePostQueries';
import { useToast } from '@/presentation/components/common/Toast';

interface PostListProps {
  initialStatus?: PostStatus;
}

export function PostList({ initialStatus }: PostListProps) {
  const [statusFilter, setStatusFilter] = useState<PostStatus | undefined>(initialStatus);
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  const { data, isLoading, error } = usePosts({
    status: statusFilter,
    page,
    limit: 10,
  });

  const deletePostMutation = useDeletePost();
  const publishPostMutation = usePublishPost();

  const handleDelete = async (post: Post) => {
    if (!confirm(`"${post.title}" 글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(post.id);
      showToast('글이 삭제되었습니다.', 'success');
    } catch {
      showToast('글 삭제에 실패했습니다.', 'error');
    }
  };

  const handleTogglePublish = async (post: Post) => {
    const willPublish = post.status === 'draft';
    const message = willPublish ? '글을 발행하시겠습니까?' : '글을 비공개로 전환하시겠습니까?';

    if (!confirm(message)) {
      return;
    }

    try {
      await publishPostMutation.mutateAsync({ id: post.id, publish: willPublish });
      showToast(willPublish ? '글이 발행되었습니다.' : '글이 비공개로 전환되었습니다.', 'success');
    } catch {
      showToast('상태 변경에 실패했습니다.', 'error');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p style={{ color: 'var(--error)' }}>글 목록을 불러오는데 실패했습니다.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>상태:</span>
        <div className="flex gap-1">
          <Button
            variant={statusFilter === undefined ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              setStatusFilter(undefined);
              setPage(1);
            }}
          >
            전체
          </Button>
          <Button
            variant={statusFilter === 'published' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              setStatusFilter('published');
              setPage(1);
            }}
          >
            발행됨
          </Button>
          <Button
            variant={statusFilter === 'draft' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              setStatusFilter('draft');
              setPage(1);
            }}
          >
            임시저장
          </Button>
        </div>
      </div>

      {/* Post List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: 'var(--primary)' }}
          />
        </div>
      ) : !data?.posts.length ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ color: 'var(--text-tertiary)' }}>글이 없습니다.</p>
          <Link href="/posts/new">
            <Button className="mt-4">새 글 작성</Button>
          </Link>
        </div>
      ) : (
        <>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <table className="min-w-full" style={{ borderColor: 'var(--border)' }}>
              <thead style={{ background: 'var(--surface-elevated)' }}>
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    제목
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    상태
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    조회수
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    작성일
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {data.posts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors duration-150 hover:bg-[var(--surface-hover)]"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/posts/${post.id}/edit`}
                          className="text-sm font-medium transition-colors duration-150 hover:text-[var(--primary)]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {post.title}
                        </Link>
                        <p
                          className="text-sm truncate max-w-md"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {post.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PostStatusBadge status={post.status} />
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {post.viewCount.toLocaleString()}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(post)}
                          disabled={publishPostMutation.isPending}
                        >
                          {post.status === 'draft' ? '발행' : '비공개'}
                        </Button>
                        <Link href={`/posts/${post.id}/edit`}>
                          <Button variant="outline" size="sm">
                            수정
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(post)}
                          disabled={deletePostMutation.isPending}
                        >
                          삭제
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </Button>
              <span
                className="flex items-center px-4 text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                {page} / {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
