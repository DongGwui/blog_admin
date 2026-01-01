'use client';

import Link from 'next/link';
import { Button } from '@/presentation/components/common/Button';
import { PostList } from '@/presentation/components/post/PostList';

export default function PostsPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            글 관리
          </h1>
          <p
            className="mt-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            블로그 글을 관리합니다.
          </p>
        </div>
        <Link href="/posts/new">
          <Button>새 글 작성</Button>
        </Link>
      </div>
      <PostList />
    </div>
  );
}
