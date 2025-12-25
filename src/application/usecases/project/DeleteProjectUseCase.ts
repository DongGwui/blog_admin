import { IProjectRepository } from '@/domain/repositories/IProjectRepository';

export class DeleteProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('Invalid project ID');
    }

    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    await this.projectRepository.delete(id);
  }
}
