'use client';

import { MediaList } from '@/presentation/components/media/MediaList';

export default function MediaPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          미디어 관리
        </h1>
        <p
          className="mt-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          이미지와 미디어 파일을 관리합니다.
        </p>
      </div>
      <MediaList />
    </div>
  );
}
