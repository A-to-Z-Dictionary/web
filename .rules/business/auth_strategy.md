# 인증 전략

## 결론: 이메일 아이디 + 한국 본인인증 분리

휴대폰 번호를 아이디로 쓰면 번호 변경 시 계정 이전 로직이 복잡해진다.
→ **이메일을 아이디로 사용하고, 본인인증은 별도 서비스로 처리**하는 방식이 현실적이다.

---

## 인증 구조

```
회원가입: 이메일 + 비밀번호 (Supabase Auth)
본인인증: 아래 서비스 중 택1 (1회성 또는 선택적)
소셜 로그인: 카카오 / 네이버 OAuth (Supabase OAuth)
```

---

## 한국 본인인증 서비스 비교

| 서비스 | 방식 | 특징 | 비용 |
|--------|------|------|------|
| **NICE 본인인증** | 통신사 인증 (가장 보편적) | 금융/쇼핑몰 표준, 법적 효력 | 건당 약 70~100원 |
| **PASS 인증** | SKT/KT/LGU+ 공동 앱 | 앱 설치 필요, 간편함 | 계약 필요 |
| **카카오 인증** | 카카오톡 인증서 | 카카오 사용자에 친숙 | 계약 필요 |
| **Solapi (솔라피)** | SMS OTP | 구현 쉬움, 법적 효력 낮음 | 건당 약 9~15원 |
| **NHN Cloud SMS** | SMS OTP | 국내 대형 클라우드 | 건당 약 9원 |
| **알리고** | SMS OTP | 저렴, 소규모에 적합 | 건당 약 8원 |

### MVP 단계 추천
- **Solapi 또는 알리고** — SMS OTP로 빠르게 구현
- 정식 출시 후 **NICE 본인인증**으로 업그레이드

---

## 휴대폰 번호 변경 처리

번호를 아이디로 쓰지 않아도 저장은 해야 한다. 변경 시:

1. 새 번호로 OTP 인증 완료
2. DB의 `phone_number` 업데이트
3. 기존 번호로 변경 알림 SMS 발송 (선택)

```sql
-- users 테이블에 추가
phone_number        text UNIQUE
phone_verified_at   timestamptz
```

---

## Supabase Auth 연동 계획

| 기능 | 방법 |
|------|------|
| 이메일 회원가입/로그인 | Supabase Auth 기본 제공 |
| 카카오 OAuth | Supabase OAuth Provider |
| 네이버 OAuth | Supabase OAuth Provider |
| SMS OTP | Solapi API 직접 연동 or Supabase Phone Auth (Twilio) |
| 본인인증 (NICE) | 별도 서버사이드 연동 |
