import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('Invalid category ID');
    }

    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new Error('Category not found');
    }

    if (existingCategory.postCount > 0) {
      throw new Error('Cannot delete category with existing posts');
    }

    await this.categoryRepository.delete(id);
  }
}
