# Application Layer

비즈니스 로직을 조합하고 유스케이스를 정의하는 레이어입니다. Domain 레이어의 Repository 인터페이스에 의존하며, 각 유스케이스는 단일 비즈니스 작업을 수행합니다.

## Structure

```
application/
└── usecases/
    ├── auth/
    │   ├── LoginUseCase.ts
    │   ├── LogoutUseCase.ts
    │   └── GetCurrentUserUseCase.ts
    ├── post/
    │   ├── CreatePostUseCase.ts
    │   ├── GetPostsUseCase.ts
    │   ├── GetPostByIdUseCase.ts
    │   ├── UpdatePostUseCase.ts
    │   ├── DeletePostUseCase.ts
    │   └── PublishPostUseCase.ts
    ├── category/
    │   ├── GetCategoriesUseCase.ts
    │   ├── CreateCategoryUseCase.ts
    │   ├── UpdateCategoryUseCase.ts
    │   └── DeleteCategoryUseCase.ts
    ├── tag/
    │   ├── GetTagsUseCase.ts
    │   ├── CreateTagUseCase.ts
    │   ├── UpdateTagUseCase.ts
    │   └── DeleteTagUseCase.ts
    ├── media/
    │   ├── GetMediaListUseCase.ts
    │   ├── UploadMediaUseCase.ts
    │   ├── DeleteMediaUseCase.ts
    │   └── InsertImageUseCase.ts
    └── project/
        ├── GetProjectsUseCase.ts
        ├── GetProjectByIdUseCase.ts
        ├── CreateProjectUseCase.ts
        ├── UpdateProjectUseCase.ts
        ├── DeleteProjectUseCase.ts
        └── ReorderProjectsUseCase.ts
```

## Use Case Pattern

모든 유스케이스는 동일한 패턴을 따릅니다:

```typescript
class ExampleUseCase {
  constructor(private repository: IExampleRepository) {}

  async execute(params: InputParams): Promise<OutputType> {
    // 1. 입력 검증
    if (!params.requiredField) {
      throw new Error('필수 필드가 없습니다.');
    }

    // 2. 비즈니스 로직 수행
    const result = await this.repository.someMethod(params);

    // 3. 결과 반환
    return result;
  }
}
```

## Auth Use Cases

### LoginUseCase
사용자 인증을 처리합니다.

```typescript
class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<AuthToken> {
    // 입력 검증
    if (!credentials.username || !credentials.password) {
      throw new Error('사용자명과 비밀번호를 입력해주세요.');
    }
    return this.authRepository.login(credentials);
  }
}
```

### LogoutUseCase
로그아웃을 처리합니다.

```typescript
class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
```

### GetCurrentUserUseCase
현재 인증된 사용자 정보를 조회합니다.

```typescript
class GetCurrentUserUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
```

## Post Use Cases

### CreatePostUseCase
새 포스트를 생성합니다.

```typescript
class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(data: CreatePostData): Promise<Post> {
    // 제목, 내용 검증
    if (!data.title?.trim()) {
      throw new Error('제목을 입력해주세요.');
    }
    if (!data.content?.trim()) {
      throw new Error('내용을 입력해주세요.');
    }
    return this.postRepository.create(data);
  }
}
```

### GetPostsUseCase
포스트 목록을 조회합니다 (페이지네이션 지원).

```typescript
class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(params?: GetPostsParams): Promise<GetPostsResult> {
    return this.postRepository.findAll(params);
  }
}
```

### UpdatePostUseCase
포스트를 수정합니다.

```typescript
class UpdatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number, data: UpdatePostData): Promise<Post> {
    if (!id) {
      throw new Error('포스트 ID가 필요합니다.');
    }
    return this.postRepository.update(id, data);
  }
}
```

### PublishPostUseCase
포스트 발행 상태를 변경합니다.

```typescript
class PublishPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(id: number, publish: boolean): Promise<Post> {
    const status = publish ? 'published' : 'draft';
    return this.postRepository.updateStatus(id, status);
  }
}
```

## Media Use Cases

### UploadMediaUseCase
미디어 파일을 업로드합니다.

```typescript
class UploadMediaUseCase {
  private readonly MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  constructor(private mediaRepository: IMediaRepository) {}

  async execute(file: File): Promise<Media> {
    // 파일 타입 검증
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('지원하지 않는 파일 형식입니다. (JPEG, PNG, GIF, WebP만 가능)');
    }

    // 파일 크기 검증
    if (file.size > this.MAX_SIZE) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }

    return this.mediaRepository.upload(file);
  }
}
```

### InsertImageUseCase
이미지를 마크다운 형식으로 삽입합니다.

```typescript
class InsertImageUseCase {
  async execute(imageUrl: string, altText?: string): Promise<string> {
    const alt = altText || 'image';
    return `![${alt}](${imageUrl})`;
  }
}
```

## Project Use Cases

### ReorderProjectsUseCase
프로젝트 순서를 변경합니다.

```typescript
class ReorderProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(orders: { id: number; order: number }[]): Promise<void> {
    // 검증: 중복 ID 체크
    const ids = orders.map(o => o.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error('중복된 프로젝트 ID가 있습니다.');
    }

    // 검증: 음수 순서 체크
    if (orders.some(o => o.order < 0)) {
      throw new Error('순서는 0 이상이어야 합니다.');
    }

    return this.projectRepository.reorder(orders);
  }
}
```

## Conventions

### Dependency Injection
- 생성자를 통해 Repository 인터페이스 주입
- 구체적인 구현체에 의존하지 않음

```typescript
// Good
constructor(private postRepository: IPostRepository) {}

// Bad
constructor(private postRepository: ApiPostRepository) {}
```

### Input Validation
- 모든 필수 입력값 검증
- 명확한 에러 메시지 제공
- 비즈니스 규칙에 따른 검증

```typescript
async execute(data: CreatePostData): Promise<Post> {
  if (!data.title?.trim()) {
    throw new Error('제목을 입력해주세요.');
  }
  // ...
}
```

### Single Responsibility
- 각 유스케이스는 하나의 작업만 수행
- 복잡한 작업은 여러 유스케이스로 분리

### Naming
- `{Action}{Entity}UseCase` 형식
- `execute()` 메서드로 실행
- 명확한 입출력 타입 정의

## Error Handling

```typescript
// 입력 검증 에러
throw new Error('제목을 입력해주세요.');

// 비즈니스 규칙 위반
throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');

// 권한 에러
throw new Error('이 작업을 수행할 권한이 없습니다.');
```

## Testing

유스케이스 테스트는 Repository를 모킹하여 수행합니다:

```typescript
describe('CreatePostUseCase', () => {
  const mockRepository: IPostRepository = {
    create: jest.fn(),
    // ...
  };

  const useCase = new CreatePostUseCase(mockRepository);

  it('should create post with valid data', async () => {
    const data = { title: 'Test', content: 'Content' };
    await useCase.execute(data);
    expect(mockRepository.create).toHaveBeenCalledWith(data);
  });

  it('should throw error when title is empty', async () => {
    await expect(useCase.execute({ title: '', content: 'Content' }))
      .rejects.toThrow('제목을 입력해주세요.');
  });
});
```

## Important Notes

- **No HTTP/UI Logic**: HTTP 요청이나 UI 상태 관리 로직 포함하지 않음
- **Repository Interface Only**: 구체적 구현체가 아닌 인터페이스에 의존
- **Stateless**: 상태를 유지하지 않음, 모든 상태는 파라미터로 전달
- **Testable**: Repository 모킹을 통한 단위 테스트 용이
