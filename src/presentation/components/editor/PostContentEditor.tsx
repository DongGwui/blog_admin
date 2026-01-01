'use client';

import { MarkdownEditor } from '@/presentation/components/editor/MarkdownEditor';
import { useEditorHeight } from '@/presentation/hooks/useEditorHeight';

interface PostContentEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export function PostContentEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onImageUpload,
}: PostContentEditorProps) {
  const { editorHeight, containerRef } = useEditorHeight({
    headerHeight: 57,
    titleAreaHeight: 73,
    padding: 16,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Title Input */}
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full text-2xl sm:text-3xl font-bold border-0 outline-none focus:ring-0 bg-transparent transition-colors duration-200"
          style={{
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Content Editor - fills remaining space */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 px-4 sm:px-6 lg:px-8 py-2"
      >
        <MarkdownEditor
          value={content}
          onChange={onContentChange}
          onImageUpload={onImageUpload}
          height={editorHeight}
          placeholder="내용을 입력하세요..."
        />
      </div>
    </div>
  );
}
