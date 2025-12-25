import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTagUseCase } from '@/application/usecases/tag/CreateTagUseCase';
import { ITagRepository, CreateTagData } from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';

describe('CreateTagUseCase', () => {
  let useCase: CreateTagUseCase;
  let mockTagRepository: ITagRepository;

  const mockTag: Tag = {
    id: 1,
    name: 'Go',
    slug: 'go',
    postCount: 0,
  };

  beforeEach(() => {
    mockTagRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new CreateTagUseCase(mockTagRepository);
  });

  it('should create a tag with valid data', async () => {
    const createData: CreateTagData = {
      name: 'Go',
    };

    vi.mocked(mockTagRepository.create).mockResolvedValue(mockTag);

    const result = await useCase.execute(createData);

    expect(mockTagRepository.create).toHaveBeenCalledWith(createData);
    expect(result).toEqual(mockTag);
  });

  it('should throw error when name is empty', async () => {
    const createData: CreateTagData = {
      name: '',
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Tag name is required');
    expect(mockTagRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when name is only whitespace', async () => {
    const createData: CreateTagData = {
      name: '   ',
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Tag name is required');
    expect(mockTagRepository.create).not.toHaveBeenCalled();
  });

  it('should create a tag with custom slug', async () => {
    const createData: CreateTagData = {
      name: 'Go',
      slug: 'golang',
    };

    const tagWithSlug = { ...mockTag, slug: 'golang' };
    vi.mocked(mockTagRepository.create).mockResolvedValue(tagWithSlug);

    const result = await useCase.execute(createData);

    expect(mockTagRepository.create).toHaveBeenCalledWith(createData);
    expect(result.slug).toBe('golang');
  });

  it('should propagate repository errors', async () => {
    const createData: CreateTagData = {
      name: 'Go',
    };

    const error = new Error('Database error');
    vi.mocked(mockTagRepository.create).mockRejectedValue(error);

    await expect(useCase.execute(createData)).rejects.toThrow('Database error');
  });
});
