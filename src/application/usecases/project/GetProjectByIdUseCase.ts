import { IProjectRepository } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

export class GetProjectByIdUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: number): Promise<Project | null> {
    if (id <= 0) {
      throw new Error('Invalid project ID');
    }

    return this.projectRepository.findById(id);
  }
}
