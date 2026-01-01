# UI/디자인 전체 리디자인 계획

**CRITICAL INSTRUCTIONS**: After completing each phase:
1. ✅ Check off completed task checkboxes
2. 🧪 Run all quality gate validation commands
3. ⚠️ Verify ALL quality gate items pass
4. 📅 Update "Last Updated" date
5. 📝 Document learnings in Notes section
6. ➡️ Only then proceed to next phase

⛔ DO NOT skip quality gates or proceed with failing checks

---

## Overview

블로그 관리자 페이지의 전체 UI/디자인을 **컬러풀 & 볼드** 스타일로 리디자인합니다.

### Objectives
- 강렬한 색상과 그라데이션을 활용한 생동감 있는 디자인
- 완전한 다크모드 지원 (시스템 연동 + 수동 토글)
- 마이크로 인터랙션과 애니메이션으로 사용자 경험 향상
- 일관된 디자인 시스템 구축

### Design Direction
- **Style**: 컬러풀 & 볼드 (Stripe, Vercel, Linear 참고)
- **Colors**: 보라-파랑-핑크 그라데이션 기반
- **Effects**: 그라데이션 배경, 호버 효과, 부드러운 트랜지션
- **Dark Mode**: 깊은 색상 + 네온 포인트 컬러

---

## Phase Summary

| Phase | Name | Scope |
|-------|------|-------|
| 1 | 디자인 시스템 기반 | 색상, 다크모드, CSS 변수 |
| 2 | 로그인 페이지 | 그라데이션 배경, 애니메이션 폼 |
| 3 | 사이드바 & 네비게이션 | 현대적 사이드바, 아이콘, 호버 효과 |
| 4 | 헤더 & 레이아웃 | 헤더, 다크모드 토글, 레이아웃 |
| 5 | 대시보드 | 통계 카드, 빠른 액션, 차트 |
| 6 | 테이블 & 리스트 | PostList, MediaGrid, 페이지네이션 |
| 7 | 공통 컴포넌트 | Button, Input, Modal, Toast |

---

## Phase 1: 디자인 시스템 기반 구축

### Goal
컬러풀 & 볼드 스타일의 디자인 토큰과 CSS 변수를 정의하고, 다크모드 지원을 위한 기반을 마련합니다.

### Tasks

#### Design Tokens
- [ ] 색상 팔레트 정의 (Primary: 보라-파랑 그라데이션)
- [ ] 시맨틱 색상 변수 정의 (background, surface, text, border)
- [ ] 라이트/다크 모드 CSS 변수 설정

#### Theme System
- [ ] ThemeContext 생성 (light/dark/system)
- [ ] 로컬 스토리지 테마 저장/복원
- [ ] 시스템 테마 변경 감지

#### Global Styles
- [ ] globals.css 리팩토링
- [ ] 그라데이션 유틸리티 클래스 정의
- [ ] 애니메이션 키프레임 정의

### Files to Modify
- `src/app/globals.css`
- `src/presentation/context/ThemeContext.tsx` (new)
- `src/app/providers.tsx`

### Color Palette (Light Mode)
```css
--primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--primary-solid: #7c3aed
--secondary: #f472b6
--accent: #06b6d4
--background: #fafafa
--surface: #ffffff
--text-primary: #1f2937
--text-secondary: #6b7280
--border: #e5e7eb
```

### Color Palette (Dark Mode)
```css
--primary: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)
--primary-solid: #8b5cf6
--secondary: #f9a8d4
--accent: #22d3ee
--background: #0f0f23
--surface: #1a1a2e
--text-primary: #f3f4f6
--text-secondary: #9ca3af
--border: #374151
```

### Quality Gate
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 라이트/다크 모드 전환 정상 동작
- [ ] 시스템 테마 연동 확인

---

## Phase 2: 로그인 페이지 리디자인

### Goal
첫인상을 결정하는 로그인 페이지를 그라데이션 배경과 애니메이션이 있는 매력적인 디자인으로 개선합니다.

### Tasks

#### Background
- [ ] 애니메이션 그라데이션 배경 구현
- [ ] 부유하는 도형 애니메이션 추가 (선택적)

#### Login Card
- [ ] 글래스모피즘 스타일 카드
- [ ] 로고/브랜딩 영역 강화
- [ ] 입력 필드 리디자인 (아이콘 + 포커스 효과)

#### Interactions
- [ ] 버튼 호버/클릭 애니메이션
- [ ] 에러 메시지 애니메이션
- [ ] 로딩 상태 개선

#### Dark Mode
- [ ] 다크모드용 그라데이션 배경
- [ ] 다크모드용 카드 스타일

### Files to Modify
- `src/app/login/page.tsx`
- `src/presentation/components/common/Input.tsx`

### Quality Gate
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 로그인 기능 정상 동작
- [ ] 다크모드 전환 확인
- [ ] 모바일 반응형 확인

---

## Phase 3: 사이드바 & 네비게이션 개선

### Goal
현대적이고 생동감 있는 사이드바로 개선하여 네비게이션 경험을 향상시킵니다.

### Tasks

#### Sidebar Design
- [ ] 그라데이션 배경 또는 다크 테마
- [ ] 로고 영역 리디자인
- [ ] 네비게이션 아이템 호버 효과 (그라데이션 보더 등)
- [ ] 활성 상태 강조 (배경 그라데이션)

#### Icons
- [ ] Lucide React 아이콘으로 통일 (선택적)
- [ ] 아이콘 호버 애니메이션

#### Interactions
- [ ] 부드러운 트랜지션
- [ ] 호버 시 아이콘 + 텍스트 색상 변화

#### Dark Mode
- [ ] 다크모드용 사이드바 스타일

### Files to Modify
- `src/presentation/components/layout/Sidebar.tsx`

### Quality Gate
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 네비게이션 정상 동작
- [ ] 활성 상태 표시 정확
- [ ] 다크모드 전환 확인

---

## Phase 4: 헤더 & 레이아웃 개선

### Goal
헤더에 다크모드 토글을 추가하고, 전체 레이아웃의 일관성을 개선합니다.

### Tasks

#### Header
- [ ] 다크모드 토글 버튼 추가 (아이콘 + 애니메이션)
- [ ] 사용자 아바타 그라데이션 보더
- [ ] 헤더 배경 스타일 (blur + 반투명)

#### Layout
- [ ] 콘텐츠 영역 배경색 조정
- [ ] 카드/섹션 사이 간격 통일
- [ ] 반응형 레이아웃 개선

#### Dark Mode
- [ ] 헤더 다크모드 스타일
- [ ] 레이아웃 배경 다크모드

### Files to Modify
- `src/presentation/components/layout/Header.tsx`
- `src/presentation/components/layout/AppLayout.tsx`

### Quality Gate
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 다크모드 토글 정상 동작
- [ ] 헤더 스크롤 시 정상 동작

---

## Phase 5: 대시보드 리디자인

### Goal
통계 카드와 위젯들을 컬러풀하고 시각적으로 풍부하게 개선합니다.

### Tasks

#### Stats Cards
- [ ] 각 카드별 다른 그라데이션 배경
- [ ] 아이콘 배경 개선
- [ ] 숫자 애니메이션 (count up)
- [ ] 호버 시 살짝 띄우는 효과

#### Quick Actions
- [ ] 액션 버튼 그라데이션 스타일
- [ ] 호버 애니메이션

#### Recent Posts Widget
- [ ] 카드 스타일 개선
- [ ] 상태 뱃지 컬러풀하게

#### System Info Widget
- [ ] 프로그레스 바 또는 아이콘 추가
- [ ] 시각적 구분 강화

#### Dark Mode
- [ ] 모든 위젯 다크모드 스타일

### Files to Modify
- `src/app/(authenticated)/dashboard/page.tsx`
- `src/presentation/components/dashboard/StatsCard.tsx`
- `src/presentation/components/dashboard/QuickActions.tsx`
- `src/presentation/components/dashboard/RecentPosts.tsx`

### Quality Gate
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 통계 데이터 정상 표시
- [ ] 다크모드 전환 확인
- [ ] 모바일 반응형 확인

---

## Phase 6: 테이블 & 리스트 컴포넌트 개선

### Goal
데이터 테이블과 리스트 컴포넌트의 가독성과 인터랙션을 개선합니다.

### Tasks

#### PostList Table
- [ ] 테이블 헤더 스타일 (그라데이션 또는 컬러)
- [ ] 행 호버 효과 개선
- [ ] 액션 버튼 아이콘 + 툴팁
- [ ] 상태 뱃지 개선 (그라데이션)

#### MediaGrid
- [ ] 그리드 아이템 호버 효과
- [ ] 선택 상태 표시 개선
- [ ] 이미지 오버레이 효과

#### Pagination
- [ ] 페이지네이션 디자인 개선
- [ ] 현재 페이지 강조

#### Filters
- [ ] 필터 버튼 스타일 개선
- [ ] 활성 필터 표시

#### Dark Mode
- [ ] 테이블/리스트 다크모드

### Files to Modify
- `src/presentation/components/post/PostList.tsx`
- `src/presentation/components/post/PostStatusBadge.tsx`
- `src/presentation/components/media/MediaGrid.tsx`

### Quality Gate
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 데이터 표시 정상
- [ ] 필터/페이지네이션 동작
- [ ] 다크모드 전환 확인

---

## Phase 7: 공통 컴포넌트 개선

### Goal
Button, Input, Modal, Toast 등 공통 컴포넌트를 컬러풀 & 볼드 스타일로 개선합니다.

### Tasks

#### Button
- [ ] Primary 버튼 그라데이션
- [ ] 호버/클릭 애니메이션
- [ ] 로딩 스피너 개선

#### Input
- [ ] 포커스 시 그라데이션 보더
- [ ] 에러 상태 스타일 개선
- [ ] 라벨 애니메이션 (선택적)

#### Modal
- [ ] 모달 배경 블러 효과
- [ ] 모달 카드 스타일 개선
- [ ] 열기/닫기 애니메이션

#### Toast
- [ ] 토스트 스타일 개선 (아이콘, 색상)
- [ ] 등장/퇴장 애니메이션

#### Skeleton & Loading
- [ ] 스켈레톤 그라데이션 효과
- [ ] 로딩 스피너 개선

#### Dark Mode
- [ ] 모든 공통 컴포넌트 다크모드

### Files to Modify
- `src/presentation/components/common/Button.tsx`
- `src/presentation/components/common/Input.tsx`
- `src/presentation/components/common/Toast.tsx`
- `src/presentation/components/common/Skeleton.tsx`
- `src/presentation/components/common/LoadingSpinner.tsx`
- `src/presentation/components/media/ImageInsertModal.tsx`

### Quality Gate
- [ ] `npm run build` 성공
- [ ] `npm run lint` 에러 없음
- [ ] 모든 컴포넌트 정상 렌더링
- [ ] 접근성 유지 (키보드, 스크린리더)
- [ ] 다크모드 전환 확인

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| CSS 변수 충돌 | Low | Medium | 명확한 네이밍 규칙 적용 |
| 다크모드 깜빡임 | Medium | Low | 서버사이드 쿠키 활용 |
| 성능 저하 (애니메이션) | Low | Medium | GPU 가속 활용, 간단한 트랜지션 |
| 기존 스타일 충돌 | Medium | Medium | 단계별 점진적 적용 |

---

## Rollback Strategy

각 Phase별로 이전 상태로 롤백 가능:
1. Git commit으로 각 Phase 완료 시점 기록
2. CSS 변수 기반이므로 변수 값만 원복하면 이전 스타일 복원 가능
3. ThemeContext 제거 시 시스템 기본 테마로 자동 복원

---

## Progress Tracking

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1 | ✅ Completed | 2024-12 | 2024-12 |
| 2 | ✅ Completed | 2024-12 | 2024-12 |
| 3 | ✅ Completed | 2024-12 | 2024-12 |
| 4 | ✅ Completed | 2024-12 | 2024-12 |
| 5 | ✅ Completed | 2024-12 | 2024-12 |
| 6 | ✅ Completed | 2024-12 | 2024-12 |
| 7 | ✅ Completed | 2024-12 | 2024-12 |

**Last Updated**: 2026-01-01

---

## Notes & Learnings

### 2026-01-01
- 모든 7개 Phase 완료
- 다크모드/라이트모드 전환 완벽 지원
- CSS 변수 기반 테마 시스템 구축 완료
- Hydration 에러 해결 (suppressHydrationWarning 적용)
- 사이드바, 헤더가 테마에 따라 색상 변경되도록 수정
