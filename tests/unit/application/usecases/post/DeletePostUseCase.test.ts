import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeletePostUseCase } from '@/application/usecases/post/DeletePostUseCase';
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

describe('DeletePostUseCase', () => {
  let useCase: DeletePostUseCase;
  let mockPostRepository: IPostRepository;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    slug: 'test-post',
    content: 'This is test content',
    excerpt: 'This is test...',
    status: 'draft',
    categoryId: 1,
    tagIds: [1, 2],
    thumbnail: null,
    viewCount: 0,
    readingTime: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    publishedAt: null,
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
    useCase = new DeletePostUseCase(mockPostRepository);
  });

  it('should delete a post when found', async () => {
    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);
    vi.mocked(mockPostRepository.delete).mockResolvedValue();

    await useCase.execute(1);

    expect(mockPostRepository.findById).toHaveBeenCalledWith(1);
    expect(mockPostRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when id is invalid (zero)', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Invalid post ID');
    expect(mockPostRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when id is invalid (negative)', async () => {
    await expect(useCase.execute(-1)).rejects.toThrow('Invalid post ID');
    expect(mockPostRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when post not found', async () => {
    vi.mocked(mockPostRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow('Post not found');
    expect(mockPostRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');

    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);
    vi.mocked(mockPostRepository.delete).mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Database error');
  });
});
