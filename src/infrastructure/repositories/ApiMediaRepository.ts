import { IMediaRepository, GetMediaParams, GetMediaResult } from '@/domain/repositories/IMediaRepository';
import { Media } from '@/domain/entities/Media';
import { ApiClient } from '../api/ApiClient';
import { MediaMapper, MediaListApiResponse, SingleMediaApiResponse } from '../mappers/MediaMapper';

export class ApiMediaRepository implements IMediaRepository {
  constructor(private apiClient: ApiClient) {}

  async findAll(params?: GetMediaParams): Promise<GetMediaResult> {
    const queryParams: Record<string, string> = {};

    if (params?.page) {
      queryParams.page = params.page.toString();
    }
    if (params?.limit) {
      queryParams.per_page = params.limit.toString();
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString ? `/media?${queryString}` : '/media';

    const response = await this.apiClient.get<MediaListApiResponse>(url);
    return MediaMapper.toDomainList(response);
  }

  async findById(id: number): Promise<Media | null> {
    try {
      const response = await this.apiClient.get<SingleMediaApiResponse>(`/media/${id}`);
      return MediaMapper.toDomain(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async upload(file: File): Promise<Media> {
    const response = await this.apiClient.uploadFile<SingleMediaApiResponse>('/media/upload', file);
    return MediaMapper.toDomain(response.data);
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`/media/${id}`);
  }
}
