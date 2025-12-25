import {
  ITagRepository,
  CreateTagData,
  UpdateTagData,
} from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';
import { ApiClient } from '../api/ApiClient';
import { TagMapper, TagListApiResponse, SingleTagApiResponse } from '../mappers/TagMapper';

export class ApiTagRepository implements ITagRepository {
  constructor(private apiClient: ApiClient) {}

  async findAll(): Promise<Tag[]> {
    const response = await this.apiClient.get<TagListApiResponse>('/tags');
    return TagMapper.toDomainList(response);
  }

  async findById(id: number): Promise<Tag | null> {
    try {
      const response = await this.apiClient.get<SingleTagApiResponse>(`/tags/${id}`);
      return TagMapper.toDomain(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreateTagData): Promise<Tag> {
    const requestData = TagMapper.toCreateApiRequest(data);
    const response = await this.apiClient.post<SingleTagApiResponse>('/tags', requestData);
    return TagMapper.toDomain(response.data);
  }

  async update(id: number, data: UpdateTagData): Promise<Tag> {
    const requestData = TagMapper.toUpdateApiRequest(data);
    const response = await this.apiClient.put<SingleTagApiResponse>(`/tags/${id}`, requestData);
    return TagMapper.toDomain(response.data);
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`/tags/${id}`);
  }
}
