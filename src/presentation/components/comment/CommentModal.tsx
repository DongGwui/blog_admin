'use client';

import { useEffect, useState } from 'react';
import { Comment } from '@/domain/entities/Comment';
import { MinimizeReason } from '@/domain/repositories/ICommentRepository';
import {
  useInfiniteComments,
  useDeleteComment,
  useMinimizeComment,
  useUnminimizeComment,
} from '@/presentation/hooks/useCommentQueries';
import { CommentCard } from './CommentCard';
import { Button } from '@/presentation/components/common/Button';
import { useToast } from '@/presentation/components/common/Toast';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postSlug: string;
  postTitle: string;
}

export function CommentModal({ isOpen, onClose, postSlug, postTitle }: CommentModalProps) {
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
    postSlug,
  });

  const deleteComment = useDeleteComment();
  const minimizeComment = useMinimizeComment();
  const unminimizeComment = useUnminimizeComment();

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [minimizingId, setMinimizingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Comment | null>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

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

  const allComments = data?.pages.flatMap((page) => page.comments) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-elevated)' }}
        >
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              댓글 관리
            </h2>
            <p className="text-sm truncate max-w-md" style={{ color: 'var(--text-tertiary)' }}>
              {postTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-[var(--surface-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div
            className="flex items-center gap-4 p-3 rounded-lg mb-4"
            style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
          >
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              총 <strong style={{ color: 'var(--text-primary)' }}>{allComments.length}</strong>개의 댓글
            </span>
          </div>

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div
              className="p-4 rounded-xl mb-4"
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

          {/* Loading */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl animate-pulse"
                  style={{ background: 'var(--surface-elevated)' }}
                />
              ))}
            </div>
          ) : error ? (
            <div
              className="text-center py-8 rounded-xl"
              style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)' }}
            >
              <p className="mb-4" style={{ color: 'var(--error)' }}>
                댓글을 불러오는데 실패했습니다.
              </p>
              <Button onClick={() => refetch()}>다시 시도</Button>
            </div>
          ) : allComments.length > 0 ? (
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
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-tertiary)',
              }}
            >
              <svg
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: 'var(--text-tertiary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p>이 글에 댓글이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
