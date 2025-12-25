import { IProjectRepository, UpdateProjectData } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

export class UpdateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: number, data: UpdateProjectData): Promise<Project> {
    if (id <= 0) {
      throw new Error('Invalid project ID');
    }

    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new Error('Project not found');
    }

    if (data.title !== undefined && data.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }

    if (data.description !== undefined && data.description.trim() === '') {
      throw new Error('Description cannot be empty');
    }

    return this.projectRepository.update(id, data);
  }
}
