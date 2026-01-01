'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ImageResizeToolbarProps {
  isOpen: boolean;
  imageUrl: string;
  currentWidth?: string;
  currentAlign?: 'left' | 'center' | 'right';
  position: { top: number; left: number };
  onClose: () => void;
  onApply: (width: string | null, align: 'left' | 'center' | 'right') => void;
}

type SizeType = '25' | '50' | '75' | '100' | 'custom';
type AlignType = 'left' | 'center' | 'right';

const SIZE_OPTIONS: { value: SizeType; label: string }[] = [
  { value: '100', label: '100%' },
  { value: '75', label: '75%' },
  { value: '50', label: '50%' },
  { value: '25', label: '25%' },
  { value: 'custom', label: '직접 입력' },
];

const ALIGN_OPTIONS: { value: AlignType; label: string; icon: React.ReactNode }[] = [
  {
    value: 'left',
    label: '왼쪽',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
      </svg>
    ),
  },
  {
    value: 'center',
    label: '가운데',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
      </svg>
    ),
  },
  {
    value: 'right',
    label: '오른쪽',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
      </svg>
    ),
  },
];

export function ImageResizeToolbar({
  isOpen,
  imageUrl,
  currentWidth,
  currentAlign = 'left',
  position,
  onClose,
  onApply,
}: ImageResizeToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Parse current width to determine initial size type
  const parseInitialSize = useCallback((): { type: SizeType; custom: string } => {
    if (!currentWidth) return { type: '100', custom: '400' };

    if (currentWidth.endsWith('%')) {
      const percent = currentWidth.replace('%', '');
      if (['25', '50', '75', '100'].includes(percent)) {
        return { type: percent as SizeType, custom: '400' };
      }
    }

    // Custom pixel value
    const pixelMatch = currentWidth.match(/^(\d+)(px)?$/);
    if (pixelMatch) {
      return { type: 'custom', custom: pixelMatch[1] };
    }

    return { type: '100', custom: '400' };
  }, [currentWidth]);

  const initialValues = parseInitialSize();
  const [sizeType, setSizeType] = useState<SizeType>(initialValues.type);
  const [customWidth, setCustomWidth] = useState(initialValues.custom);
  const [align, setAlign] = useState<AlignType>(currentAlign);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      const values = parseInitialSize();
      setSizeType(values.type);
      setCustomWidth(values.custom);
      setAlign(currentAlign);
    }
  }, [isOpen, currentWidth, currentAlign, parseInitialSize]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleApply = useCallback(() => {
    let width: string | null = null;

    if (sizeType === 'custom') {
      const w = parseInt(customWidth, 10);
      if (w > 0) {
        width = `${w}`;
      }
    } else if (sizeType !== '100') {
      width = `${sizeType}%`;
    }

    onApply(width, align);
    onClose();
  }, [sizeType, customWidth, align, onApply, onClose]);

  if (!isOpen) return null;

  // Calculate position to keep toolbar in viewport
  const toolbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: Math.max(10, Math.min(position.top, window.innerHeight - 300)),
    left: Math.max(10, Math.min(position.left, window.innerWidth - 320)),
    zIndex: 9999,
  };

  return (
    <div
      ref={toolbarRef}
      className="animate-scale-in"
      style={toolbarStyle}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl), var(--shadow-glow)',
          width: '300px',
        }}
      >
        {/* Gradient top border */}
        <div
          className="h-1"
          style={{ background: 'var(--gradient-primary)' }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              이미지 크기 조절
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--text-tertiary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--error-light)';
              e.currentTarget.style.color = 'var(--error)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface-elevated)';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Image Preview */}
          <div
            className="w-full h-20 rounded-xl overflow-hidden flex items-center justify-center"
            style={{ background: 'var(--surface-elevated)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Size Options */}
          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              크기
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSizeType(option.value)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: sizeType === option.value ? 'var(--primary)' : 'var(--surface-elevated)',
                    color: sizeType === option.value ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${sizeType === option.value ? 'var(--primary)' : 'var(--border)'}`,
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Custom width input */}
            {sizeType === 'custom' && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  placeholder="400"
                  min="50"
                  max="2000"
                  className="w-20 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                  }}
                />
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>px</span>
              </div>
            )}
          </div>

          {/* Alignment Options */}
          <div>
            <label
              className="block text-xs font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              정렬
            </label>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface-elevated)' }}>
              {ALIGN_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAlign(option.value)}
                  title={option.label}
                  className="flex-1 p-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                  style={{
                    background: align === option.value ? 'var(--primary)' : 'transparent',
                    color: align === option.value ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {option.icon}
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-2 px-4 py-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--text-secondary)',
            }}
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{
              background: 'var(--gradient-primary)',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
