import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCategoriesUseCase } from '@/application/usecases/category/GetCategoriesUseCase';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/Category';

describe('GetCategoriesUseCase', () => {
  let useCase: GetCategoriesUseCase;
  let mockCategoryRepository: ICategoryRepository;

  const mockCategories: Category[] = [
    {
      id: 1,
      name: '개발',
      slug: 'dev',
      description: '개발 관련 글',
      postCount: 10,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      name: '일상',
      slug: 'daily',
      description: null,
      postCount: 5,
      createdAt: new Date('2024-01-02'),
    },
  ];

  beforeEach(() => {
    mockCategoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new GetCategoriesUseCase(mockCategoryRepository);
  });

  it('should return all categories', async () => {
    vi.mocked(mockCategoryRepository.findAll).mockResolvedValue(mockCategories);

    const result = await useCase.execute();

    expect(mockCategoryRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no categories exist', async () => {
    vi.mocked(mockCategoryRepository.findAll).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockCategoryRepository.findAll).mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Database error');
  });
});
