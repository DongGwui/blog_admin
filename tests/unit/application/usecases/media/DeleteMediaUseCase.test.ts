import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteMediaUseCase } from '@/application/usecases/media/DeleteMediaUseCase';
import { IMediaRepository } from '@/domain/repositories/IMediaRepository';

describe('DeleteMediaUseCase', () => {
  let useCase: DeleteMediaUseCase;
  let mockMediaRepository: IMediaRepository;

  beforeEach(() => {
    mockMediaRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      upload: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new DeleteMediaUseCase(mockMediaRepository);
  });

  it('should delete media with valid id', async () => {
    vi.mocked(mockMediaRepository.delete).mockResolvedValue();

    await useCase.execute(1);

    expect(mockMediaRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when id is invalid (zero)', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Invalid media ID');
    expect(mockMediaRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when id is invalid (negative)', async () => {
    await expect(useCase.execute(-1)).rejects.toThrow('Invalid media ID');
    expect(mockMediaRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockMediaRepository.delete).mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Database error');
  });
});
