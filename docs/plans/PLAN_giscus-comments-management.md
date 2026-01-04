# Giscus 댓글 관리 기능 구현 계획

**문서 버전**: 1.0
**생성일**: 2026-01-04
**최종 수정일**: 2026-01-04
**상태**: 완료

---

**CRITICAL INSTRUCTIONS**: 각 단계 완료 후:
1. 완료된 작업 체크박스를 체크
2. Quality Gate 검증 명령어 실행
3. 모든 Quality Gate 항목 통과 확인
4. "최종 수정일" 업데이트
5. Notes 섹션에 학습 내용 기록
6. 다음 단계로 진행

**DO NOT skip quality gates or proceed with failing checks**

---

## 개요

### 목적
blog_public에서 giscus를 통해 작성된 GitHub Discussions 댓글을 blog_admin에서 관리(조회, 삭제)할 수 있는 기능 구현

### 배경
- blog_public: giscus를 통해 GitHub Discussions 기반 댓글 시스템 운영
- Repository: `DongGwui/blog_public`
- Category: `General` (DIC_kwDOQxxkec4C0cwg)
- Mapping: `pathname` 기반 (URL 경로로 댓글 구분)

### 핵심 기능
1. **댓글 목록 조회**: 전체 Discussion 댓글 조회
2. **댓글 필터링**: 게시글별, 날짜별 필터링
3. **댓글 삭제**: 스팸/부적절한 댓글 삭제

---

## 아키텍처 결정

### 1. GitHub API 선택
**결정**: GitHub GraphQL API 사용

**이유**:
- Discussions API는 GraphQL만 지원
- 필요한 필드만 선택적으로 조회 가능
- 페이지네이션 지원 (Cursor 기반)

### 2. 인증 방식
**결정**: GitHub Personal Access Token (PAT) 사용

**이유**:
- Admin 전용 기능이므로 서버 사이드 토큰 관리
- 환경 변수로 안전하게 보관
- `public_repo` scope 필요 (public repository)

### 3. Clean Architecture 적용
**결정**: 기존 프로젝트 패턴 준수

```
Domain: Comment 엔티티, ICommentRepository 인터페이스
Application: GetCommentsUseCase, DeleteCommentUseCase
Infrastructure: GitHubCommentRepository (GraphQL 구현)
Presentation: CommentList 컴포넌트, useComments 훅
```

### 4. 데이터 흐름
```
GitHub GraphQL API (snake_case)
    → GitHubCommentRepository
    → CommentMapper (camelCase 변환)
    → Use Case
    → React Query Hook
    → Component
```

---

## Phase 1: Domain & Infrastructure 기반 구조 (1-2시간)

### 목표
Comment 엔티티, Repository 인터페이스, GraphQL 클라이언트 기반 구조 구축

### Test Strategy
- **Unit Tests**: Entity 헬퍼 함수, Mapper 변환 로직
- **Coverage Target**: 90% (Domain, Mapper)

### Tasks

#### RED Phase (테스트 먼저 작성)
- [ ] `src/domain/entities/__tests__/Comment.test.ts` 생성
  - Comment 엔티티 타입 검증
  - formatCommentDate 헬퍼 함수 테스트
- [ ] `src/infrastructure/mappers/__tests__/CommentMapper.test.ts` 생성
  - GraphQL 응답 → Domain 변환 테스트
  - null/undefined 케이스 처리 테스트

#### GREEN Phase (구현)
- [ ] `src/domain/entities/Comment.ts` 생성
  ```typescript
  interface Comment {
    id: string;           // GraphQL node ID
    databaseId: number;   // Discussion comment ID
    body: string;
    bodyHTML: string;
    author: {
      login: string;
      avatarUrl: string;
    };
    discussionTitle: string;  // 연결된 포스트 제목
    discussionUrl: string;    // Discussion URL
    postSlug: string;         // 블로그 포스트 slug (pathname에서 추출)
    createdAt: Date;
    updatedAt: Date;
    isMinimized: boolean;     // 숨김 처리 여부
    replies: CommentReply[];  // 대댓글
  }

  interface CommentReply {
    id: string;
    databaseId: number;
    body: string;
    author: {
      login: string;
      avatarUrl: string;
    };
    createdAt: Date;
  }
  ```
- [ ] `src/domain/entities/index.ts` 업데이트
- [ ] `src/domain/repositories/ICommentRepository.ts` 생성
  ```typescript
  interface GetCommentsParams {
    page?: number;
    limit?: number;
    postSlug?: string;  // 특정 포스트 댓글만 필터
  }

  interface GetCommentsResult {
    comments: Comment[];
    total: number;
    hasNextPage: boolean;
    endCursor: string | null;
  }

  interface ICommentRepository {
    findAll(params?: GetCommentsParams): Promise<GetCommentsResult>;
    delete(id: string): Promise<void>;
    minimize(id: string, reason: string): Promise<void>;  // 숨김 처리
  }
  ```
- [ ] `src/domain/repositories/index.ts` 업데이트
- [ ] `src/infrastructure/mappers/CommentMapper.ts` 생성
- [ ] `src/infrastructure/api/GitHubGraphQLClient.ts` 생성
  - GitHub GraphQL API 클라이언트
  - 환경 변수에서 토큰 로드
  - 에러 핸들링

#### REFACTOR Phase
- [ ] 코드 중복 제거 및 타입 개선
- [ ] 헬퍼 함수 분리

### Quality Gate
- [ ] `npm run test -- --testPathPattern="Comment"` 통과
- [ ] `npm run lint` 에러 없음
- [ ] `npm run build` 성공
- [ ] TypeScript 타입 에러 없음

### Dependencies
- 없음 (첫 번째 단계)

### Rollback Strategy
- 생성된 파일 삭제
- index.ts에서 export 제거

---

## Phase 2: Infrastructure 구현 - GitHubCommentRepository (2-3시간)

### 목표
GitHub GraphQL API를 사용한 Repository 구현체 완성

### Test Strategy
- **Integration Tests**: GraphQL 쿼리 응답 파싱
- **Mock**: GitHub API 응답 mock
- **Coverage Target**: 80%

### Tasks

#### RED Phase
- [ ] `src/infrastructure/repositories/__tests__/GitHubCommentRepository.test.ts` 생성
  - findAll 메서드 테스트 (정상 응답)
  - findAll 메서드 테스트 (빈 결과)
  - findAll 메서드 테스트 (페이지네이션)
  - delete 메서드 테스트
  - minimize 메서드 테스트
  - 에러 핸들링 테스트

#### GREEN Phase
- [ ] `src/infrastructure/repositories/GitHubCommentRepository.ts` 생성
  ```typescript
  // GraphQL Queries
  const GET_DISCUSSIONS_QUERY = `
    query GetDiscussions($owner: String!, $repo: String!, $categoryId: ID!, $first: Int!, $after: String) {
      repository(owner: $owner, name: $repo) {
        discussions(categoryId: $categoryId, first: $first, after: $after, orderBy: {field: CREATED_AT, direction: DESC}) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            url
            comments(first: 100) {
              nodes {
                id
                databaseId
                body
                bodyHTML
                author {
                  login
                  avatarUrl
                }
                createdAt
                updatedAt
                isMinimized
                replies(first: 100) {
                  nodes {
                    id
                    databaseId
                    body
                    author {
                      login
                      avatarUrl
                    }
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  // Mutations
  const DELETE_COMMENT_MUTATION = `...`;
  const MINIMIZE_COMMENT_MUTATION = `...`;
  ```
- [ ] `src/infrastructure/repositories/index.ts` 업데이트
- [ ] `.env.example` 업데이트
  ```env
  NEXT_PUBLIC_GITHUB_TOKEN=ghp_xxxxx
  NEXT_PUBLIC_GITHUB_REPO_OWNER=DongGwui
  NEXT_PUBLIC_GITHUB_REPO_NAME=blog_public
  NEXT_PUBLIC_GITHUB_CATEGORY_ID=DIC_kwDOQxxkec4C0cwg
  ```

#### REFACTOR Phase
- [ ] GraphQL 쿼리 최적화
- [ ] 에러 메시지 개선
- [ ] 타입 안전성 강화

### Quality Gate
- [ ] `npm run test -- --testPathPattern="GitHubComment"` 통과
- [ ] `npm run lint` 에러 없음
- [ ] `npm run build` 성공
- [ ] GraphQL 쿼리 문법 검증

### Dependencies
- Phase 1 완료

### Rollback Strategy
- GitHubCommentRepository.ts 삭제
- 환경 변수 설정 제거

---

## Phase 3: Application Layer - Use Cases (1-2시간)

### 목표
댓글 조회, 삭제, 숨김 처리 Use Case 구현

### Test Strategy
- **Unit Tests**: Use Case 로직, 입력 검증
- **Mock**: Repository 인터페이스
- **Coverage Target**: 90%

### Tasks

#### RED Phase
- [ ] `src/application/usecases/comment/__tests__/GetCommentsUseCase.test.ts`
- [ ] `src/application/usecases/comment/__tests__/DeleteCommentUseCase.test.ts`
- [ ] `src/application/usecases/comment/__tests__/MinimizeCommentUseCase.test.ts`

#### GREEN Phase
- [ ] `src/application/usecases/comment/GetCommentsUseCase.ts`
  ```typescript
  export class GetCommentsUseCase {
    constructor(private readonly commentRepository: ICommentRepository) {}

    async execute(params?: GetCommentsParams): Promise<GetCommentsResult> {
      return this.commentRepository.findAll(params);
    }
  }
  ```
- [ ] `src/application/usecases/comment/DeleteCommentUseCase.ts`
- [ ] `src/application/usecases/comment/MinimizeCommentUseCase.ts`
- [ ] `src/application/usecases/comment/index.ts`

#### REFACTOR Phase
- [ ] 공통 로직 추출
- [ ] 에러 타입 정의

### Quality Gate
- [ ] `npm run test -- --testPathPattern="usecases/comment"` 통과
- [ ] `npm run lint` 에러 없음
- [ ] `npm run build` 성공

### Dependencies
- Phase 1, 2 완료

### Rollback Strategy
- usecases/comment 디렉토리 삭제

---

## Phase 4: Presentation Layer - Hooks & Provider 업데이트 (1-2시간)

### 목표
React Query 훅 생성 및 DependencyProvider 업데이트

### Test Strategy
- **Integration Tests**: Hook 동작 테스트
- **Mock**: Use Case
- **Coverage Target**: 80%

### Tasks

#### RED Phase
- [ ] `src/presentation/hooks/__tests__/useCommentQueries.test.ts`
  - useComments 훅 테스트
  - useDeleteComment 훅 테스트
  - useMinimizeComment 훅 테스트

#### GREEN Phase
- [ ] `src/presentation/hooks/useCommentQueries.ts`
  ```typescript
  export const commentKeys = {
    all: ['comments'] as const,
    lists: () => [...commentKeys.all, 'list'] as const,
    list: (params?: GetCommentsParams) => [...commentKeys.lists(), params] as const,
  };

  export function useComments(params?: GetCommentsParams) {
    const { getCommentsUseCase } = useDependencies();
    return useQuery({
      queryKey: commentKeys.list(params),
      queryFn: () => getCommentsUseCase.execute(params),
    });
  }

  export function useDeleteComment() {
    const { deleteCommentUseCase } = useDependencies();
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) => deleteCommentUseCase.execute(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      },
    });
  }

  export function useMinimizeComment() { ... }
  ```
- [ ] `src/presentation/hooks/index.ts` 업데이트
- [ ] `src/presentation/providers/DependencyProvider.tsx` 업데이트
  - GitHubCommentRepository 인스턴스 생성
  - Comment Use Cases 추가
  - Dependencies 인터페이스 확장

#### REFACTOR Phase
- [ ] 훅 최적화
- [ ] 캐시 전략 개선

### Quality Gate
- [ ] `npm run test -- --testPathPattern="useCommentQueries"` 통과
- [ ] `npm run lint` 에러 없음
- [ ] `npm run build` 성공

### Dependencies
- Phase 3 완료

### Rollback Strategy
- useCommentQueries.ts 삭제
- DependencyProvider 변경 사항 롤백

---

## Phase 5: Presentation Layer - UI 컴포넌트 (2-3시간)

### 목표
댓글 관리 페이지 UI 컴포넌트 구현

### Test Strategy
- **Component Tests**: 렌더링, 사용자 인터랙션
- **Coverage Target**: 70%

### Tasks

#### RED Phase
- [ ] `src/presentation/components/comment/__tests__/CommentList.test.tsx`
- [ ] `src/presentation/components/comment/__tests__/CommentCard.test.tsx`
- [ ] `src/presentation/components/comment/__tests__/CommentFilters.test.tsx`

#### GREEN Phase
- [ ] `src/presentation/components/comment/CommentCard.tsx`
  - 댓글 내용 표시
  - 작성자 아바타 및 이름
  - 작성 날짜
  - 연결된 포스트 링크
  - 삭제/숨김 버튼
  - 대댓글 펼치기/접기
- [ ] `src/presentation/components/comment/CommentFilters.tsx`
  - 게시글 선택 드롭다운
  - 날짜 범위 필터
  - 검색 입력
- [ ] `src/presentation/components/comment/CommentList.tsx`
  - 댓글 목록 렌더링
  - 페이지네이션 (Load More 방식)
  - 빈 상태 표시
  - 로딩 상태
- [ ] `src/presentation/components/comment/CommentDeleteModal.tsx`
  - 삭제 확인 모달
- [ ] `src/presentation/components/comment/index.ts`

#### REFACTOR Phase
- [ ] 컴포넌트 분리 최적화
- [ ] 접근성 개선 (ARIA)
- [ ] 반응형 디자인

### Quality Gate
- [ ] `npm run test -- --testPathPattern="components/comment"` 통과
- [ ] `npm run lint` 에러 없음
- [ ] `npm run build` 성공
- [ ] 수동 테스트: 모든 UI 상태 확인

### Dependencies
- Phase 4 완료

### Rollback Strategy
- components/comment 디렉토리 삭제

---

## Phase 6: 페이지 통합 & 네비게이션 (1-2시간)

### 목표
댓글 관리 페이지 생성 및 사이드바 네비게이션 추가

### Test Strategy
- **E2E Tests**: 페이지 네비게이션, 댓글 목록 로드
- **Manual Tests**: 전체 플로우 확인

### Tasks

#### GREEN Phase (E2E이므로 구현 우선)
- [ ] `src/app/(authenticated)/comments/page.tsx` 생성
  ```typescript
  export default function CommentsPage() {
    return (
      <div>
        <PageHeader
          title="댓글 관리"
          description="giscus를 통해 작성된 댓글을 관리합니다"
        />
        <CommentFilters />
        <CommentList />
      </div>
    );
  }
  ```
- [ ] `src/app/(authenticated)/comments/loading.tsx` 생성
- [ ] `src/presentation/components/layout/Sidebar.tsx` 업데이트
  - 댓글 관리 메뉴 항목 추가
  ```typescript
  {
    href: '/comments',
    label: '댓글',
    gradient: 'from-violet-500 to-purple-500',
    icon: <ChatBubbleIcon />,
  }
  ```

#### Test Phase
- [ ] E2E 테스트 작성 (Playwright)
  - 댓글 페이지 접근
  - 댓글 목록 로드
  - 필터링 동작
  - 삭제 플로우

### Quality Gate
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 수동 테스트: 페이지 접근 및 네비게이션
- [ ] 수동 테스트: 댓글 목록 로드 확인
- [ ] 수동 테스트: 삭제 기능 동작

### Dependencies
- Phase 5 완료

### Rollback Strategy
- comments 페이지 디렉토리 삭제
- Sidebar 변경 사항 롤백

---

## Phase 7: 다크모드 & 최종 마무리 (1시간)

### 목표
다크모드 지원, 에러 핸들링 개선, 최종 테스트

### Tasks

- [ ] 모든 컴포넌트 다크모드 스타일 적용
- [ ] 토스트 알림 추가 (삭제 성공/실패)
- [ ] 에러 바운더리 통합
- [ ] README 업데이트 (환경 변수 설명)
- [ ] 전체 E2E 테스트 실행
- [ ] 성능 최적화 검토

### Quality Gate
- [ ] `npm run test` 모든 테스트 통과
- [ ] `npm run test:e2e` E2E 테스트 통과
- [ ] `npm run build` 성공
- [ ] 다크모드/라이트모드 전환 테스트
- [ ] 모바일 반응형 테스트

### Dependencies
- Phase 6 완료

### Rollback Strategy
- 스타일 변경 사항 롤백

---

## 위험 평가

| 위험 | 확률 | 영향 | 완화 전략 |
|------|------|------|-----------|
| GitHub API Rate Limit | 중간 | 높음 | 캐싱 전략 적용, 요청 최소화 |
| GraphQL 쿼리 복잡성 | 중간 | 중간 | 단계별 쿼리 테스트, 문서 참조 |
| 토큰 권한 부족 | 낮음 | 높음 | 사전에 권한 확인, 명확한 설정 가이드 |
| 대량 댓글 처리 | 낮음 | 중간 | Cursor 기반 페이지네이션, 가상화 |

---

## 참고 자료

- [GitHub GraphQL API for Discussions](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions)
- [Getting GitHub Discussion Comments](https://www.jvt.me/posts/2025/01/08/github-discussion-comments/)
- [Giscus Configuration](https://giscus.app/)

---

## Notes & Learnings

_각 Phase 완료 후 학습 내용을 여기에 기록하세요._

### Phase 1
-

### Phase 2
-

### Phase 3
-

### Phase 4
-

### Phase 5
-

### Phase 6
-

### Phase 7
- Toast 알림을 alert() 대신 사용하여 UX 개선
- CSS 변수 기반 스타일링으로 다크모드 자동 지원
- 빌드 성공 확인 완료

---

## Progress Tracking

| Phase | 상태 | 시작일 | 완료일 | 담당자 |
|-------|------|--------|--------|--------|
| Phase 1 | ✅ 완료 | 2026-01-04 | 2026-01-04 | Claude |
| Phase 2 | ✅ 완료 | 2026-01-04 | 2026-01-04 | Claude |
| Phase 3 | ✅ 완료 | 2026-01-04 | 2026-01-04 | Claude |
| Phase 4 | ✅ 완료 | 2026-01-04 | 2026-01-04 | Claude |
| Phase 5 | ✅ 완료 | 2026-01-04 | 2026-01-04 | Claude |
| Phase 6 | ✅ 완료 | 2026-01-04 | 2026-01-04 | Claude |
| Phase 7 | ✅ 완료 | 2026-01-04 | 2026-01-04 | Claude |
