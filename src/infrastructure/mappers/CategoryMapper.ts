import { Category } from '@/domain/entities/Category';
import { CreateCategoryData, UpdateCategoryData } from '@/domain/repositories/ICategoryRepository';

// API Response DTOs
export interface CategoryApiResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  post_count: number;
  created_at?: string;
}

export interface CategoryListApiResponse {
  data: CategoryApiResponse[];
}

export interface SingleCategoryApiResponse {
  data: CategoryApiResponse;
}

// API Request DTOs
export interface CreateCategoryApiRequest {
  name: string;
  slug?: string;
  description?: string;
  sort_order?: number;
}

export interface UpdateCategoryApiRequest {
  name?: string;
  slug?: string;
  description?: string;
  sort_order?: number;
}

export class CategoryMapper {
  static toDomain(apiResponse: CategoryApiResponse): Category {
    return {
      id: apiResponse.id,
      name: apiResponse.name,
      slug: apiResponse.slug,
      description: apiResponse.description,
      postCount: apiResponse.post_count,
      createdAt: apiResponse.created_at ? new Date(apiResponse.created_at) : new Date(),
    };
  }

  static toDomainList(apiResponse: CategoryListApiResponse): Category[] {
    return (apiResponse.data || []).map(CategoryMapper.toDomain);
  }

  static toCreateApiRequest(data: CreateCategoryData): CreateCategoryApiRequest {
    return {
      name: data.name,
      slug: data.slug,
      description: data.description ?? undefined,
    };
  }

  static toUpdateApiRequest(data: UpdateCategoryData): UpdateCategoryApiRequest {
    const request: UpdateCategoryApiRequest = {};

    if (data.name !== undefined) request.name = data.name;
    if (data.slug !== undefined) request.slug = data.slug;
    if (data.description !== undefined) request.description = data.description ?? undefined;

    return request;
  }
}
