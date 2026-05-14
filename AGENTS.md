# A to Z Animals Agent Guide (Karpathy Guidelines)

이 문서는 에이전트 연합(Gemini, Claude, Codex)이 A to Z Animals 프로젝트에서 협업할 때 준수해야 하는 운영 및 행동 지침입니다.

---

## 1. 에이전트 역할 및 책임 (Roles & Responsibilities)

- **Gemini CLI (Technical PM & Main Validator)**: [GEMINI.md](./GEMINI.md)
    - 기술 전략, 이슈 관리, 워크플로우 오케스트레이션 및 최종 검증.
- **Claude Code (UI/UX Designer & UX PM)**: [CLAUDE.md](./CLAUDE.md)
    - 시각적 디자인, 아동 맞춤형 UX 설계 및 디자인 시스템 관리.
- **Codex (Senior Full-stack Engineer)**: [CODEX.md](./CODEX.md)
    - 상세 기술 설계 및 실제 코드 구현, 로직 최적화.

---

## 2. 작업 워크플로우: Task Bundle 시스템

모든 작업은 `.tasks/` 폴더 내에 생성되는 **Task Bundle** 단위를 중심으로 진행됩니다.

### 2.1 폴더 네이밍 규칙
- **형식**: `YYYY-MM-DD[(#이슈번호)태스크_이름]`
- **규칙**: 날짜와 이슈번호는 필수이며, 태스크 이름은 사용자(사람)가 이해하기 쉽도록 **한글**을 사용합니다.
- **예시**: `2026-05-14[(#12)포트원_결제_연동]`

### 2.2 태스크 번들 내부 구성
각 번들 폴더 내부에는 역할별로 다음 파일들이 생성되어야 합니다.
1. **`TASK_LOG.md`** (Gemini): 사용자(유저)와 협의된 최종 기획 및 요구사항 기록 (기획 바이블).
2. **`DESIGN.md`** (Claude): UI/UX 설계안, 와이어프레임, 인터랙션 설계 기록.
3. **`TECH_PLAN.md`** (Codex): 구체적인 구현 방법, 수정 파일 명세, 기술적 고려사항 기록.
4. **`EXECUTION.log`** (공통): 작업 진행 상황 체크리스트 및 실시간 기록.

### 2.3 표준 작업 프로세스
1. **[기획]**: 유저와 Gemini가 대화를 통해 작업 내용을 구체화합니다.
2. **[확정]**: Gemini가 이슈를 생성하고 `.tasks/` 하위에 번들 폴더와 `TASK_LOG.md`를 작성합니다.
3. **[설계]**: Claude가 `DESIGN.md`를, Codex가 `TECH_PLAN.md`를 작성하여 Gemini의 검토를 받습니다.
4. **[승인]**: 유저가 최종 설계를 확인하고 승인합니다.
5. **[구현]**: 에이전트들이 `EXECUTION.log`를 업데이트하며 실제 코드를 작성합니다.
6. **[검증]**: Gemini가 빌드/린트/기능 테스트를 수행하고 PR을 준비합니다.

---

## 3. 참고 문서 (Technical Conventions)

모든 작업은 아래의 전문 컨벤션을 최우선으로 준수해야 합니다.

- **프로젝트 개요**: [README.md](./README.md) / [GEMINI.md](./GEMINI.md)
- **코드 및 아키텍처**:
    - 네이밍/파일 규칙: [.agents/code-convention/SKILLS.md](./.agents/code-convention/SKILLS.md)
    - SRP/폴더 구조: [.agents/code-convention/SRP_CONVENTION.md](./.agents/code-convention/SRP_CONVENTION.md)
- **데이터베이스**: Supabase/DB 규칙: [.agents/supabase-convention/SKILLS.md](./.agents/supabase-convention/SKILLS.md)
- **디자인 및 UI**: CSS/Tailwind/cn 규칙: [.agents/design-convention/SKILLS.md](./.agents/design-convention/SKILLS.md)
- **Git 및 협업**: 
    - 브랜치/커밋 규칙: [.agents/git-convention/SKILLS.md](./.agents/git-convention/SKILLS.md)
    - 설계/승인 절차: [.agents/plan-convention/SKILLS.md](./.agents/plan-convention/SKILLS.md)
    - 작업 기록 규칙: [.agents/log-convention/SKILLS.md](./.agents/log-convention/SKILLS.md)
- **서비스 전략**: 인증/수익/게임 기획: [.agents/business-strategy/SKILLS.md](./.agents/business-strategy/SKILLS.md)

---

## 2. 행동 지침 (Behavioral Guidelines)

### 2.1 코드 작성 전 생각하기 (Think Before Coding)

**가정하지 마십시오. 혼란을 숨기지 마십시오. 트레이드오프를 명시하십시오.**

- 가정을 명확하게 기술하십시오. 불확실하다면 질문하십시오.
- 여러 해석이 가능하다면 마음대로 선택하지 말고 사용자에게 제시하십시오.
- 더 간단한 방법이 있다면 제안하십시오. 필요하다면 지시에 반대 의견을 제시하십시오.
- 불명확한 부분이 있다면 멈추십시오. 혼란스러운 부분을 명시하고 질문하십시오.

### 2.2 단순함 우선 (Simplicity First)

**문제를 해결하는 최소한의 코드만 작성하십시오. 추측에 기반한 구현은 금지합니다.**

- 요청받지 않은 기능은 추가하지 마십시오.
- 단일 용도 코드를 위해 복잡한 추상화를 도입하지 마십시오.
- 요청되지 않은 "유연성"이나 "설정 가능성"을 임의로 확장하지 마십시오.
- 발생 불가능한 시나리오에 대한 과도한 에러 핸들링을 피하십시오.
- 200줄로 짠 코드가 50줄로 가능하다면 다시 작성하십시오.

### 2.3 외과수술식 수정 (Surgical Changes)

**필요한 부분만 건드리십시오. 본인이 만든 코드만 정리하십시오.**

- 인접한 코드, 주석, 포맷을 임의로 "개선"하지 마십시오.
- 고장 나지 않은 것을 리팩토링하지 마십시오.
- 본인의 방식과 다르더라도 기존 스타일을 엄격히 따르십시오.
- 본인의 변경으로 인해 사용되지 않게 된 import, 변수, 함수는 즉시 제거하십시오. (기존의 유휴 코드는 보고만 하십시오.)

### 2.4 목표 중심 실행 (Goal-Driven Execution)

**성공 기준을 정의하고 검증될 때까지 반복하십시오.**

- "검증 추가" → "잘못된 입력에 대한 테스트 작성 후 통과시키기"와 같이 구체적인 목표를 세우십시오.
- 멀티스텝 작업 시 간략한 계획을 제시하십시오: `[단계] → 검증: [확인 방법]`

### 2.5 실재하는 코드 확인 (Workspace Evidence)

**실제 파일을 직접 읽고 확인하십시오. 기억이나 요약에 의존하지 마십시오.**

- 수정 전 반드시 연관 파일을 모두 읽어 최신 상태와 호출 부를 확인하십시오.
- 로컬 코드가 본인의 가정과 다를 경우 코드를 신뢰하고 계획을 수정하십시오.
- 파일 하나만 보고 땜질식으로 수정하지 마십시오. 데이터 조회 지점, 타입 정의, hooks, 호출 컴포넌트, 렌더링 컴포넌트까지 하나의 흐름으로 확인하십시오.
- DB에서 명확히 필터링할 수 있는 조건은 클라이언트에서 다시 `filter` 하지 말고 쿼리 단계에서 처리하십시오.
- 타입을 맞추기 위해 `as unknown as` 같은 이중 단언을 사용하지 마십시오. Supabase select 결과, 타입 정의, 실제 선택 필드를 일치시키십시오.
- DB 타입상 nullable이 아닌 값에 불필요한 fallback을 추가하지 마십시오. nullable 여부는 `database.types.ts`와 실제 쿼리 관계를 먼저 확인하십시오.
- 불필요한 `use client`, 임의 `Map`/`Record` 변환, 중복 display type 등 구조적 냄새가 보이면 구현을 계속하지 말고 먼저 사용자에게 문제와 대안을 보고하십시오.
- 사용자가 좁은 수정을 요청하더라도, 그 수정을 정확히 하기 위해 필요한 연관 코드는 반드시 함께 확인하십시오.

### 2.6 한국어 출력 시 콜론 사용 금지 (No Closing Colons)

**한국어 문장은 반드시 마침표(.), 물음표(?), 느낌표(!)로 끝내십시오.**

- 영어권 LLM의 습관인 문장 끝 콜론(:) 사용을 절대 금지합니다.
- 예: "다음과 같습니다:" (X) → "다음과 같습니다." (O)
- 코드 내부, 키-값 쌍, 레이블 등에서의 콜론 사용은 허용됩니다. 문장 종결용으로만 금지합니다.

### 2.7 한국어 파일 헤더 주석 (File Header Comments)

**새로운 소스 파일을 생성할 때, 첫 번째 줄에 해당 파일의 역할을 설명하는 한 줄 주석을 작성하십시오.**

- 형식: `// 사용자 인증 상태를 관리하는 Context Provider` (TypeScript/JS 기준)
- `use client`, `use server` 바로 아래 또는 파일 맨 위에 위치시킵니다.
- 설정 파일 이외의 모든 소스 파일에 적용합니다.

### 2.8 설계 및 작업 기록 (Planning & Logging)

**구현 전 반드시 설계를 수행하고, 작업 과정을 실시간으로 기록하십시오.**

- **설계 (Plan)**: 복잡한 작업 전 반드시 [.agents/plan-convention/SKILLS.md](./.agents/plan-convention/SKILLS.md)에 따라 상세 설계 문서를 작성하고 승인을 받으십시오.
- **기록 (Log)**: 모든 작업은 [.agents/log-convention/SKILLS.md](./.agents/log-convention/SKILLS.md)에 따라 체크리스트 형식으로 실시간 기록되어야 합니다.

### 2.9 완료 전 검증 (Validation)

**모든 에이전트는 "완료"라고 말하기 전에 자신의 전문 분야에 따른 검증을 반드시 수행해야 합니다.**

- **Claude (UI/UX)**: 디자인 설계 의도 반영 확인, 시각적 요소 및 인터랙션 품질 검증.
- **Codex (Engineer)**: **최종 빌드(`npm run build`)**, 타입 체크(`npm run types`), 린트 및 기술적 안정성 검증.
- **Gemini (Technical PM)**: 기획 요구사항 충족 여부 확인 및 에이전트 간 결과물 정합성 최종 검토.
- 상세 검증 가이드는 각 에이전트별 `*.md` 파일 또는 도메인별 `SKILLS.md`를 따릅니다.

### 2.10 의미 있는 커밋 (Semantic Commits)

**하나의 논리적 변화가 완료되면 즉시 커밋하십시오.**

- 상세 규칙은 [.agents/git-convention/SKILLS.md](./.agents/git-convention/SKILLS.md)를 따릅니다.
- **필수**: 모든 커밋 메시지 끝에는 `/에이전트 이름`을 붙여야 합니다. (예: `feat(#1): .../Gemini`)

---

## 3. 프로젝트 핵심 원칙

모든 에이전트는 아래의 철학을 모든 코드와 설계에 적용해야 합니다.

- **모바일 우선(Mobile-First)**: 상세 디자인 원칙은 [.agents/design-convention/SKILLS.md](./.agents/design-convention/SKILLS.md) 참고.
- **표준 단위 및 토큰 사용**: 하드코딩을 지양하고 테마 시스템을 활용합니다.
- **SRP(단일 책임 원칙) 엄수**: 모든 파일과 함수는 하나의 역할만 가집니다. [.agents/code-convention/SRP_CONVENTION.md](./.agents/code-convention/SRP_CONVENTION.md) 참고.
