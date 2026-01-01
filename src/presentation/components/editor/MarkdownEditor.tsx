'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ICommand } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { ImageInsertModal } from '@/presentation/components/media/ImageInsertModal';
import { ImageResizeToolbar } from './ImageResizeToolbar';
import { useTheme } from '@/presentation/context/ThemeContext';

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

interface ClickedImage {
  url: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  originalMarkup: string;
  position: { top: number; left: number };
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
  const [clickedImage, setClickedImage] = useState<ClickedImage | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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

  // Parse image attributes from HTML img tag or markdown
  const parseImageAttributes = useCallback(
    (imgElement: HTMLImageElement): ClickedImage | null => {
      const src = imgElement.getAttribute('src');
      if (!src) return null;

      // Get position for toolbar
      const rect = imgElement.getBoundingClientRect();
      const position = {
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2,
      };

      // Try to find the original markup in the content
      // First, check for HTML img tag
      const imgTagRegex = new RegExp(
        `<img[^>]*src=["']${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`,
        'i'
      );
      const imgTagMatch = value.match(imgTagRegex);

      if (imgTagMatch) {
        // Parse width and align from the HTML tag
        const widthMatch = imgTagMatch[0].match(/width=["']?(\d+(?:px|%)?|\d+)["']?/i);
        const styleMatch = imgTagMatch[0].match(/style=["']([^"']*)["']/i);
        let align: 'left' | 'center' | 'right' = 'left';
        let width: string | undefined;

        if (widthMatch) {
          width = widthMatch[1].replace('px', '');
        }

        if (styleMatch) {
          const style = styleMatch[1];
          if (style.includes('margin: 0 auto') || style.includes('margin:0 auto')) {
            align = 'center';
          } else if (style.includes('margin-left: auto') || style.includes('float: right')) {
            align = 'right';
          }
        }

        return {
          url: src,
          width,
          align,
          originalMarkup: imgTagMatch[0],
          position,
        };
      }

      // Check for markdown image syntax
      const markdownRegex = new RegExp(
        `!\\[[^\\]]*\\]\\(${src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`,
        'i'
      );
      const markdownMatch = value.match(markdownRegex);

      if (markdownMatch) {
        return {
          url: src,
          align: 'left',
          originalMarkup: markdownMatch[0],
          position,
        };
      }

      return null;
    },
    [value]
  );

  // Handle click on images in the preview
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if clicked on an image in the preview area
      if (target.tagName === 'IMG' && target.closest('.wmde-markdown-var')) {
        e.preventDefault();
        e.stopPropagation();

        const imgElement = target as HTMLImageElement;
        const imageInfo = parseImageAttributes(imgElement);

        if (imageInfo) {
          setClickedImage(imageInfo);
        }
      }
    };

    container.addEventListener('click', handleClick, true);
    return () => container.removeEventListener('click', handleClick, true);
  }, [parseImageAttributes]);

  // Handle resize apply
  const handleResizeApply = useCallback(
    (width: string | null, align: 'left' | 'center' | 'right') => {
      if (!clickedImage) return;

      // Build new img tag
      let newMarkup: string;
      const altMatch = clickedImage.originalMarkup.match(/alt=["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1] : 'image';

      // Build style string for alignment
      let style = 'display: block;';
      if (align === 'center') {
        style += ' margin: 0 auto;';
      } else if (align === 'right') {
        style += ' margin-left: auto;';
      }

      if (width) {
        // If it's a percentage, use it directly; otherwise treat as px
        const widthValue = width.endsWith('%') ? width : `${width}px`;
        newMarkup = `<img src="${clickedImage.url}" alt="${alt}" width="${widthValue}" style="${style}" />`;
      } else {
        // No width specified (100% / original)
        newMarkup = `<img src="${clickedImage.url}" alt="${alt}" style="${style}" />`;
      }

      // Replace the original markup with the new one
      const newValue = value.replace(clickedImage.originalMarkup, newMarkup);
      onChange(newValue);
      setClickedImage(null);
    },
    [clickedImage, value, onChange]
  );

  const handleResizeClose = useCallback(() => {
    setClickedImage(null);
  }, []);

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
    <div ref={editorContainerRef} className="relative h-full">
      {/* Editor Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        data-color-mode={theme}
        className="h-full"
      >
        {isUploading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ background: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="animate-spin rounded-full h-5 w-5 border-b-2"
                style={{ borderColor: 'var(--primary)' }}
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                이미지 업로드 중...
              </span>
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

      {/* Image Resize Toolbar */}
      <ImageResizeToolbar
        isOpen={!!clickedImage}
        imageUrl={clickedImage?.url || ''}
        currentWidth={clickedImage?.width}
        currentAlign={clickedImage?.align}
        position={clickedImage?.position || { top: 0, left: 0 }}
        onClose={handleResizeClose}
        onApply={handleResizeApply}
      />
    </div>
  );
}
