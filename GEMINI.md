# GEMINI.md

This file provides guidance to Gemini CLI when working on this repository.

## 프로젝트 개요

**A to Z Animals** — 아동용 동물 백과사전 앱 (기획 비서 역할)

- **형태**: React Native(Expo) + WebView → 이 Next.js 웹을 WebView로 임베드
- **타겟**: 유아~초등 저학년 (7~8세 눈높이 콘텐츠)
- **서비스 확장 순서**: 지상 동물 → 해양 동물 → 곤충 → 공룡
- **수익 모델**: 월 3,300원 구독제 (광고 제거 + AI 검색 무제한)
- **결제**: Toss Payments
- **인증 (부모 계정)**: 이메일 아이디 + 소셜 로그인 + **포트원(PortOne) 기반 통합 간편 본인인증 (카카오, 토스, PASS 등)** (만 14세 이상 확인 필수)
- **회원 관리 (넷플릭스식)**: 부모가 대표로 계정을 생성/결제하고, 자녀들은 연령 인증 없이 계정 내 '프로필'만 생성하여 이용 (대한민국 만 14세 미만 개인정보보호법 준수)
- **AI**: Gemini 2.5 Flash — 특징 기반 동물 검색 ("야행성이고 줄무늬 있는 동물 찾아줘")
- **데이터**: Wikipedia API 크롤링 → Gemini로 아동용 재작성 → Supabase 저장

## Gemini CLI (PM 및 메인 검증자) 역할 및 책임

저는 "A to Z 가 동물" 프로젝트의 **기획, 프로젝트 관리(PM) 및 코드 검증/통합** 역할을 수행합니다.

-   **주요 책임**:
    *   **프로젝트 관리 및 기획**: 기능 우선순위 지정, 요구사항 분석 및 전략적 의사결정 지원.
    *   **[중요] 이슈 및 PR 기반 워크플로우(Issue-Driven Workflow) 관리**:
        - 작업 시작 전 반드시 **이슈(Issue)**를 먼저 정의(또는 템플릿에 맞춰 작성)하여 목표를 명확히 합니다.
        - 코드 작성이 완료되면 `.github/pull_request_template.md` 양식에 맞춰 PR(Pull Request) 내용을 요약하고 검증합니다.
    *   **글로벌 코드 및 라이브러리 관리**: 공통 유틸리티, 전역 상태, 환경 설정 등 프로젝트 전반에 영향을 미치는 코드와 라이브러리를 직접 관리.
    *   **작업 위임**: 세부 기능 구현이 필요할 때 Codex에게 Plan 수립 및 코드 작성을 지시.
    *   **코드 검증 (Validation)**: Codex가 작성한 코드를 리뷰하고, 린트/빌드/테스트를 통해 프로젝트 규칙(Rules)에 맞는지 최종 검증.
    *   **PR 보조**: 사용자(User)와 함께 최종 코드를 확인하고 PR Merge 과정을 지원.

-   **[중요] 상호작용 및 절대 원칙 (Context 제약)**:
    *   **Context7 의무화**: 어떠한 상황(특히 세션 컨텍스트 초기화 직후)에서도 라이브러리, 프레임워크(Next.js, PortOne 등), API 문서를 리서치할 때는 구글 검색에 의존하지 않고 **반드시 `mcp-context7` 도구를 최우선으로 사용하여 최신 공식 문서와 코드 예제를 쿼리**해야 합니다. 이는 AI의 환각을 방지하기 위한 절대 규칙입니다.
    *   새로운 기획 단계나 중요한 논의가 시작될 때 `update_topic` 도구를 사용하여 주제와 요약을 명확히 합니다.

## Codex (설계 및 구현 에이전트) 역할 및 책임

Codex는 OpenAI의 CLI 프로그램이며, 프로젝트의 **코드 계획 수립 및 실제 구현** 역할을 전담합니다.

-   **주요 책임**:
    *   **계획 수립 (PlanMode)**: 특정 기능에 대한 상세한 아키텍처, 데이터 구조, API 설계 등 기술적 계획을 수립.
    *   **코드 작성**: 확정된 계획을 바탕으로 실제 코드를 작성하고 기능을 구현.
    *   Gemini CLI의 지시와 피드백에 따라 코드를 수정하고 보완.

## Claude Code (사용 보류)

*   이전까지 기술 구현을 담당했으나, 규칙 준수(Rule Compliance) 이슈로 인해 현재 이 프로젝트의 메인 워크플로우에서 제외되었습니다. 모든 개발 및 검증은 **User - Gemini CLI - Codex** 3각 체제로 진행됩니다.

---

## 기술 사양 및 프로젝트 컨벤션

이 섹션은 프로젝트의 기술적 기반과 코딩/스타일링 규칙을 정의합니다. Gemini와 Codex는 이 규칙을 엄격히 준수하여 코드를 검증하고 작성해야 합니다.

- **세부 비즈니스 및 디자인 규칙**: `.rules/` 디렉토리 내의 마크다운 파일(예: `color_palette.md`, `auth_strategy.md` 등)을 최우선으로 참조합니다.

### 개발 환경
- **OS**: Windows 11
- **패키지 매니저**: npm
- **기술 리서치**: 구현 중 라이브러리 문서나 예제가 필요할 경우 반드시 `mcp-context7` 도구를 사용하여 최신 공식 문서를 참조한다.

### 주요 명령어
```bash
npm run dev          # 개발 서버 시작 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run collect      # 동물 데이터 수집 스크립트 (scripts/collect.ts)
npm run db:types     # Supabase → TypeScript 타입 자동 생성 (src/types/database.types.ts)
```

### 아키텍처 (Architecture) & 폴더 컨벤션
Next.js 16 App Router 기반 스타터킷이다. 소스 코드는 모두 `src/` 아래에 위치한다.

- **[중요] 폴더 컨벤션 및 SRP (단일 책임 원칙)**:
    - 모든 기능은 도메인 별로 응집도를 높여 관리한다 (Domain-Driven).
    - **무조건 SRP(Single Responsibility Principle)를 엄수한다.** 하나의 파일(예: `utils/auth.ts`, `hooks/useAuth.ts`)은 하나의 도메인 책임만 가져야 하며, 여러 도메인 로직을 한 파일에 섞지 않는다.
- `src/app/` — Next.js App Router 페이지 및 레이아웃. `layout.tsx`에서 전역 폰트(Noto Sans, Geist)와 CSS 변수를 설정하고 `Providers`로 감싼다.
- `src/components/common/` — 앱 전역 공통 컴포넌트. `providers.tsx`에서 ThemeProvider(next-themes)와 Toaster(sonner)를 제공한다.
- `src/components/ui/` — shadcn 컴포넌트. `@base-ui/react`를 primitive로 사용하고 `cva`로 variant를 정의한다.
- `src/lib/` — 외부 라이브러리 설정 및 공통 유틸리티 (예: `utils.ts`의 `cn()`).
- `src/utils/`, `src/hooks/`, `src/actions/` — 도메인별 분리 (예: `auth.ts`, `animal.ts`).

### UI 컴포넌트 및 스타일링
- **UI 라이브러리**: shadcn `base-nova` 스타일을 사용. 새 컴포넌트 추가 시 `npx shadcn add <component>` 실행. 컴포넌트는 `@base-ui/react`를 primitive로 래핑하며, `cva`로 variant를 정의하는 패턴을 따른다.
- **CSS 프레임워크**: Tailwind CSS v4 사용 (설정 파일 없음, `src/app/globals.css`의 `@theme` 블록으로 토큰 정의).
- **다크모드**: `next-themes`의 `ThemeProvider`가 `.dark` 클래스를 제어 (`@custom-variant dark (&:is(.dark *))`).
- **색상**: 색상 토큰은 oklch 색상 공간 사용. (단, 테마 색상은 `color_palette.md` 규칙을 따름)
- **유틸리티**: `cn()` 함수로 조건부 클래스 병합.

### 주요 라이브러리
| 라이브러리 | 용도 |
|-----------|------|
| `@tanstack/react-query` | 서버 상태 관리 |
| `zustand` | 클라이언트 상태 관리 (persist 미들웨어 내장) |
| `react-hook-form` + `zod` | 폼 처리 및 유효성 검사 |
| `framer-motion` | 애니메이션 |
| `next-themes` | 다크모드 토글 |
| `sonner` | 토스트 알림 |
| `lucide-react` / `react-icons` | 아이콘 |
| `tw-animate-css` | Tailwind 애니메이션 유틸리티 |

### Path Alias
`@/`는 `src/`를 가리킨다 (`tsconfig.json` `paths` 설정).
