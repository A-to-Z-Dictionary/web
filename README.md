# Next.js Starter Kit

Next.js 16 + TypeScript + Tailwind CSS v4 기반 프론트엔드 스타터킷.

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 프레임워크 | Next.js 16 (App Router), React 19 |
| 스타일링 | Tailwind CSS v4, tw-animate-css |
| UI 컴포넌트 | shadcn (base-nova), @base-ui/react, lucide-react, react-icons |
| 상태 관리 | Zustand (persist 미들웨어 내장) |
| 서버 상태 | TanStack React Query v5 |
| 폼 | React Hook Form + Zod + @hookform/resolvers |
| 애니메이션 | Framer Motion |
| 테마 | next-themes (다크모드 토글) |
| 알림 | Sonner (토스트) |
| 유틸리티 | clsx, tailwind-merge, class-variance-authority |
| 개발 도구 | Prettier + prettier-plugin-tailwindcss |

## 시작하기

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인.

## 주요 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 폴더 구조

```
src/
├── app/                # Next.js App Router (페이지, 레이아웃)
├── components/
│   ├── common/         # 전역 공통 컴포넌트 (Providers 등)
│   └── ui/             # shadcn UI 컴포넌트
└── lib/                # 유틸리티 (cn 등)
public/                 # 정적 파일
```

## UI 컴포넌트 추가

```bash
npx shadcn add <component>
```

## 스타일 가이드

- 클래스 병합: `cn()` 함수 사용 (`lib/utils.ts`)
- 다크모드: `dark:` prefix (`.dark` 클래스 기반)
- 저장 시 Tailwind 클래스 자동 정렬 (Prettier + VS Code `formatOnSave`)

## Zustand persist 예시

```ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useStore = create(
  persist(
    (set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 })) }),
    { name: "store" }
  )
)
```
