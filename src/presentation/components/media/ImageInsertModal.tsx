'use client';

import { useState, useCallback } from 'react';
import { Media } from '@/domain/entities/Media';
import { useMediaList, useUploadMedia } from '@/presentation/hooks/useMediaQueries';
import { MediaGrid } from './MediaGrid';
import { Button } from '@/presentation/components/common/Button';

interface ImageInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (markdown: string) => void;
}

type TabType = 'server' | 'upload';

export function ImageInsertModal({
  isOpen,
  onClose,
  onInsert,
}: ImageInsertModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('server');
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [altText, setAltText] = useState('');
  const [page, setPage] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);

  const { data, isLoading, refetch } = useMediaList({ page, limit: 12 });
  const uploadMutation = useUploadMedia();

  const handleSelect = useCallback((media: Media) => {
    setSelectedMedia(media);
    if (!altText) {
      setAltText(media.originalName.replace(/\.[^/.]+$/, ''));
    }
  }, [altText]);

  const handleInsert = useCallback(() => {
    if (!selectedMedia) return;

    const alt = altText.trim() || 'image';
    const markdown = `![${alt}](${selectedMedia.url})`;
    onInsert(markdown);

    // Reset state
    setSelectedMedia(null);
    setAltText('');
    setActiveTab('server');
    onClose();
  }, [selectedMedia, altText, onInsert, onClose]);

  const handleClose = useCallback(() => {
    setSelectedMedia(null);
    setAltText('');
    setActiveTab('server');
    onClose();
  }, [onClose]);

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
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        try {
          const uploadedMedia = await uploadMutation.mutateAsync(imageFile);
          setSelectedMedia(uploadedMedia);
          setAltText(imageFile.name.replace(/\.[^/.]+$/, ''));
          refetch();
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    },
    [uploadMutation, refetch]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const uploadedMedia = await uploadMutation.mutateAsync(file);
        setSelectedMedia(uploadedMedia);
        setAltText(file.name.replace(/\.[^/.]+$/, ''));
        refetch();
        setActiveTab('server');
      } catch (error) {
        console.error('Upload failed:', error);
      }
      e.target.value = '';
    },
    [uploadMutation, refetch]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] overflow-hidden mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="modal-title" className="text-lg font-semibold">
            이미지 삽입
          </h2>
          <button
            onClick={handleClose}
            aria-label="닫기"
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

        {/* Tabs */}
        <div className="flex border-b" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'server'}
            aria-controls="panel-server"
            onClick={() => setActiveTab('server')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'server'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            서버 이미지
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'upload'}
            aria-controls="panel-upload"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            새로 업로드
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-220px)]">
          {/* Server Images Tab */}
          {activeTab === 'server' && (
            <div id="panel-server" role="tabpanel">
              {isLoading && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              )}

              {data && data.media.length > 0 && (
                <>
                  <MediaGrid
                    media={data.media}
                    selectable
                    selectedIds={selectedMedia ? [selectedMedia.id] : []}
                    onSelect={handleSelect}
                  />

                  {/* Pagination */}
                  {data.totalPages > 1 && (
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
                </>
              )}

              {data && data.media.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>업로드된 이미지가 없습니다.</p>
                  <p className="text-sm mt-1">
                    &quot;새로 업로드&quot; 탭에서 이미지를 업로드하세요.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div id="panel-upload" role="tabpanel">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
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
                  <div className="text-sm text-gray-600">
                    {uploadMutation.isPending ? (
                      <span>업로드 중...</span>
                    ) : (
                      <span>
                        <span className="font-medium text-blue-600">파일 선택</span> 또는
                        드래그 앤 드롭
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, WebP (최대 10MB)
                  </p>
                </div>
                {uploadMutation.isError && (
                  <p className="mt-2 text-sm text-red-600">
                    {uploadMutation.error instanceof Error
                      ? uploadMutation.error.message
                      : '업로드에 실패했습니다.'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected Image Preview & Alt Text */}
        {selectedMedia && (
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="alt-text"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  대체 텍스트 (Alt)
                </label>
                <input
                  id="alt-text"
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="이미지 설명을 입력하세요"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleInsert}
            disabled={!selectedMedia}
          >
            삽입
          </Button>
        </div>
      </div>
    </div>
  );
}
