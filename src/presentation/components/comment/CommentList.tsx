'use client';

import { useState } from 'react';
import { Comment } from '@/domain/entities/Comment';
import { MinimizeReason } from '@/domain/repositories/ICommentRepository';
import {
  useInfiniteComments,
  useDeleteComment,
  useMinimizeComment,
  useUnminimizeComment,
} from '@/presentation/hooks/useCommentQueries';
import { CommentCard } from './CommentCard';
import { CommentFilters } from './CommentFilters';
import { Button } from '@/presentation/components/common/Button';
import { useToast } from '@/presentation/components/common/Toast';

export function CommentList() {
  const [postSlugFilter, setPostSlugFilter] = useState<string>('');
  const { showToast } = useToast();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteComments({
    first: 20,
    postSlug: postSlugFilter || undefined,
  });

  const deleteComment = useDeleteComment();
  const minimizeComment = useMinimizeComment();
  const unminimizeComment = useUnminimizeComment();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [minimizingId, setMinimizingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Comment | null>(null);

  const handleDelete = async (comment: Comment) => {
    if (!confirmDelete || confirmDelete.id !== comment.id) {
      setConfirmDelete(comment);
      return;
    }

    setDeletingId(comment.id);
    try {
      await deleteComment.mutateAsync(comment.id);
      setConfirmDelete(null);
      showToast('댓글이 삭제되었습니다.', 'success');
    } catch (error) {
      console.error('Delete failed:', error);
      showToast('댓글 삭제에 실패했습니다.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleMinimize = async (comment: Comment, reason: MinimizeReason) => {
    setMinimizingId(comment.id);
    try {
      await minimizeComment.mutateAsync({ id: comment.id, reason });
      showToast('댓글이 숨김 처리되었습니다.', 'success');
    } catch (error) {
      console.error('Minimize failed:', error);
      showToast('댓글 숨김 처리에 실패했습니다.', 'error');
    } finally {
      setMinimizingId(null);
    }
  };

  const handleUnminimize = async (comment: Comment) => {
    setMinimizingId(comment.id);
    try {
      await unminimizeComment.mutateAsync(comment.id);
      showToast('댓글 숨김이 해제되었습니다.', 'success');
    } catch (error) {
      console.error('Unminimize failed:', error);
      showToast('댓글 숨김 해제에 실패했습니다.', 'error');
    } finally {
      setMinimizingId(null);
    }
  };

  // 모든 페이지의 댓글을 하나의 배열로 합침
  const allComments = data?.pages.flatMap((page) => page.comments) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CommentFilters value={postSlugFilter} onChange={setPostSlugFilter} />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-xl animate-pulse"
              style={{ background: 'var(--surface-elevated)' }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <CommentFilters value={postSlugFilter} onChange={setPostSlugFilter} />
        <div
          className="text-center py-12 rounded-xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p className="mb-4" style={{ color: 'var(--error)' }}>
            댓글을 불러오는데 실패했습니다.
          </p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
            GitHub 환경 변수가 올바르게 설정되었는지 확인해주세요.
          </p>
          <Button onClick={() => refetch()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <CommentFilters value={postSlugFilter} onChange={setPostSlugFilter} />

      {/* Stats */}
      <div
        className="flex items-center gap-4 p-3 rounded-lg"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          총 <strong style={{ color: 'var(--text-primary)' }}>{allComments.length}</strong>개의 댓글
        </span>
        {postSlugFilter && (
          <span
            className="text-xs px-2 py-1 rounded-full"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
          >
            필터: {postSlugFilter}
          </span>
        )}
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div
          className="p-4 rounded-xl"
          style={{
            background: 'var(--error-light)',
            border: '1px solid var(--error)',
          }}
        >
          <p className="mb-3" style={{ color: 'var(--error)' }}>
            이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            작성자: {confirmDelete.author?.login || '익명'}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(confirmDelete)}
              disabled={deletingId === confirmDelete.id}
            >
              {deletingId === confirmDelete.id ? '삭제 중...' : '삭제 확인'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmDelete(null)}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* Comment List */}
      {allComments.length > 0 ? (
        <div className="space-y-3">
          {allComments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDelete={handleDelete}
              onMinimize={handleMinimize}
              onUnminimize={handleUnminimize}
              isDeleting={deletingId === comment.id}
              isMinimizing={minimizingId === comment.id}
            />
          ))}

          {/* Load More */}
          {hasNextPage && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          className="text-center py-12 rounded-xl"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-tertiary)',
          }}
        >
          {postSlugFilter ? (
            <>
              <p>&quot;{postSlugFilter}&quot; 포스트에 댓글이 없습니다.</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setPostSlugFilter('')}
              >
                필터 초기화
              </Button>
            </>
          ) : (
            <p>아직 댓글이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
