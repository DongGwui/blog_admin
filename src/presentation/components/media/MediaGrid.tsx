'use client';

import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { Media } from '@/domain/entities/Media';
import { useDeleteMedia } from '@/presentation/hooks/useMediaQueries';
import { Button } from '@/presentation/components/common/Button';

// 파일 크기 포맷 함수 (컴포넌트 외부에 정의)
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 메모이제이션된 미디어 아이템 컴포넌트
interface MediaGridItemProps {
  item: Media;
  isSelected: boolean;
  selectable: boolean;
  deleteConfirmId: number | null;
  isDeleting: boolean;
  onSelect?: (media: Media) => void;
  onDeleteConfirm: (id: number | null) => void;
  onDelete: (id: number) => void;
}

const MediaGridItem = memo(function MediaGridItem({
  item,
  isSelected,
  selectable,
  deleteConfirmId,
  isDeleting,
  onSelect,
  onDeleteConfirm,
  onDelete,
}: MediaGridItemProps) {
  const isConfirming = deleteConfirmId === item.id;

  return (
    <div
      className={`relative group rounded-xl overflow-hidden transition-all ${
        isSelected
          ? 'ring-2 ring-[var(--primary)]'
          : 'hover:ring-1 hover:ring-[var(--border)]'
      } ${selectable ? 'cursor-pointer' : ''}`}
      style={{
        background: 'var(--surface)',
        border: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
      }}
      onClick={() => selectable && onSelect?.(item)}
    >
      {/* Image */}
      <div
        className="aspect-square relative"
        style={{ background: 'var(--surface-elevated)' }}
      >
        <Image
          src={item.url}
          alt={item.originalName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Selection overlay */}
      {selectable && isSelected && (
        <div
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'var(--primary)' }}
        >
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
            <p className="text-white/70">{formatFileSize(item.size)}</p>
          </div>
          {isConfirming ? (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
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
                  onDeleteConfirm(null);
                }}
              >
                취소
              </Button>
            </div>
          ) : (
            <button
              className="p-1 rounded text-white transition-colors"
              style={{ background: 'var(--error)' }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConfirm(item.id);
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
});

interface MediaGridProps {
  media: Media[];
  selectable?: boolean;
  selectedIds?: number[];
  onSelect?: (media: Media) => void;
}

export function MediaGrid({
  media,
  selectable = false,
  selectedIds = [],
  onSelect,
}: MediaGridProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const deleteMutation = useDeleteMedia();

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [deleteMutation]);

  const handleDeleteConfirm = useCallback((id: number | null) => {
    setDeleteConfirmId(id);
  }, []);

  if (media.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-xl"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-tertiary)',
        }}
      >
        업로드된 미디어가 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {media.map((item) => (
        <MediaGridItem
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          selectable={selectable}
          deleteConfirmId={deleteConfirmId}
          isDeleting={deleteMutation.isPending && deleteConfirmId === item.id}
          onSelect={onSelect}
          onDeleteConfirm={handleDeleteConfirm}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
