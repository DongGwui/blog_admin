import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateProjectUseCase } from '@/application/usecases/project/UpdateProjectUseCase';
import { IProjectRepository, UpdateProjectData } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';

describe('UpdateProjectUseCase', () => {
  let useCase: UpdateProjectUseCase;
  let mockProjectRepository: IProjectRepository;

  const mockProject: Project = {
    id: 1,
    title: 'Original Project',
    description: 'Original description',
    content: 'Original content',
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
    useCase = new UpdateProjectUseCase(mockProjectRepository);
  });

  it('should update project with valid data', async () => {
    const updateData: UpdateProjectData = {
      title: 'Updated Project',
      description: 'Updated description',
    };
    const updatedProject = { ...mockProject, ...updateData };
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);
    vi.mocked(mockProjectRepository.update).mockResolvedValue(updatedProject);

    const result = await useCase.execute(1, updateData);

    expect(mockProjectRepository.findById).toHaveBeenCalledWith(1);
    expect(mockProjectRepository.update).toHaveBeenCalledWith(1, updateData);
    expect(result.title).toBe('Updated Project');
  });

  it('should update project visibility', async () => {
    const updateData: UpdateProjectData = { isVisible: false };
    const updatedProject = { ...mockProject, isVisible: false };
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);
    vi.mocked(mockProjectRepository.update).mockResolvedValue(updatedProject);

    const result = await useCase.execute(1, updateData);

    expect(result.isVisible).toBe(false);
  });

  it('should update tech stack', async () => {
    const updateData: UpdateProjectData = { techStack: ['Vue', 'Nuxt'] };
    const updatedProject = { ...mockProject, techStack: ['Vue', 'Nuxt'] };
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);
    vi.mocked(mockProjectRepository.update).mockResolvedValue(updatedProject);

    const result = await useCase.execute(1, updateData);

    expect(result.techStack).toEqual(['Vue', 'Nuxt']);
  });

  it('should throw error when id is invalid', async () => {
    const updateData: UpdateProjectData = { title: 'Updated' };

    await expect(useCase.execute(0, updateData)).rejects.toThrow('Invalid project ID');
    expect(mockProjectRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when project not found', async () => {
    const updateData: UpdateProjectData = { title: 'Updated' };
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(null);

    await expect(useCase.execute(999, updateData)).rejects.toThrow('Project not found');
    expect(mockProjectRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when title is empty string', async () => {
    const updateData: UpdateProjectData = { title: '' };
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Title cannot be empty');
    expect(mockProjectRepository.update).not.toHaveBeenCalled();
  });

  it('should throw error when description is empty string', async () => {
    const updateData: UpdateProjectData = { description: '' };
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Description cannot be empty');
    expect(mockProjectRepository.update).not.toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const updateData: UpdateProjectData = { title: 'Updated' };
    const error = new Error('Database error');
    vi.mocked(mockProjectRepository.findById).mockResolvedValue(mockProject);
    vi.mocked(mockProjectRepository.update).mockRejectedValue(error);

    await expect(useCase.execute(1, updateData)).rejects.toThrow('Database error');
  });
});
