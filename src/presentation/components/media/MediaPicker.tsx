'use client';

import { useState } from 'react';
import { Media } from '@/domain/entities/Media';
import { useMediaList } from '@/presentation/hooks/useMediaQueries';
import { MediaUploader } from './MediaUploader';
import { MediaGrid } from './MediaGrid';
import { Button } from '@/presentation/components/common/Button';

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  selectedId?: number;
}

export function MediaPicker({
  isOpen,
  onClose,
  onSelect,
  selectedId,
}: MediaPickerProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useMediaList({ page, limit: 20 });

  if (!isOpen) return null;

  const handleSelect = (media: Media) => {
    onSelect(media);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">미디어 선택</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Upload Area */}
          <div className="mb-6">
            <MediaUploader onUploadComplete={() => refetch()} />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Media Grid */}
          {data && (
            <MediaGrid
              media={data.media}
              selectable
              selectedIds={selectedId ? [selectedId] : []}
              onSelect={handleSelect}
            />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </Button>
              <span className="py-1 px-3 text-sm text-gray-600">
                {page} / {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
