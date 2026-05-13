# 작업 기록: infra-convention-ssot-consolidation

- **시작 시각**: 17:00
- **작업 목표**: 전역 거버넌스 문서의 중복 제거 및 단일 진실 공급원(SSOT) 확립

### 📌 체크리스트
- [x] `AGENTS.md` 전면 리팩토링: 프로젝트명 변경 및 기술적 세부 사항을 전문 스킬로 이관
- [x] `.agents/code-convention/SRP_CONVENTION.md` 업데이트: 프로젝트명 변경 및 파일 구조 예시 통합
- [x] `.agents/code-convention/SKILLS.md` 내 중복된 파일 구조 섹션 제거
- [x] 전역 파일(`AGENTS.md`, `GEMINI.md`, `CODEX.md`, `.agents/**`) 내 구형 프로젝트명(PixelPlay) 일괄 수정
- [x] 문서 간 책임 범위(SRP) 재검토 및 중복된 행동 지침 정리

- **종료 시각**: 17:15
- **관련 이슈/브랜치**: `chore/infra/convention-ssot`

### 📝 비고
- `AGENTS.md`는 이제 '헌법' 역할만 수행하며, 실제 규칙은 `.agents/` 내의 파일들이 관리함.
- 모든 문서가 "A to Z Animals" 프로젝트 정체성에 맞게 통일됨.
- 문서 간 중복이 제거되어 유지보수 효율이 극대화됨.
