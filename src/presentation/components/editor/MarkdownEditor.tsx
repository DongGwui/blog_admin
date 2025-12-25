'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { ImageInsertModal } from '@/presentation/components/media/ImageInsertModal';

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] border rounded-lg flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  ),
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  onImageUpload?: (file: File) => Promise<string>;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = 500,
  onImageUpload,
}: MarkdownEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleChange = useCallback(
    (val?: string) => {
      onChange(val || '');
    },
    [onChange]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      if (!onImageUpload) return;

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );

      if (files.length === 0) return;

      e.preventDefault();
      setIsUploading(true);

      try {
        const urls = await Promise.all(files.map((file) => onImageUpload(file)));
        const markdown = urls.map((url) => `![image](${url})`).join('\n');
        onChange(value + '\n' + markdown);
      } catch (error) {
        console.error('Image upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUpload, onChange, value]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!onImageUpload) return;

      const items = Array.from(e.clipboardData.items);
      const imageItems = items.filter((item) => item.type.startsWith('image/'));

      if (imageItems.length === 0) return;

      e.preventDefault();
      setIsUploading(true);

      try {
        const files = imageItems
          .map((item) => item.getAsFile())
          .filter((file): file is File => file !== null);
        const urls = await Promise.all(files.map((file) => onImageUpload(file)));
        const markdown = urls.map((url) => `![image](${url})`).join('\n');
        onChange(value + '\n' + markdown);
      } catch (error) {
        console.error('Image upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUpload, onChange, value]
  );

  const handleImageInsert = useCallback(
    (markdown: string) => {
      // Insert image markdown at the end with proper newlines
      const trimmedValue = value.trimEnd();
      const separator = trimmedValue ? '\n\n' : '';
      onChange(trimmedValue + separator + markdown);
    },
    [value, onChange]
  );

  return (
    <div className="relative">
      {/* Custom Toolbar with Image Button */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b">
        <button
          type="button"
          onClick={() => setIsImageModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
          title="이미지 삽입"
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          이미지
        </button>
        <span className="text-xs text-gray-500">
          또는 이미지를 드래그하거나 붙여넣기 하세요
        </span>
      </div>

      {/* Editor Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        data-color-mode="light"
      >
        {isUploading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
              <span className="text-sm text-gray-600">이미지 업로드 중...</span>
            </div>
          </div>
        )}
        <MDEditor
          value={value}
          onChange={handleChange}
          height={height}
          preview="live"
          textareaProps={{
            placeholder,
          }}
        />
      </div>

      {/* Image Insert Modal */}
      <ImageInsertModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleImageInsert}
      />
    </div>
  );
}
