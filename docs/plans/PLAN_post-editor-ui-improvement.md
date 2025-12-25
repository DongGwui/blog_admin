# Implementation Plan: 글 작성/수정 페이지 UI 개선 (Velog 스타일)

**Status**: ✅ Complete (Phase 1-5)
**Started**: 2025-12-26
**Last Updated**: 2025-12-26
**Completed**: 2025-12-26

---

**⚠️ CRITICAL INSTRUCTIONS**: After completing each phase:
1. ✅ Check off completed task checkboxes
2. 🧪 Run all quality gate validation commands
3. ⚠️ Verify ALL quality gate items pass
4. 📅 Update "Last Updated" date above
5. 📝 Document learnings in Notes section
6. ➡️ Only then proceed to next phase

⛔ **DO NOT skip quality gates or proceed with failing checks**

---

## 📋 Overview

### 현재 문제점 분석

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Sidebar (256px) │            Main Content Area                          │
│                 │ ┌──────────────────────────────────────────────────┐  │
│                 │ │ Header                                           │  │
│                 │ ├──────────────────────────────────────────────────┤  │
│                 │ │ ┌────────────────────────────────┐               │  │
│                 │ │ │ max-w-4xl 컨테이너             │   (빈 공간)   │  │
│                 │ │ │ ┌────────────────────────────┐ │               │  │
│                 │ │ │ │ 제목                       │ │               │  │
│                 │ │ │ │ 슬러그                     │ │               │  │
│                 │ │ │ │ 에디터 (500px 고정)        │ │               │  │
│                 │ │ │ │ 요약                       │ │               │  │
│                 │ │ │ │ 썸네일                     │ │               │  │
│                 │ │ │ │ 카테고리                   │ │               │  │
│                 │ │ │ │ 태그                       │ │               │  │
│                 │ │ │ │ 버튼                       │ │               │  │
│                 │ │ └────────────────────────────┘ │               │  │
└─────────────────┴─┴──────────────────────────────────┴───────────────┘

문제점:
1. 에디터 영역이 max-w-4xl로 제한되어 넓은 화면에서 공간 낭비
2. 모든 필드가 세로로 나열되어 스크롤 필요
3. 미리보기 모드 시 에디터 영역이 절반으로 줄어 협소
4. 메타 정보(썸네일, 카테고리, 태그)가 본문 작성 흐름을 방해
```

### 개선 목표 (Velog 스타일)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ 글쓰기 모드 (전체 화면, 사이드바 숨김)                                      │
│ ┌────────────────────────────────────────────────────────────────┬──────┐ │
│ │ ← 나가기        새 글 작성                    임시저장  발행   │ ⚙️   │ │
│ ├────────────────────────────────────────────────────────────────┴──────┤ │
│ │                                                                       │ │
│ │   제목을 입력하세요                                                    │ │
│ │   ─────────────────────────────────────────────────────────────       │ │
│ │   [툴바: B I S | H 🔗 " | • 1. ☑ | 🖼️ ]                              │ │
│ │   ┌───────────────────────────────────┬───────────────────────────┐   │ │
│ │   │ 에디터 (마크다운)                  │ 미리보기                   │   │ │
│ │   │                                   │                           │   │ │
│ │   │ 화면 높이에 맞춰 자동 조절         │ 실시간 렌더링              │   │ │
│ │   │                                   │                           │   │ │
│ │   │                                   │                           │   │ │
│ │   └───────────────────────────────────┴───────────────────────────┘   │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│ ⚙️ 설정 패널 (슬라이드 오버)                                               │
│ ┌─────────────────────────┐                                               │
│ │ 썸네일                  │                                               │
│ │ [이미지 선택]           │                                               │
│ │                         │                                               │
│ │ 카테고리                │                                               │
│ │ [선택...]               │                                               │
│ │                         │                                               │
│ │ 태그                    │                                               │
│ │ [태그1] [태그2] [+]     │                                               │
│ │                         │                                               │
│ │ URL 슬러그              │                                               │
│ │ [자동생성됨]            │                                               │
│ │                         │                                               │
│ │ 요약                    │                                               │
│ │ [...]                   │                                               │
│ └─────────────────────────┘                                               │
└───────────────────────────────────────────────────────────────────────────┘
```

### Success Criteria
- [ ] 글쓰기 모드에서 사이드바 숨김 처리
- [ ] 에디터가 화면 높이에 맞춰 자동 조절
- [ ] 제목 입력이 에디터와 통합된 형태
- [ ] 메타 정보(썸네일, 카테고리, 태그 등)가 설정 패널로 분리
- [ ] 반응형: 넓은 화면에서 편집/미리보기 나란히 표시
- [ ] 반응형: 좁은 화면에서 탭 전환 방식
- [ ] 저장/발행 버튼이 상단 헤더에 위치

### User Impact
- 글 작성에 집중할 수 있는 환경 제공
- 넓은 화면에서 공간 효율적 활용
- Velog와 유사한 친숙한 UX

---

## 🏗️ Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| 전용 글쓰기 레이아웃 생성 | 글쓰기 모드에서 사이드바 숨김 | 레이아웃 코드 분리 필요 |
| PostEditorPage 컴포넌트 분리 | 기존 PostForm 리팩토링 대신 새 컴포넌트 | 기존 코드와 공존 가능 |
| SettingsPanel 슬라이드 오버 | 메타 정보를 별도 패널로 분리 | 모바일에서도 동일한 UX |
| CSS calc()로 동적 높이 | vh 기반 에디터 높이 계산 | 헤더 높이 변경 시 수정 필요 |
| Zustand로 에디터 상태 관리 | 복잡한 상태를 전역으로 관리 | 의존성 추가 (이미 사용 중이면 OK) |

---

## 📦 Dependencies

### Required Before Starting
- [x] PostForm 컴포넌트 존재
- [x] MarkdownEditor 컴포넌트 존재
- [x] ThumbnailPicker 컴포넌트 존재
- [x] ImageInsertModal 컴포넌트 존재

### External Dependencies
- @uiw/react-md-editor: 기존 사용 중
- Tailwind CSS: 기존 사용 중
- React Query: 기존 사용 중

---

## 🧪 Test Strategy

### Test Pyramid for This Feature
| Test Type | Coverage Target | Purpose |
|-----------|-----------------|---------|
| **Unit Tests** | ≥80% | 상태 관리 훅, 유틸리티 함수 |
| **Integration Tests** | Critical paths | 컴포넌트 간 상호작용 |
| **E2E Tests** | Key user flows | 글 작성 전체 플로우 |

### Test File Organization
```
tests/
├── unit/
│   └── presentation/
│       ├── hooks/
│       │   └── usePostEditor.test.ts
│       └── components/
│           └── editor/
│               └── PostEditorHeader.test.tsx
└── e2e/
    └── post-editor.spec.ts
```

---

## 🚀 Implementation Phases

### Phase 1: 글쓰기 전용 레이아웃
**Goal**: 사이드바 없는 전체 화면 글쓰기 레이아웃 구현
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 1.1**: usePostEditorLayout 훅 테스트 작성
  - File(s): `tests/unit/presentation/hooks/usePostEditorLayout.test.ts`
  - Details: 레이아웃 상태 토글, 설정 패널 열기/닫기

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 1.2**: 글쓰기 전용 레이아웃 컴포넌트 생성
  - File(s): `src/presentation/components/layout/PostEditorLayout.tsx`
  - Details:
    - 전체 화면 레이아웃 (사이드바 없음)
    - 상단 헤더 (뒤로가기, 제목, 저장 버튼)
    - 설정 패널 슬롯

- [ ] **Task 1.3**: 글쓰기 페이지 레이아웃 적용
  - File(s): `src/app/(authenticated)/posts/new/layout.tsx`
  - File(s): `src/app/(authenticated)/posts/[id]/edit/layout.tsx`
  - Details: 글쓰기 전용 레이아웃 적용

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 1.4**: 레이아웃 코드 정리
  - Checklist:
    - [ ] 중복 코드 제거
    - [ ] 컴포넌트 분리

#### Quality Gate ✋
```bash
npm run test -- tests/unit/presentation/hooks/usePostEditorLayout.test.ts
npm run type-check
npm run build
```

---

### Phase 2: PostEditorHeader 컴포넌트
**Goal**: 상단 헤더 (뒤로가기, 제목 표시, 저장/발행 버튼)
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 2.1**: PostEditorHeader 컴포넌트 테스트 작성
  - File(s): `tests/unit/presentation/components/editor/PostEditorHeader.test.tsx`
  - Details: 뒤로가기 동작, 저장/발행 버튼 동작

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 2.2**: PostEditorHeader 컴포넌트 구현
  - File(s): `src/presentation/components/editor/PostEditorHeader.tsx`
  - Details:
    - 뒤로가기 버튼 (저장 여부 확인)
    - 현재 상태 표시 (임시저장됨, 수정됨 등)
    - 임시저장 버튼
    - 발행/수정 버튼
    - 설정 토글 버튼

- [ ] **Task 2.3**: 저장 상태 관리 훅 구현
  - File(s): `src/presentation/hooks/usePostEditorState.ts`
  - Details:
    - isDirty (수정 여부)
    - lastSaved (마지막 저장 시간)
    - autoSave 기능 (선택적)

#### Quality Gate ✋
```bash
npm run test -- tests/unit/presentation/components/editor/PostEditorHeader.test.tsx
npm run type-check
npm run build
```

---

### Phase 3: 통합 에디터 컴포넌트 (제목 + 본문)
**Goal**: 제목과 본문이 통합된 에디터 컴포넌트
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 3.1**: PostContentEditor 컴포넌트 테스트 작성
  - File(s): `tests/unit/presentation/components/editor/PostContentEditor.test.tsx`
  - Details: 제목 입력, 본문 입력, 높이 자동 조절

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 3.2**: PostContentEditor 컴포넌트 구현
  - File(s): `src/presentation/components/editor/PostContentEditor.tsx`
  - Details:
    - 제목 입력 (큰 폰트, 테두리 없음)
    - 구분선
    - 마크다운 에디터 (동적 높이)
    - 미리보기 모드 지원

- [ ] **Task 3.3**: 동적 높이 계산 훅
  - File(s): `src/presentation/hooks/useEditorHeight.ts`
  - Details:
    - 윈도우 높이 기반 계산
    - 헤더 높이 제외
    - resize 이벤트 대응

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 3.4**: MarkdownEditor height prop 개선
  - Details: 동적 높이 지원

#### Quality Gate ✋
```bash
npm run test -- tests/unit/presentation/components/editor/PostContentEditor.test.tsx
npm run type-check
npm run build
```

---

### Phase 4: 설정 패널 (Settings Panel)
**Goal**: 메타 정보 입력을 위한 슬라이드 패널
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 4.1**: PostSettingsPanel 컴포넌트 테스트 작성
  - File(s): `tests/unit/presentation/components/editor/PostSettingsPanel.test.tsx`
  - Details: 패널 열기/닫기, 각 설정 필드 렌더링

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 4.2**: PostSettingsPanel 컴포넌트 구현
  - File(s): `src/presentation/components/editor/PostSettingsPanel.tsx`
  - Details:
    - 슬라이드 오버 애니메이션
    - 썸네일 (ThumbnailPicker 재사용)
    - 카테고리 선택
    - 태그 선택/추가
    - URL 슬러그
    - 요약 텍스트

- [ ] **Task 4.3**: 설정 패널 상태 관리
  - File(s): `src/presentation/hooks/useSettingsPanel.ts`
  - Details: isOpen 상태, 애니메이션 제어

#### Quality Gate ✋
```bash
npm run test -- tests/unit/presentation/components/editor/PostSettingsPanel.test.tsx
npm run type-check
npm run build
```

---

### Phase 5: PostEditorPage 통합
**Goal**: 모든 컴포넌트를 통합한 새 글쓰기 페이지
**Status**: ⏳ Pending

#### Tasks

**🟢 GREEN: Implement**
- [ ] **Task 5.1**: PostEditorPage 컴포넌트 구현
  - File(s): `src/presentation/components/editor/PostEditorPage.tsx`
  - Details:
    - PostEditorHeader
    - PostContentEditor
    - PostSettingsPanel
    - 상태 통합 관리

- [ ] **Task 5.2**: 새 글 작성 페이지 업데이트
  - File(s): `src/app/(authenticated)/posts/new/page.tsx`
  - Details: PostEditorPage 사용

- [ ] **Task 5.3**: 글 수정 페이지 업데이트
  - File(s): `src/app/(authenticated)/posts/[id]/edit/page.tsx`
  - Details: PostEditorPage 사용 (기존 데이터 로드)

#### Quality Gate ✋
```bash
npm run test
npm run type-check
npm run build
```

---

### Phase 6: 반응형 디자인 및 최적화
**Goal**: 다양한 화면 크기 대응 및 UX 최적화
**Status**: ⏳ Pending

#### Tasks

**🟢 GREEN: Implement**
- [ ] **Task 6.1**: 반응형 브레이크포인트 적용
  - Details:
    - `>=1280px`: 에디터/미리보기 나란히
    - `>=768px`: 에디터/미리보기 탭 전환
    - `<768px`: 모바일 최적화

- [ ] **Task 6.2**: 미리보기 모드 토글 구현
  - Details:
    - 편집만 / 미리보기만 / 나란히
    - 단축키 지원 (Ctrl+Shift+P)

- [ ] **Task 6.3**: 자동 저장 기능 (선택적)
  - Details:
    - 30초마다 자동 임시저장
    - localStorage 백업

- [ ] **Task 6.4**: 키보드 단축키
  - Details:
    - Ctrl+S: 임시저장
    - Ctrl+Enter: 발행
    - Esc: 설정 패널 닫기

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 6.5**: 성능 최적화
  - Details:
    - 불필요한 리렌더링 방지
    - 디바운스 적용

#### Quality Gate ✋
```bash
npm run test
npm run type-check
npm run build
# 수동 테스트: 다양한 화면 크기에서 확인
```

---

### Phase 7: E2E 테스트 및 최종 검증
**Goal**: 전체 플로우 E2E 테스트 및 기존 기능 회귀 테스트
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Tests**
- [ ] **Test 7.1**: E2E 테스트 작성
  - File(s): `e2e/post-editor.spec.ts`
  - Details:
    - 새 글 작성 플로우
    - 기존 글 수정 플로우
    - 설정 패널 동작
    - 반응형 동작

**🟢 GREEN: Fix Issues**
- [ ] **Task 7.2**: E2E 테스트 통과를 위한 버그 수정

**🔵 REFACTOR: Clean Up**
- [ ] **Task 7.3**: 기존 PostForm 정리 (deprecated 또는 제거)
- [ ] **Task 7.4**: 문서 업데이트

#### Quality Gate ✋
```bash
npm run test
npm run type-check
npm run build
npx playwright test e2e/post-editor.spec.ts
```

---

## ⚠️ Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| 기존 PostForm과 충돌 | Low | Low | 새 컴포넌트로 분리, 점진적 마이그레이션 |
| MDEditor 커스터마이징 제한 | Medium | Medium | 필요시 다른 에디터 라이브러리 검토 |
| 반응형 복잡도 | Medium | Medium | 브레이크포인트 단순화, 단계적 구현 |
| 자동 저장 데이터 손실 | Low | High | localStorage 백업, 복구 기능 |

---

## 🔄 Rollback Strategy

### If Any Phase Fails
- 기존 PostForm은 그대로 유지
- 새 컴포넌트는 별도 경로에서 테스트 가능
- 문제 발생 시 기존 페이지로 즉시 복귀 가능

---

## 📊 Progress Tracking

### Completion Status
- **Phase 1**: ✅ 100% - 글쓰기 전용 레이아웃
- **Phase 2**: ✅ 100% - PostEditorHeader
- **Phase 3**: ✅ 100% - 통합 에디터 (제목 + 본문)
- **Phase 4**: ✅ 100% - 설정 패널
- **Phase 5**: ✅ 100% - PostEditorPage 통합
- **Phase 6**: ⏳ 0% - 반응형 및 최적화 (추후 진행)
- **Phase 7**: ⏳ 0% - E2E 테스트 (추후 진행)

**Overall Progress**: 71% complete (Phase 1-5 done)

---

## 📝 Notes & Learnings

### Implementation Notes
- (구현 중 발견한 인사이트 기록)

### Blockers Encountered
- (블로커 및 해결 방법 기록)

---

## 📚 References

### Documentation
- [Velog](https://velog.io/) - UI 참고
- [@uiw/react-md-editor](https://uiwjs.github.io/react-md-editor/)

### Related Files
- `src/presentation/components/post/PostForm.tsx` - 기존 폼 컴포넌트
- `src/presentation/components/editor/MarkdownEditor.tsx` - 마크다운 에디터
- `src/app/(authenticated)/layout.tsx` - 기존 레이아웃

---

## ✅ Final Checklist

**Before marking plan as COMPLETE**:
- [ ] All phases completed with quality gates passed
- [ ] 기존 PostForm 기능 모두 동작
- [ ] 반응형 테스트 완료 (Desktop, Tablet, Mobile)
- [ ] 브라우저 호환성 확인
- [ ] 접근성(a11y) 확인
- [ ] 성능 테스트 완료

---

**Plan Status**: ✅ Phase 1-5 Complete
**Next Action**: Phase 6 (반응형) 및 Phase 7 (E2E) 진행 가능
**Blocked By**: None

### Implementation Summary (2025-12-26)
- Created `(post-editor)` route group with dedicated layout
- Implemented `usePostEditorLayout` hook for state management
- Created `PostEditorHeader` component with save/publish actions
- Created `PostContentEditor` component (title + markdown editor)
- Created `PostSettingsPanel` slide-over for metadata
- Integrated all components into `PostEditorPage`
- Total new tests: 50 (246 total passing)
- Build and type check passing
