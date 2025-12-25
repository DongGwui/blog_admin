'use client';

import { PostStatus } from '@/domain/entities/Post';

interface PostStatusBadgeProps {
  status: PostStatus;
  className?: string;
}

const statusConfig: Record<PostStatus, { label: string; className: string }> = {
  draft: {
    label: '임시저장',
    className: 'bg-yellow-100 text-yellow-800',
  },
  published: {
    label: '발행됨',
    className: 'bg-green-100 text-green-800',
  },
};

export function PostStatusBadge({ status, className = '' }: PostStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
