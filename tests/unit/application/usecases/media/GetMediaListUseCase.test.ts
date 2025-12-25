import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetMediaListUseCase } from '@/application/usecases/media/GetMediaListUseCase';
import { IMediaRepository, GetMediaParams, GetMediaResult } from '@/domain/repositories/IMediaRepository';
import { Media } from '@/domain/entities/Media';

describe('GetMediaListUseCase', () => {
  let useCase: GetMediaListUseCase;
  let mockMediaRepository: IMediaRepository;

  const mockMedia: Media[] = [
    {
      id: 1,
      filename: 'image1.jpg',
      originalName: 'photo1.jpg',
      url: 'https://cdn.example.com/image1.jpg',
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
      url: 'https://cdn.example.com/image2.png',
      mimeType: 'image/png',
      size: 204800,
      width: 1920,
      height: 1080,
      createdAt: new Date('2024-01-02'),
    },
  ];

  const mockResult: GetMediaResult = {
    media: mockMedia,
    total: 2,
    page: 1,
    totalPages: 1,
  };

  beforeEach(() => {
    mockMediaRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      upload: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new GetMediaListUseCase(mockMediaRepository);
  });

  it('should return all media without params', async () => {
    vi.mocked(mockMediaRepository.findAll).mockResolvedValue(mockResult);

    const result = await useCase.execute();

    expect(mockMediaRepository.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual(mockResult);
    expect(result.media).toHaveLength(2);
  });

  it('should paginate media', async () => {
    const params: GetMediaParams = { page: 2, limit: 20 };
    const paginatedResult: GetMediaResult = {
      media: mockMedia,
      total: 50,
      page: 2,
      totalPages: 3,
    };

    vi.mocked(mockMediaRepository.findAll).mockResolvedValue(paginatedResult);

    const result = await useCase.execute(params);

    expect(mockMediaRepository.findAll).toHaveBeenCalledWith(params);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
  });

  it('should return empty array when no media found', async () => {
    const emptyResult: GetMediaResult = {
      media: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };

    vi.mocked(mockMediaRepository.findAll).mockResolvedValue(emptyResult);

    const result = await useCase.execute();

    expect(result.media).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockMediaRepository.findAll).mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Database error');
  });
});
