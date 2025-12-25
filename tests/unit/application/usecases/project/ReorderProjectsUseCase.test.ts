import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReorderProjectsUseCase, ReorderInput } from '@/application/usecases/project/ReorderProjectsUseCase';
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

  const validOrders: ReorderInput[] = [
    { id: 3, sortOrder: 1 },
    { id: 1, sortOrder: 2 },
    { id: 2, sortOrder: 3 },
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

  it('should reorder projects with valid orders', async () => {
    vi.mocked(mockProjectRepository.findAll).mockResolvedValue(mockProjects);
    vi.mocked(mockProjectRepository.reorder).mockResolvedValue();

    await useCase.execute(validOrders);

    expect(mockProjectRepository.reorder).toHaveBeenCalledWith(validOrders);
  });

  it('should throw error when orders array is empty', async () => {
    await expect(useCase.execute([])).rejects.toThrow('Project orders are required');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should throw error when orders contain invalid id (zero)', async () => {
    const invalidOrders: ReorderInput[] = [
      { id: 1, sortOrder: 1 },
      { id: 0, sortOrder: 2 },
    ];
    await expect(useCase.execute(invalidOrders)).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should throw error when orders contain invalid id (negative)', async () => {
    const invalidOrders: ReorderInput[] = [
      { id: 1, sortOrder: 1 },
      { id: -1, sortOrder: 2 },
    ];
    await expect(useCase.execute(invalidOrders)).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should throw error when orders contain invalid sortOrder (negative)', async () => {
    const invalidOrders: ReorderInput[] = [
      { id: 1, sortOrder: -1 },
    ];
    await expect(useCase.execute(invalidOrders)).rejects.toThrow('Invalid sort order');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should throw error when orders contain duplicate ids', async () => {
    const duplicateOrders: ReorderInput[] = [
      { id: 1, sortOrder: 1 },
      { id: 2, sortOrder: 2 },
      { id: 1, sortOrder: 3 },
    ];
    await expect(useCase.execute(duplicateOrders)).rejects.toThrow('Duplicate project IDs');
    expect(mockProjectRepository.reorder).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockProjectRepository.reorder).mockRejectedValue(error);

    await expect(useCase.execute(validOrders)).rejects.toThrow('Database error');
  });
});
