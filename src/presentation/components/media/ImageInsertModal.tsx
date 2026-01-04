'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
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
    // 본문용 이미지는 thumbnailMd(400px)를 사용, 없으면 원본 URL로 폴백
    const imageUrl = selectedMedia.thumbnailMd || selectedMedia.url;
    // Insert as simple markdown - resizing will be done by clicking the image in editor
    const markdown = `![${alt}](${imageUrl})`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Animated Backdrop */}
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 animate-fade-in"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden animate-scale-in"
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl), var(--shadow-glow)',
        }}
      >
        {/* Gradient top border */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: 'var(--gradient-primary)' }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2
                id="modal-title"
                className="text-lg font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                이미지 삽입
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                삽입 후 이미지를 클릭하면 크기를 조절할 수 있습니다
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="닫기"
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--error-light)';
              e.currentTarget.style.color = 'var(--error)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface-elevated)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
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
        <div
          className="relative flex px-6 pt-4"
          role="tablist"
          style={{ background: 'var(--surface)' }}
        >
          <button
            role="tab"
            aria-selected={activeTab === 'server'}
            aria-controls="panel-server"
            onClick={() => setActiveTab('server')}
            className="relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors duration-200 z-10"
            style={{
              color: activeTab === 'server' ? 'var(--primary)' : 'var(--text-secondary)',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            갤러리
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'upload'}
            aria-controls="panel-upload"
            onClick={() => setActiveTab('upload')}
            className="relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors duration-200 z-10"
            style={{
              color: activeTab === 'upload' ? 'var(--primary)' : 'var(--text-secondary)',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            업로드
          </button>

          <div
            className="absolute bottom-0 h-0.5 transition-all duration-300 ease-out"
            style={{
              background: 'var(--gradient-primary)',
              width: '50%',
              left: activeTab === 'server' ? '0' : '50%',
              borderRadius: '2px 2px 0 0',
            }}
          />
        </div>

        <div style={{ height: '1px', background: 'var(--border)' }} />

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{
            maxHeight: 'calc(85vh - 280px)',
            background: 'var(--surface-elevated)',
          }}
        >
          {/* Server Images Tab */}
          {activeTab === 'server' && (
            <div id="panel-server" role="tabpanel" className="animate-fade-in">
              {isLoading && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl animate-shimmer"
                      style={{
                        background: `linear-gradient(90deg, var(--surface) 25%, var(--surface-hover) 50%, var(--surface) 75%)`,
                        backgroundSize: '200% 100%',
                      }}
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

                  {data.totalPages > 1 && (
                    <div
                      className="flex items-center justify-center gap-3 mt-6 pt-4"
                      style={{ borderTop: '1px solid var(--border)' }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        이전
                      </Button>
                      <div
                        className="px-4 py-1.5 rounded-lg text-sm font-medium"
                        style={{
                          background: 'var(--surface)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {page} / {data.totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                        disabled={page === data.totalPages}
                      >
                        다음
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {data && data.media.length === 0 && (
                <div
                  className="text-center py-16 rounded-2xl"
                  style={{
                    background: 'var(--surface)',
                    border: '2px dashed var(--border)',
                  }}
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'var(--surface-elevated)' }}
                  >
                    <svg
                      className="w-8 h-8"
                      style={{ color: 'var(--text-tertiary)' }}
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
                  </div>
                  <p className="font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                    업로드된 이미지가 없습니다
                  </p>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                    업로드 탭에서 첫 번째 이미지를 추가해보세요
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'var(--gradient-primary)',
                      color: 'white',
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    이미지 업로드
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div id="panel-upload" role="tabpanel" className="animate-fade-in">
              <div
                className={`relative rounded-2xl p-12 text-center transition-all duration-300 ${
                  isDragOver ? 'scale-[1.02]' : ''
                }`}
                style={{
                  background: isDragOver
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)'
                    : 'var(--surface)',
                  border: isDragOver
                    ? '2px solid var(--primary)'
                    : '2px dashed var(--border)',
                  boxShadow: isDragOver ? 'var(--shadow-glow)' : 'none',
                }}
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

                <div
                  className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    isDragOver ? 'animate-bounce-subtle' : ''
                  }`}
                  style={{
                    background: isDragOver
                      ? 'var(--gradient-primary)'
                      : 'var(--surface-elevated)',
                  }}
                >
                  {uploadMutation.isPending ? (
                    <svg
                      className="w-10 h-10 animate-spin"
                      style={{ color: isDragOver ? 'white' : 'var(--primary)' }}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-10 h-10"
                      style={{ color: isDragOver ? 'white' : 'var(--primary)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  )}
                </div>

                <div className="space-y-2">
                  {uploadMutation.isPending ? (
                    <p
                      className="text-lg font-semibold"
                      style={{ color: 'var(--primary)' }}
                    >
                      업로드 중...
                    </p>
                  ) : (
                    <>
                      <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {isDragOver ? '여기에 놓으세요!' : '이미지를 드래그하거나'}
                      </p>
                      {!isDragOver && (
                        <p style={{ color: 'var(--text-secondary)' }}>
                          <span
                            className="font-semibold cursor-pointer transition-colors hover:underline"
                            style={{ color: 'var(--primary)' }}
                          >
                            파일을 선택
                          </span>
                          해서 업로드하세요
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div
                  className="flex items-center justify-center gap-2 mt-6"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm">PNG, JPG, GIF, WebP (최대 10MB)</span>
                </div>

                {uploadMutation.isError && (
                  <div
                    className="mt-4 px-4 py-2 rounded-xl text-sm inline-flex items-center gap-2"
                    style={{
                      background: 'var(--error-light)',
                      color: 'var(--error)',
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {uploadMutation.error instanceof Error
                      ? uploadMutation.error.message
                      : '업로드에 실패했습니다.'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected Image Preview */}
        {selectedMedia && (
          <div
            className="px-6 py-4 animate-fade-in-up"
            style={{
              background: 'var(--surface)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="relative flex-shrink-0 rounded-xl p-0.5"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <div
                  className="w-16 h-16 rounded-[10px] overflow-hidden relative"
                  style={{ background: 'var(--surface)' }}
                >
                  <Image
                    src={selectedMedia.thumbnailSm || selectedMedia.url}
                    alt={selectedMedia.originalName}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--success)' }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <label
                  htmlFor="alt-text"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  대체 텍스트 (Alt)
                </label>
                <input
                  id="alt-text"
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="이미지 설명을 입력하세요"
                  className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-4 px-6 py-4"
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {selectedMedia ? (
              <span style={{ color: 'var(--text-secondary)' }}>
                <span className="font-medium" style={{ color: 'var(--primary)' }}>1개</span> 선택됨
              </span>
            ) : (
              '이미지를 선택하세요'
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="px-5"
            >
              취소
            </Button>
            <button
              onClick={handleInsert}
              disabled={!selectedMedia}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: selectedMedia ? 'var(--gradient-primary)' : 'var(--surface-elevated)',
                color: selectedMedia ? 'white' : 'var(--text-tertiary)',
                boxShadow: selectedMedia ? 'var(--shadow-md)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (selectedMedia) {
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = selectedMedia ? 'var(--shadow-md)' : 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              삽입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
