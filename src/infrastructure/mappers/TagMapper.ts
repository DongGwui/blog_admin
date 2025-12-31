import { Tag } from '@/domain/entities/Tag';
import { CreateTagData, UpdateTagData } from '@/domain/repositories/ITagRepository';

// API Response DTOs
export interface TagApiResponse {
  id: number;
  name: string;
  slug: string;
  post_count: number;
  created_at: string;
}

export interface TagListApiResponse {
  data: TagApiResponse[];
}

export interface SingleTagApiResponse {
  data: TagApiResponse;
}

// API Request DTOs
export interface CreateTagApiRequest {
  name: string;
  slug?: string;
}

export interface UpdateTagApiRequest {
  name?: string;
  slug?: string;
}

export class TagMapper {
  static toDomain(apiResponse: TagApiResponse): Tag {
    return {
      id: apiResponse.id,
      name: apiResponse.name,
      slug: apiResponse.slug,
      postCount: apiResponse.post_count,
      createdAt: new Date(apiResponse.created_at),
    };
  }

  static toDomainList(apiResponse: TagListApiResponse): Tag[] {
    return (apiResponse.data || []).map(TagMapper.toDomain);
  }

  static toCreateApiRequest(data: CreateTagData): CreateTagApiRequest {
    return {
      name: data.name,
      slug: data.slug,
    };
  }

  static toUpdateApiRequest(data: UpdateTagData): UpdateTagApiRequest {
    const request: UpdateTagApiRequest = {};

    if (data.name !== undefined) request.name = data.name;
    if (data.slug !== undefined) request.slug = data.slug;

    return request;
  }
}
