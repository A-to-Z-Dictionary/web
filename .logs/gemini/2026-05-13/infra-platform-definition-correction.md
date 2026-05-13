# 작업 기록: infra-platform-definition-correction

- **시작 시각**: 17:35
- **작업 목표**: 프로젝트의 실행 형태(WebView 임베드)를 명확히 정의하도록 문서 수정

### 📌 체크리스트
- [x] `README.md` 내 '웹 애플리케이션' 설명을 'WebView 임베드 웹 콘텐츠'로 수정
- [x] `GEMINI.md` 내 플랫폼 정보를 React Native(Expo) + WebView 환경으로 구체화
- [x] 모바일 앱 환경(WebView)을 고려한 개발 방향성 재확인

- **종료 시각**: 17:45
- **관련 이슈/브랜치**: `fix/infra/platform-definition`

### 📝 비고
- 이 프로젝트는 독립적인 웹 서비스가 아니라 모바일 앱의 일부로 동작함을 모든 문서에 명시함.
- 향후 UI 설계 및 API 통신 시 WebView 환경의 특성(네이티브 브릿지, 성능 제한 등)을 고려해야 함.
