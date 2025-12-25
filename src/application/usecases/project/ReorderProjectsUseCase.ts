import { IProjectRepository } from '@/domain/repositories/IProjectRepository';

export class ReorderProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(ids: number[]): Promise<void> {
    if (ids.length === 0) {
      throw new Error('Project IDs are required');
    }

    for (const id of ids) {
      if (id <= 0) {
        throw new Error('Invalid project ID');
      }
    }

    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      throw new Error('Duplicate project IDs');
    }

    await this.projectRepository.reorder(ids);
  }
}
