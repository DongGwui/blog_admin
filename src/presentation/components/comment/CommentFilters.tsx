'use client';

import { useState, useCallback } from 'react';

interface CommentFiltersProps {
  value: string;
  onChange: (value: string) => void;
}

export function CommentFilters({ value, onChange }: CommentFiltersProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onChange(inputValue.trim());
    },
    [inputValue, onChange]
  );

  const handleClear = useCallback(() => {
    setInputValue('');
    onChange('');
  }, [onChange]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="포스트 slug로 필터링 (예: my-first-post)"
          className="w-full px-4 py-2.5 pl-10 rounded-xl text-sm transition-all duration-200 outline-none"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: 'var(--text-tertiary)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: 'var(--primary)',
          color: 'white',
        }}
      >
        검색
      </button>
    </form>
  );
}
