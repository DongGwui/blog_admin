import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetPostByIdUseCase } from '@/application/usecases/post/GetPostByIdUseCase';
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

describe('GetPostByIdUseCase', () => {
  let useCase: GetPostByIdUseCase;
  let mockPostRepository: IPostRepository;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    slug: 'test-post',
    content: 'This is test content',
    excerpt: 'This is test...',
    status: 'published',
    categoryId: 1,
    tagIds: [1, 2],
    thumbnail: 'https://example.com/image.jpg',
    viewCount: 100,
    readingTime: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    publishedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockPostRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateStatus: vi.fn(),
    };
    useCase = new GetPostByIdUseCase(mockPostRepository);
  });

  it('should return a post when found', async () => {
    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);

    const result = await useCase.execute(1);

    expect(mockPostRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockPost);
  });

  it('should throw error when id is invalid (zero)', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Invalid post ID');
    expect(mockPostRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw error when id is invalid (negative)', async () => {
    await expect(useCase.execute(-1)).rejects.toThrow('Invalid post ID');
    expect(mockPostRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw error when post not found', async () => {
    vi.mocked(mockPostRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow('Post not found');
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockPostRepository.findById).mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Database error');
  });
});
