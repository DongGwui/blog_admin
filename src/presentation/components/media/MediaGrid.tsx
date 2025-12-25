'use client';

import { useState } from 'react';
import { Media } from '@/domain/entities/Media';
import { useDeleteMedia } from '@/presentation/hooks/useMediaQueries';
import { Button } from '@/presentation/components/common/Button';

interface MediaGridProps {
  media: Media[];
  selectable?: boolean;
  selectedIds?: number[];
  onSelect?: (media: Media) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaGrid({
  media,
  selectable = false,
  selectedIds = [],
  onSelect,
}: MediaGridProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const deleteMutation = useDeleteMedia();

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        업로드된 미디어가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {media.map((item) => {
        const isSelected = selectedIds.includes(item.id);
        const isDeleting = deleteMutation.isPending && deleteConfirmId === item.id;

        return (
          <div
            key={item.id}
            className={`relative group bg-white rounded-lg overflow-hidden shadow-sm border-2 transition-all ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-transparent hover:border-gray-200'
            } ${selectable ? 'cursor-pointer' : ''}`}
            onClick={() => selectable && onSelect?.(item)}
          >
            {/* Image */}
            <div className="aspect-square bg-gray-100">
              <img
                src={item.url}
                alt={item.originalName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Selection overlay */}
            {selectable && isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            {/* Hover overlay with info and delete */}
            {!selectable && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                <div className="text-white text-xs truncate flex-1 mr-2">
                  <p className="font-medium truncate">{item.originalName}</p>
                  <p className="text-gray-300">{formatFileSize(item.size)}</p>
                </div>
                {deleteConfirmId === item.id ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? '...' : '삭제'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(null);
                      }}
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <button
                    className="p-1 bg-red-500 rounded text-white hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(item.id);
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
