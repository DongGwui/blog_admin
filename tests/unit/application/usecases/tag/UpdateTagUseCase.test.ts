import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTagUseCase } from '@/application/usecases/tag/UpdateTagUseCase';
import { ITagRepository, UpdateTagData } from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';

describe('UpdateTagUseCase', () => {
  let useCase: UpdateTagUseCase;
  let mockTagRepository: ITagRepository;

  const mockTag: Tag = {
    id: 1,
    name: 'Go',
    slug: 'go',
    postCount: 10,
  };

  beforeEach(() => {
    mockTagRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new UpdateTagUseCase(mockTagRepository);
  });

  it('should update a tag with valid data', async () => {
    const updateData: UpdateTagData = {
      name: 'Golang',
    };

    const updatedTag = { ...mockTag, name: 'Golang' };
    vi.mocked(mockTagRepository.findById).mockResolvedValue(mockTag);
    vi.mocked(mockTagRepository.update).mockResolvedValue(updatedTag);

    const result = await useCase.execute(1, updateData);

    expect(mockTagRepository.findById).toHaveBeenCalledWith(1);
    expect(mockTagRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.name).toBe('Golang');
  });

  it('should throw error when id is invalid', async () => {
    const updateData: UpdateTagData = { name: 'Go' };

    await expect(useCase.execute(0, updateData)).rejects.toThrow('Invalid tag ID');
    expect(mockTagRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when tag not found', async () => {
    const updateData: UpdateTagData = { name: 'Go' };

    vi.mocked(mockTagRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999, updateData)).rejects.toThrow('Tag not found');
    expect(mockTagRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when name is empty string', async () => {
    const updateData: UpdateTagData = { name: '' };

    vi.mocked(mockTagRepository.findById).mockResolvedValue(mockTag);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Tag name cannot be empty');
    expect(mockTagRepository.update).not.toHaveBeenCalled();
  });

  it('should update only slug', async () => {
    const updateData: UpdateTagData = { slug: 'golang' };

    const updatedTag = { ...mockTag, slug: 'golang' };
    vi.mocked(mockTagRepository.findById).mockResolvedValue(mockTag);
    vi.mocked(mockTagRepository.update).mockResolvedValue(updatedTag);

    const result = await useCase.execute(1, updateData);

    expect(mockTagRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.slug).toBe('golang');
  });

  it('should propagate repository errors', async () => {
    const updateData: UpdateTagData = { name: 'Go' };
    const error = new Error('Database error');

    vi.mocked(mockTagRepository.findById).mockResolvedValue(mockTag);
    vi.mocked(mockTagRepository.update).mockRejectedValue(error);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Database error');
  });
});
