## 📌 개요 (Overview)
포트원(PortOne) 기반의 성인 실명 인증과 넷플릭스식 자녀 프로필 관리를 지원하기 위한 데이터베이스 스키마 및 마이그레이션 파일을 생성합니다.

## ✅ 작업 내용 (Tasks)
- [ ] `accounts` 테이블 설계 (부모 계정, 결제 상태, 실명 인증 여부 등 포함)
- [ ] `profiles` 테이블 설계 (자녀 프로필용: 이름, 연령대, 아바타 등)
- [ ] Supabase Auth 연동을 위한 외래키(Foreign Key) 설정 및 RLS(Row Level Security) 정책 초안 작성
- [ ] 위 내용을 반영하는 Supabase Migration SQL 파일 작성

## 🎯 기대 결과 (Expected Result)
- 데이터베이스에 부모 계정과 자녀 프로필을 1:N으로 관리할 수 있는 스키마가 성공적으로 반영되어야 합니다.
- Supabase Studio에서 마이그레이션이 정상적으로 적용되는 것을 확인해야 합니다.

## 🚨 참고 사항 (Additional Notes)
- **관련 정책**: `.rules/business/auth_strategy.md`, `.rules/supabase_convention.md`
- **의존성**: 포트원 결제 및 인증 정보가 추후 업데이트될 수 있으므로 `accounts` 테이블은 확장 가능하게 설계해야 합니다.