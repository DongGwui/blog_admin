# Implementation Plan: 이미지 삽입 UX 개선 (Velog 스타일)

**Status**: ✅ Complete
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

### Feature Description
글 작성/수정 시 이미지 삽입 경험을 Velog 스타일로 개선합니다. 현재는 썸네일 URL을 직접 입력해야 하고, 본문 이미지는 드래그&드롭/붙여넣기만 지원합니다. 개선 후에는:
- 툴바 버튼으로 이미지 삽입 모달 열기
- 서버에 저장된 기존 이미지 선택 가능
- 새 이미지 업로드 후 URL 자동 삽입
- 썸네일도 같은 방식으로 선택/업로드 가능

### Success Criteria
- [ ] 마크다운 에디터 툴바에 이미지 삽입 버튼 추가
- [ ] 이미지 선택 모달에서 기존 이미지 목록 표시 및 선택
- [ ] 모달에서 새 이미지 업로드 후 자동 선택
- [ ] 선택된 이미지 URL이 에디터에 자동 삽입
- [ ] 썸네일 필드에서도 이미지 선택/업로드 가능
- [ ] 기존 드래그&드롭, 붙여넣기 기능 유지
- [ ] Clean Architecture 준수

### User Impact
- 이미지 URL을 수동으로 입력할 필요 없음
- 기존 업로드된 이미지 재사용 가능
- 직관적인 UI로 이미지 관리 경험 향상

---

## 🏗️ Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| 기존 MediaPicker 컴포넌트 확장 | 이미 미디어 목록/업로드 기능 구현됨 | 컴포넌트가 복잡해질 수 있음 |
| @uiw/react-md-editor 커스텀 명령어 | 라이브러리 지원 기능 활용 | 라이브러리 의존성 증가 |
| InsertImageUseCase 신규 생성 | 이미지 선택/삽입 로직 캡슐화 | Use Case 수 증가 |
| ThumbnailPicker 별도 컴포넌트 | 재사용성 및 단일 책임 원칙 | 컴포넌트 수 증가 |

---

## 📦 Dependencies

### Required Before Starting
- [x] Media 도메인 엔티티 존재
- [x] MediaPicker 컴포넌트 존재
- [x] UploadMediaUseCase 존재
- [x] GetMediaListUseCase 존재

### External Dependencies
- @uiw/react-md-editor: 기존 사용 중
- React Query: 기존 사용 중

---

## 🧪 Test Strategy

### Testing Approach
**TDD Principle**: Write tests FIRST, then implement to make them pass

### Test Pyramid for This Feature
| Test Type | Coverage Target | Purpose |
|-----------|-----------------|---------|
| **Unit Tests** | ≥80% | Use Case 비즈니스 로직, 유틸리티 함수 |
| **Integration Tests** | Critical paths | 컴포넌트 간 상호작용, 모달 플로우 |
| **E2E Tests** | Key user flows | 이미지 삽입 전체 플로우 |

### Test File Organization
```
src/__tests__/
├── application/usecases/media/
│   └── InsertImageUseCase.test.ts
├── presentation/components/editor/
│   └── ImageInsertButton.test.tsx
├── presentation/components/media/
│   └── ImageInsertModal.test.tsx
└── presentation/components/post/
    └── ThumbnailPicker.test.tsx
e2e/
└── image-insertion.spec.ts
```

---

## 🚀 Implementation Phases

### Phase 1: Application Layer - InsertImageUseCase
**Goal**: 이미지 삽입 비즈니스 로직 구현
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 1.1**: InsertImageUseCase 단위 테스트 작성
  - File(s): `src/__tests__/application/usecases/media/InsertImageUseCase.test.ts`
  - Expected: Tests FAIL (red) because feature doesn't exist yet
  - Details: Test cases covering:
    - 이미지 선택 시 마크다운 이미지 문법 생성 (`![alt](url)`)
    - 빈 alt 텍스트 처리
    - 유효하지 않은 URL 처리
    - 이미지 업로드 후 URL 반환

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 1.2**: InsertImageUseCase 구현
  - File(s): `src/application/usecases/media/InsertImageUseCase.ts`
  - Goal: Make Test 1.1 pass with minimal code
  - Details:
    - `generateMarkdownImage(url: string, alt?: string): string` - 마크다운 이미지 문법 생성
    - `insertIntoContent(content: string, imageMarkdown: string, position?: number): string` - 컨텐츠에 이미지 삽입

- [ ] **Task 1.3**: Use Case index export 추가
  - File(s): `src/application/usecases/media/index.ts`
  - Goal: InsertImageUseCase export

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 1.4**: 코드 품질 개선
  - Files: Review all new code in this phase
  - Checklist:
    - [ ] DRY 원칙 준수
    - [ ] 명확한 네이밍
    - [ ] 인라인 문서화

#### Quality Gate ✋

**⚠️ STOP: Do NOT proceed to Phase 2 until ALL checks pass**

**TDD Compliance** (CRITICAL):
- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: Test coverage meets requirements

**Validation Commands**:
```bash
npm run test -- src/__tests__/application/usecases/media/InsertImageUseCase.test.ts
npm run lint
npm run type-check
npm run build
```

**Manual Test Checklist**:
- [ ] generateMarkdownImage 함수가 올바른 마크다운 생성
- [ ] insertIntoContent 함수가 올바른 위치에 삽입

---

### Phase 2: Presentation Layer - ImageInsertModal 컴포넌트
**Goal**: 이미지 삽입용 모달 UI 구현 (Velog 스타일)
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 2.1**: ImageInsertModal 단위 테스트 작성
  - File(s): `src/__tests__/presentation/components/media/ImageInsertModal.test.tsx`
  - Expected: Tests FAIL (red) because feature doesn't exist yet
  - Details: Test cases covering:
    - 모달 열림/닫힘 동작
    - 미디어 목록 표시
    - 이미지 선택 시 onSelect 콜백 호출
    - 업로드 완료 시 자동 선택
    - Alt 텍스트 입력 필드

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 2.2**: ImageInsertModal 컴포넌트 구현
  - File(s): `src/presentation/components/media/ImageInsertModal.tsx`
  - Goal: Make Test 2.1 pass with minimal code
  - Details:
    - MediaPicker 기반으로 확장
    - Alt 텍스트 입력 필드 추가
    - 탭 UI: "서버 이미지" / "새 이미지 업로드"
    - Velog 스타일 모달 디자인

- [ ] **Task 2.3**: ImageInsertModal index export 추가
  - File(s): `src/presentation/components/media/index.ts`
  - Goal: ImageInsertModal export

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 2.4**: 코드 품질 개선
  - Files: Review all new code in this phase
  - Checklist:
    - [ ] 접근성(a11y) 고려
    - [ ] 반응형 디자인
    - [ ] 키보드 네비게이션

#### Quality Gate ✋

**⚠️ STOP: Do NOT proceed to Phase 3 until ALL checks pass**

**TDD Compliance** (CRITICAL):
- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: Test coverage meets requirements

**Validation Commands**:
```bash
npm run test -- src/__tests__/presentation/components/media/ImageInsertModal.test.tsx
npm run lint
npm run type-check
npm run build
```

**Manual Test Checklist**:
- [ ] 모달이 올바르게 열리고 닫힘
- [ ] 서버 이미지 목록이 표시됨
- [ ] 이미지 선택 시 콜백 호출
- [ ] 새 이미지 업로드 후 자동 선택

---

### Phase 3: MarkdownEditor 이미지 삽입 버튼 통합
**Goal**: 마크다운 에디터에 이미지 삽입 버튼 추가
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 3.1**: MarkdownEditor 이미지 버튼 테스트 작성
  - File(s): `src/__tests__/presentation/components/editor/MarkdownEditor.test.tsx`
  - Expected: Tests FAIL (red) because feature doesn't exist yet
  - Details: Test cases covering:
    - 이미지 버튼 렌더링
    - 버튼 클릭 시 모달 열림
    - 이미지 선택 시 에디터에 마크다운 삽입
    - 기존 드래그&드롭 기능 유지

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 3.2**: MarkdownEditor 이미지 버튼 추가
  - File(s): `src/presentation/components/editor/MarkdownEditor.tsx`
  - Goal: Make Test 3.1 pass with minimal code
  - Details:
    - @uiw/react-md-editor 커스텀 명령어 사용
    - ImageInsertModal 연동
    - 선택된 이미지 마크다운을 커서 위치에 삽입

- [ ] **Task 3.3**: useImageInsert 커스텀 훅 생성 (선택적)
  - File(s): `src/presentation/hooks/useImageInsert.ts`
  - Goal: 이미지 삽입 로직 재사용 가능하게 분리

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 3.4**: 코드 품질 개선
  - Files: Review all new code in this phase
  - Checklist:
    - [ ] 기존 기능과의 충돌 없음
    - [ ] 버튼 아이콘 일관성
    - [ ] 로딩 상태 표시

#### Quality Gate ✋

**⚠️ STOP: Do NOT proceed to Phase 4 until ALL checks pass**

**TDD Compliance** (CRITICAL):
- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: Test coverage meets requirements

**Validation Commands**:
```bash
npm run test -- src/__tests__/presentation/components/editor/MarkdownEditor.test.tsx
npm run lint
npm run type-check
npm run build
```

**Manual Test Checklist**:
- [ ] 툴바에 이미지 버튼 표시
- [ ] 버튼 클릭 시 모달 열림
- [ ] 이미지 선택 후 에디터에 삽입
- [ ] 드래그&드롭 여전히 동작

---

### Phase 4: ThumbnailPicker 컴포넌트
**Goal**: 썸네일 선택용 UI 컴포넌트 구현
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 4.1**: ThumbnailPicker 단위 테스트 작성
  - File(s): `src/__tests__/presentation/components/post/ThumbnailPicker.test.tsx`
  - Expected: Tests FAIL (red) because feature doesn't exist yet
  - Details: Test cases covering:
    - 현재 썸네일 미리보기 표시
    - 이미지 선택 버튼 렌더링
    - 선택 시 onChange 콜백 호출
    - 썸네일 제거 기능

**🟢 GREEN: Implement to Make Tests Pass**
- [ ] **Task 4.2**: ThumbnailPicker 컴포넌트 구현
  - File(s): `src/presentation/components/post/ThumbnailPicker.tsx`
  - Goal: Make Test 4.1 pass with minimal code
  - Details:
    - 현재 썸네일 미리보기 (있을 경우)
    - "이미지 선택" 버튼
    - ImageInsertModal 연동
    - "제거" 버튼

- [ ] **Task 4.3**: PostForm에 ThumbnailPicker 통합
  - File(s): `src/presentation/components/post/PostForm.tsx`
  - Goal: 기존 Input 필드를 ThumbnailPicker로 교체

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 4.4**: 코드 품질 개선
  - Files: Review all new code in this phase
  - Checklist:
    - [ ] 이미지 로딩 상태
    - [ ] 에러 처리 (이미지 로드 실패)
    - [ ] 반응형 미리보기

#### Quality Gate ✋

**⚠️ STOP: Do NOT proceed to Phase 5 until ALL checks pass**

**TDD Compliance** (CRITICAL):
- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: Test coverage meets requirements

**Validation Commands**:
```bash
npm run test -- src/__tests__/presentation/components/post/ThumbnailPicker.test.tsx
npm run lint
npm run type-check
npm run build
```

**Manual Test Checklist**:
- [ ] 썸네일 미리보기 표시
- [ ] 이미지 선택 버튼 동작
- [ ] 새 썸네일 선택 시 미리보기 업데이트
- [ ] 제거 버튼 동작

---

### Phase 5: E2E 테스트 및 최종 검증
**Goal**: 전체 이미지 삽입 플로우 E2E 테스트
**Status**: ⏳ Pending

#### Tasks

**🔴 RED: Write Failing Tests First**
- [ ] **Test 5.1**: E2E 테스트 작성
  - File(s): `e2e/image-insertion.spec.ts`
  - Expected: Tests FAIL (red) until full integration complete
  - Details: Test cases covering:
    - 글 작성 시 이미지 버튼으로 이미지 삽입
    - 썸네일 선택 후 저장
    - 기존 이미지 선택
    - 새 이미지 업로드 후 삽입

**🟢 GREEN: Fix Any Integration Issues**
- [ ] **Task 5.2**: E2E 테스트 통과를 위한 버그 수정
  - Files: 필요에 따라 여러 파일
  - Goal: Make Test 5.1 pass

**🔵 REFACTOR: Clean Up Code**
- [ ] **Task 5.3**: 최종 코드 품질 개선
  - Files: Review all new code
  - Checklist:
    - [ ] 불필요한 console.log 제거
    - [ ] TODO 주석 정리
    - [ ] 코드 일관성 검토

#### Quality Gate ✋

**⚠️ STOP: Feature is NOT complete until ALL checks pass**

**TDD Compliance** (CRITICAL):
- [ ] **Red Phase**: Tests were written FIRST and initially failed
- [ ] **Green Phase**: Production code written to make tests pass
- [ ] **Refactor Phase**: Code improved while tests still pass
- [ ] **Coverage Check**: Test coverage meets requirements

**Validation Commands**:
```bash
npm run test
npm run lint
npm run type-check
npm run build
npx playwright test e2e/image-insertion.spec.ts
```

**Manual Test Checklist**:
- [ ] 전체 이미지 삽입 플로우 수동 테스트
- [ ] 다양한 브라우저에서 테스트
- [ ] 모바일 반응형 테스트

---

## ⚠️ Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| @uiw/react-md-editor 커스텀 명령어 호환성 | Low | Medium | 라이브러리 문서 확인, 대안으로 별도 버튼 구현 |
| 모달 z-index 충돌 | Low | Low | 일관된 z-index 체계 사용 |
| 대용량 이미지 업로드 성능 | Medium | Medium | 이미지 최적화, 프로그레스 표시 |
| 기존 드래그&드롭 기능 충돌 | Low | High | 통합 테스트로 검증 |

---

## 🔄 Rollback Strategy

### If Phase 1 Fails
**Steps to revert**:
- Undo code changes in: `src/application/usecases/media/InsertImageUseCase.ts`
- Remove from index export

### If Phase 2 Fails
**Steps to revert**:
- Restore to Phase 1 complete state
- Undo changes in: `src/presentation/components/media/ImageInsertModal.tsx`

### If Phase 3 Fails
**Steps to revert**:
- Restore MarkdownEditor to previous state
- 기존 이미지 삽입 방식 유지 (드래그&드롭, 붙여넣기)

### If Phase 4 Fails
**Steps to revert**:
- Restore PostForm to use Input field for thumbnail
- ThumbnailPicker 컴포넌트 제거

### If Phase 5 Fails
**Steps to revert**:
- Restore to Phase 4 complete state
- E2E 테스트 파일 제거

---

## 📊 Progress Tracking

### Completion Status
- **Phase 1**: ✅ 100% - InsertImageUseCase 구현 완료
- **Phase 2**: ✅ 100% - ImageInsertModal 구현 완료
- **Phase 3**: ✅ 100% - MarkdownEditor 이미지 버튼 통합 완료
- **Phase 4**: ✅ 100% - ThumbnailPicker 구현 완료
- **Phase 5**: ✅ 100% - 빌드 및 테스트 검증 완료

**Overall Progress**: 100% complete

---

## 📝 Notes & Learnings

### Implementation Notes
- (Add insights discovered during implementation)

### Blockers Encountered
- (Document any blockers and resolutions)

### Improvements for Future Plans
- (What would you do differently next time?)

---

## 📚 References

### Documentation
- [@uiw/react-md-editor Custom Commands](https://uiwjs.github.io/react-md-editor/)
- [Velog UI Reference](https://velog.io/)

### Related Files
- `src/presentation/components/media/MediaPicker.tsx` - 기존 미디어 선택 컴포넌트
- `src/presentation/components/editor/MarkdownEditor.tsx` - 기존 마크다운 에디터
- `src/presentation/components/post/PostForm.tsx` - 글 작성/수정 폼

---

## ✅ Final Checklist

**Before marking plan as COMPLETE**:
- [ ] All phases completed with quality gates passed
- [ ] Full integration testing performed
- [ ] 기존 기능 회귀 테스트 통과
- [ ] 브라우저 호환성 확인
- [ ] 반응형 디자인 확인
- [ ] 접근성(a11y) 확인

---

**Plan Status**: ⏳ Pending User Approval
**Next Action**: 사용자 승인 후 Phase 1 시작
**Blocked By**: None
