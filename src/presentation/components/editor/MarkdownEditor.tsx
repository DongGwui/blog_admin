'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useMemo } from 'react';
import { ICommand } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { ImageInsertModal } from '@/presentation/components/media/ImageInsertModal';

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-full min-h-[300px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  ),
});

// Dynamic import for commands
const commands = await import('@uiw/react-md-editor').then((mod) => mod.commands);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number | string;
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

  // Custom image command for toolbar
  const imageCommand: ICommand = useMemo(
    () => ({
      name: 'image-insert',
      keyCommand: 'image-insert',
      buttonProps: {
        'aria-label': '이미지 삽입',
        title: '이미지 삽입 (서버 이미지 선택 또는 업로드)',
      },
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      execute: () => {
        setIsImageModalOpen(true);
      },
    }),
    []
  );

  // Build custom toolbar commands
  const customCommands = useMemo(() => {
    if (!commands) return undefined;
    return [
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.hr,
      commands.divider,
      commands.title,
      commands.link,
      commands.quote,
      commands.code,
      commands.codeBlock,
      commands.divider,
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.checkedListCommand,
      commands.divider,
      imageCommand,
    ];
  }, [imageCommand]);

  return (
    <div className="relative h-full">
      {/* Editor Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        data-color-mode="light"
        className="h-full"
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
          commands={customCommands}
          textareaProps={{
            placeholder,
          }}
          visibleDragbar={false}
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
