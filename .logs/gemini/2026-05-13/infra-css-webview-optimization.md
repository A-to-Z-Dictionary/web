# 작업 기록: infra-css-webview-optimization

- **시작 시각**: 18:30
- **작업 목표**: globals.css를 모바일 WebView 환경에 최적화하고 표준 레이아웃 컨테이너 구축

### 📌 체크리스트
- [x] `globals.css` 내 WebView 최적화 스타일 적용 (터치 하이라이트 제거, 텍스트 선택 방지)
- [x] `body` 태그에 `env(safe-area-inset-*)`를 이용한 Safe Area 대응 패딩 추가
- [x] 모바일 뷰포트 고정(`100dvh`) 및 가로 스크롤 방지 설정
- [x] 데스크탑용 마우스 커서 스타일(`cursor: pointer`) 제거 및 네이티브 앱 느낌 구현
- [x] `.webview-container` 유틸리티 클래스 생성 (최대 너비 `sm` 제한 및 중앙 정렬)
- [x] Tailwind 테마 토큰에 Safe Area 변수(`--spacing-safe-*`) 등록

- **종료 시각**: 18:45
- **관련 이슈/브랜치**: `chore/infra/css-webview`

### 📝 비고
- 이제 모든 페이지 구성 시 최상위 부모 요소에 `.webview-container`를 적용하면 모바일 앱에 최적화된 레이아웃을 즉시 확보할 수 있음.
- `user-select: none` 적용으로 아이들이 조작 중 의도치 않게 텍스트가 선택되는 불편함을 제거함.
