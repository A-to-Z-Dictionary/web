# Supabase 사용 주의사항

이 프로젝트는 Next.js App Router + Supabase 조합을 사용한다.
Supabase는 자동으로 처리해주지 않는 항목들이 있으므로 아래 사항을 반드시 직접 처리해야 한다.

## 인덱싱

- 자주 조회되는 컬럼에는 반드시 인덱스를 수동으로 추가한다.
- 특히 `category`, `slug`, `tags`, `diet` 등 필터/검색에 쓰이는 컬럼은 인덱스 필수.
- 배열 컬럼(`tags`, `habitat`)은 GIN 인덱스를 사용한다.

```sql
CREATE INDEX idx_animals_category ON animals(category);
CREATE INDEX idx_animals_slug ON animals(slug);
CREATE INDEX idx_animals_diet ON animals(diet);
CREATE INDEX idx_animals_tags ON animals USING GIN(tags);
CREATE INDEX idx_animals_habitat ON animals USING GIN(habitat);
```

## 동시성

- Supabase(PostgreSQL)는 기본적으로 낙관적 동시성 제어를 하지 않는다.
- 동시에 같은 row를 수정할 가능성이 있는 경우 `SELECT FOR UPDATE`로 락을 걸거나,
  `modified_at` 컬럼을 이용한 낙관적 잠금을 직접 구현해야 한다.
- 현재 프로젝트는 관리자만 데이터를 수정하므로 동시성 충돌 위험은 낮지만,
  추후 사용자 데이터(즐겨찾기, 학습 기록 등)가 생기면 반드시 고려할 것.

## 트랜잭션

- Supabase JS 클라이언트는 트랜잭션을 직접 지원하지 않는다.
- 여러 테이블을 동시에 수정해야 하는 경우 반드시 **Supabase RPC(PostgreSQL 함수)**로 처리한다.

```sql
-- 예시: 트랜잭션이 필요한 작업은 DB 함수로 정의
CREATE OR REPLACE FUNCTION some_atomic_operation(...)
RETURNS void AS $$
BEGIN
  -- 여러 INSERT/UPDATE를 하나의 트랜잭션으로 처리
END;
$$ LANGUAGE plpgsql;
```

```typescript
// 호출 방법
const { data, error } = await supabase.rpc('some_atomic_operation', { ... })
```

## Row Level Security (RLS)

- 테이블 생성 시 RLS를 반드시 활성화한다.
- 정책(Policy)을 명시적으로 정의하지 않으면 아무도 접근할 수 없다.
- 공개 데이터(동물 목록 등)는 `anon` 역할에 SELECT 정책을 추가한다.

```sql
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 동물 목록 조회 가능"
ON animals FOR SELECT
TO anon, authenticated
USING (true);
```

## N+1 쿼리 방지

- 관계 데이터를 가져올 때 반복 호출하지 말고 Supabase의 `select`에서 join을 활용한다.
- 목록 조회 시 필요한 컬럼만 명시적으로 select한다 (전체 컬럼 조회 지양).

## 기타

- `created_at`, `modified_at`은 모든 테이블에 기본으로 추가한다.
- Supabase Storage를 사용할 경우 버킷 정책도 RLS와 별도로 설정해야 한다.
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 `.env.local`에 관리한다.
