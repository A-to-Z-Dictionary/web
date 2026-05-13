# 코드 컨벤션

## 네이밍 규칙

| 대상            | 규칙             | 예시                                         |
| --------------- | ---------------- | -------------------------------------------- |
| 변수, 함수      | camelCase        | `userName`, `getUserData()`, `isLoading`     |
| 파일, 폴더 이름 | kebab-case       | `user-card.ts`, `api-client/`, `use-auth.ts` |
| 컴포넌트 이름   | PascalCase       | `UserCard`, `LoginForm`, `DashboardLayout`   |
| 상수            | UPPER_SNAKE_CASE | `MEMBER_LIST`                                |
| 타입/인터페이스 | PascalCase       | `interface Props`, `type User`               |

## 예외

- **컴포넌트 파일**: 컴포넌트 이름은 PascalCase이지만, 파일 이름은 kebab-case로 작성한다.
  - ex) `UserCard` 컴포넌트 → `user-card.tsx`

## 훅 (Hooks)

- 파일 이름: kebab-case → `use-auth.ts`
- 훅 함수 이름: camelCase → `useAuth()`

### `useEffect` 내부 단일 상태 보정

- `useEffect`에서 조건에 따라 `useState` setter를 단일로 호출해 상태를 보정해야 할 때는 `react-hooks/set-state-in-effect` lint 규칙을 해당 줄에서 비활성화한다.
- 이 패턴은 선택 가능한 값이 탭, 권한, 옵션 변경으로 더 이상 유효하지 않을 때 기본값으로 되돌리는 경우에만 사용한다.

```tsx
useEffect(() => {
  if (!options.includes(value)) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(DEFAULT_VALUE);
  }
}, [value, options]);
```

## 백엔드 및 데이터베이스 컨벤션

### 데이터베이스 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 테이블 이름 | 복수형 + 소문자 snake_case | `animals`, `user_favorites`, `search_logs` |
| 컬럼 이름 | 소문자 snake_case | `name_ko`, `created_at`, `image_url` |
| 인덱스 이름 | `idx_{테이블}_{컬럼}` | `idx_animals_category` |
| RLS 정책 이름 | 한국어 서술형 | `"누구나 동물 목록 조회 가능"` |
| 트리거 이름 | `{테이블}_{동작}` | `animals_modified_at` |
| RPC 함수 이름 | 소문자 snake_case 동사형 | `insert_user_favorite()` |

### 테이블 기본 구조

모든 테이블에 아래 컬럼을 기본으로 포함한다.

```sql
id         uuid PRIMARY KEY DEFAULT gen_random_uuid()
created_at timestamptz NOT NULL DEFAULT now()
modified_at timestamptz NOT NULL DEFAULT now()
```

### Server Action 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일 이름 | kebab-case | `get-animals.ts`, `create-favorite.ts` |
| 함수 이름 | camelCase 동사형 | `getAnimals()`, `createFavorite()` |
