import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteMediaUseCase } from '@/application/usecases/media/DeleteMediaUseCase';
import { IMediaRepository } from '@/domain/repositories/IMediaRepository';
import { Media } from '@/domain/entities/Media';

describe('DeleteMediaUseCase', () => {
  let useCase: DeleteMediaUseCase;
  let mockMediaRepository: IMediaRepository;

  const mockMedia: Media = {
    id: 1,
    filename: 'image.jpg',
    originalName: 'photo.jpg',
    url: 'https://cdn.example.com/image.jpg',
    mimeType: 'image/jpeg',
    size: 102400,
    width: 800,
    height: 600,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockMediaRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      upload: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new DeleteMediaUseCase(mockMediaRepository);
  });

  it('should delete media when found', async () => {
    vi.mocked(mockMediaRepository.findById).mockResolvedValue(mockMedia);
    vi.mocked(mockMediaRepository.delete).mockResolvedValue();

    await useCase.execute(1);

    expect(mockMediaRepository.findById).toHaveBeenCalledWith(1);
    expect(mockMediaRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when id is invalid (zero)', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Invalid media ID');
    expect(mockMediaRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when id is invalid (negative)', async () => {
    await expect(useCase.execute(-1)).rejects.toThrow('Invalid media ID');
    expect(mockMediaRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when media not found', async () => {
    vi.mocked(mockMediaRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow('Media not found');
    expect(mockMediaRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockMediaRepository.findById).mockResolvedValue(mockMedia);
    vi.mocked(mockMediaRepository.delete).mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Database error');
  });
});
