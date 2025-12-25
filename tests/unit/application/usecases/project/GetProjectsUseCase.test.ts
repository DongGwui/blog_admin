import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProjectsUseCase } from '@/application/usecases/project/GetProjectsUseCase';
import { IProjectRepository } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

describe('GetProjectsUseCase', () => {
  let useCase: GetProjectsUseCase;
  let mockProjectRepository: IProjectRepository;

  const mockProjects: Project[] = [
    {
      id: 1,
      title: 'Project 1',
      description: 'Description 1',
      content: 'Content 1',
      thumbnailUrl: 'https://example.com/thumb1.jpg',
      githubUrl: 'https://github.com/example/project1',
      demoUrl: 'https://demo.example.com/project1',
      techStack: ['React', 'TypeScript'],
      order: 1,
      isVisible: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 2,
      title: 'Project 2',
      description: 'Description 2',
      content: 'Content 2',
      thumbnailUrl: null,
      githubUrl: null,
      demoUrl: null,
      techStack: ['Next.js', 'Tailwind'],
      order: 2,
      isVisible: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
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
    useCase = new GetProjectsUseCase(mockProjectRepository);
  });

  it('should return all projects', async () => {
    vi.mocked(mockProjectRepository.findAll).mockResolvedValue(mockProjects);

    const result = await useCase.execute();

    expect(mockProjectRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockProjects);
    expect(result).toHaveLength(2);
  });

  it('should return empty array when no projects exist', async () => {
    vi.mocked(mockProjectRepository.findAll).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockProjectRepository.findAll).mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Database error');
  });
});
