import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateCategoryUseCase } from '@/application/usecases/category/CreateCategoryUseCase';
import { ICategoryRepository, CreateCategoryData } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/Category';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let mockCategoryRepository: ICategoryRepository;

  const mockCategory: Category = {
    id: 1,
    name: '개발',
    slug: 'dev',
    description: '개발 관련 글',
    postCount: 0,
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
    useCase = new CreateCategoryUseCase(mockCategoryRepository);
  });

  it('should create a category with valid data', async () => {
    const createData: CreateCategoryData = {
      name: '개발',
      description: '개발 관련 글',
    };

    vi.mocked(mockCategoryRepository.create).mockResolvedValue(mockCategory);

    const result = await useCase.execute(createData);

    expect(mockCategoryRepository.create).toHaveBeenCalledWith(createData);
    expect(result).toEqual(mockCategory);
  });

  it('should throw error when name is empty', async () => {
    const createData: CreateCategoryData = {
      name: '',
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Category name is required');
    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when name is only whitespace', async () => {
    const createData: CreateCategoryData = {
      name: '   ',
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Category name is required');
    expect(mockCategoryRepository.create).not.toHaveBeenCalled();
  });

  it('should create a category without description', async () => {
    const createData: CreateCategoryData = {
      name: '개발',
    };

    const categoryWithoutDesc = { ...mockCategory, description: null };
    vi.mocked(mockCategoryRepository.create).mockResolvedValue(categoryWithoutDesc);

    const result = await useCase.execute(createData);

    expect(mockCategoryRepository.create).toHaveBeenCalledWith(createData);
    expect(result.description).toBeNull();
  });

  it('should propagate repository errors', async () => {
    const createData: CreateCategoryData = {
      name: '개발',
    };

    const error = new Error('Database error');
    vi.mocked(mockCategoryRepository.create).mockRejectedValue(error);

    await expect(useCase.execute(createData)).rejects.toThrow('Database error');
  });
});
