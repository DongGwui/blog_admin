import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProjectUseCase } from '@/application/usecases/project/CreateProjectUseCase';
import { IProjectRepository, CreateProjectData } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

describe('CreateProjectUseCase', () => {
  let useCase: CreateProjectUseCase;
  let mockProjectRepository: IProjectRepository;

  const mockProject: Project = {
    id: 1,
    title: 'New Project',
    description: 'Project description',
    content: 'Project content',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    githubUrl: 'https://github.com/example/project',
    demoUrl: 'https://demo.example.com',
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
    useCase = new CreateProjectUseCase(mockProjectRepository);
  });

  it('should create project with valid data', async () => {
    const createData: CreateProjectData = {
      title: 'New Project',
      description: 'Project description',
      content: 'Project content',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      githubUrl: 'https://github.com/example/project',
      demoUrl: 'https://demo.example.com',
      techStack: ['React', 'TypeScript'],
    };
    vi.mocked(mockProjectRepository.create).mockResolvedValue(mockProject);

    const result = await useCase.execute(createData);

    expect(mockProjectRepository.create).toHaveBeenCalledWith(createData);
    expect(result).toEqual(mockProject);
  });

  it('should create project with minimal data', async () => {
    const createData: CreateProjectData = {
      title: 'Simple Project',
      description: 'Simple description',
      techStack: [],
    };
    const minimalProject = { ...mockProject, ...createData, thumbnailUrl: null, githubUrl: null, demoUrl: null };
    vi.mocked(mockProjectRepository.create).mockResolvedValue(minimalProject);

    const result = await useCase.execute(createData);

    expect(mockProjectRepository.create).toHaveBeenCalledWith(createData);
    expect(result.title).toBe('Simple Project');
  });

  it('should throw error when title is empty', async () => {
    const createData: CreateProjectData = {
      title: '',
      description: 'Description',
      techStack: [],
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Title is required');
    expect(mockProjectRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when title is whitespace only', async () => {
    const createData: CreateProjectData = {
      title: '   ',
      description: 'Description',
      techStack: [],
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Title is required');
    expect(mockProjectRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error when description is empty', async () => {
    const createData: CreateProjectData = {
      title: 'Project',
      description: '',
      techStack: [],
    };

    await expect(useCase.execute(createData)).rejects.toThrow('Description is required');
    expect(mockProjectRepository.create).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const createData: CreateProjectData = {
      title: 'Project',
      description: 'Description',
      techStack: [],
    };
    const error = new Error('Database error');
    vi.mocked(mockProjectRepository.create).mockRejectedValue(error);

    await expect(useCase.execute(createData)).rejects.toThrow('Database error');
  });
});
