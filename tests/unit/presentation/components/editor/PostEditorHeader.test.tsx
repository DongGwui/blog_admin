import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PostEditorHeader } from '@/presentation/components/editor/PostEditorHeader';

// Mock useRouter
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: vi.fn(),
  }),
}));

describe('PostEditorHeader', () => {
  const defaultProps = {
    title: '새 글 작성',
    onSaveDraft: vi.fn(),
    onPublish: vi.fn(),
    onSettingsToggle: vi.fn(),
    isSaving: false,
    isDirty: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the title', () => {
      render(<PostEditorHeader {...defaultProps} />);

      expect(screen.getByText('새 글 작성')).toBeInTheDocument();
    });

    it('should render back button', () => {
      render(<PostEditorHeader {...defaultProps} />);

      expect(screen.getByRole('button', { name: /나가기|뒤로/i })).toBeInTheDocument();
    });

    it('should render save draft button', () => {
      render(<PostEditorHeader {...defaultProps} />);

      expect(screen.getByRole('button', { name: /임시저장/i })).toBeInTheDocument();
    });

    it('should render publish button', () => {
      render(<PostEditorHeader {...defaultProps} />);

      expect(screen.getByRole('button', { name: /발행/i })).toBeInTheDocument();
    });

    it('should render settings toggle button', () => {
      render(<PostEditorHeader {...defaultProps} />);

      expect(screen.getByRole('button', { name: /설정/i })).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call router.back when back button is clicked and not dirty', () => {
      render(<PostEditorHeader {...defaultProps} />);

      const backButton = screen.getByRole('button', { name: /나가기|뒤로/i });
      fireEvent.click(backButton);

      expect(mockBack).toHaveBeenCalled();
    });

    it('should show confirmation when back button is clicked and dirty', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      render(<PostEditorHeader {...defaultProps} isDirty={true} />);

      const backButton = screen.getByRole('button', { name: /나가기|뒤로/i });
      fireEvent.click(backButton);

      expect(confirmSpy).toHaveBeenCalledWith(expect.stringContaining('저장'));
      expect(mockBack).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('should call onSaveDraft when save draft button is clicked', () => {
      render(<PostEditorHeader {...defaultProps} />);

      const saveDraftButton = screen.getByRole('button', { name: /임시저장/i });
      fireEvent.click(saveDraftButton);

      expect(defaultProps.onSaveDraft).toHaveBeenCalled();
    });

    it('should call onPublish when publish button is clicked', () => {
      render(<PostEditorHeader {...defaultProps} />);

      const publishButton = screen.getByRole('button', { name: /발행/i });
      fireEvent.click(publishButton);

      expect(defaultProps.onPublish).toHaveBeenCalled();
    });

    it('should call onSettingsToggle when settings button is clicked', () => {
      render(<PostEditorHeader {...defaultProps} />);

      const settingsButton = screen.getByRole('button', { name: /설정/i });
      fireEvent.click(settingsButton);

      expect(defaultProps.onSettingsToggle).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should disable buttons when saving', () => {
      render(<PostEditorHeader {...defaultProps} isSaving={true} />);

      const saveDraftButton = screen.getByRole('button', { name: /저장 중|임시저장/i });
      const publishButton = screen.getByRole('button', { name: /발행/i });

      expect(saveDraftButton).toBeDisabled();
      expect(publishButton).toBeDisabled();
    });

    it('should show loading text when saving', () => {
      render(<PostEditorHeader {...defaultProps} isSaving={true} />);

      expect(screen.getByText(/저장 중/i)).toBeInTheDocument();
    });
  });

  describe('dirty state', () => {
    it('should show modified indicator when dirty', () => {
      render(<PostEditorHeader {...defaultProps} isDirty={true} />);

      expect(screen.getByText(/수정됨/i)).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    it('should show "수정" instead of "발행" when isEdit is true', () => {
      render(<PostEditorHeader {...defaultProps} isEdit={true} />);

      expect(screen.getByRole('button', { name: /수정/i })).toBeInTheDocument();
    });
  });
});
