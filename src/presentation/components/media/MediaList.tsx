'use client';

import { useState } from 'react';
import { useMediaList } from '@/presentation/hooks/useMediaQueries';
import { MediaUploader } from './MediaUploader';
import { MediaGrid } from './MediaGrid';
import { Button } from '@/presentation/components/common/Button';

export function MediaList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useMediaList({ page, limit: 20 });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">미디어를 불러오는데 실패했습니다.</p>
        <Button onClick={() => refetch()}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <MediaUploader />

      {/* Media Grid */}
      {data && <MediaGrid media={data.media} />}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="py-2 px-4 text-sm text-gray-600">
            {page} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
