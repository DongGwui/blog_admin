'use client';

import { useState } from 'react';
import { Comment, formatCommentDate, getCommentPreview } from '@/domain/entities/Comment';
import { MinimizeReason } from '@/domain/repositories/ICommentRepository';
import { Button } from '@/presentation/components/common/Button';

interface CommentCardProps {
  comment: Comment;
  onDelete: (comment: Comment) => void;
  onMinimize: (comment: Comment, reason: MinimizeReason) => void;
  onUnminimize: (comment: Comment) => void;
  isDeleting?: boolean;
  isMinimizing?: boolean;
}

export function CommentCard({
  comment,
  onDelete,
  onMinimize,
  onUnminimize,
  isDeleting,
  isMinimizing,
}: CommentCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200"
      style={{
        background: comment.isMinimized ? 'var(--surface)' : 'var(--surface-elevated)',
        border: `1px solid ${comment.isMinimized ? 'var(--warning)' : 'var(--border)'}`,
        opacity: comment.isMinimized ? 0.7 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          {comment.author ? (
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.login}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{ background: 'var(--surface)' }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}

          {/* Author & Meta */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {comment.author?.login || '익명'}
              </span>
              {comment.isMinimized && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--warning)', color: 'white' }}
                >
                  숨김
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <span>{formatCommentDate(comment.createdAt)}</span>
              <span>·</span>
              <a
                href={comment.discussionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate max-w-[200px]"
                style={{ color: 'var(--primary)' }}
              >
                {comment.postSlug}
              </a>
            </div>
          </div>
        </div>

        {/* Actions Toggle */}
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 rounded-lg transition-colors flex-shrink-0"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div
          className="mt-3 p-2 rounded-lg flex flex-wrap gap-2"
          style={{ background: 'var(--surface)' }}
        >
          {comment.isMinimized ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUnminimize(comment)}
              disabled={isMinimizing}
            >
              {isMinimizing ? '처리 중...' : '숨김 해제'}
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMinimize(comment, 'SPAM')}
                disabled={isMinimizing}
              >
                스팸
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMinimize(comment, 'ABUSE')}
                disabled={isMinimizing}
              >
                악성
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMinimize(comment, 'OFF_TOPIC')}
                disabled={isMinimizing}
              >
                주제 벗어남
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(comment)}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="mt-3">
        <p
          className="text-sm whitespace-pre-wrap"
          style={{ color: 'var(--text-primary)' }}
        >
          {getCommentPreview(comment.body, 300)}
        </p>
      </div>

      {/* Replies */}
      {comment.replyCount > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm flex items-center gap-1 transition-colors"
            style={{ color: 'var(--primary)' }}
          >
            <svg
              className={`w-4 h-4 transition-transform ${showReplies ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
            답글 {comment.replyCount}개
          </button>

          {showReplies && (
            <div className="mt-2 pl-4 space-y-2 border-l-2" style={{ borderColor: 'var(--border)' }}>
              {comment.replies.map((reply) => (
                <div key={reply.id} className="py-2">
                  <div className="flex items-center gap-2 mb-1">
                    {reply.author ? (
                      <img
                        src={reply.author.avatarUrl}
                        alt={reply.author.login}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--surface)' }}
                      >
                        <svg className="w-3 h-3" style={{ color: 'var(--text-tertiary)' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {reply.author?.login || '익명'}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatCommentDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {reply.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
