import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTagUseCase } from '@/application/usecases/tag/DeleteTagUseCase';
import { ITagRepository } from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';

describe('DeleteTagUseCase', () => {
  let useCase: DeleteTagUseCase;
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
    useCase = new DeleteTagUseCase(mockTagRepository);
  });

  it('should delete a tag when found', async () => {
    vi.mocked(mockTagRepository.findById).mockResolvedValue(mockTag);
    vi.mocked(mockTagRepository.delete).mockResolvedValue();

    await useCase.execute(1);

    expect(mockTagRepository.findById).toHaveBeenCalledWith(1);
    expect(mockTagRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when id is invalid', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Invalid tag ID');
    expect(mockTagRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when tag not found', async () => {
    vi.mocked(mockTagRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow('Tag not found');
    expect(mockTagRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');

    vi.mocked(mockTagRepository.findById).mockResolvedValue(mockTag);
    vi.mocked(mockTagRepository.delete).mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Database error');
  });
});
