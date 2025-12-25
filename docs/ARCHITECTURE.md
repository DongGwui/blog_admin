# Clean Architecture 설계 문서

## 개요

이 문서는 Blog Admin 프로젝트의 Clean Architecture 설계를 상세히 설명합니다.

### Clean Architecture란?

Robert C. Martin(Uncle Bob)이 제안한 소프트웨어 아키텍처로, 다음 원칙을 따릅니다:

1. **프레임워크 독립성**: 비즈니스 로직이 프레임워크에 의존하지 않음
2. **테스트 용이성**: UI, DB 없이 비즈니스 규칙 테스트 가능
3. **UI 독립성**: UI 변경이 시스템에 영향 없음
4. **데이터베이스 독립성**: 비즈니스 규칙이 DB에 종속되지 않음
5. **외부 에이전시 독립성**: 외부 서비스 변경에 대한 격리

---

## 레이어 구조

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                      Presentation Layer                             │
│                   (UI, Controllers, Views)                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                      Application Layer                              │
│                (Use Cases, Application Services)                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        Domain Layer                                 │
│              (Entities, Repository Interfaces)                      │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                     Infrastructure Layer                            │
│            (Database, External APIs, Frameworks)                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

의존성 방향: Presentation → Application → Domain ← Infrastructure
```

### 의존성 규칙 (Dependency Rule)

**핵심 원칙**: 의존성은 항상 안쪽(Domain)을 향해야 합니다.

```
Presentation ──────┐
                   ↓
Application ───────┼──→ Domain
                   ↑
Infrastructure ────┘
```

- Domain은 어떤 레이어에도 의존하지 않음
- Application은 Domain에만 의존
- Presentation은 Application과 Domain에 의존
- Infrastructure는 Domain에 의존 (인터페이스 구현)

---

## 레이어별 상세 설명

### 1. Domain Layer (핵심)

**위치**: `src/domain/`

**역할**: 핵심 비즈니스 로직과 엔티티 정의

**특징**:
- 순수 TypeScript (프레임워크 코드 금지)
- 외부 의존성 없음
- 가장 안정적인 레이어

#### Entities (엔티티)

```typescript
// src/domain/entities/Post.ts
export type PostStatus = 'draft' | 'published';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  categoryId: number | null;
  tagIds: number[];
  thumbnail: string | null;
  viewCount: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

// 팩토리 함수 (선택적)
export function createPost(params: CreatePostParams): Post {
  return {
    id: 0,
    title: params.title,
    slug: generateSlug(params.title),
    content: params.content,
    excerpt: params.excerpt || '',
    status: 'draft',
    categoryId: params.categoryId || null,
    tagIds: params.tagIds || [],
    thumbnail: null,
    viewCount: 0,
    readingTime: calculateReadingTime(params.content),
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: null,
  };
}
```

```typescript
// src/domain/entities/Category.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
  createdAt: Date;
}
```

```typescript
// src/domain/entities/Tag.ts
export interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}
```

```typescript
// src/domain/entities/Media.ts
export interface Media {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  createdAt: Date;
}
```

```typescript
// src/domain/entities/User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface AuthToken {
  accessToken: string;
  expiresAt: Date;
}
```

#### Repository Interfaces (저장소 인터페이스)

```typescript
// src/domain/repositories/IPostRepository.ts
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

export interface IPostRepository {
  findAll(params: GetPostsParams): Promise<GetPostsResult>;
  findById(id: number): Promise<Post | null>;
  create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>;
  update(id: number, post: Partial<Post>): Promise<Post>;
  delete(id: number): Promise<void>;
  updateStatus(id: number, status: PostStatus): Promise<Post>;
}
```

```typescript
// src/domain/repositories/IAuthRepository.ts
import { User, AuthToken } from '../entities/User';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthToken>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<AuthToken>;
}
```

```typescript
// src/domain/repositories/IMediaRepository.ts
import { Media } from '../entities/Media';

export interface IMediaRepository {
  findAll(page?: number): Promise<{ media: Media[]; total: number }>;
  upload(file: File): Promise<Media>;
  delete(id: number): Promise<void>;
}
```

#### Value Objects (값 객체)

```typescript
// src/domain/value-objects/Slug.ts
export class Slug {
  private readonly value: string;

  constructor(value: string) {
    this.value = this.normalize(value);
  }

  private normalize(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  toString(): string {
    return this.value;
  }

  equals(other: Slug): boolean {
    return this.value === other.value;
  }
}
```

---

### 2. Application Layer

**위치**: `src/application/`

**역할**: 유스케이스 구현, 비즈니스 흐름 조정

**특징**:
- Domain 레이어에만 의존
- 프레임워크 독립적
- 단일 책임 원칙 (하나의 유스케이스 = 하나의 책임)

#### Use Cases (유스케이스)

```typescript
// src/application/usecases/post/CreatePostUseCase.ts
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';
import { CreatePostRequest } from '@/application/dto/CreatePostRequest';
import { Slug } from '@/domain/value-objects/Slug';

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: CreatePostRequest): Promise<Post> {
    // 비즈니스 규칙 검증
    if (!request.title.trim()) {
      throw new Error('Title is required');
    }

    // 슬러그 생성
    const slug = new Slug(request.title);

    // 저장
    return this.postRepository.create({
      title: request.title,
      slug: slug.toString(),
      content: request.content,
      excerpt: request.excerpt || this.generateExcerpt(request.content),
      status: request.status || 'draft',
      categoryId: request.categoryId || null,
      tagIds: request.tagIds || [],
      thumbnail: request.thumbnail || null,
      viewCount: 0,
      readingTime: this.calculateReadingTime(request.content),
      publishedAt: request.status === 'published' ? new Date() : null,
    });
  }

  private generateExcerpt(content: string): string {
    return content.slice(0, 200).trim() + '...';
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}
```

```typescript
// src/application/usecases/post/GetPostsUseCase.ts
import { IPostRepository, GetPostsParams, GetPostsResult } from '@/domain/repositories/IPostRepository';

export class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(params: GetPostsParams = {}): Promise<GetPostsResult> {
    return this.postRepository.findAll({
      status: params.status,
      page: params.page || 1,
      limit: params.limit || 10,
    });
  }
}
```

```typescript
// src/application/usecases/post/UpdatePostUseCase.ts
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';
import { UpdatePostRequest } from '@/application/dto/UpdatePostRequest';

export class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number, request: UpdatePostRequest): Promise<Post> {
    const existingPost = await this.postRepository.findById(id);

    if (!existingPost) {
      throw new Error('Post not found');
    }

    return this.postRepository.update(id, {
      ...request,
      updatedAt: new Date(),
    });
  }
}
```

```typescript
// src/application/usecases/post/DeletePostUseCase.ts
import { IPostRepository } from '@/domain/repositories/IPostRepository';

export class DeletePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number): Promise<void> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

    await this.postRepository.delete(id);
  }
}
```

```typescript
// src/application/usecases/post/PublishPostUseCase.ts
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post, PostStatus } from '@/domain/entities/Post';

export class PublishPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number, status: PostStatus): Promise<Post> {
    const post = await this.postRepository.findById(id);

    if (!post) {
      throw new Error('Post not found');
    }

    return this.postRepository.updateStatus(id, status);
  }
}
```

```typescript
// src/application/usecases/auth/LoginUseCase.ts
import { IAuthRepository, LoginCredentials } from '@/domain/repositories/IAuthRepository';
import { AuthToken } from '@/domain/entities/User';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthToken> {
    if (!credentials.username || !credentials.password) {
      throw new Error('Username and password are required');
    }

    return this.authRepository.login(credentials);
  }
}
```

```typescript
// src/application/usecases/media/UploadMediaUseCase.ts
import { IMediaRepository } from '@/domain/repositories/IMediaRepository';
import { Media } from '@/domain/entities/Media';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export class UploadMediaUseCase {
  constructor(private mediaRepository: IMediaRepository) {}

  async execute(file: File): Promise<Media> {
    // 파일 유효성 검사
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
    }

    if (file.size > MAX_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    return this.mediaRepository.upload(file);
  }
}
```

#### DTOs (Data Transfer Objects)

```typescript
// src/application/dto/CreatePostRequest.ts
import { PostStatus } from '@/domain/entities/Post';

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  status?: PostStatus;
  categoryId?: number;
  tagIds?: number[];
  thumbnail?: string;
}
```

```typescript
// src/application/dto/UpdatePostRequest.ts
import { PostStatus } from '@/domain/entities/Post';

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: PostStatus;
  categoryId?: number | null;
  tagIds?: number[];
  thumbnail?: string | null;
}
```

---

### 3. Infrastructure Layer

**위치**: `src/infrastructure/`

**역할**: 외부 시스템과의 통신, Repository 구현

**특징**:
- Domain 인터페이스 구현
- 프레임워크/라이브러리 사용
- 외부 API, DB 등과 통신

#### API Client

```typescript
// src/infrastructure/api/ApiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { TokenStorage } from '../auth/TokenStorage';

export class ApiClient {
  private instance: AxiosInstance;
  private tokenStorage: TokenStorage;

  constructor(baseURL: string, tokenStorage: TokenStorage) {
    this.tokenStorage = tokenStorage;
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor: JWT 토큰 추가
    this.instance.interceptors.request.use((config) => {
      const token = this.tokenStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: 401 처리
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.tokenStorage.removeToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: object): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: object): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: object): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: object): Promise<T> {
    const response = await this.instance.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }

  async uploadFile<T>(url: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.instance.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}
```

#### Token Storage

```typescript
// src/infrastructure/auth/TokenStorage.ts
import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_DAYS = 1;

export class TokenStorage {
  getToken(): string | null {
    return Cookies.get(TOKEN_KEY) || null;
  }

  setToken(token: string): void {
    Cookies.set(TOKEN_KEY, token, {
      expires: TOKEN_EXPIRY_DAYS,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  removeToken(): void {
    Cookies.remove(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
```

#### Repository Implementations

```typescript
// src/infrastructure/repositories/ApiPostRepository.ts
import { IPostRepository, GetPostsParams, GetPostsResult } from '@/domain/repositories/IPostRepository';
import { Post, PostStatus } from '@/domain/entities/Post';
import { ApiClient } from '../api/ApiClient';
import { PostMapper } from '../mappers/PostMapper';

interface ApiPostResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  category_id: number | null;
  tag_ids: number[];
  thumbnail: string | null;
  view_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface ApiPostsResponse {
  posts: ApiPostResponse[];
  total: number;
  page: number;
  total_pages: number;
}

export class ApiPostRepository implements IPostRepository {
  constructor(private api: ApiClient) {}

  async findAll(params: GetPostsParams): Promise<GetPostsResult> {
    const response = await this.api.get<ApiPostsResponse>('/posts', {
      status: params.status,
      page: params.page,
      limit: params.limit,
    });

    return {
      posts: response.posts.map(PostMapper.toDomain),
      total: response.total,
      page: response.page,
      totalPages: response.total_pages,
    };
  }

  async findById(id: number): Promise<Post | null> {
    try {
      const response = await this.api.get<ApiPostResponse>(`/posts/${id}`);
      return PostMapper.toDomain(response);
    } catch {
      return null;
    }
  }

  async create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const response = await this.api.post<ApiPostResponse>('/posts',
      PostMapper.toApi(post)
    );
    return PostMapper.toDomain(response);
  }

  async update(id: number, post: Partial<Post>): Promise<Post> {
    const response = await this.api.put<ApiPostResponse>(`/posts/${id}`,
      PostMapper.toApi(post)
    );
    return PostMapper.toDomain(response);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }

  async updateStatus(id: number, status: PostStatus): Promise<Post> {
    const response = await this.api.patch<ApiPostResponse>(`/posts/${id}/publish`, {
      status,
    });
    return PostMapper.toDomain(response);
  }
}
```

```typescript
// src/infrastructure/repositories/ApiAuthRepository.ts
import { IAuthRepository, LoginCredentials } from '@/domain/repositories/IAuthRepository';
import { User, AuthToken } from '@/domain/entities/User';
import { ApiClient } from '../api/ApiClient';
import { TokenStorage } from '../auth/TokenStorage';

interface ApiLoginResponse {
  token: string;
  expires_at: string;
}

interface ApiUserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

export class ApiAuthRepository implements IAuthRepository {
  constructor(
    private api: ApiClient,
    private tokenStorage: TokenStorage
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const response = await this.api.post<ApiLoginResponse>('/auth/login', credentials);

    this.tokenStorage.setToken(response.token);

    return {
      accessToken: response.token,
      expiresAt: new Date(response.expires_at),
    };
  }

  async logout(): Promise<void> {
    this.tokenStorage.removeToken();
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.tokenStorage.isAuthenticated()) {
      return null;
    }

    try {
      const response = await this.api.get<ApiUserResponse>('/auth/me');
      return {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role as 'admin' | 'editor',
      };
    } catch {
      return null;
    }
  }

  async refreshToken(): Promise<AuthToken> {
    const response = await this.api.post<ApiLoginResponse>('/auth/refresh');

    this.tokenStorage.setToken(response.token);

    return {
      accessToken: response.token,
      expiresAt: new Date(response.expires_at),
    };
  }
}
```

#### Mappers

```typescript
// src/infrastructure/mappers/PostMapper.ts
import { Post } from '@/domain/entities/Post';

interface ApiPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  category_id: number | null;
  tag_ids: number[];
  thumbnail: string | null;
  view_count: number;
  reading_time: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export class PostMapper {
  static toDomain(api: ApiPost): Post {
    return {
      id: api.id,
      title: api.title,
      slug: api.slug,
      content: api.content,
      excerpt: api.excerpt,
      status: api.status as 'draft' | 'published',
      categoryId: api.category_id,
      tagIds: api.tag_ids,
      thumbnail: api.thumbnail,
      viewCount: api.view_count,
      readingTime: api.reading_time,
      createdAt: new Date(api.created_at),
      updatedAt: new Date(api.updated_at),
      publishedAt: api.published_at ? new Date(api.published_at) : null,
    };
  }

  static toApi(domain: Partial<Post>): Partial<ApiPost> {
    const result: Partial<ApiPost> = {};

    if (domain.title !== undefined) result.title = domain.title;
    if (domain.slug !== undefined) result.slug = domain.slug;
    if (domain.content !== undefined) result.content = domain.content;
    if (domain.excerpt !== undefined) result.excerpt = domain.excerpt;
    if (domain.status !== undefined) result.status = domain.status;
    if (domain.categoryId !== undefined) result.category_id = domain.categoryId;
    if (domain.tagIds !== undefined) result.tag_ids = domain.tagIds;
    if (domain.thumbnail !== undefined) result.thumbnail = domain.thumbnail;

    return result;
  }
}
```

---

### 4. Presentation Layer

**위치**: `src/presentation/`

**역할**: UI 렌더링, 사용자 상호작용 처리

**특징**:
- React/Next.js 코드
- Use Case를 통해 비즈니스 로직 호출
- 상태 관리 (TanStack Query, Context)

#### Dependency Provider (의존성 주입)

```typescript
// src/presentation/providers/DependencyProvider.tsx
'use client';

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { TokenStorage } from '@/infrastructure/auth/TokenStorage';
import { ApiPostRepository } from '@/infrastructure/repositories/ApiPostRepository';
import { ApiAuthRepository } from '@/infrastructure/repositories/ApiAuthRepository';
import { ApiMediaRepository } from '@/infrastructure/repositories/ApiMediaRepository';
import { CreatePostUseCase } from '@/application/usecases/post/CreatePostUseCase';
import { GetPostsUseCase } from '@/application/usecases/post/GetPostsUseCase';
import { UpdatePostUseCase } from '@/application/usecases/post/UpdatePostUseCase';
import { DeletePostUseCase } from '@/application/usecases/post/DeletePostUseCase';
import { PublishPostUseCase } from '@/application/usecases/post/PublishPostUseCase';
import { LoginUseCase } from '@/application/usecases/auth/LoginUseCase';
import { UploadMediaUseCase } from '@/application/usecases/media/UploadMediaUseCase';

interface Dependencies {
  // Auth
  loginUseCase: LoginUseCase;
  tokenStorage: TokenStorage;

  // Posts
  createPostUseCase: CreatePostUseCase;
  getPostsUseCase: GetPostsUseCase;
  updatePostUseCase: UpdatePostUseCase;
  deletePostUseCase: DeletePostUseCase;
  publishPostUseCase: PublishPostUseCase;

  // Media
  uploadMediaUseCase: UploadMediaUseCase;
}

const DependencyContext = createContext<Dependencies | null>(null);

export function DependencyProvider({ children }: { children: ReactNode }) {
  const dependencies = useMemo(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://blog-api.dltmxm.link/api/admin';

    // Infrastructure
    const tokenStorage = new TokenStorage();
    const apiClient = new ApiClient(apiUrl, tokenStorage);

    // Repositories
    const postRepository = new ApiPostRepository(apiClient);
    const authRepository = new ApiAuthRepository(apiClient, tokenStorage);
    const mediaRepository = new ApiMediaRepository(apiClient);

    // Use Cases
    return {
      tokenStorage,
      loginUseCase: new LoginUseCase(authRepository),
      createPostUseCase: new CreatePostUseCase(postRepository),
      getPostsUseCase: new GetPostsUseCase(postRepository),
      updatePostUseCase: new UpdatePostUseCase(postRepository),
      deletePostUseCase: new DeletePostUseCase(postRepository),
      publishPostUseCase: new PublishPostUseCase(postRepository),
      uploadMediaUseCase: new UploadMediaUseCase(mediaRepository),
    };
  }, []);

  return (
    <DependencyContext.Provider value={dependencies}>
      {children}
    </DependencyContext.Provider>
  );
}

export function useDependencies(): Dependencies {
  const context = useContext(DependencyContext);
  if (!context) {
    throw new Error('useDependencies must be used within DependencyProvider');
  }
  return context;
}
```

#### Query Hooks (TanStack Query 통합)

```typescript
// src/presentation/hooks/queries/usePostQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/DependencyProvider';
import { PostStatus } from '@/domain/entities/Post';
import { CreatePostRequest } from '@/application/dto/CreatePostRequest';
import { UpdatePostRequest } from '@/application/dto/UpdatePostRequest';

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: { status?: PostStatus; page?: number }) =>
    [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

export function usePosts(status?: PostStatus, page = 1) {
  const { getPostsUseCase } = useDependencies();

  return useQuery({
    queryKey: postKeys.list({ status, page }),
    queryFn: () => getPostsUseCase.execute({ status, page }),
  });
}

export function useCreatePost() {
  const { createPostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPostUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useUpdatePost() {
  const { updatePostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      updatePostUseCase.execute(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
    },
  });
}

export function useDeletePost() {
  const { deletePostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePostUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function usePublishPost() {
  const { publishPostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: PostStatus }) =>
      publishPostUseCase.execute(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
    },
  });
}
```

#### Page Component Example

```typescript
// src/presentation/app/(authenticated)/posts/page.tsx
'use client';

import { useState } from 'react';
import { usePosts, useDeletePost } from '@/presentation/hooks/queries/usePostQueries';
import { PostList } from '@/presentation/components/post/PostList';
import { PostStatus } from '@/domain/entities/Post';

export default function PostsPage() {
  const [status, setStatus] = useState<PostStatus | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = usePosts(status, page);
  const deletePost = useDeletePost();

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deletePost.mutateAsync(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>글 관리</h1>

      <div>
        <button onClick={() => setStatus(undefined)}>전체</button>
        <button onClick={() => setStatus('published')}>발행됨</button>
        <button onClick={() => setStatus('draft')}>임시저장</button>
      </div>

      <PostList
        posts={data?.posts || []}
        onDelete={handleDelete}
      />

      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          이전
        </button>
        <span>{page} / {data?.totalPages}</span>
        <button
          disabled={page === data?.totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
```

---

## 테스트 전략

### 레이어별 테스트

| 레이어 | 테스트 유형 | Mock 대상 | 커버리지 목표 |
|--------|------------|-----------|--------------|
| Domain | Unit | 없음 | >= 90% |
| Application | Unit | Repository | >= 80% |
| Infrastructure | Integration | API (MSW) | >= 70% |
| Presentation | Component | Use Cases | >= 70% |

### 테스트 예시

```typescript
// tests/unit/application/usecases/post/CreatePostUseCase.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreatePostUseCase } from '@/application/usecases/post/CreatePostUseCase';
import { IPostRepository } from '@/domain/repositories/IPostRepository';

describe('CreatePostUseCase', () => {
  let useCase: CreatePostUseCase;
  let mockRepository: IPostRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateStatus: vi.fn(),
    };
    useCase = new CreatePostUseCase(mockRepository);
  });

  it('should create a post with generated slug', async () => {
    const request = {
      title: 'Hello World',
      content: 'This is content',
    };

    const expectedPost = {
      id: 1,
      title: 'Hello World',
      slug: 'hello-world',
      content: 'This is content',
      status: 'draft',
    };

    vi.mocked(mockRepository.create).mockResolvedValue(expectedPost as any);

    const result = await useCase.execute(request);

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Hello World',
        slug: 'hello-world',
      })
    );
    expect(result.slug).toBe('hello-world');
  });

  it('should throw error if title is empty', async () => {
    const request = {
      title: '',
      content: 'Content',
    };

    await expect(useCase.execute(request)).rejects.toThrow('Title is required');
  });
});
```

---

## 참고 자료

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [The Clean Architecture in TypeScript](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
