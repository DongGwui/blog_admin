import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTagsUseCase } from '@/application/usecases/tag/GetTagsUseCase';
import { ITagRepository } from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';

describe('GetTagsUseCase', () => {
  let useCase: GetTagsUseCase;
  let mockTagRepository: ITagRepository;

  const mockTags: Tag[] = [
    { id: 1, name: 'Go', slug: 'go', postCount: 10 },
    { id: 2, name: 'TypeScript', slug: 'typescript', postCount: 5 },
  ];

  beforeEach(() => {
    mockTagRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new GetTagsUseCase(mockTagRepository);
  });

  it('should return all tags', async () => {
    vi.mocked(mockTagRepository.findAll).mockResolvedValue(mockTags);

    const result = await useCase.execute();

    expect(mockTagRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockTags);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no tags exist', async () => {
    vi.mocked(mockTagRepository.findAll).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockTagRepository.findAll).mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Database error');
  });
});
