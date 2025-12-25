import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadMediaUseCase } from '@/application/usecases/media/UploadMediaUseCase';
import { IMediaRepository } from '@/domain/repositories/IMediaRepository';
import { Media } from '@/domain/entities/Media';

describe('UploadMediaUseCase', () => {
  let useCase: UploadMediaUseCase;
  let mockMediaRepository: IMediaRepository;

  const mockMedia: Media = {
    id: 1,
    filename: 'uploaded-image.jpg',
    originalName: 'my-photo.jpg',
    url: 'https://cdn.example.com/uploaded-image.jpg',
    mimeType: 'image/jpeg',
    size: 102400,
    width: 800,
    height: 600,
    createdAt: new Date('2024-01-01'),
  };

  const createMockFile = (name: string, type: string, size: number): File => {
    const blob = new Blob([''], { type });
    Object.defineProperty(blob, 'name', { value: name });
    Object.defineProperty(blob, 'size', { value: size });
    return blob as File;
  };

  beforeEach(() => {
    mockMediaRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      upload: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new UploadMediaUseCase(mockMediaRepository);
  });

  it('should upload a valid image file', async () => {
    const file = createMockFile('photo.jpg', 'image/jpeg', 102400);
    vi.mocked(mockMediaRepository.upload).mockResolvedValue(mockMedia);

    const result = await useCase.execute(file);

    expect(mockMediaRepository.upload).toHaveBeenCalledWith(file);
    expect(result).toEqual(mockMedia);
  });

  it('should upload a PNG image', async () => {
    const file = createMockFile('image.png', 'image/png', 204800);
    const pngMedia = { ...mockMedia, mimeType: 'image/png', filename: 'image.png' };
    vi.mocked(mockMediaRepository.upload).mockResolvedValue(pngMedia);

    const result = await useCase.execute(file);

    expect(mockMediaRepository.upload).toHaveBeenCalledWith(file);
    expect(result.mimeType).toBe('image/png');
  });

  it('should throw error when file is not an image', async () => {
    const file = createMockFile('document.pdf', 'application/pdf', 102400);

    await expect(useCase.execute(file)).rejects.toThrow('Only image files are allowed');
    expect(mockMediaRepository.upload).not.toHaveBeenCalled();
  });

  it('should throw error when file size exceeds limit', async () => {
    const file = createMockFile('large-image.jpg', 'image/jpeg', 11 * 1024 * 1024); // 11MB

    await expect(useCase.execute(file)).rejects.toThrow('File size exceeds maximum limit');
    expect(mockMediaRepository.upload).not.toHaveBeenCalled();
  });

  it('should accept file at exactly the size limit', async () => {
    const file = createMockFile('max-size.jpg', 'image/jpeg', 10 * 1024 * 1024); // 10MB
    vi.mocked(mockMediaRepository.upload).mockResolvedValue(mockMedia);

    const result = await useCase.execute(file);

    expect(mockMediaRepository.upload).toHaveBeenCalledWith(file);
    expect(result).toEqual(mockMedia);
  });

  it('should accept WebP images', async () => {
    const file = createMockFile('image.webp', 'image/webp', 50000);
    const webpMedia = { ...mockMedia, mimeType: 'image/webp' };
    vi.mocked(mockMediaRepository.upload).mockResolvedValue(webpMedia);

    const result = await useCase.execute(file);

    expect(result.mimeType).toBe('image/webp');
  });

  it('should accept GIF images', async () => {
    const file = createMockFile('animation.gif', 'image/gif', 500000);
    const gifMedia = { ...mockMedia, mimeType: 'image/gif' };
    vi.mocked(mockMediaRepository.upload).mockResolvedValue(gifMedia);

    const result = await useCase.execute(file);

    expect(result.mimeType).toBe('image/gif');
  });

  it('should propagate repository errors', async () => {
    const file = createMockFile('photo.jpg', 'image/jpeg', 102400);
    const error = new Error('Upload failed');
    vi.mocked(mockMediaRepository.upload).mockRejectedValue(error);

    await expect(useCase.execute(file)).rejects.toThrow('Upload failed');
  });
});
