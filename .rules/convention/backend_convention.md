# 백엔드 컨벤션

## 데이터베이스 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 테이블 이름 | 복수형 + 소문자 snake_case | `animals`, `user_favorites`, `search_logs` |
| 컬럼 이름 | 소문자 snake_case | `name_ko`, `created_at`, `image_url` |
| 인덱스 이름 | `idx_{테이블}_{컬럼}` | `idx_animals_category` |
| RLS 정책 이름 | 한국어 서술형 | `"누구나 동물 목록 조회 가능"` |
| 트리거 이름 | `{테이블}_{동작}` | `animals_modified_at` |
| RPC 함수 이름 | 소문자 snake_case 동사형 | `insert_user_favorite()` |

## 테이블 기본 구조

모든 테이블에 아래 컬럼을 기본으로 포함한다.

```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
created_at timestamptz NOT NULL DEFAULT now()
modified_at timestamptz NOT NULL DEFAULT now()
```

## Server Action 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일 이름 | snake_case | `get_animals.ts`, `create_favorite.ts` |
| 함수 이름 | camelCase 동사형 | `getAnimals()`, `createFavorite()` |

## 파일 구조

```
src/
  actions/          -- Server Actions
    animals/
      get_animals.ts
      get_animal_by_slug.ts
  lib/
    supabase/
      client.ts     -- 클라이언트 컴포넌트용
      server.ts     -- 서버 컴포넌트/액션용
```
