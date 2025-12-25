'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

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

  return (
    <div
      className="relative"
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
  );
}
