# Implementation Plan: Blog Admin (Clean Architecture)

**Status**: 🔄 In Progress
**Started**: 2024-12-25
**Last Updated**: 2024-12-25

---

**CRITICAL INSTRUCTIONS**: After completing each phase:
1. Check off completed task checkboxes
2. Run all quality gate validation commands
3. Verify ALL quality gate items pass
4. Update "Last Updated" date above
5. Document learnings in Notes section
6. Only then proceed to next phase

**DO NOT skip quality gates or proceed with failing checks**

---

## Overview

### Feature Description
Blog Admin 프론트엔드를 Clean Architecture 원칙에 따라 구현합니다. TDD 방식으로 개발하며, 각 레이어의 독립성을 보장합니다.

### Success Criteria
- [ ] Clean Architecture 4개 레이어 분리 완료
- [ ] 모든 Use Case에 대한 테스트 커버리지 80% 이상
- [ ] E2E 테스트로 핵심 사용자 플로우 검증
- [ ] 빌드 및 배포 가능한 상태

### User Impact
- 블로그 관리자가 글, 카테고리, 태그, 프로젝트, 미디어를 효율적으로 관리할 수 있음
- Tailscale VPN을 통한 안전한 접근

---

## Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Clean Architecture 적용 | 테스트 용이성, 유지보수성 향상 | 초기 설정 복잡도 증가 |
| Repository Pattern | 데이터 접근 추상화, 테스트 시 Mock 용이 | 추가 인터페이스 필요 |
| Use Case Pattern | 비즈니스 로직 명확한 분리 | 파일 수 증가 |
| TanStack Query | 서버 상태 관리 최적화 | 학습 곡선 |

---

## Dependencies

### Required Before Starting
- [ ] Node.js 18+ 설치
- [ ] Backend API 서버: https://blog-api.dltmxm.link/api/admin

### External Dependencies
- next: ^14.0.0
- @tanstack/react-query: ^5.0.0
- axios: ^1.6.0
- vitest: ^1.0.0
- @testing-library/react: ^14.0.0

---

## Test Strategy

### Testing Approach
**TDD Principle**: Write tests FIRST, then implement to make them pass

### Test Pyramid for This Feature
| Test Type | Coverage Target | Purpose |
|-----------|-----------------|---------|
| **Unit Tests** | >=80% | Domain entities, Use Cases |
| **Integration Tests** | Critical paths | Repository implementations |
| **E2E Tests** | Key user flows | Login, Post CRUD, Media upload |

### Test File Organization
```
tests/
├── unit/
│   ├── domain/
│   │   └── entities/
│   │       ├── Post.test.ts
│   │       ├── Category.test.ts
│   │       └── Tag.test.ts
│   └── application/
│       └── usecases/
│           ├── post/
│           │   ├── CreatePostUseCase.test.ts
│           │   └── GetPostsUseCase.test.ts
│           └── auth/
│               └── LoginUseCase.test.ts
├── integration/
│   └── repositories/
│       ├── ApiPostRepository.test.ts
│       └── ApiAuthRepository.test.ts
└── e2e/
    └── flows/
        ├── auth.spec.ts
        ├── post-management.spec.ts
        └── media-upload.spec.ts
```

---

## Implementation Phases

### Phase 1: Project Setup & Domain Layer
**Goal**: 프로젝트 초기화 및 핵심 도메인 엔티티 정의
**Status**: Complete

#### Tasks

**RED: Write Failing Tests First**
- [x] **Test 1.1**: Domain Entity 테스트 작성
  - File(s): `tests/unit/domain/entities/Post.test.ts`
  - Expected: Tests FAIL (Post entity doesn't exist)
  - Details:
    - Post 엔티티 생성 테스트
    - PostStatus 타입 검증
    - 필수 필드 검증

- [x] **Test 1.2**: Category, Tag, Media 엔티티 테스트 작성
  - File(s): `tests/unit/domain/entities/*.test.ts`
  - Expected: Tests FAIL

**GREEN: Implement to Make Tests Pass**
- [x] **Task 1.3**: Next.js 프로젝트 생성 및 설정
  - Commands:
    ```bash
    npx create-next-app@latest . --typescript --tailwind --app
    npm install @tanstack/react-query axios js-cookie
    npm install -D vitest @testing-library/react @types/js-cookie
    ```

- [x] **Task 1.4**: 디렉토리 구조 생성
  - Directories:
    ```
    src/domain/entities/
    src/domain/repositories/
    src/domain/value-objects/
    src/application/usecases/
    src/application/dto/
    src/infrastructure/api/
    src/infrastructure/repositories/
    src/presentation/
    tests/unit/
    tests/integration/
    tests/e2e/
    ```

- [x] **Task 1.5**: Domain Entity 구현
  - File(s): `src/domain/entities/*.ts`
  - Goal: Make Test 1.1, 1.2 pass

- [x] **Task 1.6**: Repository Interface 정의
  - File(s): `src/domain/repositories/I*Repository.ts`

**REFACTOR: Clean Up Code**
- [x] **Task 1.7**: 코드 정리 및 타입 최적화
  - ESLint, Prettier 설정
  - tsconfig paths 설정 (@/)

#### Quality Gate

**TDD Compliance**:
- [x] Tests written BEFORE production code
- [x] All tests pass (Green)
- [x] Coverage: Domain entities >= 90% (100% achieved)

**Validation Commands**:
```bash
npm run test -- --coverage
npm run lint
npm run type-check
npm run build
```

**Manual Test Checklist**:
- [x] 프로젝트 빌드 성공
- [x] 테스트 실행 성공
- [x] TypeScript 타입 검사 통과

---

### Phase 2: Authentication System
**Goal**: JWT 기반 인증 시스템 구현 (Login/Logout)
**Status**: Complete

#### Tasks

**RED: Write Failing Tests First**
- [x] **Test 2.1**: LoginUseCase 테스트 작성
  - File(s): `tests/unit/application/usecases/auth/LoginUseCase.test.ts`
  - Expected: Tests FAIL
  - Details:
    - 유효한 자격 증명으로 로그인 성공
    - 잘못된 자격 증명으로 로그인 실패
    - 토큰 반환 검증

- [x] **Test 2.2**: LogoutUseCase, GetCurrentUserUseCase 테스트 작성
  - File(s): `tests/unit/application/usecases/auth/*.test.ts`

**GREEN: Implement to Make Tests Pass**
- [x] **Task 2.3**: IAuthRepository 인터페이스 정의 (Phase 1에서 완료)
  - File(s): `src/domain/repositories/IAuthRepository.ts`

- [x] **Task 2.4**: Auth Use Cases 구현
  - File(s): `src/application/usecases/auth/*.ts`
  - LoginUseCase, LogoutUseCase, GetCurrentUserUseCase

- [x] **Task 2.5**: ApiClient 구현 (Axios)
  - File(s): `src/infrastructure/api/ApiClient.ts`
  - Features:
    - JWT 토큰 인터셉터
    - 401 응답 처리

- [x] **Task 2.6**: ApiAuthRepository 구현
  - File(s): `src/infrastructure/repositories/ApiAuthRepository.ts`

- [x] **Task 2.7**: TokenStorage 구현
  - File(s): `src/infrastructure/auth/TokenStorage.ts`
  - Features: Cookie 기반 토큰 저장

**REFACTOR: Clean Up Code**
- [x] **Task 2.8**: 인증 관련 코드 정리
  - 인터셉터 로직 분리 완료

#### Quality Gate

**TDD Compliance**:
- [x] Tests written BEFORE production code
- [x] All tests pass (37 tests)
- [x] Coverage: Auth UseCases = 100%

**Validation Commands**:
```bash
npm run test -- tests/unit/application/usecases/auth
npm run type-check
npm run build
```

**Manual Test Checklist**:
- [x] 타입 체크 통과
- [x] 빌드 성공
- [ ] 로그인 API 호출 테스트 (Phase 3에서 수행)

---

### Phase 3: Presentation Layer - Auth UI
**Goal**: 로그인 페이지 및 인증 가드 구현
**Status**: Complete

#### Tasks

**Implementation (Component-First Approach)**
- [x] **Task 3.1**: DependencyProvider 구현
  - File(s): `src/presentation/providers/DependencyProvider.tsx`
  - Features: Use Case 의존성 주입, QueryClientProvider 통합

- [x] **Task 3.2**: AuthContext 및 AuthProvider 구현
  - File(s): `src/presentation/context/AuthContext.tsx`
  - Features: login, logout, getCurrentUser 연동

- [x] **Task 3.3**: useAuth Hook 구현
  - File(s): `src/presentation/hooks/useAuth.ts`

- [x] **Task 3.4**: 공통 UI 컴포넌트 구현
  - File(s): `src/presentation/components/common/*.tsx`
  - Components: Button, Input, Toast, ToastProvider

- [x] **Task 3.5**: Login Page 구현
  - File(s): `src/app/login/page.tsx`
  - Features: 폼 검증, 에러 표시, 로딩 상태

- [x] **Task 3.6**: AuthGuard 컴포넌트 구현
  - File(s): `src/presentation/components/layout/AuthGuard.tsx`

- [x] **Task 3.7**: Authenticated Layout 및 Dashboard 페이지 구현
  - File(s): `src/app/(authenticated)/layout.tsx`, `src/app/(authenticated)/dashboard/page.tsx`

#### Quality Gate

**Build & Type Check**:
- [x] TypeScript 타입 검사 통과
- [x] 빌드 성공
- [x] 모든 기존 테스트 통과 (37 tests)

**Validation Commands**:
```bash
npm run type-check
npm run test:run
npm run build
```

**Manual Test Checklist**:
- [x] 로그인 페이지 렌더링 (/login)
- [x] 대시보드 페이지 렌더링 (/dashboard)
- [x] AuthGuard 리다이렉트 로직
- [ ] 실제 API 연동 테스트 (수동)

---

### Phase 4: Post Management - Domain & Application
**Goal**: 글 관리 도메인 로직 및 Use Cases 구현
**Status**: Complete

#### Tasks

**RED: Write Failing Tests First**
- [x] **Test 4.1**: Post Use Cases 테스트 작성
  - File(s): `tests/unit/application/usecases/post/*.test.ts`
  - Expected: Tests FAIL
  - Details:
    - CreatePostUseCase (7 tests)
    - GetPostsUseCase (6 tests)
    - GetPostByIdUseCase (5 tests)
    - UpdatePostUseCase (10 tests)
    - DeletePostUseCase (5 tests)
    - PublishPostUseCase (8 tests)

- [x] **Test 4.2**: IPostRepository Mock 테스트 (Use Case 테스트에 포함)

**GREEN: Implement to Make Tests Pass**
- [x] **Task 4.3**: IPostRepository 인터페이스 정의 (Phase 1에서 완료)
  - File(s): `src/domain/repositories/IPostRepository.ts`

- [x] **Task 4.4**: Post Use Cases 구현
  - File(s): `src/application/usecases/post/*.ts`
  - Goal: Make Test 4.1 pass (41 tests passed)

- [x] **Task 4.5**: PostMapper 구현 (API ↔ Domain 변환)
  - File(s): `src/infrastructure/mappers/PostMapper.ts`

- [x] **Task 4.6**: ApiPostRepository 구현
  - File(s): `src/infrastructure/repositories/ApiPostRepository.ts`

- [x] **Task 4.7**: DependencyProvider 업데이트
  - Post Use Cases를 의존성 주입에 추가

**REFACTOR: Clean Up Code**
- [x] **Task 4.8**: ApiClient 제네릭 타입 개선

#### Quality Gate

**TDD Compliance**:
- [x] Tests written BEFORE production code
- [x] All tests pass (78 tests total)
- [x] Coverage: Post UseCases = 100%

**Validation Commands**:
```bash
npm run test -- tests/unit/application/usecases/post
npm run lint
npm run type-check
npm run build
```

**Manual Test Checklist**:
- [x] Use Case 단위 테스트 모두 통과 (41 Post Use Case tests)
- [x] TypeScript 타입 체크 통과
- [x] 빌드 성공

---

### Phase 5: Post Management - UI
**Goal**: 글 목록, 작성, 수정 페이지 구현
**Status**: Complete

#### Tasks

**Implementation (Component-First Approach)**
- [x] **Task 5.1**: usePostQueries Hook 구현
  - File(s): `src/presentation/hooks/queries/usePostQueries.ts`
  - Features: TanStack Query 기반 (usePosts, usePost, useCreatePost, useUpdatePost, useDeletePost, usePublishPost)

- [x] **Task 5.2**: PostStatusBadge 컴포넌트 구현
  - File(s): `src/presentation/components/post/PostStatusBadge.tsx`
  - Features: draft/published 상태 뱃지

- [x] **Task 5.3**: PostList 컴포넌트 구현
  - File(s): `src/presentation/components/post/PostList.tsx`
  - Features: 상태 필터, 페이지네이션, 삭제/발행 기능

- [x] **Task 5.4**: MarkdownEditor 컴포넌트 구현
  - File(s): `src/presentation/components/editor/MarkdownEditor.tsx`
  - Features: @uiw/react-md-editor 기반, 이미지 드래그앤드롭/붙여넣기 지원

- [x] **Task 5.5**: PostForm 컴포넌트 구현
  - File(s): `src/presentation/components/post/PostForm.tsx`
  - Features: 생성/수정 폼, 슬러그 자동 생성, 카테고리/태그 선택

- [x] **Task 5.6**: 글 관련 페이지 구현
  - File(s):
    - `src/app/(authenticated)/posts/page.tsx` - 글 목록
    - `src/app/(authenticated)/posts/new/page.tsx` - 새 글 작성
    - `src/app/(authenticated)/posts/[id]/edit/page.tsx` - 글 수정

- [x] **Task 5.7**: Button 컴포넌트 확장
  - Added: outline variant

#### Quality Gate

**Build & Type Check**:
- [x] TypeScript 타입 검사 통과
- [x] 빌드 성공 (routes: `/posts`, `/posts/new`, `/posts/[id]/edit`)
- [x] 모든 기존 테스트 통과 (78 tests)

**Validation Commands**:
```bash
npm run type-check
npm run test:run
npm run build
```

**Manual Test Checklist**:
- [x] 글 목록 페이지 렌더링 (`/posts`)
- [x] 상태 필터 (전체/발행됨/임시저장)
- [x] 새 글 작성 페이지 (`/posts/new`)
- [x] 마크다운 에디터 컴포넌트
- [x] 글 수정 페이지 (`/posts/[id]/edit`)
- [ ] 실제 API 연동 테스트 (수동)

---

### Phase 6: Category & Tag Management
**Goal**: 카테고리/태그 CRUD 구현
**Status**: Complete

#### Tasks

**RED: Write Failing Tests First**
- [x] **Test 6.1**: Category Use Cases 테스트 (19 tests)
  - GetCategoriesUseCase (3 tests)
  - CreateCategoryUseCase (5 tests)
  - UpdateCategoryUseCase (6 tests)
  - DeleteCategoryUseCase (5 tests)

- [x] **Test 6.2**: Tag Use Cases 테스트 (18 tests)
  - GetTagsUseCase (3 tests)
  - CreateTagUseCase (5 tests)
  - UpdateTagUseCase (6 tests)
  - DeleteTagUseCase (4 tests)

**GREEN: Implement to Make Tests Pass**
- [x] **Task 6.3**: Category Use Cases 구현
  - File(s): `src/application/usecases/category/*.ts`

- [x] **Task 6.4**: Tag Use Cases 구현
  - File(s): `src/application/usecases/tag/*.ts`

- [x] **Task 6.5**: Repository 및 Mapper 구현
  - File(s): `src/infrastructure/repositories/ApiCategoryRepository.ts`
  - File(s): `src/infrastructure/repositories/ApiTagRepository.ts`
  - File(s): `src/infrastructure/mappers/CategoryMapper.ts`
  - File(s): `src/infrastructure/mappers/TagMapper.ts`

- [x] **Task 6.6**: Query Hooks 구현
  - File(s): `src/presentation/hooks/queries/useCategoryQueries.ts`
  - File(s): `src/presentation/hooks/queries/useTagQueries.ts`

- [x] **Task 6.7**: UI 컴포넌트 구현
  - File(s): `src/presentation/components/category/CategoryList.tsx`
  - File(s): `src/presentation/components/tag/TagList.tsx`

- [x] **Task 6.8**: 페이지 구현
  - File(s): `src/app/(authenticated)/categories/page.tsx`
  - File(s): `src/app/(authenticated)/tags/page.tsx`

- [x] **Task 6.9**: DependencyProvider 업데이트
  - Category/Tag Use Cases 의존성 주입 추가

#### Quality Gate

**TDD Compliance**:
- [x] Tests written BEFORE production code
- [x] All tests pass (115 tests total)
- [x] Coverage: Category/Tag UseCases = 100%

**Validation Commands**:
```bash
npm run test -- tests/unit/application/usecases/category
npm run test -- tests/unit/application/usecases/tag
npm run type-check
npm run build
```

**Manual Test Checklist**:
- [x] 카테고리 CRUD 동작
- [x] 태그 CRUD 동작
- [x] 삭제 시 경고 표시
- [ ] 실제 API 연동 테스트 (수동)

---

### Phase 7: Media Management
**Goal**: 미디어 업로드/삭제 기능 구현
**Status**: Pending

#### Tasks

**RED: Write Failing Tests First**
- [ ] **Test 7.1**: Media Use Cases 테스트
  - File(s): `tests/unit/application/usecases/media/*.test.ts`

**GREEN: Implement to Make Tests Pass**
- [ ] **Task 7.2**: Media Use Cases 구현
  - File(s): `src/application/usecases/media/*.ts`

- [ ] **Task 7.3**: ApiMediaRepository 구현
  - File(s): `src/infrastructure/repositories/ApiMediaRepository.ts`
  - Features: FormData 업로드

- [ ] **Task 7.4**: Media UI 컴포넌트 구현
  - File(s):
    - `src/presentation/components/media/MediaGrid.tsx`
    - `src/presentation/components/media/MediaUploader.tsx`
    - `src/presentation/components/media/MediaPicker.tsx`

- [ ] **Task 7.5**: 미디어 페이지 구현
  - File(s): `src/presentation/app/(authenticated)/media/page.tsx`

**REFACTOR: Clean Up Code**
- [ ] **Task 7.6**: 업로드 로직 최적화

#### Quality Gate

**Validation Commands**:
```bash
npm run test -- tests/unit/application/usecases/media
npm run lint
```

**Manual Test Checklist**:
- [ ] 드래그앤드롭 업로드 동작
- [ ] 이미지 그리드 표시
- [ ] 삭제 동작
- [ ] URL 복사 동작

---

### Phase 8: Project Management
**Goal**: 프로젝트 CRUD 및 순서 변경 기능 구현
**Status**: Pending

#### Tasks

**RED: Write Failing Tests First**
- [ ] **Test 8.1**: Project Use Cases 테스트
  - File(s): `tests/unit/application/usecases/project/*.test.ts`

**GREEN: Implement to Make Tests Pass**
- [ ] **Task 8.2**: Project Use Cases 구현
- [ ] **Task 8.3**: ApiProjectRepository 구현
- [ ] **Task 8.4**: Project UI 컴포넌트 구현
- [ ] **Task 8.5**: 프로젝트 페이지 구현

**REFACTOR: Clean Up Code**
- [ ] **Task 8.6**: 드래그앤드롭 로직 최적화

#### Quality Gate

**Manual Test Checklist**:
- [ ] 프로젝트 CRUD 동작
- [ ] 순서 변경 동작
- [ ] 기술 스택 태그 입력

---

### Phase 9: Dashboard & Layout
**Goal**: 대시보드 및 공통 레이아웃 구현
**Status**: Pending

#### Tasks

- [ ] **Task 9.1**: Sidebar 컴포넌트 구현
- [ ] **Task 9.2**: Header 컴포넌트 구현
- [ ] **Task 9.3**: Authenticated Layout 구현
- [ ] **Task 9.4**: Dashboard 통계 API 연동
- [ ] **Task 9.5**: StatsCard, RecentPosts 컴포넌트 구현
- [ ] **Task 9.6**: Dashboard 페이지 구현

#### Quality Gate

**Manual Test Checklist**:
- [ ] 사이드바 네비게이션 동작
- [ ] 대시보드 통계 표시
- [ ] 최근 글 목록 표시

---

### Phase 10: E2E Tests & Polish
**Goal**: E2E 테스트 및 최종 마무리
**Status**: Pending

#### Tasks

**E2E Tests**
- [ ] **Test 10.1**: 인증 플로우 E2E 테스트
  - File(s): `tests/e2e/flows/auth.spec.ts`

- [ ] **Test 10.2**: 글 관리 E2E 테스트
  - File(s): `tests/e2e/flows/post-management.spec.ts`

- [ ] **Test 10.3**: 미디어 업로드 E2E 테스트
  - File(s): `tests/e2e/flows/media-upload.spec.ts`

**Polish**
- [ ] **Task 10.4**: 에러 핸들링 개선
- [ ] **Task 10.5**: 로딩 상태 UX 개선
- [ ] **Task 10.6**: 접근성 개선 (a11y)
- [ ] **Task 10.7**: 성능 최적화

#### Quality Gate

**Validation Commands**:
```bash
npm run test
npm run test:e2e
npm run lint
npm run build
```

**Manual Test Checklist**:
- [ ] 모든 핵심 플로우 동작 확인
- [ ] 에러 상황 처리 확인
- [ ] 반응형 레이아웃 확인

---

### Phase 11: Deployment
**Goal**: Docker 빌드 및 배포 준비
**Status**: Pending

#### Tasks

- [ ] **Task 11.1**: Dockerfile 작성
- [ ] **Task 11.2**: docker-compose.yml 작성
- [ ] **Task 11.3**: 환경 변수 정리
- [ ] **Task 11.4**: 빌드 테스트
- [ ] **Task 11.5**: Traefik 라벨 설정

#### Quality Gate

**Validation Commands**:
```bash
docker build -t blog-admin .
docker-compose up -d
```

**Manual Test Checklist**:
- [ ] Docker 빌드 성공
- [ ] 컨테이너 실행 성공
- [ ] Tailscale 네트워크에서 접근 확인

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Backend API 변경 | Medium | High | Repository 패턴으로 변경 격리 |
| Toast UI Editor 호환성 | Low | Medium | 대체 에디터 후보 준비 |
| TanStack Query 버전 업데이트 | Low | Low | 버전 고정 |
| 테스트 커버리지 미달 | Medium | Medium | Phase별 Quality Gate 강제 |

---

## Rollback Strategy

### If Phase Fails
**Steps to revert**:
1. Git으로 해당 Phase 이전 커밋으로 리셋
2. 환경 변수 복원
3. 의존성 재설치 (`npm ci`)

---

## Progress Tracking

### Completion Status
- **Phase 1**: Complete
- **Phase 2**: Complete
- **Phase 3**: Complete
- **Phase 4**: Complete
- **Phase 5**: Complete
- **Phase 6**: Complete
- **Phase 7**: Pending
- **Phase 8**: Pending
- **Phase 9**: Pending
- **Phase 10**: Pending
- **Phase 11**: Pending

**Overall Progress**: 55% complete (6/11 phases)

---

## Notes & Learnings

### Implementation Notes
- (Add insights during implementation)

### Blockers Encountered
- (Document blockers and resolutions)

---

## Final Checklist

**Before marking plan as COMPLETE**:
- [ ] All phases completed with quality gates passed
- [ ] Full E2E testing performed
- [ ] Test coverage >= 80% overall
- [ ] Documentation updated
- [ ] Docker build successful
- [ ] Deployed to Tailscale network
