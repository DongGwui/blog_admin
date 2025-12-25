'use client';

import { MarkdownEditor } from '@/presentation/components/editor/MarkdownEditor';

interface PostContentEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  editorHeight?: number;
}

export function PostContentEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onImageUpload,
  editorHeight,
}: PostContentEditorProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Title Input */}
      <div className="px-6 py-4">
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-0 outline-none focus:ring-0"
        />
      </div>

      {/* Separator */}
      <hr className="mx-6 border-gray-200" />

      {/* Content Editor */}
      <div className="flex-1 px-6 py-4">
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
