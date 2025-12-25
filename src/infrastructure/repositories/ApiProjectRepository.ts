import { IProjectRepository, CreateProjectData, UpdateProjectData } from '@/domain/repositories/IProjectRepository';
import { Project } from '@/domain/entities/Project';
import { ApiClient } from '../api/ApiClient';
import {
  ProjectMapper,
  ProjectListApiResponse,
  SingleProjectApiResponse,
  ReorderProjectsApiRequest,
} from '../mappers/ProjectMapper';

export class ApiProjectRepository implements IProjectRepository {
  constructor(private apiClient: ApiClient) {}

  async findAll(): Promise<Project[]> {
    const response = await this.apiClient.get<ProjectListApiResponse>('/projects');
    return ProjectMapper.toDomainList(response);
  }

  async findById(id: number): Promise<Project | null> {
    try {
      const response = await this.apiClient.get<SingleProjectApiResponse>(`/projects/${id}`);
      return ProjectMapper.toDomain(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreateProjectData): Promise<Project> {
    const requestData = ProjectMapper.toCreateApiRequest(data);
    const response = await this.apiClient.post<SingleProjectApiResponse>('/projects', requestData);
    return ProjectMapper.toDomain(response.data);
  }

  async update(id: number, data: UpdateProjectData): Promise<Project> {
    const requestData = ProjectMapper.toUpdateApiRequest(data);
    const response = await this.apiClient.put<SingleProjectApiResponse>(`/projects/${id}`, requestData);
    return ProjectMapper.toDomain(response.data);
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`/projects/${id}`);
  }

  async reorder(ids: number[]): Promise<void> {
    const requestData: ReorderProjectsApiRequest = { ids };
    await this.apiClient.patch('/projects/reorder', requestData);
  }
}
