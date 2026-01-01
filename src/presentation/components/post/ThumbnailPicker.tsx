'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageInsertModal } from '@/presentation/components/media/ImageInsertModal';

interface ThumbnailPickerProps {
  value: string;
  onChange: (url: string) => void;
}

export function ThumbnailPicker({ value, onChange }: ThumbnailPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleInsert = (markdown: string) => {
    // Extract URL from markdown: ![alt](url) -> url
    const match = markdown.match(/!\[.*?\]\((.*?)\)/);
    if (match && match[1]) {
      onChange(match[1]);
      setImageError(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setImageError(false);
  };

  return (
    <div>
      {value ? (
        <div className="relative group">
          {/* Thumbnail Preview */}
          <div
            className="relative w-full aspect-video rounded-lg overflow-hidden"
            style={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
            }}
          >
            {imageError ? (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">이미지를 불러올 수 없습니다</span>
              </div>
            ) : (
              <Image
                src={value}
                alt="썸네일 미리보기"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                onError={() => setImageError(true)}
                unoptimized
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              style={{
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            >
              변경
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              style={{
                background: 'var(--error)',
                color: 'white',
              }}
            >
              제거
            </button>
          </div>

          {/* URL Display */}
          <p
            className="mt-2 text-xs truncate"
            style={{ color: 'var(--text-tertiary)' }}
            title={value}
          >
            {value}
          </p>
        </div>
      ) : (
        /* Empty State */
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-tertiary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-tertiary)';
          }}
        >
          <svg
            className="w-12 h-12 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm font-medium">썸네일 선택</span>
          <span className="text-xs mt-1">클릭하여 이미지를 선택하세요</span>
        </button>
      )}

      {/* Image Insert Modal */}
      <ImageInsertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInsert={handleInsert}
      />
    </div>
  );
}
