# AGENTS.md - Project Master Log & History

이 파일은 프로젝트의 주요 의사결정, 히스토리, 그리고 에이전트 간 협업 규칙을 기록하는 마스터 로그입니다. 컴퓨터를 옮기거나 새로운 에이전트가 합류했을 때 이 파일을 읽으면 프로젝트의 현재 맥락을 즉시 파악할 수 있습니다.

## 🕒 주요 히스토리 및 의사결정 (Decision Log)

### 2026-04-30: 프로젝트 킥오프 및 PM 선임
- **결정 사항**: Gemini CLI를 프로젝트의 **PM(Project Manager) 및 기획 비서**로 임명.
- **역할 분담**: 
    - **Gemini CLI (PM)**: 기획, 전략, 에이전트 오케스트레이션.
    - **Codex (설계)**: 기술 설계, DB 스키마 및 아키텍처 플랜 수립.
    - **Claude (구현)**: 실제 코드 작성 및 리팩토링.

### 2026-04-30: 협업 원칙 수립 (Context7 의무화)
- **결정 사항**: 모든 에이전트는 기술 리서치 및 문서 참조 시 `mcp-context7` 도구를 사용하도록 의무화 (`GEMINI.md`, `CLAUDE.md`, `CODEX.md` 반영 완료).

### 2026-04-30: 회원 및 프로필 관리 전략 확정
- **결정 사항**: "넷플릭스식 프로필 관리" 도입.
- **핵심 구조**:
    - `profiles`: 부모 계정 (연락/결제/법적 책임 주체, PortOne 본인인증 필수).
    - `child_profiles`: 자녀 프로필 (이메일/연락처 배제, 별명과 출생연도만 저장).
    - `parent_gate_verifications`: 부모 안심 장치 (결제/관리 진입 시 서버 사이드 검증).
- **보안**: PortOne `imp_uid` 검증은 반드시 Supabase Edge Functions(서버)에서 수행.

## 🛠️ 추천 및 검토 중인 기술 스택
- **UI/UX**: Lottie (애니메이션), Framer Motion (인터랙션), Web Speech API (TTS).
- **분석**: Mixpanel / Amplitude (유저 행동 분석).
- **통신**: webview-bridge (Expo ↔ Next.js 통신).

## 📋 현재 진행 상황 (Status)
- [x] 프로젝트 역할 및 지침 수립
- [x] `BACKLOG.md` 생성 및 전략 제안 정리
- [x] 회원 관리 DB 스키마 설계 승인 (Codex 설계안)
- [ ] **Next Task**: 회원 관리 스키마 마이그레이션 및 Auth UI 구현 (Codex 작업 예정)

---
*이 파일은 PM(Gemini CLI)에 의해 관리되며, 주요 결정이 있을 때마다 업데이트됩니다.*
