# A to Z Animals — 어린이 동물을 위한 탐험적 백과사전

**A to Z Animals**는 React Native(Expo) 모바일 애플리케이션 내의 **WebView로 임베드**되도록 최적화된, 인터페이스 중심의 어린이용 동물 백과사전 웹 콘텐츠입니다.

## 🐾 프로젝트 소개

단순히 텍스트를 읽는 백과사전에서 벗어나, 아이들이 호기심을 갖고 동물의 특징을 발견하며 학습할 수 있는 환경을 제공합니다. 모바일 앱 환경에 최적화된 UI/UX를 통해 National Geographic의 탐험적 감성을 "야생을 보는 창"으로 구현하는 것이 목표입니다.

## ✨ 주요 기능

- **탐험적 동물 도감**: 고화질 사진과 함께 A부터 Z까지, 지상부터 공룡까지 다양한 동물 데이터를 탐색합니다.
- **AI 특징 검색**: "야행성이고 줄무늬가 있는 동물은 누구일까?"와 같이 동물의 특징을 기반으로 Gemini AI가 동물을 찾아줍니다.
- **실루엣 퀴즈**: 동물의 실루엣과 단계별 힌트를 통해 동물을 맞히고 도감을 완성해 나가는 게임 요소를 제공합니다.
- **아동 보호 중심**: 만 14세 미만 개인정보보호법을 준수하여, 부모가 관리하는 프로필 시스템으로 안전하게 이용할 수 있습니다.

## 🛠 기술 스택

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Supabase (PostgreSQL), Edge Functions
- **AI**: Google Gemini Pro 2.5 Flash
- **Infrastructure**: Vercel, PortOne (본인인증), Toss Payments

## 🚀 개발 및 기여

이 프로젝트는 AI 에이전트(Gemini CLI, Codex)와 협업하여 엄격한 컨벤션 하에 개발되고 있습니다. 개발 가이드라인과 상세 설계 원칙은 아래 문서를 참고하십시오.

- **전체 가이드라인**: [AGENTS.md](./AGENTS.md)
- **에이전트 역할**: [GEMINI.md](./GEMINI.md) (PM) / [CODEX.md](./CODEX.md) (Engineer)
- **세부 컨벤션**: `.agents/` 디렉토리 내 SKILLS.md 문서들

---
© 2026 A to Z Animals Team.
