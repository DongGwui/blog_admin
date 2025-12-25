import {
  IPostRepository,
  GetPostsParams,
  GetPostsResult,
  CreatePostData,
  UpdatePostData,
} from '@/domain/repositories/IPostRepository';
import { Post, PostStatus } from '@/domain/entities/Post';
import { ApiClient } from '../api/ApiClient';
import {
  PostMapper,
  PostListApiResponse,
  SinglePostApiResponse,
  PublishPostApiRequest,
} from '../mappers/PostMapper';

export class ApiPostRepository implements IPostRepository {
  constructor(private apiClient: ApiClient) {}

  async findAll(params?: GetPostsParams): Promise<GetPostsResult> {
    const queryParams: Record<string, string> = {};

    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.page) {
      queryParams.page = params.page.toString();
    }
    if (params?.limit) {
      queryParams.per_page = params.limit.toString();
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString ? `/posts?${queryString}` : '/posts';

    const response = await this.apiClient.get<PostListApiResponse>(url);
    return PostMapper.toDomainList(response);
  }

  async findById(id: number): Promise<Post | null> {
    try {
      const response = await this.apiClient.get<SinglePostApiResponse>(`/posts/${id}`);
      return PostMapper.toDomain(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreatePostData): Promise<Post> {
    const requestData = PostMapper.toCreateApiRequest(data);
    const response = await this.apiClient.post<SinglePostApiResponse>('/posts', requestData);
    return PostMapper.toDomain(response.data);
  }

  async update(id: number, data: UpdatePostData): Promise<Post> {
    const requestData = PostMapper.toUpdateApiRequest(data);
    const response = await this.apiClient.put<SinglePostApiResponse>(`/posts/${id}`, requestData);
    return PostMapper.toDomain(response.data);
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`/posts/${id}`);
  }

  async updateStatus(id: number, status: PostStatus): Promise<Post> {
    const requestData: PublishPostApiRequest = {
      publish: status === 'published',
    };
    const response = await this.apiClient.patch<SinglePostApiResponse>(
      `/posts/${id}/publish`,
      requestData
    );
    return PostMapper.toDomain(response.data);
  }
}
