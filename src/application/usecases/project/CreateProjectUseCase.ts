import { IProjectRepository, CreateProjectData } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(data: CreateProjectData): Promise<Project> {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Title is required');
    }

    if (!data.description || data.description.trim() === '') {
      throw new Error('Description is required');
    }

    return this.projectRepository.create(data);
  }
}
