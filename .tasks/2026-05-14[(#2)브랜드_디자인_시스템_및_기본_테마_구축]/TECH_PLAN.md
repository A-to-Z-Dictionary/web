# [Tech Plan #2] 브랜드 디자인 시스템 및 기본 테마 구축

- **작성일**: 2026-05-14
- **담당 엔지니어**: Codex
- **작업 브랜치**: `feat/design-system/#2-theme`
- **참조 문서**: `TASK_LOG.md`, `DESIGN.md`
- **상태**: Review

## 1. 구현 목표
- `DESIGN.md`에서 정의한 브랜드 확장 팔레트, 폰트 시스템, 상태 색상, 아동 가독성 기준을 Tailwind CSS v4 기반 전역 테마로 반영합니다.
- 핵심 구현 대상은 `src/app/globals.css`의 `@theme inline`, `:root`, `.dark` 토큰 정리와 `src/app/layout.tsx`의 폰트 변수 주입입니다.
- 기존 WebView 최적화와 shadcn 토큰 호환성을 유지하면서, 디자인 시스템 변경 범위를 필요한 파일로 제한합니다.

## 2. 확인한 현재 코드 근거
- `.tasks/2026-05-14[(#2)브랜드_디자인_시스템_및_기본_테마_구축]/TASK_LOG.md` - 브랜드 컬러 확장, 아동용 폰트 적용, `globals.css` 테마 변수 정리, 라이트와 다크 모드 가독성 검토가 핵심 요구사항입니다.
- `.tasks/2026-05-14[(#2)브랜드_디자인_시스템_및_기본_테마_구축]/DESIGN.md` - Secondary Green `#3FBB7D`, Accent Orange `#FF8C42`, Success `#4AD66D`, Warning `#FFB830`, Danger `#FF6B6B`, Info `#4FC3F7`, Nunito heading 도입을 요구합니다.
- `src/app/globals.css` - Tailwind CSS v4 `@theme inline`이 이미 적용되어 있고, shadcn 변수와 커스텀 `--color-*` 토큰이 함께 정의되어 있습니다.
- `src/app/globals.css` - Safe Area, 텍스트 선택 방지, 터치 하이라이트 제거, WebView 스크롤 최적화가 전역 base layer에 들어 있습니다.
- `src/app/layout.tsx` - 현재 `Noto_Sans`, `Geist`, `Geist_Mono`를 로드하고 `--font-sans`, `--font-geist-sans`, `--font-geist-mono` 변수를 html class에 주입합니다.
- `src/components/ui/button.tsx` - `secondary`, `ghost`, `outline` variant가 `hover:` 상태와 shadcn `secondary`, `muted` 토큰에 의존합니다. `xs` size는 `text-xs`를 사용합니다.
- `package.json` - `tailwindcss`와 `@tailwindcss/postcss`가 `^4`로 설정되어 Tailwind v4 `@theme` 기반 설계를 유지할 수 있습니다.

## 3. 상세 파일 변경 명세

### 신규 생성
- 없음.

### 수정
- `src/app/globals.css` - 브랜드 확장 색상, 상태 색상, 다크 모드 오버라이드, Safe Area 토큰, 폰트 토큰 매핑을 정리합니다.
- `src/app/layout.tsx` - Nunito를 `next/font/google`로 추가하고 `--font-nunito` 변수를 주입합니다. 한국어 본문 폰트는 디자인 의도에 맞게 `Noto_Sans_KR` 적용 여부를 검토합니다.
- `src/components/ui/button.tsx` - `secondary`와 `ghost` variant가 새 브랜드 토큰과 충돌하는지 확인하고, WebView 기준으로 `hover:` 의존을 줄이며 `active:`와 `aria-expanded` 상태를 유지합니다. `text-xs` 사용은 아동 가독성 기준에 맞게 조정합니다.

### 삭제 또는 이동
- 없음.

## 4. 기술 설계

### 데이터 흐름
- 서버 데이터와 DB 흐름은 변경하지 않습니다.
- 디자인 토큰은 `:root`와 `.dark`가 실제 값을 소유하고, `@theme inline`이 Tailwind 유틸리티로 노출하는 구조를 유지합니다.
- 컴포넌트는 HEX를 직접 쓰지 않고 `bg-primary`, `bg-secondary`, `bg-accent`, `text-success`, `ring-info` 같은 Tailwind 토큰을 사용합니다.

### 상태 관리
- React state, Zustand, TanStack Query 변경은 없습니다.
- 다크 모드는 기존 `.dark` 클래스 기반 토큰 전환을 유지합니다.
- Success, Warning, Danger, Info는 런타임 상태 관리가 아니라 의미 기반 CSS 변수로 관리합니다.

### 타입 및 검증
- TypeScript 타입 변경은 없습니다.
- `--secondary`, `--accent`를 브랜드 색상으로 재매핑하면 shadcn 컴포넌트의 기존 의미가 바뀌므로 `button.tsx` variant를 함께 검토합니다.
- `--destructive`는 shadcn 기존 오류 토큰으로 유지하고, 디자인 시스템의 부드러운 위험 색상은 `--danger`와 `--color-danger`로 분리하는 방안을 우선합니다.
- 폰트 변수는 `--font-sans`, `--font-heading`, `--font-mono`를 기준으로 단순화합니다.

### UI 구현
- Light mode 기준으로 `--secondary: #3FBB7D`, `--accent: #FF8C42`를 적용하고 foreground는 `#111111`을 유지합니다.
- Dark mode 기준으로 `--secondary: #4ECE8A`, `--accent: #FF9F5E`를 적용합니다.
- 상태 색상은 `success`, `warning`, `danger`, `info` 네 계열과 각 foreground 토큰을 추가합니다.
- `--font-heading`은 `var(--font-nunito)`로 연결하고, 한국어 본문은 `font-sans` 책임으로 유지합니다.
- Safe Area는 `--spacing-safe-top`, `--spacing-safe-bottom`, `--spacing-safe-left`, `--spacing-safe-right`를 유지하되, `body`와 fixed 영역에서 중복 패딩이 생기지 않도록 구현 전 적용 위치를 확인합니다.
- `body`의 `width: 100vw`는 모바일에서 가로 스크롤을 만들 수 있으므로 `width: 100%` 전환 또는 제거를 검토합니다.

## 5. Supabase 및 보안 영향
- **DB 스키마 변경**: 없음.
- **Migration 기록 필요 여부**: 없음.
- **RLS 정책 변경**: 없음.
- **RPC 또는 Edge Function 변경**: 없음.
- **타입 동기화 필요 여부**: 없음.
- 인증, 권한, 개인정보 노출 흐름에는 영향이 없습니다.

## 6. 성능 및 장애 대응
- 폰트 추가는 렌더링 비용이 있으므로 Nunito는 `subsets: ["latin"]`, `weight: ["400", "600", "700", "800"]`, `display: "swap"`으로 제한합니다.
- 한국어 본문 폰트는 현재 코드의 `Noto_Sans`와 디자인 요구의 `Noto Sans KR`가 다르므로, 구현 시 `Noto_Sans_KR` 전환 가능성을 먼저 검증합니다.
- 전역 CSS 토큰은 앱 전체에 영향을 주므로 기존 shadcn 변수명을 대량 변경하지 않고 필요한 색상만 추가합니다.
- `hover:` 제거는 데스크톱 확인성을 낮출 수 있으므로 WebView 주요 버튼에서는 `active:`를 우선하고, 공용 UI에서는 기존 상호작용을 깨지 않는 범위로 조정합니다.
- `text-xs` 금지는 디자인 기준이지만 아이콘 버튼과 보조 UI에 영향이 있으므로 `button.tsx`의 `xs` size부터 제한적으로 조정합니다.

## 7. 검증 전략
- `npm run types` - DB와 Supabase 타입 변경이 없으므로 실행하지 않습니다.
- `npm run build` - Tailwind v4 토큰 생성, next/font 로딩, App Router 빌드 오류를 확인합니다.
- `npm run lint` - `layout.tsx`, `button.tsx` 변경 후 ESLint를 확인합니다.
- 수동 확인 시나리오 - 라이트 모드에서 primary, secondary, accent, status 색상과 텍스트 대비를 확인합니다.
- 수동 확인 시나리오 - 다크 모드에서 secondary와 accent의 밝기 조정값이 의도대로 보이는지 확인합니다.
- 수동 확인 시나리오 - 모바일 폭에서 Safe Area, 가로 스크롤, 버튼 active 피드백, 입력 필드 텍스트 선택 허용 여부를 확인합니다.

## 8. 트레이드오프 및 미결정 사항
- `--secondary`와 `--accent`를 브랜드 컬러로 바꾸면 기존 shadcn semantic 의미가 바뀝니다. 영향이 크면 `--brand-secondary`, `--brand-accent`를 별도 추가하고 컴포넌트 적용을 단계적으로 진행하는 편이 안전합니다.
- 디자인 문서는 Status 컬러를 `--color-danger`로 제안하지만 shadcn은 `destructive`를 사용합니다. 기존 오류 UI 호환성을 위해 `danger`와 `destructive`의 관계를 구현 시 확정해야 합니다.
- `DESIGN.md` 제목은 `[Design #1]`로 남아 있지만 현재 태스크 폴더와 GitHub Issue는 `#2`입니다. 문서 내용은 `#2` 기준으로 참조합니다.
- `Noto_Sans_KR` 전환은 디자인 의도에는 맞지만 폰트 용량이 증가할 수 있습니다. 빌드 결과와 실제 WebView 로딩을 보고 확정합니다.

## 9. 승인 전 확인
- [x] `TASK_LOG.md` 요구사항과 충돌하지 않습니다.
- [x] `DESIGN.md`의 UI/UX 의도와 충돌하지 않습니다.
- [x] 변경 파일 범위가 SRP와 폴더 컨벤션을 따릅니다.
- [x] DB, RLS, 타입 동기화 영향이 명시되었습니다.
- [x] 검증 명령과 수동 확인 시나리오가 명시되었습니다.
