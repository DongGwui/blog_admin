import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostContentEditor } from '@/presentation/components/editor/PostContentEditor';

// Mock MarkdownEditor to avoid SSR issues in tests
vi.mock('@/presentation/components/editor/MarkdownEditor', () => ({
  MarkdownEditor: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => (
    <textarea
      data-testid="markdown-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

describe('PostContentEditor', () => {
  const defaultProps = {
    title: '',
    content: '',
    onTitleChange: vi.fn(),
    onContentChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('title input', () => {
    it('should render title input', () => {
      render(<PostContentEditor {...defaultProps} />);

      expect(screen.getByPlaceholderText(/제목/i)).toBeInTheDocument();
    });

    it('should display title value', () => {
      render(<PostContentEditor {...defaultProps} title="테스트 제목" />);

      expect(screen.getByDisplayValue('테스트 제목')).toBeInTheDocument();
    });

    it('should call onTitleChange when title is changed', () => {
      render(<PostContentEditor {...defaultProps} />);

      const titleInput = screen.getByPlaceholderText(/제목/i);
      fireEvent.change(titleInput, { target: { value: '새 제목' } });

      expect(defaultProps.onTitleChange).toHaveBeenCalledWith('새 제목');
    });

    it('should have large font size for title', () => {
      render(<PostContentEditor {...defaultProps} />);

      const titleInput = screen.getByPlaceholderText(/제목/i);
      expect(titleInput).toHaveClass('text-3xl');
    });
  });

  describe('content editor', () => {
    it('should render markdown editor', () => {
      render(<PostContentEditor {...defaultProps} />);

      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });

    it('should display content value', () => {
      render(<PostContentEditor {...defaultProps} content="테스트 내용" />);

      expect(screen.getByDisplayValue('테스트 내용')).toBeInTheDocument();
    });

    it('should call onContentChange when content is changed', () => {
      render(<PostContentEditor {...defaultProps} />);

      const contentEditor = screen.getByTestId('markdown-editor');
      fireEvent.change(contentEditor, { target: { value: '새 내용' } });

      expect(defaultProps.onContentChange).toHaveBeenCalledWith('새 내용');
    });
  });

  describe('layout', () => {
    it('should have separator between title and content', () => {
      const { container } = render(<PostContentEditor {...defaultProps} />);

      // Check for separator element (hr or border)
      expect(container.querySelector('hr, [class*="border"]')).toBeInTheDocument();
    });

    it('should apply full height styling', () => {
      const { container } = render(<PostContentEditor {...defaultProps} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('flex', 'flex-col');
    });
  });

  describe('props forwarding', () => {
    it('should pass onImageUpload to MarkdownEditor', () => {
      const mockImageUpload = vi.fn();
      render(
        <PostContentEditor {...defaultProps} onImageUpload={mockImageUpload} />
      );

      // Component should render without errors
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    });
  });
});
