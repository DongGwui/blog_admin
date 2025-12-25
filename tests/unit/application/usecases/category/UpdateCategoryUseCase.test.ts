import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateCategoryUseCase } from '@/application/usecases/category/UpdateCategoryUseCase';
import { ICategoryRepository, UpdateCategoryData } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/Category';

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let mockCategoryRepository: ICategoryRepository;

  const mockCategory: Category = {
    id: 1,
    name: '개발',
    slug: 'dev',
    description: '개발 관련 글',
    postCount: 10,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockCategoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new UpdateCategoryUseCase(mockCategoryRepository);
  });

  it('should update a category with valid data', async () => {
    const updateData: UpdateCategoryData = {
      name: '개발 업데이트',
      description: '수정된 설명',
    };

    const updatedCategory = { ...mockCategory, ...updateData };
    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(mockCategory);
    vi.mocked(mockCategoryRepository.update).mockResolvedValue(updatedCategory);

    const result = await useCase.execute(1, updateData);

    expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
    expect(mockCategoryRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.name).toBe('개발 업데이트');
  });

  it('should throw error when id is invalid', async () => {
    const updateData: UpdateCategoryData = { name: '개발' };

    await expect(useCase.execute(0, updateData)).rejects.toThrow('Invalid category ID');
    expect(mockCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when category not found', async () => {
    const updateData: UpdateCategoryData = { name: '개발' };

    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999, updateData)).rejects.toThrow('Category not found');
    expect(mockCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when name is empty string', async () => {
    const updateData: UpdateCategoryData = { name: '' };

    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(mockCategory);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Category name cannot be empty');
    expect(mockCategoryRepository.update).not.toHaveBeenCalled();
  });

  it('should update only description', async () => {
    const updateData: UpdateCategoryData = { description: '새 설명' };

    const updatedCategory = { ...mockCategory, description: '새 설명' };
    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(mockCategory);
    vi.mocked(mockCategoryRepository.update).mockResolvedValue(updatedCategory);

    const result = await useCase.execute(1, updateData);

    expect(mockCategoryRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.description).toBe('새 설명');
  });

  it('should propagate repository errors', async () => {
    const updateData: UpdateCategoryData = { name: '개발' };
    const error = new Error('Database error');

    vi.mocked(mockCategoryRepository.findById).mockResolvedValue(mockCategory);
    vi.mocked(mockCategoryRepository.update).mockRejectedValue(error);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Database error');
  });
});
