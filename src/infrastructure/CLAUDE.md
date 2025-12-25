# Infrastructure Layer

기술적 구현을 담당하는 레이어입니다. Domain 레이어의 Repository 인터페이스를 구현하고, API 통신, 토큰 저장소, 데이터 변환 등의 기술적 세부사항을 처리합니다.

## Structure

```
infrastructure/
├── api/
│   └── ApiClient.ts          # Axios 기반 HTTP 클라이언트
├── auth/
│   └── TokenStorage.ts       # JWT 토큰 저장소
├── mappers/
│   ├── PostMapper.ts         # Post API ↔ Domain 변환
│   ├── CategoryMapper.ts     # Category 변환
│   ├── TagMapper.ts          # Tag 변환
│   ├── MediaMapper.ts        # Media 변환
│   └── ProjectMapper.ts      # Project 변환
└── repositories/
    ├── ApiPostRepository.ts
    ├── ApiCategoryRepository.ts
    ├── ApiTagRepository.ts
    ├── ApiMediaRepository.ts
    ├── ApiProjectRepository.ts
    └── ApiAuthRepository.ts
```

## API Client

### ApiClient

Axios 기반의 HTTP 클라이언트 래퍼입니다.

```typescript
class ApiClient {
  private client: AxiosInstance;

  constructor(
    baseURL: string,
    tokenStorage: TokenStorage,
    onUnauthorized?: () => void
  ) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Request interceptor: JWT 토큰 자동 삽입
    this.client.interceptors.request.use((config) => {
      const token = tokenStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: 401 에러 처리
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          tokenStorage.removeToken();
          onUnauthorized?.();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T>;
  async post<T, D>(url: string, data: D): Promise<T>;
  async put<T, D>(url: string, data: D): Promise<T>;
  async patch<T, D>(url: string, data: D): Promise<T>;
  async delete<T>(url: string): Promise<T>;
  async uploadFile<T>(url: string, file: File, fieldName?: string): Promise<T>;
}
```

**특징:**
- 30초 타임아웃
- JWT 토큰 자동 삽입 (Authorization 헤더)
- 401 응답 시 토큰 삭제 및 콜백 호출
- `uploadFile()`: multipart/form-data 지원

## Token Storage

### TokenStorage

쿠키 기반의 JWT 토큰 저장소입니다.

```typescript
class TokenStorage {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_EXPIRY_DAYS = 1;

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(this.TOKEN_KEY) || null;
  }

  setToken(token: string): void {
    Cookies.set(this.TOKEN_KEY, token, {
      expires: this.TOKEN_EXPIRY_DAYS,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  removeToken(): void {
    Cookies.remove(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Singleton export
export const tokenStorage = new TokenStorage();
```

**특징:**
- `js-cookie` 라이브러리 사용
- 1일 만료 기간
- Production에서 `secure: true` (HTTPS only)
- SSR 안전 (window 체크)

## Mappers

API 응답(snake_case)과 Domain 엔티티(camelCase) 간의 변환을 담당합니다.

### Mapper Pattern

```typescript
class ExampleMapper {
  // API 응답 → Domain 엔티티
  static toDomain(response: ApiResponse): DomainEntity {
    return {
      id: response.id,
      createdAt: new Date(response.created_at),
      categoryId: response.category_id,
      // ...
    };
  }

  // API 응답 배열 → Domain 엔티티 배열
  static toDomainList(responses: ApiResponse[]): DomainEntity[] {
    return responses.map(this.toDomain);
  }

  // Domain 데이터 → API 요청 (Create)
  static toCreateApiRequest(data: CreateData): ApiCreateRequest {
    return {
      title: data.title,
      category_id: data.categoryId,
      // ...
    };
  }

  // Domain 데이터 → API 요청 (Update)
  static toUpdateApiRequest(data: UpdateData): ApiUpdateRequest {
    const request: ApiUpdateRequest = {};
    if (data.title !== undefined) request.title = data.title;
    if (data.categoryId !== undefined) request.category_id = data.categoryId;
    // ...
    return request;
  }
}
```

### PostMapper

```typescript
// API 응답 타입 (snake_case)
interface PostApiResponse {
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
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

// API 요청 타입 (snake_case)
interface PostApiCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  category_id?: number | null;
  tag_ids?: number[];
  thumbnail?: string | null;
  status?: string;
}

class PostMapper {
  static toDomain(response: PostApiResponse): Post {
    return {
      id: response.id,
      title: response.title,
      slug: response.slug,
      content: response.content,
      excerpt: response.excerpt,
      status: response.status as PostStatus,
      categoryId: response.category_id,
      tagIds: response.tag_ids,
      thumbnail: response.thumbnail,
      viewCount: response.view_count,
      readingTime: Math.ceil(response.content.length / 1000), // 계산된 필드
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
      publishedAt: response.published_at ? new Date(response.published_at) : null,
    };
  }

  static toCreateApiRequest(data: CreatePostData): PostApiCreateRequest {
    return {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      category_id: data.categoryId,
      tag_ids: data.tagIds,
      thumbnail: data.thumbnail,
      status: data.status,
    };
  }
}
```

### MediaMapper

```typescript
interface MediaApiResponse {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size: number;
  width: number | null;
  height: number | null;
  created_at: string;
}

class MediaMapper {
  static toDomain(response: MediaApiResponse): Media {
    return {
      id: response.id,
      filename: response.filename,
      originalName: response.original_name,
      url: response.url,
      mimeType: response.mime_type,
      size: response.size,
      width: response.width,
      height: response.height,
      createdAt: new Date(response.created_at),
    };
  }
}
```

## Repository Implementations

Domain 레이어의 Repository 인터페이스를 구현합니다.

### ApiPostRepository

```typescript
class ApiPostRepository implements IPostRepository {
  constructor(private apiClient: ApiClient) {}

  async findAll(params?: GetPostsParams): Promise<GetPostsResult> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('per_page', params.limit.toString());
    if (params?.status) queryParams.set('status', params.status);
    if (params?.categoryId) queryParams.set('category_id', params.categoryId.toString());
    if (params?.search) queryParams.set('search', params.search);

    const query = queryParams.toString();
    const response = await this.apiClient.get<PostListApiResponse>(
      `/posts${query ? `?${query}` : ''}`
    );

    return {
      posts: PostMapper.toDomainList(response.data),
      total: response.total,
      page: response.page,
      totalPages: response.total_pages,
    };
  }

  async findById(id: number): Promise<Post | null> {
    try {
      const response = await this.apiClient.get<PostApiResponse>(`/posts/${id}`);
      return PostMapper.toDomain(response);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async create(data: CreatePostData): Promise<Post> {
    const request = PostMapper.toCreateApiRequest(data);
    const response = await this.apiClient.post<PostApiResponse>('/posts', request);
    return PostMapper.toDomain(response);
  }

  async update(id: number, data: UpdatePostData): Promise<Post> {
    const request = PostMapper.toUpdateApiRequest(data);
    const response = await this.apiClient.patch<PostApiResponse>(`/posts/${id}`, request);
    return PostMapper.toDomain(response);
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`/posts/${id}`);
  }

  async updateStatus(id: number, status: PostStatus): Promise<Post> {
    const response = await this.apiClient.patch<PostApiResponse>(
      `/posts/${id}/publish`,
      { publish: status === 'published' }
    );
    return PostMapper.toDomain(response);
  }
}
```

### ApiMediaRepository

```typescript
class ApiMediaRepository implements IMediaRepository {
  constructor(private apiClient: ApiClient) {}

  async upload(file: File): Promise<Media> {
    const response = await this.apiClient.uploadFile<MediaApiResponse>(
      '/media/upload',
      file,
      'file'
    );
    return MediaMapper.toDomain(response);
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.delete(`/media/${id}`);
  }
}
```

### ApiAuthRepository

```typescript
class ApiAuthRepository implements IAuthRepository {
  constructor(
    private apiClient: ApiClient,
    private tokenStorage: TokenStorage
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const response = await this.apiClient.post<AuthTokenResponse>(
      '/auth/login',
      credentials
    );

    const token: AuthToken = {
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
    };

    this.tokenStorage.setToken(token.accessToken);
    return token;
  }

  async logout(): Promise<void> {
    this.tokenStorage.removeToken();
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.tokenStorage.isAuthenticated()) {
      return null;
    }

    const response = await this.apiClient.get<UserApiResponse>('/auth/me');
    return {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
    };
  }
}
```

## API Endpoints

| Entity | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Auth | POST | `/auth/login` | 로그인 |
| Auth | GET | `/auth/me` | 현재 사용자 |
| Auth | POST | `/auth/refresh` | 토큰 갱신 |
| Post | GET | `/posts` | 목록 조회 |
| Post | GET | `/posts/:id` | 상세 조회 |
| Post | POST | `/posts` | 생성 |
| Post | PATCH | `/posts/:id` | 수정 |
| Post | DELETE | `/posts/:id` | 삭제 |
| Post | PATCH | `/posts/:id/publish` | 발행 상태 변경 |
| Category | GET | `/categories` | 목록 조회 |
| Category | POST | `/categories` | 생성 |
| Category | PATCH | `/categories/:id` | 수정 |
| Category | DELETE | `/categories/:id` | 삭제 |
| Tag | GET | `/tags` | 목록 조회 |
| Tag | POST | `/tags` | 생성 |
| Tag | PATCH | `/tags/:id` | 수정 |
| Tag | DELETE | `/tags/:id` | 삭제 |
| Media | GET | `/media` | 목록 조회 |
| Media | POST | `/media/upload` | 업로드 |
| Media | DELETE | `/media/:id` | 삭제 |
| Project | GET | `/projects` | 목록 조회 |
| Project | POST | `/projects` | 생성 |
| Project | PATCH | `/projects/:id` | 수정 |
| Project | DELETE | `/projects/:id` | 삭제 |
| Project | PATCH | `/projects/reorder` | 순서 변경 |

## Conventions

### Naming Convention Transform
- API (snake_case) → Domain (camelCase)
- `category_id` → `categoryId`
- `created_at` → `createdAt`
- `tag_ids` → `tagIds`

### Error Handling
```typescript
// 404 에러는 null 반환
async findById(id: number): Promise<Entity | null> {
  try {
    const response = await this.apiClient.get(`/endpoint/${id}`);
    return Mapper.toDomain(response);
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}
```

### Query Parameters
```typescript
// URLSearchParams 사용
const queryParams = new URLSearchParams();
if (params?.page) queryParams.set('page', params.page.toString());
if (params?.limit) queryParams.set('per_page', params.limit.toString());

const query = queryParams.toString();
const url = `/endpoint${query ? `?${query}` : ''}`;
```

## Important Notes

- **API URL**: `NEXT_PUBLIC_API_URL` 환경변수로 설정
- **Token Storage**: 쿠키 기반, 1일 만료
- **Snake_case Transform**: 모든 API 통신에서 변환 필수
- **File Upload**: `uploadFile()` 메서드로 multipart/form-data 처리
- **401 Handling**: 자동 토큰 삭제 및 콜백 호출
