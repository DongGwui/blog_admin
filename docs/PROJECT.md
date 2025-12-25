# Blog Admin 프로젝트

## 프로젝트 개요

개인 블로그의 관리자 프론트엔드. 글 작성/수정, 카테고리/태그 관리, 미디어 업로드, 프로젝트 관리 등을 수행합니다. Tailscale VPN을 통해서만 접근 가능합니다.

### 핵심 정보

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 14+ (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 상태 관리 | TanStack Query |
| 마크다운 에디터 | Toast UI Editor |
| 접근 | Tailscale Only (비공개) |
| 도메인 | admin.dltmxm.link (또는 Tailscale IP) |

### API 연결

```
API URL: https://blog-api.dltmxm.link/api/admin
Swagger: https://blog-api.dltmxm.link/swagger/index.html
```

**API 명세서**: [docs/admin-api-docs.md](./admin-api-docs.md)

---

## 아키텍처 개요

이 프로젝트는 **Clean Architecture** 원칙을 따릅니다.

### 핵심 원칙

1. **프레임워크 독립성**: 비즈니스 로직은 Next.js에 의존하지 않음
2. **테스트 용이성**: UI, DB 없이 비즈니스 규칙 테스트 가능
3. **UI 독립성**: UI 변경이 비즈니스 로직에 영향 없음
4. **의존성 규칙**: 외부 레이어 → 내부 레이어 방향으로만 의존

### 레이어 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│              (Next.js App Router, Components)               │
├─────────────────────────────────────────────────────────────┤
│                   Application Layer                         │
│                (Use Cases, Services)                        │
├─────────────────────────────────────────────────────────────┤
│                     Domain Layer                            │
│           (Entities, Repository Interfaces)                 │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                       │
│         (API Client, Repository Implementations)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 기술 스택 상세

### 필수 의존성

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "@toast-ui/react-editor": "^3.2.0",
    "js-cookie": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0",
    "@types/js-cookie": "^3.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

---

## 디렉토리 구조 (Clean Architecture)

```
blog-admin/
├── src/
│   ├── domain/                          # 🟢 Domain Layer (가장 안쪽)
│   │   ├── entities/                    # 핵심 비즈니스 객체
│   │   │   ├── Post.ts
│   │   │   ├── Category.ts
│   │   │   ├── Tag.ts
│   │   │   ├── Project.ts
│   │   │   ├── Media.ts
│   │   │   └── User.ts
│   │   ├── repositories/                # Repository 인터페이스 (추상화)
│   │   │   ├── IPostRepository.ts
│   │   │   ├── ICategoryRepository.ts
│   │   │   ├── ITagRepository.ts
│   │   │   ├── IProjectRepository.ts
│   │   │   ├── IMediaRepository.ts
│   │   │   └── IAuthRepository.ts
│   │   └── value-objects/               # 값 객체
│   │       ├── Slug.ts
│   │       └── Email.ts
│   │
│   ├── application/                     # 🟡 Application Layer
│   │   ├── usecases/                    # 유스케이스 (비즈니스 로직)
│   │   │   ├── post/
│   │   │   │   ├── CreatePostUseCase.ts
│   │   │   │   ├── UpdatePostUseCase.ts
│   │   │   │   ├── DeletePostUseCase.ts
│   │   │   │   ├── GetPostsUseCase.ts
│   │   │   │   └── PublishPostUseCase.ts
│   │   │   ├── category/
│   │   │   │   ├── CreateCategoryUseCase.ts
│   │   │   │   └── GetCategoriesUseCase.ts
│   │   │   ├── tag/
│   │   │   ├── project/
│   │   │   ├── media/
│   │   │   │   ├── UploadMediaUseCase.ts
│   │   │   │   └── DeleteMediaUseCase.ts
│   │   │   └── auth/
│   │   │       ├── LoginUseCase.ts
│   │   │       └── LogoutUseCase.ts
│   │   ├── dto/                         # Data Transfer Objects
│   │   │   ├── PostDTO.ts
│   │   │   ├── CreatePostRequest.ts
│   │   │   └── UpdatePostRequest.ts
│   │   └── services/                    # 애플리케이션 서비스
│   │       └── SlugGeneratorService.ts
│   │
│   ├── infrastructure/                  # 🔴 Infrastructure Layer
│   │   ├── api/                         # API 클라이언트
│   │   │   ├── ApiClient.ts             # Axios 인스턴스
│   │   │   └── endpoints.ts             # API 엔드포인트 정의
│   │   ├── repositories/                # Repository 구현체
│   │   │   ├── ApiPostRepository.ts
│   │   │   ├── ApiCategoryRepository.ts
│   │   │   ├── ApiTagRepository.ts
│   │   │   ├── ApiProjectRepository.ts
│   │   │   ├── ApiMediaRepository.ts
│   │   │   └── ApiAuthRepository.ts
│   │   ├── auth/                        # 인증 인프라
│   │   │   ├── TokenStorage.ts          # 토큰 저장 (Cookie)
│   │   │   └── AuthInterceptor.ts       # API 인터셉터
│   │   └── mappers/                     # Entity ↔ DTO 변환
│   │       ├── PostMapper.ts
│   │       └── CategoryMapper.ts
│   │
│   └── presentation/                    # 🟣 Presentation Layer
│       ├── app/                         # Next.js App Router
│       │   ├── layout.tsx               # 루트 레이아웃
│       │   ├── page.tsx                 # 리다이렉트 → /dashboard
│       │   ├── login/
│       │   │   └── page.tsx             # 로그인 페이지
│       │   └── (authenticated)/         # 인증 필요 그룹
│       │       ├── layout.tsx           # 사이드바 레이아웃
│       │       ├── dashboard/
│       │       │   └── page.tsx
│       │       ├── posts/
│       │       │   ├── page.tsx
│       │       │   ├── new/
│       │       │   │   └── page.tsx
│       │       │   └── [id]/
│       │       │       └── edit/
│       │       │           └── page.tsx
│       │       ├── categories/
│       │       │   └── page.tsx
│       │       ├── tags/
│       │       │   └── page.tsx
│       │       ├── projects/
│       │       │   ├── page.tsx
│       │       │   ├── new/
│       │       │   │   └── page.tsx
│       │       │   └── [id]/
│       │       │       └── edit/
│       │       │           └── page.tsx
│       │       └── media/
│       │           └── page.tsx
│       │
│       ├── components/                  # UI 컴포넌트
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   └── AuthGuard.tsx
│       │   ├── post/
│       │   │   ├── PostForm.tsx
│       │   │   ├── PostList.tsx
│       │   │   └── PostStatusBadge.tsx
│       │   ├── editor/
│       │   │   └── MarkdownEditor.tsx
│       │   ├── category/
│       │   │   ├── CategoryList.tsx
│       │   │   └── CategoryForm.tsx
│       │   ├── tag/
│       │   │   ├── TagList.tsx
│       │   │   └── TagForm.tsx
│       │   ├── project/
│       │   │   ├── ProjectForm.tsx
│       │   │   └── ProjectList.tsx
│       │   ├── media/
│       │   │   ├── MediaGrid.tsx
│       │   │   ├── MediaUploader.tsx
│       │   │   └── MediaPicker.tsx
│       │   ├── dashboard/
│       │   │   ├── StatsCard.tsx
│       │   │   └── RecentPosts.tsx
│       │   └── common/
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Select.tsx
│       │       ├── Modal.tsx
│       │       ├── Table.tsx
│       │       ├── Pagination.tsx
│       │       └── Toast.tsx
│       │
│       ├── hooks/                       # React Hooks
│       │   ├── useAuth.ts
│       │   ├── useToast.ts
│       │   └── queries/                 # TanStack Query Hooks
│       │       ├── usePostQueries.ts
│       │       ├── useCategoryQueries.ts
│       │       ├── useTagQueries.ts
│       │       ├── useProjectQueries.ts
│       │       └── useMediaQueries.ts
│       │
│       ├── context/                     # React Context
│       │   └── AuthContext.tsx
│       │
│       └── providers/                   # 의존성 주입
│           └── DependencyProvider.tsx
│
├── tests/                               # 테스트
│   ├── unit/
│   │   ├── domain/
│   │   │   └── entities/
│   │   └── application/
│   │       └── usecases/
│   ├── integration/
│   │   └── repositories/
│   └── e2e/
│       └── flows/
│
├── docs/                                # 문서
│   ├── PROJECT.md
│   ├── TASKS.md
│   ├── ARCHITECTURE.md
│   └── plans/                           # 기능별 구현 계획
│
├── Dockerfile
├── docker-compose.dev.yml
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## 레이어별 의존성 규칙

### Domain Layer (가장 안쪽)
- **의존**: 없음 (순수 TypeScript)
- **역할**: 핵심 비즈니스 엔티티와 규칙 정의
- **특징**: 프레임워크 코드 금지

```typescript
// domain/entities/Post.ts
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: PostStatus;
  categoryId: number | null;
  tagIds: number[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export type PostStatus = 'draft' | 'published';
```

### Application Layer
- **의존**: Domain Layer만
- **역할**: 유스케이스 구현, 비즈니스 로직 조정
- **특징**: Repository 인터페이스를 통해 데이터 접근

```typescript
// application/usecases/post/CreatePostUseCase.ts
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { Post } from '@/domain/entities/Post';

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(request: CreatePostRequest): Promise<Post> {
    // 비즈니스 로직
    const slug = this.generateSlug(request.title);
    return this.postRepository.create({ ...request, slug });
  }
}
```

### Infrastructure Layer
- **의존**: Domain Layer, Application Layer
- **역할**: 외부 시스템과의 통신 구현
- **특징**: Repository 인터페이스의 구체적 구현

```typescript
// infrastructure/repositories/ApiPostRepository.ts
import { IPostRepository } from '@/domain/repositories/IPostRepository';
import { ApiClient } from '../api/ApiClient';

export class ApiPostRepository implements IPostRepository {
  constructor(private api: ApiClient) {}

  async create(data: CreatePostRequest): Promise<Post> {
    const response = await this.api.post('/posts', data);
    return PostMapper.toDomain(response.data);
  }
}
```

### Presentation Layer (가장 바깥쪽)
- **의존**: 모든 레이어
- **역할**: UI 렌더링, 사용자 입력 처리
- **특징**: React/Next.js 코드

```typescript
// presentation/hooks/queries/usePostQueries.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDependencies } from '@/presentation/providers/DependencyProvider';

export function useCreatePost() {
  const { createPostUseCase } = useDependencies();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPostUseCase.execute(data),
  });
}
```

---

## 페이지 구조

| 경로 | 페이지 | 기능 |
|------|--------|------|
| `/login` | 로그인 | JWT 인증 |
| `/dashboard` | 대시보드 | 통계, 최근 글 |
| `/posts` | 글 목록 | 전체/발행/임시저장 필터 |
| `/posts/new` | 글 작성 | 마크다운 에디터 |
| `/posts/[id]/edit` | 글 수정 | 기존 글 편집 |
| `/categories` | 카테고리 관리 | CRUD |
| `/tags` | 태그 관리 | CRUD |
| `/projects` | 프로젝트 목록 | 순서 변경 |
| `/projects/new` | 프로젝트 추가 | |
| `/projects/[id]/edit` | 프로젝트 수정 | |
| `/media` | 미디어 관리 | 업로드, 삭제 |

---

## 주요 기능

### 인증
- JWT 기반 로그인
- 토큰 저장 (쿠키)
- 자동 로그아웃 (만료 시)
- 인증 가드 (미인증 시 로그인 리다이렉트)

### 글 관리
- 글 목록 (상태별 필터: 전체/발행/임시저장)
- Toast UI Editor로 마크다운 작성
- 자동 저장 (임시저장)
- 이미지 삽입 (미디어 라이브러리 연동)
- 카테고리/태그 선택
- 슬러그 자동 생성 + 수동 편집
- 발행/비공개 전환

### 카테고리 & 태그
- 목록 보기 (사용 중인 글 개수)
- 추가/수정/삭제
- 삭제 시 연결된 글 확인 경고

### 프로젝트 관리
- 목록 보기
- 드래그앤드롭 순서 변경
- 기술 스택 태그 입력
- 이미지 첨부

### 미디어 관리
- 이미지 업로드 (드래그앤드롭)
- 그리드 뷰
- 삭제/URL 복사

### 대시보드
- 전체 글 수/발행/임시저장
- 카테고리별 글 수
- 최근 글 목록

---

## 환경 변수

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://blog-api.dltmxm.link/api/admin
```

---

## 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 테스트
npm run test

# 테스트 커버리지
npm run test:coverage

# 빌드
npm run build
```

### 확인
```
http://localhost:3001
```

---

## 보안 고려사항

1. **네트워크 격리**: Tailscale VPN에서만 접근 가능
2. **JWT 인증**: 모든 API 요청에 토큰 필요
3. **토큰 만료**: 24시간 후 재로그인 필요
4. **CSRF 방지**: SameSite 쿠키 설정

---

## 참고 문서

| 파일 | 내용 |
|------|------|
| docs/ARCHITECTURE.md | Clean Architecture 상세 설계 |
| docs/TASKS.md | 구현 계획 (TDD 기반) |
