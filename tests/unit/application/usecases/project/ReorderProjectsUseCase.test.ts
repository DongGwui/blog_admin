import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReorderProjectsUseCase } from '@/application/usecases/project/ReorderProjectsUseCase';
import { IProjectRepository } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

describe('ReorderProjectsUseCase', () => {
  let useCase: ReorderProjectsUseCase;
  let mockProjectRepository: IProjectRepository;

  const mockProjects: Project[] = [
    {
      id: 1,
      title: 'Project 1',
      description: 'Description 1',
      content: '',
      thumbnailUrl: null,
      githubUrl: null,
      demoUrl: null,
      techStack: [],
      order: 1,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: 'Project 2',
      description: 'Description 2',
      content: '',
      thumbnailUrl: null,
      githubUrl: null,
      demoUrl: null,
      techStack: [],
      order: 2,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: 'Project 3',
      description: 'Description 3',
      content: '',
      thumbnailUrl: null,
      githubUrl: null,
      demoUrl: null,
      techStack: [],
      order: 3,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    mockProjectRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      reorder: vi.fn(),
    };
    useCase = new ReorderProjectsUseCase(mockProjectRepository);
  });

  it('should reorder projects with valid ids', async () => {
    vi.mocked(mockProjectRepository.findAll).mockResolvedValue(mockProjects);
    vi.mocked(mockProjectRepository.reorder).mockResolvedValue();

    await useCase.execute([3, 1, 2]);

    expect(mockProjectRepository.reorder).toHaveBeenCalledWith([3, 1, 2]);
  });

  it('should throw error when ids array is empty', async () => {
    await expect(useCase.execute([])).rejects.toThrow('Project IDs are required');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should throw error when ids contain invalid values (zero)', async () => {
    await expect(useCase.execute([1, 0, 2])).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should throw error when ids contain invalid values (negative)', async () => {
    await expect(useCase.execute([1, -1, 2])).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should throw error when ids contain duplicates', async () => {
    await expect(useCase.execute([1, 2, 1])).rejects.toThrow('Duplicate project IDs');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockProjectRepository.findAll).mockResolvedValue(mockProjects);
    vi.mocked(mockProjectRepository.reorder).mockRejectedValue(error);

    await expect(useCase.execute([1, 2, 3])).rejects.toThrow('Database error');
  });
});
