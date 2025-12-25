# Domain Layer

순수 비즈니스 로직을 담당하는 핵심 레이어입니다. 외부 의존성이 없으며, 다른 레이어의 계약(Contract)을 정의합니다.

## Structure

```
domain/
├── entities/         # 비즈니스 엔티티
│   ├── Post.ts
│   ├── Category.ts
│   ├── Tag.ts
│   ├── Media.ts
│   ├── Project.ts
│   └── User.ts
├── repositories/     # 리포지토리 인터페이스
│   ├── IPostRepository.ts
│   ├── ICategoryRepository.ts
│   ├── ITagRepository.ts
│   ├── IMediaRepository.ts
│   ├── IProjectRepository.ts
│   └── IAuthRepository.ts
└── value-objects/    # 값 객체 (필요시)
```

## Entities

### Post
블로그 포스트 엔티티

```typescript
interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;        // 'draft' | 'published'
  categoryId: number | null;
  tagIds: number[];
  thumbnail: string | null;
  viewCount: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}
```

**Helper Functions:**
- `createPost(params)`: 기본값으로 Post 생성
- `generateSlug(title)`: 제목에서 slug 생성
- `generateExcerpt(content, length)`: 콘텐츠에서 발췌문 생성

### Category
포스트 카테고리

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  createdAt: Date;
}
```

### Tag
포스트 태그

```typescript
interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}
```

### Media
미디어 파일 (이미지)

```typescript
interface Media {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  createdAt: Date;
}
```

**Helper Functions:**
- `isImage(media)`: 이미지 파일 여부 확인
- `getFileExtension(filename)`: 파일 확장자 추출

### Project
포트폴리오 프로젝트

```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  thumbnailUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  techStack: string[];
  order: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### User
사용자 인증 정보

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor';
}

interface AuthToken {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
```

## Repository Interfaces

리포지토리 인터페이스는 데이터 접근의 계약을 정의합니다. 구현체는 Infrastructure 레이어에 있습니다.

### IPostRepository

```typescript
interface IPostRepository {
  findAll(params?: GetPostsParams): Promise<GetPostsResult>;
  findById(id: number): Promise<Post | null>;
  create(data: CreatePostData): Promise<Post>;
  update(id: number, data: UpdatePostData): Promise<Post>;
  delete(id: number): Promise<void>;
  updateStatus(id: number, status: PostStatus): Promise<Post>;
}
```

**Data Types:**
- `GetPostsParams`: `{ page?, limit?, status?, categoryId?, search? }`
- `GetPostsResult`: `{ posts, total, page, totalPages }`
- `CreatePostData`: 포스트 생성에 필요한 필드
- `UpdatePostData`: 포스트 수정에 필요한 필드 (Partial)

### ICategoryRepository

```typescript
interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: number, data: UpdateCategoryData): Promise<Category>;
  delete(id: number): Promise<void>;
}
```

### ITagRepository

```typescript
interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: number): Promise<Tag | null>;
  create(data: CreateTagData): Promise<Tag>;
  update(id: number, data: UpdateTagData): Promise<Tag>;
  delete(id: number): Promise<void>;
}
```

### IMediaRepository

```typescript
interface IMediaRepository {
  findAll(params?: GetMediaParams): Promise<GetMediaResult>;
  findById(id: number): Promise<Media | null>;
  upload(file: File): Promise<Media>;
  delete(id: number): Promise<void>;
}
```

### IProjectRepository

```typescript
interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  create(data: CreateProjectData): Promise<Project>;
  update(id: number, data: UpdateProjectData): Promise<Project>;
  delete(id: number): Promise<void>;
  reorder(orders: { id: number; order: number }[]): Promise<void>;
}
```

### IAuthRepository

```typescript
interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthToken>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<AuthToken>;
}
```

## Conventions

### Entity Creation
- 팩토리 함수 사용: `createPost()`, `createCategory()` 등
- 기본값 초기화 포함
- 파라미터는 `Create*Params` 인터페이스로 정의

### Type Safety
- 모든 엔티티는 불변(immutable)으로 취급
- 상태 변경은 새 객체 반환
- nullable 필드는 명시적으로 `| null` 사용

### Naming
- 엔티티: PascalCase 단수형 (`Post`, `Category`)
- 인터페이스: `I` prefix (`IPostRepository`)
- 타입: PascalCase (`PostStatus`, `CreatePostData`)

## Important Notes

- **No External Dependencies**: Domain 레이어는 외부 라이브러리에 의존하지 않음
- **Pure Business Logic**: 순수 비즈니스 규칙만 포함
- **Contract Definition**: 다른 레이어가 따라야 할 인터페이스 정의
- **Immutability**: 엔티티는 불변으로 취급
