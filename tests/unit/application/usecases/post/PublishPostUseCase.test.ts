import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PublishPostUseCase } from '@/application/usecases/post/PublishPostUseCase';
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

describe('PublishPostUseCase', () => {
  let useCase: PublishPostUseCase;
  let mockPostRepository: IPostRepository;

  const mockDraftPost: Post = {
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

  const mockPublishedPost: Post = {
    ...mockDraftPost,
    status: 'published',
    publishedAt: new Date('2024-01-02'),
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
    useCase = new PublishPostUseCase(mockPostRepository);
  });

  it('should publish a draft post', async () => {
    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockDraftPost);
    vi.mocked(mockPostRepository.updateStatus).mockResolvedValue(mockPublishedPost);

    const result = await useCase.execute(1, true);

    expect(mockPostRepository.findById).toHaveBeenCalledWith(1);
    expect(mockPostRepository.updateStatus).toHaveBeenCalledWith(1, 'published');
    expect(result.status).toBe('published');
  });

  it('should unpublish a published post', async () => {
    const unpublishedPost = { ...mockPublishedPost, status: 'draft' as const, publishedAt: null };

    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPublishedPost);
    vi.mocked(mockPostRepository.updateStatus).mockResolvedValue(unpublishedPost);

    const result = await useCase.execute(1, false);

    expect(mockPostRepository.updateStatus).toHaveBeenCalledWith(1, 'draft');
    expect(result.status).toBe('draft');
  });

  it('should throw error when id is invalid (zero)', async () => {
    await expect(useCase.execute(0, true)).rejects.toThrow('Invalid post ID');
    expect(mockPostRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('should throw error when id is invalid (negative)', async () => {
    await expect(useCase.execute(-1, true)).rejects.toThrow('Invalid post ID');
    expect(mockPostRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('should throw error when post not found', async () => {
    vi.mocked(mockPostRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999, true)).rejects.toThrow('Post not found');
    expect(mockPostRepository.updateStatus).not.toHaveBeenCalled();
  });

  it('should not change status if already published and trying to publish', async () => {
    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPublishedPost);
    vi.mocked(mockPostRepository.updateStatus).mockResolvedValue(mockPublishedPost);

    const result = await useCase.execute(1, true);

    expect(mockPostRepository.updateStatus).toHaveBeenCalledWith(1, 'published');
    expect(result.status).toBe('published');
  });

  it('should not change status if already draft and trying to unpublish', async () => {
    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockDraftPost);
    vi.mocked(mockPostRepository.updateStatus).mockResolvedValue(mockDraftPost);

    const result = await useCase.execute(1, false);

    expect(mockPostRepository.updateStatus).toHaveBeenCalledWith(1, 'draft');
    expect(result.status).toBe('draft');
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');

    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockDraftPost);
    vi.mocked(mockPostRepository.updateStatus).mockRejectedValue(error);

    await expect(useCase.execute(1, true)).rejects.toThrow('Database error');
  });
});
