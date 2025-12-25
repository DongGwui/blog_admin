import { Post, PostStatus } from '../entities/Post';

export interface GetPostsParams {
  status?: PostStatus;
  page?: number;
  limit?: number;
}

export interface GetPostsResult {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  status?: PostStatus;
  categoryId?: number | null;
  tagIds?: number[];
  thumbnail?: string | null;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: PostStatus;
  categoryId?: number | null;
  tagIds?: number[];
  thumbnail?: string | null;
}

export interface IPostRepository {
  findAll(params?: GetPostsParams): Promise<GetPostsResult>;
  findById(id: number): Promise<Post | null>;
  create(data: CreatePostData): Promise<Post>;
  update(id: number, data: UpdatePostData): Promise<Post>;
  delete(id: number): Promise<void>;
  updateStatus(id: number, status: PostStatus): Promise<Post>;
}
