'use client';

import { ThumbnailPicker } from '@/presentation/components/post/ThumbnailPicker';

interface PostSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  thumbnail: string;
  onThumbnailChange: (url: string) => void;
  categoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  tagIds: number[];
  onTagToggle: (id: number) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  excerpt: string;
  onExcerptChange: (excerpt: string) => void;
  categories: { id: number; name: string }[];
  tags: { id: number; name: string }[];
}

export function PostSettingsPanel({
  isOpen,
  onClose,
  thumbnail,
  onThumbnailChange,
  categoryId,
  onCategoryChange,
  tagIds,
  onTagToggle,
  slug,
  onSlugChange,
  excerpt,
  onExcerptChange,
  categories,
  tags,
}: PostSettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className="fixed right-0 top-0 h-full w-80 z-50 overflow-y-auto transition-colors duration-200"
        style={{
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-xl)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="게시글 설정"
      >
        {/* Header */}
        <div
          className="sticky top-0 px-4 py-3 flex items-center justify-between transition-colors duration-200"
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            설정
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)';
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Thumbnail */}
          <section>
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              썸네일
            </h3>
            <ThumbnailPicker value={thumbnail} onChange={onThumbnailChange} />
          </section>

          {/* Category */}
          {categories.length > 0 && (
            <section>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                카테고리
              </label>
              <select
                id="category-select"
                value={categoryId || ''}
                onChange={(e) =>
                  onCategoryChange(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2"
                style={{
                  background: 'var(--surface-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </section>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <section>
              <h3
                className="text-sm font-medium mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onTagToggle(tag.id)}
                    className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                    style={{
                      background: tagIds.includes(tag.id)
                        ? 'var(--primary)'
                        : 'var(--surface-elevated)',
                      color: tagIds.includes(tag.id)
                        ? 'white'
                        : 'var(--text-secondary)',
                      border: tagIds.includes(tag.id)
                        ? 'none'
                        : '1px solid var(--border)',
                    }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Slug */}
          <section>
            <label
              htmlFor="slug-input"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              URL 슬러그
            </label>
            <input
              id="slug-input"
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="url-friendly-slug"
              className="w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2"
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <p
              className="mt-1 text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              URL에 사용될 슬러그입니다. 비워두면 자동 생성됩니다.
            </p>
          </section>

          {/* Excerpt */}
          <section>
            <label
              htmlFor="excerpt-textarea"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              요약
            </label>
            <textarea
              id="excerpt-textarea"
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              placeholder="글 요약을 입력하세요. 비워두면 자동 생성됩니다."
              rows={4}
              className="w-full px-3 py-2 rounded-lg text-sm resize-none transition-colors duration-200 focus:outline-none focus:ring-2"
              style={{
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
          </section>
        </div>
      </aside>
    </>
  );
}
