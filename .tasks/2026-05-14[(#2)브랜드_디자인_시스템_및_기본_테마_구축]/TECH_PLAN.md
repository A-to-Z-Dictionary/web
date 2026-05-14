# [Tech Plan #1] 브랜드 디자인 시스템 및 기본 테마 구축

- **작성일**: 2026-05-14
- **담당 엔지니어**: Codex
- **작업 브랜치**: `feat/design-system/#1-theme`
- **참조 문서**: `TASK_LOG.md`, `DESIGN.md`
- **상태**: Draft

## 1. 구현 목표
- Claude Code가 확정할 브랜드 디자인 시스템을 `src/app/globals.css`의 Tailwind CSS v4 `@theme` 구조에 반영할 수 있도록 기술 설계를 준비합니다.
- 이번 설계의 우선 목표는 색상, 폰트, 반경, 간격, Safe Area, 터치 인터랙션 관련 토큰을 한곳에서 예측 가능하게 관리하는 것입니다.
- `DESIGN.md`가 아직 작성되지 않았으므로 실제 팔레트 확장값, 폰트명, 구체 UI 톤은 확정하지 않습니다.

## 2. 확인한 현재 코드 근거
- `.tasks/2026-05-14[(#1)브랜드_디자인_시스템_및_기본_테마_구축]/TASK_LOG.md` - 기존 브랜드 컬러 `#FFD700`, 아동용 폰트, `globals.css` 테마 변수 정리, 라이트와 다크 모드 대비 검토가 핵심 요구사항입니다.
- `src/app/globals.css` - Tailwind CSS v4 `@theme inline`을 이미 사용하고 있으며, `:root`와 `.dark`에 shadcn 변수와 커스텀 색상 변수가 함께 정의되어 있습니다.
- `src/app/globals.css` - Safe Area 변수는 `--spacing-safe-*`로 노출되어 있고, `body`와 `.webview-container`에서 `env(safe-area-inset-*)`를 직접 사용하고 있습니다.
- `src/app/globals.css` - `@layer base`에서 `-webkit-tap-highlight-color`, `user-select`, `-webkit-overflow-scrolling`, `cursor: default` 같은 WebView 최적화가 전역 적용되어 있습니다.
- `package.json` - `tailwindcss`와 `@tailwindcss/postcss`가 `^4`로 설정되어 Tailwind CSS v4 기반 설계가 가능합니다.
- `.agents/code-convention/SKILLS.md` - 파일과 폴더는 kebab-case, 컴포넌트는 PascalCase, 함수와 변수는 camelCase를 사용합니다.
- `.agents/design-convention/SKILLS.md` - WebView 환경에서 hover 지양, 터치 피드백 우선, Safe Area 활용, 모바일 우선, 표준 단위 사용을 요구합니다.

## 3. 상세 파일 변경 명세

### 신규 생성
- 없음.

### 수정
- `src/app/globals.css` - Claude의 `DESIGN.md` 확정값을 기준으로 `@theme inline`, `:root`, `.dark`, `@layer base`, `@layer utilities`의 토큰 구조를 정리합니다.

### 삭제 또는 이동
- 없음.

## 4. 기술 설계

### 데이터 흐름
- 이번 작업은 DB나 서버 데이터 흐름을 변경하지 않습니다.
- 디자인 토큰 흐름은 `:root`와 `.dark`의 실제 CSS 변수 정의에서 시작해 `@theme inline`의 Tailwind 유틸리티 토큰으로 노출되는 구조로 유지합니다.
- 컴포넌트는 `bg-background`, `text-foreground`, `bg-primary`, `p-safe-bottom`처럼 Tailwind 유틸리티를 통해 테마 값을 사용하도록 유도합니다.

### 상태 관리
- 런타임 상태 관리는 추가하지 않습니다.
- 다크 모드는 기존 `.dark` 클래스 기반 변수를 유지하고, `next-themes` 사용 여부는 실제 호출부 확인 후 필요한 경우에만 조정합니다.
- 디자인 토큰은 Zustand나 React state가 아니라 CSS 변수의 책임으로 둡니다.

### 타입 및 검증
- TypeScript 타입 변경은 없습니다.
- CSS 변수명은 의미 기반 이름을 우선합니다.
- 색상 토큰은 `--background`, `--foreground`, `--primary` 같은 shadcn 호환 토큰과 `--color-*` Tailwind 노출 토큰의 매핑을 명확히 유지합니다.
- 폰트 토큰은 Claude가 폰트를 확정한 뒤 `--font-heading`, `--font-sans`, 필요 시 `--font-body` 수준에서만 추가합니다.

### UI 구현
- `DESIGN.md`가 확정한 브랜드 컬러는 `:root`와 `.dark`에 먼저 정의하고, `@theme inline`에서 Tailwind 유틸리티로 노출합니다.
- 기존 `#FFD700` 브랜드 노랑은 `--primary`와 `--color-primary`의 기준값으로 유지하되, Claude가 확장 팔레트를 제시하면 `--color-brand-*` 또는 의미 기반 토큰으로 추가합니다.
- Safe Area는 직접 `env()`를 반복하기보다 `@theme inline`의 `--spacing-safe-*` 토큰과 유틸리티 클래스로 사용할 수 있게 정리합니다.
- 터치 인터랙션은 `hover:` 의존을 늘리지 않고 `active:`, `focus-visible:`, `disabled:` 상태가 잘 보이도록 색상과 ring 토큰을 설계합니다.
- `body`의 `width: 100vw`는 모바일 WebView에서 가로 스크롤을 만들 수 있으므로 실제 구현 시 유지 여부를 검토합니다.

## 5. Supabase 및 보안 영향
- **DB 스키마 변경**: 없음.
- **Migration 기록 필요 여부**: 없음.
- **RLS 정책 변경**: 없음.
- **RPC 또는 Edge Function 변경**: 없음.
- **타입 동기화 필요 여부**: 없음.
- 개인정보나 권한 검증 흐름에는 영향이 없습니다.

## 6. 성능 및 장애 대응
- 전역 CSS는 앱 전체에 영향을 주므로 토큰 추가는 필요한 값으로 제한하고 중복 변수는 줄입니다.
- `@theme inline`과 `:root` 사이에 같은 의미의 변수가 중복 정의될 경우 실제 값의 원천을 `:root`와 `.dark`로 통일합니다.
- WebView 터치 최적화는 전역 선택 방지와 입력 필드 예외를 유지하되, 링크와 버튼 접근성을 해치지 않는지 확인합니다.
- Safe Area 패딩은 `body`와 개별 fixed 영역에 중복 적용될 수 있으므로, 최종 구현 시 상단과 하단 내비게이션 구조를 확인한 뒤 적용 위치를 결정합니다.
- 폰트 추가가 필요하면 외부 폰트 로딩 비용을 확인하고, Next.js 폰트 최적화 또는 시스템 폰트 fallback을 우선 검토합니다.

## 7. 검증 전략
- `npm run types` - DB와 TypeScript 타입 변경이 없으므로 실행하지 않습니다.
- `npm run build` - CSS 토큰과 Tailwind v4 유틸리티 생성 오류를 확인합니다.
- `npm run lint` - 전역 CSS 변경만 있어도 프로젝트 기본 검증으로 실행합니다.
- 수동 확인 시나리오 - 라이트 모드와 다크 모드에서 배경, 카드, 텍스트, 버튼, 포커스 링, Safe Area 여백을 모바일 폭 기준으로 확인합니다.
- 수동 확인 시나리오 - WebView 기준 터치 하이라이트 제거, 입력 필드 텍스트 선택 허용, 가로 스크롤 발생 여부를 확인합니다.

## 8. 트레이드오프 및 미결정 사항
- `DESIGN.md`가 없으므로 색상 확장 팔레트와 폰트는 확정하지 않았습니다.
- shadcn 호환 토큰을 유지하면 기존 컴포넌트 영향이 작지만, 브랜드 전용 토큰이 늘어날 경우 변수 수가 증가합니다.
- Safe Area를 `body`에 전역 적용하면 단순하지만 fixed 헤더와 하단 내비게이션에서 중복 여백이 생길 수 있습니다.
- `body`의 `width: 100vw` 제거 여부는 실제 화면 구조와 가로 스크롤 재현 여부를 확인한 뒤 결정합니다.
- Claude Code가 `DESIGN.md`에서 색상 대비, 폰트, 컴포넌트 톤을 확정하면 이 문서를 `Review` 상태로 업데이트해야 합니다.

## 9. 승인 전 확인
- [x] `TASK_LOG.md` 요구사항과 충돌하지 않습니다.
- [ ] `DESIGN.md`의 UI/UX 의도와 충돌하지 않습니다.
- [x] 변경 파일 범위가 SRP와 폴더 컨벤션을 따릅니다.
- [x] DB, RLS, 타입 동기화 영향이 명시되었습니다.
- [x] 검증 명령과 수동 확인 시나리오가 명시되었습니다.
