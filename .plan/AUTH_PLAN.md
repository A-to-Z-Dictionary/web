# 부모 계정/자녀 프로필 인증 기반 Supabase 설계 Plan

## 요약

- `profiles`는 부모 계정의 인증/결제/법적 책임 정보를 담당하고, `child_profiles`는 자녀별 콘텐츠 맞춤 정보만 저장한다.
- PortOne 본인인증은 **V1 아임포트 `imp_uid` 검증 방식**으로 설계한다.
- Parental Gate는 **부모 계정 비밀번호 재입력**을 기본값으로 한다.
- 회원가입 직후 `auth.users` 생성 시 `public.profiles` 기본 레코드가 자동 생성되도록 Postgres Trigger를 포함한다.

## 핵심 변경

- Supabase 마이그레이션 추가:
  - `profiles`
    - `id uuid primary key references auth.users(id) on delete cascade`
    - `display_name text not null default ''`
    - `identity_verified boolean not null default false`
    - `identity_verified_at timestamptz`
    - `identity_provider text check (identity_provider in ('portone'))`
    - `phone_number text unique`
    - `phone_verified_at timestamptz`
    - `created_at`, `modified_at`
  - `child_profiles`
    - `id uuid primary key default gen_random_uuid()`
    - `parent_id uuid not null references profiles(id) on delete cascade`
    - `nickname text not null`
    - `birth_year smallint not null`
    - `avatar_preset text not null default 'default'`
    - `preferred_locale text not null default 'ko'`
    - `created_at`, `modified_at`
    - 자녀 개인정보 보호를 위해 이메일, 전화번호, 실명, 생년월일 전체는 저장하지 않음
  - `parent_gate_verifications`
    - `id uuid primary key default gen_random_uuid()`
    - `parent_id uuid not null references profiles(id) on delete cascade`
    - `action text not null check (action in ('child_profile_create', 'child_profile_delete', 'subscription_enter', 'subscription_cancel'))`
    - `verified_at timestamptz not null default now()`
    - `expires_at timestamptz not null`
- DB 함수/트리거:
  - `public.set_modified_at()` 공용 트리거 함수 생성
  - 세 테이블에 `modified_at` 자동 갱신 트리거 적용
  - `public.handle_new_user_profile()` 생성
  - `auth.users` insert 후 `public.profiles`에 기본 레코드 자동 생성
- RLS:
  - `profiles`: 부모 본인만 SELECT/INSERT/UPDATE 가능
  - `child_profiles`: `parent_id = auth.uid()`인 자녀 프로필만 SELECT 가능
  - 자녀 프로필 INSERT/UPDATE/DELETE는 초기에는 부모 본인 RLS로 허용하되, 앱 레이어에서는 Parental Gate 통과 후 서버 액션/RPC로만 호출
  - `parent_gate_verifications`: 부모 본인 SELECT만 허용, INSERT는 Edge Function의 service role만 수행

## Edge Function 구조

- `verify-portone-identity`
  - 입력: `{ imp_uid: string }`
  - 인증: 로그인된 사용자 JWT 필수
  - 환경변수:
    - `PORTONE_API_KEY`
    - `PORTONE_API_SECRET`
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY`
  - 흐름:
    - PortOne V1 토큰 발급 API 호출
    - `/certifications/{imp_uid}` 재조회
    - 인증 상태, `imp_uid`, 필요한 경우 전화번호 필드 유효성 검증
    - 성공 시 service role로 `profiles.identity_verified = true`, `identity_verified_at = now()`, `identity_provider = 'portone'`, 필요 시 `phone_number`, `phone_verified_at` 업데이트
    - 실패 시 DB 업데이트 없이 400/401 반환

- `verify-parent-gate`
  - 입력: `{ password: string, action: ParentGateAction }`
  - 인증: 로그인된 사용자 JWT 필수
  - 흐름:
    - JWT의 사용자 id와 이메일 확인
    - Supabase Auth password grant로 이메일/비밀번호 재검증
    - 반환된 user id가 현재 JWT 사용자 id와 같을 때만 성공 처리
    - 성공 시 `parent_gate_verifications`에 `expires_at = now() + interval '10 minutes'` 기록
    - 실패 시 기록 없이 401 반환
  - 후속 서버 액션/RPC는 민감 행동 실행 전, 해당 `action`에 대해 만료되지 않은 검증 기록이 있는지 확인한다.

## 타입/앱 연동

- 마이그레이션 적용 후 Windows PowerShell 기준으로 타입 재생성:
  - `npm run db:types`
- `src\types\database.types.ts` 갱신 후 `GenericTables<'profiles'>`, `GenericTables<'child_profiles'>` 형태로 사용한다.
- 프로필 전환 상태는 Zustand persist에 `active_child_id`로 저장한다.
- 앱 시작 시 자녀 프로필이 2개 이상이면 “누가 볼까요?” 화면으로 진입하고, 선택된 `child_profiles.birth_year`를 콘텐츠 난이도 조절의 기준값으로 사용한다.

## 검증

- DB 검증:
  - 신규 회원 생성 시 `public.profiles` 레코드가 자동 생성되는지 확인
  - 로그인한 부모가 본인 `profiles`만 조회/수정 가능한지 확인
  - 다른 부모의 `child_profiles` 조회가 RLS로 차단되는지 확인
  - `child_profiles`에 이메일/전화번호/실명 컬럼이 없는지 확인
  - `parent_gate_verifications.expires_at` 만료 기준이 동작하는지 확인
- Edge Function 검증:
  - 조작된 `imp_uid`로 `identity_verified`가 변경되지 않는지 확인
  - PortOne 검증 성공 시에만 부모 프로필 인증 상태가 변경되는지 확인
  - 잘못된 비밀번호로 Parental Gate 기록이 생성되지 않는지 확인
  - 올바른 비밀번호로 지정 action의 검증 기록이 생성되는지 확인
- 앱 검증:
  - 회원가입 직후 프로필 페이지 진입 시 “프로필 없음” 에러가 없어야 함
  - 자녀 프로필 추가/삭제, 구독 결제/해지 진입 전에 부모 비밀번호 재입력이 요구되어야 함
  - `active_child_id`가 새로고침/WebView 재진입 후에도 유지되어야 함

## 확정된 전제

- PortOne은 V1 아임포트 `imp_uid` 기반 검증으로 진행한다.
- Parental Gate 기본 방식은 부모 계정 비밀번호 재입력이다.
- 자녀 프로필에는 닉네임과 출생연도 중심의 비식별 정보만 저장한다.
- 실제 파일 작성은 다음 실행 단계에서 진행하며, 예상 위치는 `C:\Programming\project\A to Z Animals\web\supabase\migrations`, `C:\Programming\project\A to Z Animals\web\supabase\functions`이다.
