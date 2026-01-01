'use client';

import { TagList } from '@/presentation/components/tag/TagList';

export default function TagsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          태그 관리
        </h1>
        <p
          className="mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          블로그 글의 태그를 관리합니다.
        </p>
      </div>
      <div className="max-w-3xl">
        <TagList />
      </div>
    </div>
  );
}
