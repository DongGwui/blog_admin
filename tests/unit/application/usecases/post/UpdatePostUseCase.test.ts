import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdatePostUseCase } from '@/application/usecases/post/UpdatePostUseCase';
import { IPostRepository, UpdatePostData } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

describe('UpdatePostUseCase', () => {
  let useCase: UpdatePostUseCase;
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
    useCase = new UpdatePostUseCase(mockPostRepository);
  });

  it('should update a post with valid data', async () => {
    const updateData: UpdatePostData = {
      title: 'Updated Title',
      content: 'Updated content',
    };

    const updatedPost = { ...mockPost, ...updateData };
    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);
    vi.mocked(mockPostRepository.update).mockResolvedValue(updatedPost);

    const result = await useCase.execute(1, updateData);

    expect(mockPostRepository.findById).toHaveBeenCalledWith(1);
    expect(mockPostRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.title).toBe('Updated Title');
  });

  it('should throw error when id is invalid (zero)', async () => {
    const updateData: UpdatePostData = { title: 'Updated Title' };

    await expect(useCase.execute(0, updateData)).rejects.toThrow('Invalid post ID');
    expect(mockPostRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when id is invalid (negative)', async () => {
    const updateData: UpdatePostData = { title: 'Updated Title' };

    await expect(useCase.execute(-1, updateData)).rejects.toThrow('Invalid post ID');
    expect(mockPostRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when post not found', async () => {
    const updateData: UpdatePostData = { title: 'Updated Title' };

    vi.mocked(mockPostRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999, updateData)).rejects.toThrow('Post not found');
    expect(mockPostRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when title is empty string', async () => {
    const updateData: UpdatePostData = { title: '' };

    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Title cannot be empty');
    expect(mockPostRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when title is only whitespace', async () => {
    const updateData: UpdatePostData = { title: '   ' };

    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Title cannot be empty');
    expect(mockPostRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when content is empty string', async () => {
    const updateData: UpdatePostData = { content: '' };

    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Content cannot be empty');
    expect(mockPostRepository.update).not.toHaveBeenCalled();
  });

  it('should update only specific fields', async () => {
    const updateData: UpdatePostData = { categoryId: 2 };

    const updatedPost = { ...mockPost, categoryId: 2 };
    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);
    vi.mocked(mockPostRepository.update).mockResolvedValue(updatedPost);

    const result = await useCase.execute(1, updateData);

    expect(mockPostRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.categoryId).toBe(2);
    expect(result.title).toBe(mockPost.title);
  });

  it('should update tags', async () => {
    const updateData: UpdatePostData = { tagIds: [3, 4, 5] };

    const updatedPost = { ...mockPost, tagIds: [3, 4, 5] };
    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);
    vi.mocked(mockPostRepository.update).mockResolvedValue(updatedPost);

    const result = await useCase.execute(1, updateData);

    expect(result.tagIds).toEqual([3, 4, 5]);
  });

  it('should propagate repository errors', async () => {
    const updateData: UpdatePostData = { title: 'Updated Title' };
    const error = new Error('Database error');

    vi.mocked(mockPostRepository.findById).mockResolvedValue(mockPost);
    vi.mocked(mockPostRepository.update).mockRejectedValue(error);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Database error');
  });
});
