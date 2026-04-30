# A to Z Animals — Visual Identity & Color System

> 상태: **확정** → "컬러 확정" 시 globals.css @theme 블록에 적용

## 브랜드 컨셉

**"The Window into the Wild"** (야생을 보는 창)
National Geographic의 탐험적 정체성을 현대적 교육용 앱으로 재해석.
명확한 노란색 프레임과 고화질 동물 사진이 돋보이는 High-Contrast 배색.

---

## 1. Core Brand Color

| 이름 | HEX | 용도 |
|------|-----|------|
| **NG_YELLOW** | `#FFD700` | 브랜드 로고, 카드 프레임, 활성 인덱스(A-Z), 주요 CTA 버튼 |

---

## 2. Light & Dark Mode

| UI 요소 | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `#F2F2F2` (Cool Light Gray) | `#0A0A0A` (Pure Dark) |
| Surface (Card) | `#FFFFFF` (Pure White) | `#1A1A1A` (Elevation Gray) |
| Text (Primary) | `#111111` (Deep Black) | `#FFFFFF` (Pure White) |
| Text (Secondary) | `#555555` (Slate Gray) | `#A0A0A0` (Silver Gray) |
| Border/Divider | `#DDDDDD` | `#333333` |
| Overlay | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.05)` |

---

## 3. globals.css 적용 시 CSS 변수

```css
@theme {
  /* Brand */
  --color-primary: #FFD700;

  /* Light mode (default) */
  --color-background: #F2F2F2;
  --color-surface: #FFFFFF;
  --color-text: #111111;
  --color-text-muted: #555555;
  --color-border: #DDDDDD;
  --color-overlay: rgba(0, 0, 0, 0.05);
}

@custom-variant dark (&:is(.dark *)) {
  --color-background: #0A0A0A;
  --color-surface: #1A1A1A;
  --color-text: #FFFFFF;
  --color-text-muted: #A0A0A0;
  --color-border: #333333;
  --color-overlay: rgba(255, 255, 255, 0.05);
}
```
