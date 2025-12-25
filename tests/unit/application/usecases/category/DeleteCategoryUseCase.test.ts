import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteCategoryUseCase } from '@/application/usecases/category/DeleteCategoryUseCase';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/Category';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let mockCategoryRepository: ICategoryRepository;

  const mockCategory: Category = {
    id: 1,
    name: '개발',
    slug: 'dev',
    description: '개발 관련 글',
    postCount: 0,
    createdAt: new Date('2024-01-01'),
  };

  const mockCategoryWithPosts: Category = {
    ...mockCategory,
    postCount: 5,
  };

  beforeEach(() => {
    mockCategoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new DeleteCategoryUseCase(mockCategoryRepository);
  });

  it('should delete a category when it has no posts', async () => {
    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(mockCategory);
    vi.mocked(mockCategoryRepository.delete).mockResolvedValue();

    await useCase.execute(1);

    expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
    expect(mockCategoryRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when id is invalid', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Invalid category ID');
    expect(mockCategoryRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when category not found', async () => {
    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow('Category not found');
    expect(mockCategoryRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when category has posts', async () => {
    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(mockCategoryWithPosts);

    await expect(useCase.execute(1)).rejects.toThrow(
      'Cannot delete category with existing posts'
    );
    expect(mockCategoryRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');

    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(mockCategory);
    vi.mocked(mockCategoryRepository.delete).mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Database error');
  });
});
