'use client';

import { useState, useCallback, memo, useMemo } from 'react';
import Link from 'next/link';
import { Post, PostStatus } from '@/domain/entities/Post';
import { PostStatusBadge } from './PostStatusBadge';
import { Button } from '@/presentation/components/common/Button';
import { usePosts, useDeletePost, usePublishPost } from '@/presentation/hooks/queries/usePostQueries';
import { useToast } from '@/presentation/components/common/Toast';

// 날짜 포맷 함수 (컴포넌트 외부에 정의하여 재생성 방지)
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// 메모이제이션된 테이블 행 컴포넌트
interface PostListRowProps {
  post: Post;
  onDelete: (post: Post) => void;
  onTogglePublish: (post: Post) => void;
  isDeleting: boolean;
  isPublishing: boolean;
}

const PostListRow = memo(function PostListRow({
  post,
  onDelete,
  onTogglePublish,
  isDeleting,
  isPublishing,
}: PostListRowProps) {
  return (
    <tr className="transition-colors duration-150 hover:bg-[var(--surface-hover)]">
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
            onClick={() => onTogglePublish(post)}
            disabled={isPublishing}
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
            onClick={() => onDelete(post)}
            disabled={isDeleting}
          >
            삭제
          </Button>
        </div>
      </td>
    </tr>
  );
});

// 메모이제이션된 필터 버튼 컴포넌트
interface FilterButtonsProps {
  statusFilter: PostStatus | undefined;
  onFilterChange: (status: PostStatus | undefined) => void;
}

const FilterButtons = memo(function FilterButtons({
  statusFilter,
  onFilterChange,
}: FilterButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>상태:</span>
      <div className="flex gap-1">
        <Button
          variant={statusFilter === undefined ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange(undefined)}
        >
          전체
        </Button>
        <Button
          variant={statusFilter === 'published' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('published')}
        >
          발행됨
        </Button>
        <Button
          variant={statusFilter === 'draft' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange('draft')}
        >
          임시저장
        </Button>
      </div>
    </div>
  );
});

interface PostListProps {
  initialStatus?: PostStatus;
}

export function PostList({ initialStatus }: PostListProps) {
  const [statusFilter, setStatusFilter] = useState<PostStatus | undefined>(initialStatus);
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  // 쿼리 파라미터 메모이제이션
  const queryParams = useMemo(() => ({
    status: statusFilter,
    page,
    limit: 10,
  }), [statusFilter, page]);

  const { data, isLoading, error } = usePosts(queryParams);
  const deletePostMutation = useDeletePost();
  const publishPostMutation = usePublishPost();

  // 콜백 함수 메모이제이션
  const handleDelete = useCallback(async (post: Post) => {
    if (!confirm(`"${post.title}" 글을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(post.id);
      showToast('글이 삭제되었습니다.', 'success');
    } catch {
      showToast('글 삭제에 실패했습니다.', 'error');
    }
  }, [deletePostMutation, showToast]);

  const handleTogglePublish = useCallback(async (post: Post) => {
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
  }, [publishPostMutation, showToast]);

  const handleFilterChange = useCallback((status: PostStatus | undefined) => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    if (data) {
      setPage((p) => Math.min(data.totalPages, p + 1));
    }
  }, [data]);

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
      <FilterButtons statusFilter={statusFilter} onFilterChange={handleFilterChange} />

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
                  <PostListRow
                    key={post.id}
                    post={post}
                    onDelete={handleDelete}
                    onTogglePublish={handleTogglePublish}
                    isDeleting={deletePostMutation.isPending}
                    isPublishing={publishPostMutation.isPending}
                  />
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
                onClick={handlePrevPage}
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
                onClick={handleNextPage}
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
