import { ICategoryRepository, CreateCategoryData } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/Category';

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(data: CreateCategoryData): Promise<Category> {
    if (!data.name || !data.name.trim()) {
      throw new Error('Category name is required');
    }

    return this.categoryRepository.create(data);
  }
}
