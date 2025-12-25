# Presentation Layer

UI를 담당하는 레이어입니다. React 컴포넌트, 커스텀 훅, Context, Provider를 포함합니다.

## Structure

```
presentation/
├── components/
│   ├── common/           # 공통 UI 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── editor/           # 에디터 컴포넌트
│   ├── post/             # 포스트 관련
│   ├── category/         # 카테고리 관련
│   ├── tag/              # 태그 관련
│   ├── media/            # 미디어 관련
│   ├── project/          # 프로젝트 관련
│   └── dashboard/        # 대시보드 관련
├── hooks/
│   ├── queries/          # React Query 훅
│   └── *.ts              # 기타 커스텀 훅
├── context/
│   └── AuthContext.tsx   # 인증 Context
└── providers/
    └── DependencyProvider.tsx  # 의존성 주입 Provider
```

## Providers

### DependencyProvider

모든 의존성을 주입하는 Provider입니다. Application 레이어의 Use Case들을 생성하고 제공합니다.

```typescript
interface Dependencies {
  tokenStorage: TokenStorage;

  // Auth Use Cases
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;
  getCurrentUserUseCase: GetCurrentUserUseCase;

  // Post Use Cases
  createPostUseCase: CreatePostUseCase;
  getPostsUseCase: GetPostsUseCase;
  getPostByIdUseCase: GetPostByIdUseCase;
  updatePostUseCase: UpdatePostUseCase;
  deletePostUseCase: DeletePostUseCase;
  publishPostUseCase: PublishPostUseCase;

  // Category, Tag, Media, Project Use Cases...
}

// 사용법
const { getPostsUseCase, createPostUseCase } = useDependencies();
```

**초기화 순서:**
1. ApiClient 생성 (baseURL, tokenStorage)
2. Repository 구현체 생성 (apiClient 주입)
3. Use Case 생성 (repository 주입)
4. Dependencies 객체로 제공

## Context

### AuthContext

인증 상태를 관리하는 Context입니다.

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// 사용법
const { user, isAuthenticated, login, logout } = useAuth();
```

**기능:**
- 앱 시작 시 토큰 확인 및 사용자 정보 로드
- 로그인/로그아웃 처리
- 인증 상태 전역 관리

## Hooks

### Query Hooks

TanStack React Query v5 기반의 데이터 fetching 훅입니다.

```typescript
// Query Key Factory
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (params?: GetPostsParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

// Query Hooks
export function usePosts(params?: GetPostsParams) {
  const { getPostsUseCase } = useDependencies();
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => getPostsUseCase.execute(params),
    staleTime: 5 * 60 * 1000, // 5분
  });
}

export function usePost(id: number) {
  const { getPostByIdUseCase } = useDependencies();
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPostByIdUseCase.execute(id),
    enabled: !!id,
  });
}

// Mutation Hooks
export function useCreatePost() {
  const { createPostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPostUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useUpdatePost() {
  const { updatePostUseCase } = useDependencies();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostData }) =>
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
```

**Query Hook 파일:**
- `usePostQueries.ts` - Post CRUD
- `useCategoryQueries.ts` - Category CRUD
- `useTagQueries.ts` - Tag CRUD
- `useMediaQueries.ts` - Media CRUD + Upload
- `useProjectQueries.ts` - Project CRUD + Reorder

### Custom Hooks

#### useEditorHeight
에디터 높이를 동적으로 계산합니다.

```typescript
interface UseEditorHeightOptions {
  headerHeight?: number;
  titleAreaHeight?: number;
  padding?: number;
}

function useEditorHeight(options?: UseEditorHeightOptions) {
  const [editorHeight, setEditorHeight] = useState(500);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    // 컨테이너 높이 기반 계산
  }, []);

  return { editorHeight, containerRef };
}
```

#### usePostEditorLayout
에디터 레이아웃 상태를 관리합니다.

```typescript
function usePostEditorLayout() {
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

  return {
    isSettingsPanelOpen,
    toggleSettingsPanel: () => setIsSettingsPanelOpen(!isSettingsPanelOpen),
    closeSettingsPanel: () => setIsSettingsPanelOpen(false),
  };
}
```

## Components

### Common Components

| Component | Props | Description |
|-----------|-------|-------------|
| **Button** | `variant`, `size`, `isLoading`, ... | 기본 버튼 |
| **Input** | `label`, `error`, `helperText`, ... | 폼 입력 필드 |
| **Skeleton** | `width`, `height` | 로딩 플레이스홀더 |
| **LoadingSpinner** | `size` | 로딩 스피너 |
| **LoadingOverlay** | `message` | 전체 화면 로딩 |
| **ErrorMessage** | `message`, `onRetry` | 에러 메시지 |
| **ErrorBoundary** | `children` | 에러 바운더리 |
| **Toast** | `message`, `type` | 토스트 알림 |

#### Button Variants
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

<Button variant="primary" size="md" isLoading={false}>
  저장
</Button>
```

#### Toast Usage
```typescript
const { showToast } = useToast();

showToast('저장되었습니다.', 'success');
showToast('오류가 발생했습니다.', 'error');
showToast('처리 중입니다.', 'info');
```

### Layout Components

| Component | Description |
|-----------|-------------|
| **AppLayout** | 메인 앱 레이아웃 (Sidebar + Header + Content) |
| **AuthGuard** | 인증 보호 래퍼 (미인증 시 /login 리다이렉트) |
| **Sidebar** | 좌측 네비게이션 |
| **Header** | 상단 헤더 (사용자 정보, 로그아웃) |
| **PostEditorLayout** | 에디터 전용 레이아웃 |

### Editor Components

| Component | Description |
|-----------|-------------|
| **MarkdownEditor** | @uiw/react-md-editor 래퍼 |
| **PostContentEditor** | 제목 + 에디터 조합 |
| **PostEditorHeader** | 에디터 헤더 (저장, 발행 버튼) |
| **PostEditorPage** | 에디터 전체 페이지 |
| **PostSettingsPanel** | 설정 패널 (썸네일, 카테고리, 태그) |

#### MarkdownEditor Features
- 드래그 앤 드롭 이미지 업로드
- 클립보드 이미지 붙여넣기
- 커스텀 이미지 삽입 툴바 버튼
- 실시간 미리보기
- Dynamic import (SSR 안전)

```typescript
<MarkdownEditor
  value={content}
  onChange={setContent}
  onImageUpload={handleImageUpload}
  height={500}
  placeholder="내용을 입력하세요..."
/>
```

### Domain Components

#### Post Components
- **PostForm**: 포스트 생성/수정 폼
- **PostList**: 포스트 목록 테이블
- **PostStatusBadge**: 상태 뱃지 (draft/published)
- **ThumbnailPicker**: 썸네일 선택기

#### Media Components
- **MediaUploader**: 파일 업로드 (드래그 앤 드롭)
- **MediaGrid**: 미디어 그리드 뷰
- **MediaList**: 미디어 리스트 뷰
- **MediaPicker**: 미디어 선택 모달
- **ImageInsertModal**: 이미지 삽입 모달

#### Dashboard Components
- **StatsCard**: KPI 카드
- **RecentPosts**: 최근 포스트 위젯
- **QuickActions**: 빠른 액션 버튼

## Component Patterns

### Form Component Pattern
```typescript
interface FormProps {
  initialData?: Entity;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

function ExampleForm({ initialData, onSubmit, onCancel }: FormProps) {
  const [formData, setFormData] = useState<FormData>(
    initialData ? mapToFormData(initialData) : defaultFormData
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim()) newErrors.title = '제목을 입력해주세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### List Component Pattern
```typescript
function ExampleList() {
  const { data, isLoading, error } = useExamples();
  const deleteMutation = useDeleteExample();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.length) return <EmptyState />;

  return (
    <div>
      {data.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          onDelete={() => deleteMutation.mutate(item.id)}
        />
      ))}
    </div>
  );
}
```

### Modal Component Pattern
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Data) => void;
}

function ExampleModal({ isOpen, onClose, onConfirm }: ModalProps) {
  const [data, setData] = useState<Data>(initialData);

  // Escape 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg p-6">
        {/* modal content */}
      </div>
    </div>
  );
}
```

## Keyboard Shortcuts

에디터 페이지에서 지원하는 단축키:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | 임시저장 |
| `Ctrl/Cmd + Enter` | 발행 |
| `Escape` | 설정 패널 닫기 |

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveDraft();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handlePublish();
    }
    if (e.key === 'Escape') {
      closeSettingsPanel();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handleSaveDraft, handlePublish, closeSettingsPanel]);
```

## Styling

Tailwind CSS v4를 사용합니다.

### Common Classes
```css
/* 버튼 */
.btn-primary: "bg-blue-600 text-white hover:bg-blue-700"
.btn-secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200"
.btn-danger: "bg-red-600 text-white hover:bg-red-700"

/* 카드 */
.card: "bg-white rounded-lg shadow-sm border border-gray-200 p-4"

/* 입력 필드 */
.input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
```

### Responsive Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## Important Notes

- **Client Components**: `'use client'` 지시문 필수 (훅, 이벤트 핸들러 사용 시)
- **Dynamic Import**: SSR 이슈가 있는 컴포넌트는 `dynamic()` 사용
- **Error Boundaries**: 컴포넌트 트리 최상위에 ErrorBoundary 배치
- **Toast Notifications**: 사용자 피드백은 Toast로 통일
- **Loading States**: 모든 비동기 작업에 로딩 상태 표시
- **Accessibility**: ARIA 속성, 키보드 네비게이션 지원
