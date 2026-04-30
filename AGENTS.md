# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 중요 사항

- [중요] **문서**: 모든 문서나 답변은 무조건 한국어로 해주세요.

## 프로젝트 개요

**A to Z Animals** — 아동용 동물 백과사전 앱

- **형태**: React Native(Expo) + WebView → 이 Next.js 웹을 WebView로 임베드
- **타겟**: 유아~초등 저학년 (7~8세 눈높이 콘텐츠)
- **서비스 확장 순서**: 지상 동물 → 해양 동물 → 곤충 → 공룡
- **수익 모델**: Google AdMob 광고 + 5,500원 프리미엄 결제 (광고 제거 + AI 검색 무제한)
- **결제**: Toss Payments
- **인증**: 이메일 아이디 + 카카오/네이버 OAuth + SMS 본인인증(Solapi)
- **AI**: Gemini 2.5 Flash — 특징 기반 동물 검색 ("야행성이고 줄무늬 있는 동물 찾아줘")
- **데이터**: Wikipedia API 크롤링 → Gemini로 아동용 재작성 → Supabase 저장

## 개발 환경

- **OS**: Windows 11
- **패키지 매니저**: npm

## Commands

```bash
npm run dev          # 개발 서버 시작 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run collect      # 동물 데이터 수집 스크립트 (scripts/collect.ts)
npm run db:types     # Supabase → TypeScript 타입 자동 생성 (src/types/database.types.ts)
```

## Commands

```bash
npm run dev      # 개발 서버 시작 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
```

## Architecture

Next.js 16 App Router 기반 스타터킷이다. 소스 코드는 모두 `src/` 아래에 위치한다.

- `src/app/` — Next.js App Router 페이지 및 레이아웃. `layout.tsx`에서 전역 폰트(Noto Sans, Geist)와 CSS 변수를 설정하고 `Providers`로 감싼다.
- `src/components/common/` — 앱 전역 공통 컴포넌트. `providers.tsx`에서 ThemeProvider(next-themes)와 Toaster(sonner)를 제공한다.
- `src/components/ui/` — shadcn 컴포넌트. `@base-ui/react`를 primitive로 사용하고 `cva`로 variant를 정의한다.
- `src/lib/utils.ts` — `cn()` 유틸리티 (clsx + tailwind-merge).

## UI 컴포넌트

shadcn `base-nova` 스타일을 사용한다. 새 컴포넌트 추가 시:

```bash
npx shadcn add <component>
```

컴포넌트는 `@base-ui/react`를 primitive로 래핑하며, `cva`로 variant를 정의하는 패턴을 따른다.

## 스타일링

- Tailwind CSS v4 사용 (설정 파일 없음, `src/app/globals.css`의 `@theme` 블록으로 토큰 정의)
- 다크모드: `next-themes`의 `ThemeProvider`가 `.dark` 클래스를 제어 (`@custom-variant dark (&:is(.dark *))`)
- 색상 토큰은 oklch 색상 공간 사용
- `cn()` 함수로 조건부 클래스 병합

## 주요 라이브러리

| 라이브러리                     | 용도                                         |
| ------------------------------ | -------------------------------------------- |
| `@tanstack/react-query`        | 서버 상태 관리                               |
| `zustand`                      | 클라이언트 상태 관리 (persist 미들웨어 내장) |
| `react-hook-form` + `zod`      | 폼 처리 및 유효성 검사                       |
| `framer-motion`                | 애니메이션                                   |
| `next-themes`                  | 다크모드 토글                                |
| `sonner`                       | 토스트 알림                                  |
| `lucide-react` / `react-icons` | 아이콘                                       |
| `tw-animate-css`               | Tailwind 애니메이션 유틸리티                 |

## Path Alias

`@/`는 `src/`를 가리킨다 (`tsconfig.json` `paths` 설정).
