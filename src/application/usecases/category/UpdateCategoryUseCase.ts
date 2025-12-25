import { ICategoryRepository, UpdateCategoryData } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/Category';

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: number, data: UpdateCategoryData): Promise<Category> {
    if (id <= 0) {
      throw new Error('Invalid category ID');
    }

    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('Category name cannot be empty');
    }

    return this.categoryRepository.update(id, data);
  }
}
