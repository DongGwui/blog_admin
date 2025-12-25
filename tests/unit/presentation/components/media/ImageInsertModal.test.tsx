import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageInsertModal } from '@/presentation/components/media/ImageInsertModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the useMediaList, useUploadMedia, and useDeleteMedia hooks
vi.mock('@/presentation/hooks/useMediaQueries', () => ({
  useMediaList: vi.fn(() => ({
    data: {
      media: [
        {
          id: 1,
          filename: 'image1.jpg',
          originalName: 'photo1.jpg',
          url: 'https://example.com/image1.jpg',
          mimeType: 'image/jpeg',
          size: 102400,
          width: 800,
          height: 600,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 2,
          filename: 'image2.png',
          originalName: 'photo2.png',
          url: 'https://example.com/image2.png',
          mimeType: 'image/png',
          size: 204800,
          width: 1200,
          height: 800,
          createdAt: new Date('2024-01-02'),
        },
      ],
      total: 2,
      page: 1,
      totalPages: 1,
    },
    isLoading: false,
    refetch: vi.fn(),
  })),
  useUploadMedia: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  })),
  useDeleteMedia: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('ImageInsertModal', () => {
  const mockOnClose = vi.fn();
  const mockOnInsert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={false}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('이미지 삽입')).toBeInTheDocument();
    });

    it('should render tabs for server images and upload', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      expect(screen.getByRole('tab', { name: /서버 이미지/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /새로 업로드/i })).toBeInTheDocument();
    });

    it('should render insert and cancel buttons', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      expect(screen.getByRole('button', { name: /삽입/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /취소/i })).toBeInTheDocument();
    });

    it('should have insert button disabled when no image selected', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const insertButton = screen.getByRole('button', { name: /삽입/i });
      expect(insertButton).toBeDisabled();
    });
  });

  describe('Image Grid', () => {
    it('should display server images from mock data', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      // MediaGrid should be rendered with the mock data
      // The actual image elements would be rendered by MediaGrid component
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });
  });

  describe('Modal Controls', () => {
    it('should call onClose when close button is clicked', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const closeButton = screen.getByRole('button', { name: /닫기/i });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when cancel button is clicked', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /취소/i });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Tab Navigation', () => {
    it('should have server tab selected by default', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const serverTab = screen.getByRole('tab', { name: /서버 이미지/i });
      expect(serverTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should switch to upload tab when clicked', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const uploadTab = screen.getByRole('tab', { name: /새로 업로드/i });
      fireEvent.click(uploadTab);

      expect(uploadTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should show upload area when upload tab is active', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const uploadTab = screen.getByRole('tab', { name: /새로 업로드/i });
      fireEvent.click(uploadTab);

      expect(screen.getByText(/파일 선택/i)).toBeInTheDocument();
      expect(screen.getByText(/드래그 앤 드롭/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes on modal', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should have proper tab role and aria-selected attributes', () => {
      renderWithProviders(
        <ImageInsertModal
          isOpen={true}
          onClose={mockOnClose}
          onInsert={mockOnInsert}
        />
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);

      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
      });
    });
  });
});
