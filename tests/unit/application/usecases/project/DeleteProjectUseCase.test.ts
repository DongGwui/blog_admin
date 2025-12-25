import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteProjectUseCase } from '@/application/usecases/project/DeleteProjectUseCase';
import { IProjectRepository } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

describe('DeleteProjectUseCase', () => {
  let useCase: DeleteProjectUseCase;
  let mockProjectRepository: IProjectRepository;

  const mockProject: Project = {
    id: 1,
    title: 'Project',
    description: 'Description',
    content: 'Content',
    thumbnailUrl: null,
    githubUrl: null,
    demoUrl: null,
    techStack: ['React'],
    order: 1,
    isVisible: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockProjectRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      reorder: vi.fn(),
    };
    useCase = new DeleteProjectUseCase(mockProjectRepository);
  });

  it('should delete project when found', async () => {
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);
    vi.mocked(mockProjectRepository.delete).mockResolvedValue();

    await useCase.execute(1);

    expect(mockProjectRepository.findById).toHaveBeenCalledWith(1);
    expect(mockProjectRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw error when id is invalid (zero)', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when id is invalid (negative)', async () => {
    await expect(useCase.execute(-1)).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw error when project not found', async () => {
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow('Project not found');
    expect(mockProjectRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);
    vi.mocked(mockProjectRepository.delete).mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Database error');
  });
});
