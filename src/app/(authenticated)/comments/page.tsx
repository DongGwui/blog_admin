'use client';

import { CommentList } from '@/presentation/components/comment/CommentList';

export default function CommentsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          댓글 관리
        </h1>
        <p
          className="mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          giscus를 통해 작성된 GitHub Discussions 댓글을 관리합니다.
        </p>
      </div>
      <div className="max-w-4xl">
        <CommentList />
      </div>
    </div>
  );
}
