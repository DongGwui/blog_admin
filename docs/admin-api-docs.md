# Blog Admin API 명세서

**Base URL:** `https://blog-api.dltmxm.link/api`
**Version:** 1.0

---

## 인증 (Authentication)

모든 Admin API는 JWT Bearer 토큰 인증이 필요합니다 (로그인/로그아웃 제외).

```
Authorization: Bearer <token>
```

---

## 1. 인증 API

### POST `/admin/auth/login`
관리자 로그인 및 JWT 토큰 발급

**Request Body:**
```json
{
  "username": "string (필수)",
  "password": "string (필수)"
}
```

**Response (201):**
```json
{
  "data": {
    "token": "eyJhbGc...",
    "expires_at": "2025-01-01T00:00:00Z"
  }
}
```

**Errors:** 400 (잘못된 요청), 401 (인증 실패)

---

### POST `/admin/auth/logout`
관리자 로그아웃 (클라이언트에서 토큰 폐기)

**Response (200):**
```json
{
  "message": "logged out"
}
```

---

### GET `/admin/auth/me`
현재 인증된 관리자 정보 조회

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "username": "admin",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**Errors:** 401 (인증 필요)

---

## 2. 대시보드 API

### GET `/admin/dashboard/stats`
대시보드 통계 정보 조회

**Response (200):**
```json
{
  "data": {
    "posts": {
      "total": 10,
      "published": 8,
      "draft": 2
    },
    "categories": [
      {
        "id": 1,
        "name": "개발",
        "slug": "dev",
        "post_count": 5
      }
    ],
    "recent_posts": [
      {
        "id": 1,
        "title": "최근 글",
        "slug": "recent-post",
        "status": "published",
        "view_count": 100,
        "created_at": "2025-01-01T00:00:00Z",
        "published_at": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

## 3. 게시글 API

### GET `/admin/posts`
전체 게시글 목록 조회 (페이지네이션)

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| page | integer | 1 | 페이지 번호 |
| per_page | integer | 10 | 페이지당 항목 수 |
| status | string | - | 상태 필터 (draft, published) |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "글 제목",
      "slug": "post-slug",
      "excerpt": "발췌문",
      "category_id": 1,
      "category_name": "개발",
      "category_slug": "dev",
      "status": "published",
      "view_count": 100,
      "reading_time": 5,
      "thumbnail": "https://...",
      "tags": [
        { "id": 1, "name": "Go", "slug": "go" }
      ],
      "created_at": "2025-01-01T00:00:00Z",
      "published_at": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

---

### GET `/admin/posts/{id}`
게시글 상세 조회

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | integer | 게시글 ID |

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "title": "글 제목",
    "slug": "post-slug",
    "content": "글 내용 (마크다운)",
    "excerpt": "발췌문",
    "thumbnail": "https://...",
    "status": "published",
    "category_id": 1,
    "category_name": "개발",
    "category_slug": "dev",
    "tags": [
      { "id": 1, "name": "Go", "slug": "go" }
    ],
    "view_count": 100,
    "reading_time": 5,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z",
    "published_at": "2025-01-01T00:00:00Z"
  }
}
```

**Errors:** 404 (게시글 없음)

---

### POST `/admin/posts`
새 게시글 생성

**Request Body:**
```json
{
  "title": "string (필수, 최대 200자)",
  "content": "string (필수)",
  "slug": "string (선택, 미입력시 자동생성)",
  "excerpt": "string (선택, 최대 500자)",
  "thumbnail": "string (선택)",
  "status": "string (선택, draft/published)",
  "category_id": "integer (선택)",
  "tag_ids": [1, 2, 3]
}
```

**Response (201):**
```json
{
  "data": { ... }
}
```

**Errors:** 400 (유효성 검증 실패), 409 (slug 중복)

---

### PUT `/admin/posts/{id}`
게시글 수정

**Path Parameters:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| id | integer | 게시글 ID |

**Request Body:**
```json
{
  "title": "string (필수, 최대 200자)",
  "content": "string (필수)",
  "slug": "string (선택)",
  "excerpt": "string (선택, 최대 500자)",
  "thumbnail": "string (선택)",
  "category_id": "integer (선택)",
  "tag_ids": [1, 2, 3]
}
```

**Response (200):** 수정된 게시글 데이터

**Errors:** 400, 404, 409 (slug 중복)

---

### DELETE `/admin/posts/{id}`
게시글 삭제

**Response:** 204 No Content

**Errors:** 404 (게시글 없음)

---

### PATCH `/admin/posts/{id}/publish`
게시글 발행/발행취소

**Request Body:**
```json
{
  "publish": true
}
```

**Response (200):** 수정된 게시글 데이터

**Errors:** 404 (게시글 없음)

---

## 4. 카테고리 API

### GET `/admin/categories`
전체 카테고리 목록 조회

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "개발",
      "slug": "dev",
      "description": "개발 관련 글",
      "sort_order": 1,
      "post_count": 10,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST `/admin/categories`
새 카테고리 생성

**Request Body:**
```json
{
  "name": "string (필수, 최대 50자)",
  "slug": "string (선택)",
  "description": "string (선택)",
  "sort_order": "integer (선택)"
}
```

**Response (201):** 생성된 카테고리 데이터

**Errors:** 400, 409 (slug 중복)

---

### PUT `/admin/categories/{id}`
카테고리 수정

**Request Body:**
```json
{
  "name": "string (필수, 최대 50자)",
  "slug": "string (선택)",
  "description": "string (선택)",
  "sort_order": "integer (선택)"
}
```

**Response (200):** 수정된 카테고리 데이터

**Errors:** 400, 404, 409

---

### DELETE `/admin/categories/{id}`
카테고리 삭제 (게시글이 없어야 삭제 가능)

**Response:** 204 No Content

**Errors:** 400 (게시글 존재), 404

---

## 5. 태그 API

### GET `/admin/tags`
전체 태그 목록 조회

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Go",
      "slug": "go",
      "post_count": 5,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST `/admin/tags`
새 태그 생성

**Request Body:**
```json
{
  "name": "string (필수, 최대 50자)",
  "slug": "string (선택)"
}
```

**Response (201):** 생성된 태그 데이터

**Errors:** 400, 409

---

### PUT `/admin/tags/{id}`
태그 수정

**Request Body:**
```json
{
  "name": "string (필수, 최대 50자)",
  "slug": "string (선택)"
}
```

**Response (200):** 수정된 태그 데이터

**Errors:** 400, 404, 409

---

### DELETE `/admin/tags/{id}`
태그 삭제

**Response:** 204 No Content

**Errors:** 404

---

## 6. 프로젝트 API

### GET `/admin/projects`
전체 프로젝트 목록 조회

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "블로그 서비스",
      "slug": "blog-service",
      "description": "개인 블로그",
      "tech_stack": ["Go", "Next.js", "PostgreSQL"],
      "thumbnail": "https://...",
      "is_featured": true,
      "sort_order": 1
    }
  ]
}
```

---

### GET `/admin/projects/{id}`
프로젝트 상세 조회

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "title": "블로그 서비스",
    "slug": "blog-service",
    "description": "개인 블로그",
    "content": "프로젝트 상세 내용 (마크다운)",
    "thumbnail": "https://...",
    "images": ["url1", "url2"],
    "tech_stack": ["Go", "Next.js", "PostgreSQL"],
    "github_url": "https://github.com/...",
    "demo_url": "https://...",
    "is_featured": true,
    "sort_order": 1,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

**Errors:** 404

---

### POST `/admin/projects`
새 프로젝트 생성

**Request Body:**
```json
{
  "title": "string (필수, 1-200자)",
  "slug": "string (선택)",
  "description": "string (선택)",
  "content": "string (선택)",
  "thumbnail": "string (선택)",
  "images": ["string"],
  "tech_stack": ["string"],
  "github_url": "string (선택)",
  "demo_url": "string (선택)",
  "is_featured": "boolean (선택)",
  "sort_order": "integer (선택)"
}
```

**Response (201):** 생성된 프로젝트 데이터

**Errors:** 400, 409

---

### PUT `/admin/projects/{id}`
프로젝트 수정

**Request Body:** POST와 동일 (title 필수 아님)

**Response (200):** 수정된 프로젝트 데이터

**Errors:** 400, 404, 409

---

### DELETE `/admin/projects/{id}`
프로젝트 삭제

**Response:** 204 No Content

**Errors:** 404

---

### PATCH `/admin/projects/reorder`
프로젝트 순서 변경

**Request Body:**
```json
{
  "orders": [
    { "id": 1, "sort_order": 1 },
    { "id": 2, "sort_order": 2 },
    { "id": 3, "sort_order": 3 }
  ]
}
```

**Response (200):** 성공 메시지

**Errors:** 400

---

## 7. 미디어 API

### GET `/admin/media`
업로드된 미디어 파일 목록 조회 (페이지네이션)

**Query Parameters:**
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| page | integer | 1 | 페이지 번호 |
| per_page | integer | 20 | 페이지당 항목 수 |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "filename": "image.jpg",
      "original_name": "my-image.jpg",
      "path": "/uploads/2025/01/image.jpg",
      "url": "https://cdn.dltmxm.link/...",
      "mime_type": "image/jpeg",
      "size": 102400,
      "width": 1920,
      "height": 1080,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

### POST `/admin/media/upload`
미디어 파일 업로드

**Content-Type:** `multipart/form-data`

**Form Data:**
| 필드 | 타입 | 설명 |
|-----|------|------|
| file | file | 업로드할 이미지 파일 (필수) |

**지원 형식:** JPEG, PNG, GIF, WebP, SVG

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "filename": "image.jpg",
    "original_name": "my-image.jpg",
    "url": "https://cdn.dltmxm.link/..."
  }
}
```

**Errors:** 400 (잘못된 파일), 413 (파일 크기 초과)

---

### DELETE `/admin/media/{id}`
미디어 파일 삭제

**Response:** 204 No Content

**Errors:** 404

---

## 에러 응답 형식

모든 에러는 다음 형식으로 반환됩니다:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

**HTTP 상태 코드:**
| 코드 | 설명 |
|-----|------|
| 400 | Bad Request - 잘못된 요청 |
| 401 | Unauthorized - 인증 필요 |
| 403 | Forbidden - 권한 없음 |
| 404 | Not Found - 리소스 없음 |
| 409 | Conflict - 중복 데이터 |
| 413 | Payload Too Large - 파일 크기 초과 |
| 422 | Validation Error - 유효성 검증 실패 |
| 500 | Internal Error - 서버 에러 |
