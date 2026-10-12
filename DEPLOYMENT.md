# KOKKIRI BUSINESS PLATFORM — DEPLOYMENT & OPERATION GUIDE

본 문서는 KOKKIRI 통합 비즈니스 플랫폼의 Docker 및 Coolify(쿠리파이) 클라우드 배포, 데이터베이스 설정, 외부 연동(SMTP / 카카오 알림톡) 가이드입니다.

---

## 1. 아키텍처 개요

- **프레임워크**: Next.js 16 (App Router, Standalone 모드)
- **런타임**: Node.js 22 (Alpine Linux 컨테이너)
- **데이터베이스**: PostgreSQL 16
- **ORM**: Prisma (22개 정규화 엔티티)
- **알림 엔진**:
  - Nodemailer (SMTP 이메일)
  - KakaoTalk Bizmessage Alimtalk Adapter (샌드박스 & 실운영)
  - DB 기반 재시도 작업 큐 (Exponential Backoff)
- **호스팅/오케스트레이션**: Coolify (Self-hosted PaaS) & Docker Compose
- **네트워크 / 프록시**: Cloudflare (Full SSL/TLS Strict)

---

## 2. 필수 환경 변수 체크리스트 (.env)

| 변수명 | 설명 | 예시 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 공식 서비스 도메인 | `https://kokkiri.com` |
| `DATABASE_URL` | PostgreSQL 접속 URI | `postgresql://user:pass@host:5432/kokkiri_db?schema=public` |
| `JWT_SECRET` | 관리자 세션 암호화 비밀키 | `고유의 64바이트 랜덤 해시 문자열` |
| `ADMIN_INIT_EMAIL` | 기본 슈퍼 관리자 이메일 | `admin@kokkiri.com` |
| `ADMIN_INIT_PASSWORD` | 기본 슈퍼 관리자 비밀번호 | `KokkiriAdmin2026!#` |
| `SMTP_HOST` | 발송 메일 서버 호스트 | `smtp.gmail.com` 또는 사내 SMTP |
| `SMTP_PORT` | 발송 포트 | `587` (TLS) / `465` (SSL) |
| `SMTP_SECURE` | 보안 연결 사용 여부 | `false` (587) / `true` (465) |
| `SMTP_USER` | 메일 계정 아이디 | `noreply@kokkiri.com` |
| `SMTP_PASS` | 메일 계정 앱 비밀번호 | `앱 전용 16자리 비밀번호` |
| `SMTP_FROM` | 발신자 표시 명칭 | `코끼리 비즈니스 플랫폼 <no-reply@kokkiri.com>` |
| `NOTIFICATION_RECEIVER_EMAILS` | 문의 알림을 받을 관리자 이메일 | `admin@kokkiri.com, ceo@kokkiri.com` |
| `KAKAO_API_URL` | 알림톡 제공업체 API 주소 | `https://api.bizmessage.kakao.com/v1` |
| `KAKAO_API_KEY` | 카카오 알림톡 인증 API Key | 발급받은 인증키 |
| `KAKAO_SENDER_KEY` | 비즈니스 채널 발신 프로필 키 | 발급받은 Sender Key |
| `KAKAO_TEST_MODE` | 테스트 모드 여부 | `true` (테스트 샌드박스) / `false` (실발송) |

---

## 3. Coolify(쿠리파이) 배포 가이드

### 단계 1: GitHub 저장소 연동
1. Coolify 대시보드 로그인 -> **Projects** -> **+ New Resource** 클릭
2. **Public / Private GitHub Repository** 선택 후 저장소 URL 지정
3. 브랜치: `main`

### 단계 2: 빌드 팩 설정
1. Build Pack: **Dockerfile** 선택
2. Dockerfile 경로: `./Dockerfile`
3. Port: `3000`

### 단계 3: PostgreSQL 데이터베이스 생성
1. Coolify 내에서 **PostgreSQL** 서비스를 생성하거나 외부에 준비된 DB 사용
2. 내부 네트워크 연결 문자열(`DATABASE_URL`)을 복사

### 단계 4: 환경 변수 등록
1. 애플리케이션의 **Environment Variables** 탭으로 이동
2. 위의 `필수 환경 변수 체크리스트`에 해당하는 항목을 입력
3. 저장 후 적용

### 단계 5: 도메인 및 Cloudflare 연동
1. **Domains** 설정에 `https://kokkiri.com` 등록
2. Cloudflare DNS 설정:
   - Type: `A`
   - Name: `@` (또는 서브도메인)
   - Content: 서버 공인 IP
   - Proxy status: `Proxied (오렌지 구름 활성화)`
3. Cloudflare SSL/TLS 암호화 모드: **Full (strict)** 설정

### 단계 6: 데이터베이스 마이그레이션 및 초기 시드
Coolify 애플리케이션 콘솔(Terminal) 또는 배포 스크립트에서 다음 명령을 실행합니다:
```bash
# Prisma 스키마를 데이터베이스에 동기화
npx prisma db push

# 관리자 계정, 3대 브랜드, 서비스, 제품 초기 데이터 생성
node scripts/seed.mjs
```

---

## 4. 로컬 Docker Compose 실행 가이드

로컬 머신 또는 단독 VPS에서 바로 실행할 경우:

```bash
# 1. 환경 변수 파일 복사 및 설정
cp .env.example .env

# 2. 컨테이너 빌드 및 백그라운드 실행
docker compose up -d --build

# 3. 데이터베이스 테이블 생성 및 시드
docker compose exec app npx prisma db push
docker compose exec app node scripts/seed.mjs

# 4. 상태 및 로그 확인
docker compose logs -f app
```

접속 주소:
- 공개 웹사이트: `http://localhost:3000`
- 관리자 로그인: `http://localhost:3000/admin/login` (초기 계정: `admin@kokkiri.com` / `KokkiriAdmin2026!#`)

---

## 5. 장애 복구 및 백업 절차 (Backup & Rollback)

### PostgreSQL 데이터베이스 백업
```bash
docker exec -t kokkiri-postgres pg_dumpall -c -U kokkiri_user > backup_$(date +%Y%m%d_%H%M%S).sql
```

### PostgreSQL 데이터베이스 복원
```bash
cat backup_xxxx.sql | docker exec -i kokkiri-postgres psql -U kokkiri_user -d kokkiri_db
```

### 롤백(Rollback) 절차
Coolify 대시보드 내 **Deployments** 목록에서 이전 정상 빌드 커밋을 선택한 후 **Redeploy**를 누르면 무중단 롤백이 진행됩니다.
