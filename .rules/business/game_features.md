# 미니게임 & 게임 요소 기획

## 실루엣 퀴즈 ("무슨 동물일까요?")

### 구현 방법
- 기존 `image_url` 이미지에 CSS `filter: brightness(0)` → 실루엣
- 별도 데이터 수집 불필요

### 게임 흐름
```
1단계: 검은 실루엣만 표시
2단계: 힌트 1 — habitat 기반 ("초원에 살아요")
3단계: 힌트 2 — diet 기반 ("육식동물이에요")
4단계: 힌트 3 — tags 기반 ("갈기가 있어요")
정답 시: 동물 카드 언락 + 도감에 등록
```

### 힌트 자동 생성
기존 `tags`, `habitat`, `diet` 데이터로 힌트 자동 구성 — 별도 작업 없음

### 프리미엄 연동
- 무료: 하루 5판
- 프리미엄: 무제한

---

## 도감 시스템

- 퀴즈 정답 / 동물 상세 조회 시 도감에 등록
- 전체 동물 수 중 몇 마리 모았는지 진행률 표시
- 완성 보상: 배지 or 특별 카드

---

## 사운드 수집 전략 (Freesound.org)

### API 키 발급
- freesound.org/apiv2/apply/ — 무료

### 수집 방법
1. collect.ts에 Freesound 검색 추가
2. CC0 라이선스만 필터링 (상업 이용 완전 무료)
3. 후보 URL 자동 수집 → 직접 들어보고 sound_url 확정
4. Supabase Storage에 mp3 업로드 후 URL 교체

### 검색 쿼리 예시
```
lion → "lion roar"
elephant → "elephant sound"
tiger → "tiger growl"
wolf → "wolf howl"
```

### 없는 동물 대처
- 실제 소리 없으면 Supabase Storage에 "소리 없음" 표시
- 추후 직접 추가 또는 TTS로 동물 이름 읽어주기로 대체
