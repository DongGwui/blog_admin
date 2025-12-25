import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreatePostUseCase } from '@/application/usecases/post/CreatePostUseCase';
import { IPostRepository, CreatePostData } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;
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
    useCase = new CreatePostUseCase(mockPostRepository);
  });

  it('should create a post with valid data', async () => {
    const createData: CreatePostData = {
      title: 'Test Post',
      content: 'This is test content',
      categoryId: 1,
      tagIds: [1, 2],
    };

    vi.mocked(mockPostRepository.create).mockResolvedValue(mockPost);

    const result = await useCase.execute(createData);

    expect(mockPostRepository.create).toHaveBeenCalledWith(createData);
    expect(result).toEqual(mockPost);
  });

  it('should throw error when title is empty', async () => {
    const createData: CreatePostData = {
      title: '',
      content: 'This is test content',
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Title is required');
    expect(mockPostRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when title is only whitespace', async () => {
    const createData: CreatePostData = {
      title: '   ',
      content: 'This is test content',
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Title is required');
    expect(mockPostRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when content is empty', async () => {
    const createData: CreatePostData = {
      title: 'Test Post',
      content: '',
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Content is required');
    expect(mockPostRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when content is only whitespace', async () => {
    const createData: CreatePostData = {
      title: 'Test Post',
      content: '   ',
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Content is required');
    expect(mockPostRepository.create).not.toHaveBeenCalled();
  });

  it('should create a post with optional fields', async () => {
    const createData: CreatePostData = {
      title: 'Test Post',
      content: 'This is test content',
      excerpt: 'Custom excerpt',
      status: 'published',
      thumbnail: 'https://example.com/image.jpg',
    };

    const expectedPost = { ...mockPost, ...createData };
    vi.mocked(mockPostRepository.create).mockResolvedValue(expectedPost);

    const result = await useCase.execute(createData);

    expect(mockPostRepository.create).toHaveBeenCalledWith(createData);
    expect(result.excerpt).toBe('Custom excerpt');
  });

  it('should propagate repository errors', async () => {
    const createData: CreatePostData = {
      title: 'Test Post',
      content: 'This is test content',
    };

    const error = new Error('Database error');
    vi.mocked(mockPostRepository.create).mockRejectedValue(error);

    await expect(useCase.execute(createData)).rejects.toThrow('Database error');
  });
});
