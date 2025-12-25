import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProjectByIdUseCase } from '@/application/usecases/project/GetProjectByIdUseCase';
import { IProjectRepository } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

describe('GetProjectByIdUseCase', () => {
  let useCase: GetProjectByIdUseCase;
  let mockProjectRepository: IProjectRepository;

  const mockProject: Project = {
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
    useCase = new GetProjectByIdUseCase(mockProjectRepository);
  });

  it('should return project when found', async () => {
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);

    const result = await useCase.execute(1);

    expect(mockProjectRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockProject);
  });

  it('should return null when project not found', async () => {
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(null);

    const result = await useCase.execute(999);

    expect(result).toBeNull();
  });

  it('should throw error when id is invalid (zero)', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw error when id is invalid (negative)', async () => {
    await expect(useCase.execute(-1)).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.findById).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database error');
    vi.mocked(mockProjectRepository.findById).mockRejectedValue(error);

    await expect(useCase.execute(1)).rejects.toThrow('Database error');
  });
});
