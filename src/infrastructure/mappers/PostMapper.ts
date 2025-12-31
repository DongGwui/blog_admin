import { Post, PostStatus } from '@/domain/entities/Post';
import { CreatePostData, UpdatePostData } from '@/domain/repositories/IPostRepository';

// Tag in post response
export interface TagBriefInPost {
  id: number;
  name: string;
  slug: string;
}

// API Response DTOs (snake_case from backend)
export interface PostApiResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string | null;
  status: string;
  category_id: number | null;
  category_name?: string;
  category_slug?: string;
  tags: TagBriefInPost[];
  view_count: number;
  reading_time?: number;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export interface PostListApiResponse {
  data: PostApiResponse[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface SinglePostApiResponse {
  data: PostApiResponse;
}

// API Request DTOs (snake_case for backend)
export interface CreatePostApiRequest {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  thumbnail?: string;
  status?: string;
  category_id?: number | null;
  tag_ids?: number[];
}

export interface UpdatePostApiRequest {
  title?: string;
  content?: string;
  slug?: string;
  excerpt?: string;
  thumbnail?: string;
  status?: string;
  category_id?: number | null;
  tag_ids?: number[];
}

export interface PublishPostApiRequest {
  publish: boolean;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.ceil(words / wordsPerMinute);
}

export class PostMapper {
  static toDomain(apiResponse: PostApiResponse): Post {
    // Extract tag IDs from tags array
    const tagIds = (apiResponse.tags || []).map((tag) => tag.id);

    return {
      id: apiResponse.id,
      title: apiResponse.title,
      slug: apiResponse.slug,
      content: apiResponse.content || '',
      excerpt: apiResponse.excerpt || '',
      status: apiResponse.status as PostStatus,
      categoryId: apiResponse.category_id,
      tagIds,
      thumbnail: apiResponse.thumbnail,
      viewCount: apiResponse.view_count,
      readingTime: apiResponse.reading_time || calculateReadingTime(apiResponse.content || ''),
      createdAt: new Date(apiResponse.created_at),
      updatedAt: new Date(apiResponse.updated_at),
      publishedAt: apiResponse.published_at ? new Date(apiResponse.published_at) : null,
    };
  }

  static toDomainList(apiResponse: PostListApiResponse): {
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  } {
    return {
      posts: (apiResponse.data || []).map(PostMapper.toDomain),
      total: apiResponse.meta?.total ?? 0,
      page: apiResponse.meta?.page ?? 1,
      totalPages: apiResponse.meta?.total_pages ?? 0,
    };
  }

  static toCreateApiRequest(data: CreatePostData): CreatePostApiRequest {
    return {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      thumbnail: data.thumbnail ?? undefined,
      status: data.status,
      category_id: data.categoryId,
      tag_ids: data.tagIds,
    };
  }

  static toUpdateApiRequest(data: UpdatePostData): UpdatePostApiRequest {
    const request: UpdatePostApiRequest = {};

    if (data.title !== undefined) request.title = data.title;
    if (data.content !== undefined) request.content = data.content;
    if (data.excerpt !== undefined) request.excerpt = data.excerpt;
    if (data.thumbnail !== undefined) request.thumbnail = data.thumbnail ?? undefined;
    if (data.status !== undefined) request.status = data.status;
    if (data.categoryId !== undefined) request.category_id = data.categoryId;
    if (data.tagIds !== undefined) request.tag_ids = data.tagIds;

    return request;
  }
}
