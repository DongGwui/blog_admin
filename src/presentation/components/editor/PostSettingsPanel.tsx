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
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="게시글 설정"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">설정</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
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
            <h3 className="text-sm font-medium text-gray-700 mb-2">썸네일</h3>
            <ThumbnailPicker value={thumbnail} onChange={onThumbnailChange} />
          </section>

          {/* Category */}
          {categories.length > 0 && (
            <section>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                카테고리
              </label>
              <select
                id="category-select"
                value={categoryId || ''}
                onChange={(e) =>
                  onCategoryChange(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
              <h3 className="text-sm font-medium text-gray-700 mb-2">태그</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      tagIds.includes(tag.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
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
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL 슬러그
            </label>
            <input
              id="slug-input"
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="url-friendly-slug"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              URL에 사용될 슬러그입니다. 비워두면 자동 생성됩니다.
            </p>
          </section>

          {/* Excerpt */}
          <section>
            <label
              htmlFor="excerpt-textarea"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              요약
            </label>
            <textarea
              id="excerpt-textarea"
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              placeholder="글 요약을 입력하세요. 비워두면 자동 생성됩니다."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            />
          </section>
        </div>
      </aside>
    </>
  );
}
