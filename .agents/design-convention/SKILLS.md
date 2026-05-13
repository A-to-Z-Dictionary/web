# A to Z Animals — Visual Identity & Color System

> 상태: **확정** → `src/app/globals.css` @theme 블록 적용 완료

## 브랜드 컨셉

**"The Window into the Wild"** (야생을 보는 창)
National Geographic의 탐험적 정체성을 현대적 교육용 앱으로 재해석.
명확한 노란색 프레임과 고화질 동물 사진이 돋보이는 High-Contrast 배색.

---

## 1. WebView 플랫폼 가이드라인 (중요)

이 프로젝트는 React Native(Expo) 앱 내의 **WebView**로 동작하므로, 네이티브 앱과 유사한 사용자 경험을 제공해야 합니다.

### Native-Like 상호작용
- **Hover 제거**: 모바일 환경에는 마우스 오버가 없으므로 `hover:` 클래스 사용을 지양하고, 대신 `active:` 또는 터치 피드백 위주로 스타일링합니다.
- **텍스트 선택 방지**: 사용자가 텍스트를 길게 눌러 복사 메뉴가 뜨는 것을 방지하기 위해 `select-none`을 기본 적용합니다.
- **스크롤 최적화**: 매끄러운 터치 스크롤을 위해 `-webkit-overflow-scrolling: touch` 속성을 활용합니다.
- **고정 레이아웃**: 상단 바나 하단 내비게이션은 `fixed` 또는 `sticky`를 사용하여 네이티브 앱의 고정된 UI 느낌을 유지합니다.

### Safe Area 관리
- 기기의 노치(Notch)나 하단 바에 UI가 가려지지 않도록 CSS 환경 변수(`env(safe-area-inset-*)`)를 패딩이나 마진에 적극 활용합니다.

---

## 2. Core Brand Color
...
| 이름 | HEX | 용도 |
|------|-----|------|
| **NG_YELLOW** | `#FFD700` | 브랜드 로고, 카드 프레임, 활성 인덱스(A-Z), 주요 CTA 버튼 |

---

## 2. Light & Dark Mode

| UI 요소 | Light Mode | Dark Mode | CSS 변수 |
|---------|-----------|-----------|----------|
| **Background** | `#F2F2F2` (Cool Light Gray) | `#0A0A0A` (Pure Dark) | `--background` |
| **Surface (Card)** | `#FFFFFF` (Pure White) | `#1A1A1A` (Elevation Gray) | `--surface` |
| **Text Primary** | `#111111` (Deep Black) | `#FFFFFF` (Pure White) | `--text` |
| **Text Secondary** | `#555555` (Slate Gray) | `#A0A0A0` (Silver Gray) | `--text-muted` |
| **Border/Divider** | `#DDDDDD` | `#333333` | `--border` |
| **Overlay** | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` | `--overlay` |

---

## 3. `cn` 유틸리티 사용 규칙

가독성을 최우선으로 하며, 인간이 읽기 편한 구조를 지향합니다.

1.  **단순 단일 라인**: 클래스 명이 짧고(약 40자 미만) 조건부가 없다면 `className="..."` 문자열을 직접 사용합니다.
2.  **가독성을 위한 그룹화 (필수)**: 클래스 명이 길거나(약 40자 이상) 복잡할 경우, 반드시 `cn()`을 사용하고 **논리적 단위(Layout, Sizing, Interactive 등)로 묶어 줄바꿈**을 적용합니다.

```tsx
// GOOD: 인간이 읽기 편한 그룹화 (40자 이상일 때 권장)
<div
  className={cn(
    "flex items-center gap-2",
    "w-full max-w-50 h-10",
    "bg-primary transition-all duration-200"
  )}
/>
```

---

## 4. Responsive Design (Mobile-First)

1.  **기본 원칙**: 모든 컴포넌트는 모바일 뷰(375px 내외)를 기본값으로 스타일링합니다.
2.  **점진적 확장**: Tailwind의 브레이크포인트 접두사(`sm:`, `md:`, `lg:`, `xl:`)는 스타일을 추가하거나 덮어쓰는 용도로만 사용합니다.

---

## 5. Spacing & Sizing

1.  **임의 값([ ]) 지양**: Tailwind의 임의 값 표현식(예: `min-h-[100px]`, `w-[45px]`) 사용을 지양합니다.
2.  **표준 단위 사용**: Tailwind의 기본 스페이싱 단위(4px = 1 unit)를 사용하여 수치를 계산합니다. (`100px` → `min-h-25`)

---

## 7. 이미지 및 미디어 최적화

- **WebP 포맷팅**: WebView의 제한된 메모리 효율을 위해 모든 이미지는 **WebP** 포맷 사용을 원칙으로 합니다.
- **next/image 활용**: Next.js의 `Image` 컴포넌트를 사용하여 자동 리사이징 및 Lazy Loading을 적용함으로써 초기 로딩 부하를 최소화합니다.
