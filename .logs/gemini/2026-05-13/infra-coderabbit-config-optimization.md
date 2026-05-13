# 작업 기록: infra-coderabbit-config-optimization

- **시작 시각**: 18:10
- **작업 목표**: CodeRabbit 설정을 프로젝트 최신 컨벤션 및 한국어 출력 원칙에 최적화

### 📌 체크리스트
- [x] 모든 출력(제목, 요약 포함)을 한국어로 작성하도록 `instructions` 추가
- [x] `knowledge_base`에 누락된 `.agents/` 내 모든 컨벤션 폴더(`log`, `plan`, `business`) 추가
- [x] `path_instructions`에 WebView 최적화 규칙(Hover 금지, Safe Area 등) 반영
- [x] `path_instructions` 내 SRP 원칙 설명을 최신 `SRP_CONVENTION.md`와 동기화
- [x] `GEMINI.md` 및 `CODEX.md`를 지식 베이스 학습 대상에 포함

- **종료 시각**: 18:25
- **관련 이슈/브랜치**: `chore/infra/coderabbit-config`

### 📝 비고
- 이제 CodeRabbit이 자동 리뷰 시 우리가 정한 전문 스킬(SKILLS.md)들을 완벽히 이해하고 피드백을 주게 됨.
- 모든 리뷰 인터페이스가 한국어로 통일되어 가독성이 향상됨.
