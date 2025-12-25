import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostSettingsPanel } from '@/presentation/components/editor/PostSettingsPanel';

// Mock ThumbnailPicker
vi.mock('@/presentation/components/post/ThumbnailPicker', () => ({
  ThumbnailPicker: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (url: string) => void;
  }) => (
    <div data-testid="thumbnail-picker">
      <input
        data-testid="thumbnail-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

describe('PostSettingsPanel', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    thumbnail: '',
    onThumbnailChange: vi.fn(),
    categoryId: null as number | null,
    onCategoryChange: vi.fn(),
    tagIds: [] as number[],
    onTagToggle: vi.fn(),
    slug: '',
    onSlugChange: vi.fn(),
    excerpt: '',
    onExcerptChange: vi.fn(),
    categories: [
      { id: 1, name: '카테고리1' },
      { id: 2, name: '카테고리2' },
    ],
    tags: [
      { id: 1, name: '태그1' },
      { id: 2, name: '태그2' },
      { id: 3, name: '태그3' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('visibility', () => {
    it('should render when isOpen is true', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<PostSettingsPanel {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('설정')).not.toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('should call onClose when close button is clicked', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /닫기/i });
      fireEvent.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('thumbnail section', () => {
    it('should render thumbnail picker', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      expect(screen.getByTestId('thumbnail-picker')).toBeInTheDocument();
    });

    it('should pass thumbnail value to picker', () => {
      render(<PostSettingsPanel {...defaultProps} thumbnail="https://example.com/image.jpg" />);

      expect(screen.getByTestId('thumbnail-input')).toHaveValue('https://example.com/image.jpg');
    });
  });

  describe('category section', () => {
    it('should render category select', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      expect(screen.getByRole('combobox', { name: /카테고리/i })).toBeInTheDocument();
    });

    it('should display all categories', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      expect(screen.getByText('카테고리1')).toBeInTheDocument();
      expect(screen.getByText('카테고리2')).toBeInTheDocument();
    });

    it('should call onCategoryChange when category is selected', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      const select = screen.getByRole('combobox', { name: /카테고리/i });
      fireEvent.change(select, { target: { value: '1' } });

      expect(defaultProps.onCategoryChange).toHaveBeenCalledWith(1);
    });

    it('should show selected category', () => {
      render(<PostSettingsPanel {...defaultProps} categoryId={2} />);

      const select = screen.getByRole('combobox', { name: /카테고리/i });
      expect(select).toHaveValue('2');
    });
  });

  describe('tags section', () => {
    it('should render tag buttons', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      expect(screen.getByRole('button', { name: '태그1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '태그2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '태그3' })).toBeInTheDocument();
    });

    it('should call onTagToggle when tag is clicked', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      const tagButton = screen.getByRole('button', { name: '태그1' });
      fireEvent.click(tagButton);

      expect(defaultProps.onTagToggle).toHaveBeenCalledWith(1);
    });

    it('should highlight selected tags', () => {
      render(<PostSettingsPanel {...defaultProps} tagIds={[1, 3]} />);

      const tag1 = screen.getByRole('button', { name: '태그1' });
      const tag2 = screen.getByRole('button', { name: '태그2' });
      const tag3 = screen.getByRole('button', { name: '태그3' });

      expect(tag1).toHaveClass('bg-blue-600');
      expect(tag2).not.toHaveClass('bg-blue-600');
      expect(tag3).toHaveClass('bg-blue-600');
    });
  });

  describe('slug section', () => {
    it('should render slug input', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      expect(screen.getByLabelText(/슬러그|URL/i)).toBeInTheDocument();
    });

    it('should display slug value', () => {
      render(<PostSettingsPanel {...defaultProps} slug="my-post-slug" />);

      expect(screen.getByDisplayValue('my-post-slug')).toBeInTheDocument();
    });

    it('should call onSlugChange when slug is changed', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      const slugInput = screen.getByLabelText(/슬러그|URL/i);
      fireEvent.change(slugInput, { target: { value: 'new-slug' } });

      expect(defaultProps.onSlugChange).toHaveBeenCalledWith('new-slug');
    });
  });

  describe('excerpt section', () => {
    it('should render excerpt textarea', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      expect(screen.getByLabelText(/요약/i)).toBeInTheDocument();
    });

    it('should display excerpt value', () => {
      render(<PostSettingsPanel {...defaultProps} excerpt="글 요약 내용" />);

      expect(screen.getByDisplayValue('글 요약 내용')).toBeInTheDocument();
    });

    it('should call onExcerptChange when excerpt is changed', () => {
      render(<PostSettingsPanel {...defaultProps} />);

      const excerptTextarea = screen.getByLabelText(/요약/i);
      fireEvent.change(excerptTextarea, { target: { value: '새 요약' } });

      expect(defaultProps.onExcerptChange).toHaveBeenCalledWith('새 요약');
    });
  });
});
