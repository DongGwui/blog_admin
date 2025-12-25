import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetPostsUseCase } from '@/application/usecases/post/GetPostsUseCase';
import { IPostRepository, GetPostsParams, GetPostsResult } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

describe('GetPostsUseCase', () => {
  let useCase: GetPostsUseCase;
  let mockPostRepository: IPostRepository;

  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'First Post',
      slug: 'first-post',
      content: 'First content',
      excerpt: 'First...',
      status: 'published',
      categoryId: 1,
      tagIds: [1],
      thumbnail: null,
      viewCount: 100,
      readingTime: 2,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      publishedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      title: 'Second Post',
      slug: 'second-post',
      content: 'Second content',
      excerpt: 'Second...',
      status: 'draft',
      categoryId: 2,
      tagIds: [2, 3],
      thumbnail: 'https://example.com/image.jpg',
      viewCount: 0,
      readingTime: 1,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      publishedAt: null,
    },
  ];

  const mockResult: GetPostsResult = {
    posts: mockPosts,
    total: 2,
    page: 1,
    totalPages: 1,
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
    useCase = new GetPostsUseCase(mockPostRepository);
  });

  it('should return all posts without filters', async () => {
    vi.mocked(mockPostRepository.findAll).mockResolvedValue(mockResult);

    const result = await useCase.execute();

    expect(mockPostRepository.findAll).toHaveBeenCalledWith({});
    expect(result).toEqual(mockResult);
    expect(result.posts).toHaveLength(2);
  });

  it('should filter posts by status', async () => {
    const params: GetPostsParams = { status: 'published' };
    const filteredResult: GetPostsResult = {
      posts: [mockPosts[0]],
      total: 1,
      page: 1,
      totalPages: 1,
    };

    vi.mocked(mockPostRepository.findAll).mockResolvedValue(filteredResult);

    const result = await useCase.execute(params);

    expect(mockPostRepository.findAll).toHaveBeenCalledWith(params);
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].status).toBe('published');
  });

  it('should paginate posts', async () => {
    const params: GetPostsParams = { page: 2, limit: 10 };
    const paginatedResult: GetPostsResult = {
      posts: mockPosts,
      total: 25,
      page: 2,
      totalPages: 3,
    };

    vi.mocked(mockPostRepository.findAll).mockResolvedValue(paginatedResult);

    const result = await useCase.execute(params);

    expect(mockPostRepository.findAll).toHaveBeenCalledWith(params);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(3);
  });

  it('should filter and paginate posts together', async () => {
    const params: GetPostsParams = { status: 'draft', page: 1, limit: 5 };
    const filteredPaginatedResult: GetPostsResult = {
      posts: [mockPosts[1]],
      total: 1,
      page: 1,
      totalPages: 1,
    };

    vi.mocked(mockPostRepository.findAll).mockResolvedValue(filteredPaginatedResult);

    const result = await useCase.execute(params);

    expect(mockPostRepository.findAll).toHaveBeenCalledWith(params);
    expect(result.posts[0].status).toBe('draft');
  });

  it('should return empty array when no posts found', async () => {
    const emptyResult: GetPostsResult = {
      posts: [],
      total: 0,
      page: 1,
      totalPages: 0,
    };

    vi.mocked(mockPostRepository.findAll).mockResolvedValue(emptyResult);

    const result = await useCase.execute();

    expect(result.posts).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockPostRepository.findAll).mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Database error');
  });
});
