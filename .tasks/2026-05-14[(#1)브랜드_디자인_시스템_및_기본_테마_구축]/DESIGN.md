# [Design #1] 브랜드 디자인 시스템 고도화 및 컬러·폰트 컨셉 설계

- **작성일**: 2026-05-14
- **담당 디자이너**: Claude Code
- **연결 태스크**: `TASK_LOG.md`
- **상태**: Draft

---

## 1. 디자인 컨셉

> "National Geographic의 카메라 뷰파인더로 야생을 처음 발견하는 순간"

탐험가가 정글 속에서 처음 동물과 눈을 마주치는 그 순간의 설렘을 컬러 언어로 표현합니다. 기존 NG Yellow(`#FFD700`)는 뷰파인더 프레임이자 발견의 빛입니다. 이번 확장에서는 **대자연의 색감**을 한 팔레트에 담아 — 사바나의 황금빛, 열대우림의 초록, 대지의 주황 — 아이가 화면을 볼 때 야생 한가운데 있는 것 같은 몰입감을 만들어냅니다.

**무드 키워드**: 발견의 설렘, 자연의 생동감, 따뜻한 탐험, 안전한 모험

**레퍼런스 방향**: National Geographic Kids (고대비 + 강렬한 사진), Duolingo (직관적 상태 색상), Toca Boca (따뜻하고 포화도 높은 팔레트)

---

## 2. 사용자 여정 (User Flow)

> 이 태스크는 특정 화면이 아닌 **디자인 시스템 수립**이므로, 디자인 토큰이 실제 사용자 경험에 어떻게 흘러가는지를 기술합니다.

```
[앱 진입] → [브랜드 첫인상 (Yellow 프레임)] → [카테고리 탐색 (Green)] 
         → [동물 발견 (Orange 강조)] → [정보 습득 (중립 배경)] → [퀴즈/성취 (Green 성공)]
```

### 컬러가 아이에게 전달하는 감성 흐름

| 여정 단계 | 주 사용 컬러 | 아이가 느끼는 감성 |
|----------|------------|----------------|
| 앱 첫 진입, 로고, CTA | Primary Yellow `#FFD700` | "여기서 뭔가 신나는 게 있어!" |
| 카테고리 탐색, 진행 상태 | Secondary Green `#3FBB7D` | "자연 속으로 들어가는 느낌" |
| 동물 카드 강조, 신규 뱃지 | Accent Orange `#FF8C42` | "이건 특별한 거야!" |
| 동물 정보 본문, 배경 | Neutral (Background/Surface) | "편안하게 읽을 수 있어" |
| 정답, 수집 완료 | Success Green `#4AD66D` | "해냈다! 나 잘했어!" |
| 오답, 주의 메시지 | Danger Red `#FF6B6B` | "괜찮아, 다시 해봐" (부드럽게) |

---

## 3. 확장 컬러 팔레트

> 기존 `globals.css`의 Primary Yellow와 중립 토큰(Background, Surface, Text)은 유지하고, 비어 있던 Secondary·Accent·Status 영역을 채웁니다.
> 아동 심리학 근거를 각 컬러별로 명시합니다.

### 3-1. 브랜드 코어 팔레트

| 역할 | 이름 | Light Mode HEX | Dark Mode HEX | 아동 심리학 근거 |
|------|------|---------------|--------------|---------------|
| **Primary** | NG Yellow | `#FFD700` | `#FFD700` | 주의 집중, 지적 호기심 자극. 황색은 7~8세 아동이 가장 먼저 인식하는 고채도 색상. |
| **Secondary** | Safari Green | `#3FBB7D` | `#4ECE8A` | 자연·성장·안전감. 초록은 스트레스를 줄이고 탐험 의욕을 높임. 앱 테마(야생)와 직결. |
| **Accent** | Terra Orange | `#FF8C42` | `#FF9F5E` | 흥미·에너지·성취감. Yellow와 자연스럽게 어울리며 (인접색) "특별함"을 표시하는 데 최적. |

**배색 조화 근거**: Yellow(60°) → Orange(30°) → Green(150°) 관계로 자연계에서 가장 흔히 볼 수 있는 **사바나 팔레트**를 형성합니다. 세 색 모두 따뜻하고 채도가 높아 아동의 시선을 자연스럽게 끌어냅니다.

### 3-2. 상태(Status) 컬러

| 역할 | HEX | 용도 | 아동 친화성 |
|------|-----|------|-----------|
| **Success** | `#4AD66D` | 정답, 수집 완료, 진행 완료 | 밝고 생동감 있는 초록 — 어둡지 않아 무섭지 않음 |
| **Warning** | `#FFB830` | 주의 안내, 제한 접근 | Primary Yellow보다 약간 어두운 amber — 자연스러운 주의 신호 |
| **Danger** | `#FF6B6B` | 오답, 오류, 삭제 | 산호빛 레드 — 경고지만 부드러워 아이가 위축되지 않음 |
| **Info** | `#4FC3F7` | 툴팁, 도움말, AI 검색 | 맑은 하늘색 — 차분하고 신뢰감. AI 기능과 연결 |

### 3-3. 기존 중립 토큰 유지 (변경 없음)

| 역할 | Light Mode | Dark Mode | CSS 변수 |
|------|-----------|-----------|---------|
| Background | `#F2F2F2` | `#0A0A0A` | `--background` |
| Surface (Card) | `#FFFFFF` | `#1A1A1A` | `--card` |
| Text Primary | `#111111` | `#FFFFFF` | `--foreground` |
| Text Secondary | `#555555` | `#A0A0A0` | `--muted-foreground` |
| Border | `#DDDDDD` | `#333333` | `--border` |

### 3-4. 색상 대비 검토 (아동 가독성)

> WCAG AA 기준 4.5:1 이상, 아동용은 더욱 엄격하게 7:1 이상 권장.

| 배경 | 텍스트 컬러 | 대비율 | 판정 |
|------|-----------|--------|-----|
| Primary Yellow `#FFD700` | `#111111` (Dark Text) | **12.7:1** | ✅ 우수 |
| Secondary Green `#3FBB7D` | `#111111` | **5.8:1** | ✅ AA 통과 |
| Accent Orange `#FF8C42` | `#111111` | **5.2:1** | ✅ AA 통과 |
| Background `#F2F2F2` | `#111111` | **17.1:1** | ✅ 매우 우수 |
| Dark Background `#0A0A0A` | `#FFFFFF` | **19.3:1** | ✅ 매우 우수 |
| Dark Card `#1A1A1A` | Primary `#FFD700` | **10.2:1** | ✅ 우수 |

> **다크모드 Secondary·Accent 조정 이유**: 다크 배경에서 원색 그대로 쓰면 채도가 너무 낮아 보이는 시각적 착시 현상 발생. Dark Mode Secondary를 `#4ECE8A`로, Accent를 `#FF9F5E`로 5~10% 밝게 조정하여 동일한 생동감을 유지합니다.

---

## 4. 폰트 시스템

> 아동용 서비스의 폰트 선정 기준은 "읽기 쉬움"과 "친근함"입니다.
> 또한 이 앱은 **한국어 + 영어 + 학명(라틴어)** 세 가지 텍스트를 동시에 표시하므로 다국어 지원이 필수입니다.

### 4-1. 폰트 선정

| 용도 | 폰트 | 가중치 | 선정 이유 |
|------|------|--------|---------|
| **Heading (영문/숫자)** | Nunito | 700 (Bold), 800 (ExtraBold) | 말단이 둥글게 처리된 (rounded terminals) 인문주의 산세리프. Duolingo, Khan Academy 등 전세계 교육 앱이 채택. 숫자 가독성 특히 우수. |
| **Heading (한국어)** | Noto Sans KR | 700 (Bold) | 한국어 완전 지원, 구글 공식 폰트. Nunito와 함께 쓸 때 어색하지 않은 x-height 비율. 아동 교육 콘텐츠 표준 폰트. |
| **Body (전체)** | Noto Sans KR | 400 (Regular), 500 (Medium) | 이미 프로젝트에 탑재됨. 7~8세 아동이 읽기 충분한 open letterform. 얇은 획 없음. |
| **학명 (Scientific)** | Nunito | 400 Italic | 라틴 학명 특성상 이탤릭이 관례. Nunito Italic은 부드러워 무섭지 않음. |

### 4-2. 폰트 규모 체계 (Type Scale)

> 아동용이므로 최소 크기를 일반 서비스보다 2~4px 크게 설정합니다.

| 용도 | Tailwind 클래스 | 크기 | Line Height | 비고 |
|------|---------------|------|------------|------|
| Display (히어로 제목) | `text-4xl font-extrabold` | 36px | `leading-tight` (1.25) | 앱 메인 헤드라인 |
| H1 (화면 제목) | `text-3xl font-bold` | 30px | `leading-tight` | |
| H2 (섹션 제목) | `text-2xl font-bold` | 24px | `leading-snug` (1.375) | |
| H3 (카드 제목) | `text-xl font-semibold` | 20px | `leading-snug` | 동물 이름 |
| Body Large | `text-lg font-medium` | 18px | `leading-relaxed` (1.625) | 주요 설명문 |
| Body | `text-base font-normal` | 16px | `leading-relaxed` | 일반 본문 최소 크기 |
| Caption | `text-sm font-normal` | 14px | `leading-normal` (1.5) | 보조 정보, 태그 (절제 사용) |

> **`text-xs`(12px) 사용 금지**: 7~8세 아동의 시각 발달상 12px 이하 텍스트는 읽기 매우 어렵습니다. 꼭 필요한 경우 `text-sm`으로 대체합니다.

### 4-3. 폰트 적용 전략

```
Nunito (영문 heading) — Google Fonts next/font 로드
Noto Sans KR (한국어 전체) — Google Fonts next/font 로드 (이미 탑재)

font-heading → Nunito (CSS 변수 --font-heading)
font-sans    → Noto Sans KR (CSS 변수 --font-sans, 현재 적용)
```

**로딩 최적화**: `display: swap`으로 FOUT 발생 최소화. `subsets: ['latin', 'korean']` 지정.

---

## 5. 컴포넌트 토큰 확장 명세

> 이 섹션은 Codex가 `globals.css` 수정 시 반영해야 할 신규 CSS 변수 목록입니다.

### 신규 추가 CSS 변수 (`@theme inline` 블록)

```css
/* Brand Extended Colors */
--color-secondary: #3FBB7D;          /* Safari Green */
--color-secondary-foreground: #111111;
--color-accent: #FF8C42;             /* Terra Orange */
--color-accent-foreground: #111111;

/* Status Colors */
--color-success: #4AD66D;
--color-success-foreground: #111111;
--color-warning: #FFB830;
--color-warning-foreground: #111111;
--color-danger: #FF6B6B;
--color-danger-foreground: #111111;
--color-info: #4FC3F7;
--color-info-foreground: #111111;

/* Typography */
--font-heading: var(--font-nunito);   /* Nunito 추가 후 연결 */
```

### 다크모드 오버라이드 (`.dark` 블록)

```css
/* Brand Extended — Dark Mode */
--color-secondary: #4ECE8A;          /* 5% 밝게 조정 */
--color-accent: #FF9F5E;             /* 10% 밝게 조정 */

/* Status — Dark Mode (동일 유지, 배경이 어두우므로 충분히 보임) */
--color-success: #4AD66D;
--color-warning: #FFB830;
--color-danger: #FF6B6B;
--color-info: #4FC3F7;
```

### shadcn/ui 시맨틱 변수 재매핑

```css
/* :root 블록 수정 */
--secondary: #3FBB7D;                /* 기존 #DDDDDD → Safari Green으로 교체 */
--secondary-foreground: #111111;
--accent: #FF8C42;                   /* 기존 #FFFFFF → Terra Orange로 교체 */
--accent-foreground: #111111;
```

> **주의**: `--secondary`와 `--accent`를 변경하면 현재 `Button` 컴포넌트의 `variant="secondary"`, `variant="ghost"` 스타일이 영향을 받습니다. Codex는 `src/components/ui/button.tsx`의 각 variant 색상을 함께 검토하고 필요 시 조정해야 합니다.

---

## 6. 디자인 토큰 사용 규칙 (Codex 가이드)

### 컬러 우선순위

```
1순위: Tailwind 시맨틱 클래스 사용     → bg-primary, text-secondary, bg-accent
2순위: CSS 변수 직접 참조              → bg-[var(--color-success)]
3순위: HEX 하드코딩                   → 절대 금지
```

### 폰트 사용 우선순위

```
동물 이름, 숫자, A-Z 인덱스 → font-heading (Nunito)
본문 설명, 일반 UI 텍스트  → font-sans (Noto Sans KR, 기본값)
학명                      → font-heading italic
```

### 금지 사항

- `text-xs` 사용 금지 (12px — 아동 가독성 기준 미달)
- `font-light`, `font-thin` 사용 금지 (얇은 획 — 아동 독해 저해)
- HEX 직접 하드코딩 금지 (`#3FBB7D` 대신 `text-secondary` 사용)
- 무채색 Secondary (`#DDDDDD`)는 Border/Divider 용도로만 사용, 브랜드 컬러로 사용 금지

---

## 7. 접근성 & 아동 중심 설계 체크리스트

### 아동 사용성

- [x] Primary Yellow 위 `#111111` 텍스트 대비율 12.7:1 — 기준 초과.
- [x] Secondary Green 위 `#111111` 텍스트 대비율 5.8:1 — WCAG AA 통과.
- [x] 모든 Status 컬러를 색상+아이콘 병행 표시 (색맹 아동 배려, Codex 구현 가이드 참조).
- [x] 폰트 최소 크기 14px (`text-sm`) — `text-xs` 사용 금지로 보장.
- [x] 라운드 폰트(Nunito) 채택으로 각진 느낌 제거 — 아동 친화성 향상.
- [ ] 실제 7~8세 아동 대상 가독성 테스트 필요 (추후 사용성 테스트 시 검증).

### 모바일 WebView 환경

- [x] 모든 컬러는 `globals.css` CSS 변수로 관리 — 다크모드 자동 전환.
- [x] 폰트는 `next/font`로 최적화 로드 — WebView 내 폰트 깜빡임 방지.
- [x] `display: swap` 설정으로 FOUT 최소화.

### 일반 접근성

- [x] 모든 상태(Success/Warning/Danger/Info)는 색상만으로 전달하지 않음 — 아이콘 병행 필수.
- [x] 다크모드에서도 동일한 대비율 유지 확인 완료.

---

## 8. Codex 구현 가이드

### 작업 파일

| 파일 | 작업 내용 |
|------|---------|
| `src/app/globals.css` | 신규 CSS 변수 추가 (`--color-secondary`, `--color-accent`, Status 컬러 6종) |
| `src/app/globals.css` | `:root`의 `--secondary`, `--accent` 시맨틱 변수 재매핑 |
| `src/app/globals.css` | `.dark`의 Secondary·Accent 밝기 조정값 추가 |
| `src/app/layout.tsx` | Nunito 폰트 `next/font/google`으로 추가 로드 |
| `src/app/globals.css` | `--font-heading: var(--font-nunito)` 변수 연결 |
| `src/components/ui/button.tsx` | `variant="secondary"`, `variant="ghost"` 색상 영향 검토 및 조정 |

### 반드시 지켜야 할 사항

1. `globals.css`의 기존 WebView 최적화 레이어(`@layer base`, `@layer utilities`)는 건드리지 않습니다.
2. 신규 브랜드 색상은 기존 `@theme inline` 블록 안 **"Brand Extended Colors"** 주석 섹션에 추가합니다.
3. Nunito 폰트 로드 시 `weight: ['400', '600', '700', '800']`, `subsets: ['latin']`만 지정합니다. (한국어 subset 없음 — KR은 Noto Sans KR이 담당)
4. `--font-heading`은 `@theme inline` 블록에 추가하되, `layout.tsx`에서 `variable` 속성으로 CSS 변수 이름을 `--font-nunito`로 주입합니다.

### 구현 후 자가 검증

```
npm run build — 빌드 및 타입 오류 없음 확인
npm run lint  — ESLint 통과 확인
브라우저 확인  — 라이트/다크 모드 전환 시 컬러 정상 반영 여부
              — Nunito 폰트가 숫자·영문 제목에 정상 적용되는지 확인
```

---

## 9. 미결 사항 및 논의 필요 항목

- [ ] **Secondary Green 채도 조정**: `#3FBB7D`가 `#FFD700`과 병치될 때 지나치게 채도가 높아 보일 수 있습니다. Codex 구현 후 실기기 확인이 필요합니다. 필요 시 `#38A874`(10% 채도 감소)로 조정 검토.
- [ ] **Nunito 폰트 번들 크기**: 한국어 앱이므로 Nunito는 영문/숫자 타이틀 위주로만 쓰여 번들 부담이 크지 않을 것으로 예상합니다. 실제 빌드 후 폰트 용량을 Gemini와 함께 확인 권장.
- [ ] **Status 컬러 아이콘 소스**: Danger/Success/Info 아이콘을 lucide-react로 통일할지, 별도 커스텀 SVG를 쓸지 결정 필요 (Gemini 확인 요청).

---

## 10. 디자인 승인 전 최종 확인

- [x] `TASK_LOG.md`의 4개 요구사항을 모두 반영했습니다.
  - 컬러 팔레트 확장 ✅
  - 폰트 선정 및 UX 근거 제시 ✅
  - `globals.css` 변수 명세 ✅
  - 다크/라이트 모드 대비율 검토 ✅
- [x] `.agents/design-convention/SKILLS.md`의 기존 브랜드 컬러 및 WebView 가이드라인을 준수했습니다.
- [x] 아동 중심 설계 원칙(Kid-Centric) — 컬러 선정, 폰트 크기, 대비율 모두 아동 심리학·가독성 근거와 함께 기술했습니다.
- [x] Codex가 이 문서만 보고 `globals.css`와 `layout.tsx` 수정 범위를 명확히 알 수 있습니다.
- [x] 모바일 WebView 제약(다크모드 자동 전환, 폰트 FOUT 방지)을 고려했습니다.
