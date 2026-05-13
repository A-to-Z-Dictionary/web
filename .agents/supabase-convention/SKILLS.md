# Supabase 컨벤션

이 문서는 A to Z Animals 프로젝트에서 Supabase를 다룰 때 준수해야 하는 규칙입니다.

## 1. 데이터베이스 타입 동기화

데이터베이스 스키마 변경이 발생하면 반드시 로컬의 TypeScript 타입을 업데이트해야 합니다.

- **명령어**: `npm run types`
- **설명**: `package.json`에 정의된 스크립트를 사용하여 Supabase 프로젝트로부터 최신 타입을 가져옵니다.
- **주기**: 테이블 추가, 컬럼 수정, 함수(RPC) 생성 등 스키마 변화가 있을 때마다 즉시 실행하십시오.

## 2. 데이터베이스 변경과 Migration 최신화

프로젝트의 복잡도를 낮추고 신속한 개발을 위해 실제 적용은 Supabase 대시보드를 우선 활용합니다.

- **적용 방법**: Supabase 대시보드의 **SQL Editor**를 사용하여 테이블 생성, 수정, RPC 함수 정의 등을 수행하십시오.
- **기록 원칙**: SQL Editor로 적용한 스키마 변경은 작업 완료 전 반드시 `supabase/migrations`에 SQL 파일로 최신화합니다.
- **파일명**: `YYYYMMDDHHMMSS_작업_내용.sql` 형식으로 작성합니다.
- **주의**: migration 파일은 실제 적용된 SQL과 동등해야 하며, 이후 `npm run types`로 타입을 갱신합니다.

## 3. 기술적 주의사항 (성능 및 안전성)

### 인덱싱
- 자주 조회되는 컬럼에는 반드시 인덱스를 수동으로 추가한다.
- 필터/검색에 쓰이는 컬럼(`category`, `slug`, `tags`, `diet` 등)은 인덱스 필수.
- 배열 컬럼(`tags`, `habitat`)은 GIN 인덱스를 사용한다.

### 동시성 및 트랜잭션
- Supabase JS 클라이언트는 트랜잭션을 직접 지원하지 않으므로, 여러 테이블을 동시에 수정해야 하는 경우 반드시 **Supabase RPC(PostgreSQL 함수)**로 처리한다.
- 동시에 같은 row를 수정할 가능성이 있는 경우 `SELECT FOR UPDATE`로 락을 걸거나, `modified_at` 컬럼을 이용한 낙관적 잠금을 직접 구현한다.

### Row Level Security (RLS)
- 테이블 생성 시 RLS를 반드시 활성화한다 (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
- 정책(Policy)을 명시적으로 정의하지 않으면 아무도 접근할 수 없다.
- 공개 데이터는 `anon` 역할에 SELECT 정책을 추가한다. 정책 이름은 한국어 서술형으로 작성한다 (예: `"누구나 동물 목록 조회 가능"`).

### N+1 쿼리 방지
- 관계 데이터를 가져올 때 반복 호출하지 말고 Supabase의 `select`에서 join을 활용한다.
- 목록 조회 시 필요한 컬럼만 명시적으로 select한다.

## 4. 파일 및 함수 컨벤션

- **Client**: `src/lib/supabase/client.ts` 및 `server.ts`를 사용하여 데이터에 접근한다.
- **RPC 이름**: 소문자 snake_case 동사형 (예: `insert_user_favorite()`).
- **기본 컬럼**: 모든 테이블에 `id` (uuid), `created_at` (timestamptz), `modified_at` (timestamptz)를 기본으로 포함한다.
