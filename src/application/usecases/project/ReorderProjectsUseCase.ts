import { IProjectRepository } from '@/domain/repositories/IProjectRepository';

export interface ReorderInput {
  id: number;
  sortOrder: number;
}

export class ReorderProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(orders: ReorderInput[]): Promise<void> {
    if (orders.length === 0) {
      throw new Error('Project orders are required');
    }

    for (const order of orders) {
      if (order.id <= 0) {
        throw new Error('Invalid project ID');
      }
      if (order.sortOrder < 0) {
        throw new Error('Invalid sort order');
      }
    }

    const uniqueIds = new Set(orders.map(o => o.id));
    if (uniqueIds.size !== orders.length) {
      throw new Error('Duplicate project IDs');
    }

    await this.projectRepository.reorder(orders);
  }
}
