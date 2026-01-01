'use client';

import { useCallback, useState } from 'react';
import { useUploadMedia } from '@/presentation/hooks/useMediaQueries';

interface MediaUploaderProps {
  onUploadComplete?: () => void;
}

export function MediaUploader({ onUploadComplete }: MediaUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const uploadMutation = useUploadMedia();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));

      for (const file of imageFiles) {
        try {
          await uploadMutation.mutateAsync(file);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
      onUploadComplete?.();
    },
    [uploadMutation, onUploadComplete]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      for (const file of Array.from(files)) {
        try {
          await uploadMutation.mutateAsync(file);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
      onUploadComplete?.();
      e.target.value = '';
    },
    [uploadMutation, onUploadComplete]
  );

  return (
    <div
      className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all"
      style={{
        background: isDragOver ? 'var(--primary-light)' : 'var(--surface)',
        borderColor: isDragOver ? 'var(--primary)' : 'var(--border)',
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="space-y-2">
        <svg
          className="mx-auto h-12 w-12"
          style={{ color: 'var(--text-tertiary)' }}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {uploadMutation.isPending ? (
            <span>업로드 중...</span>
          ) : (
            <span>
              <span className="font-medium" style={{ color: 'var(--primary)' }}>
                파일 선택
              </span>{' '}
              또는 드래그 앤 드롭
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          PNG, JPG, GIF, WebP (최대 10MB)
        </p>
      </div>
      {uploadMutation.isError && (
        <p className="mt-2 text-sm" style={{ color: 'var(--error)' }}>
          {uploadMutation.error instanceof Error
            ? uploadMutation.error.message
            : '업로드에 실패했습니다.'}
        </p>
      )}
    </div>
  );
}
