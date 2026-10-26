# KOKKIRI BUSINESS PLATFORM — DEPLOYMENT & OPERATION GUIDE
# (주식회사 코끼리 비즈니스 플랫폼 배포 및 운영 가이드 / VPS Kurulum Rehberi)

본 문서는 KOKKIRI 통합 비즈니스 플랫폼의 Docker 및 Coolify(쿠리파이) 클라우드 배포, SQLite 데이터베이스 자동 하이드레이션, 외부 연동(SMTP / 카카오 알림톡) 가이드입니다.

---

## 1. 아키텍처 개요 (Architecture Overview)

- **프레임워크**: Next.js 16 (App Router, Standalone 프로덕션 모드)
- **런타임**: Node.js 22 (Alpine Linux 초경량 컨테이너)
- **데이터베이스**: SQLite 3 (Prisma ORM 기반 내장형 무설정 데이터베이스 - 별도 DB 컨테이너 불필요)
- **자동 초기화**: Docker 빌드 시 스키마 자동 동기화(`prisma db push`) 및 데이터베이스 시딩(`db:seed`) 완료 후 템플릿화
- **볼륨 자동 복구**: 컨테이너 최초 실행 시 영구 볼륨이 비어있으면 템플릿에서 자동 하이드레이션 (`docker-entrypoint.sh`)
- **알림 엔진**:
  - Nodemailer (SMTP 이메일)
  - KakaoTalk Bizmessage Alimtalk Adapter (샌드박스 & 실운영)
- **호스팅/오케스트레이션**: Coolify (Self-hosted PaaS) 또는 Docker Compose
- **네트워크 / 프록시**: Direct IP 또는 Cloudflare (Full SSL/TLS Strict)

---

## 2. 필수 환경 변수 체크리스트 (.env)

| 변수명 | 기본값 / 권장값 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://<서버IP>:3000` 또는 `https://kokkiri.com` | 공식 서비스 도메인 또는 서버 공인 IP |
| `DATABASE_URL` | `file:/app/prisma/kokkiri.db` | SQLite 데이터베이스 파일 경로 (수정 불필요) |
| `COOKIE_SECURE` | `false` (IP 접속 시) / `true` (HTTPS 도메인 연결 시) | 관리자 로그인 쿠키 보안 플래그 |
| `JWT_SECRET` | `kokkiri-super-secret-jwt-key-...` | 관리자 세션 암호화 비밀키 (랜덤 문자열 권장) |
| `ADMIN_INIT_EMAIL` | `admin@kokkiri.com` | 최초 최고 관리자 로그인 이메일 |
| `ADMIN_INIT_NAME` | `최고 관리자` | 관리자 성명 |
| `ADMIN_INIT_PASSWORD` | `KokkiriAdmin2026!#` | 최초 최고 관리자 비밀번호 |
| `SMTP_HOST` | `smtp.mailtrap.io` 또는 사내 SMTP | 발송 메일 서버 호스트 |
| `SMTP_PORT` | `587` | 발송 포트 (587 TLS / 465 SSL) |
| `SMTP_SECURE` | `false` | 보안 연결 사용 여부 (587: false, 465: true) |
| `SMTP_USER` | `noreply@kokkiri.com` | 메일 계정 아이디 |
| `SMTP_PASS` | `앱 비밀번호` | 메일 계정 비밀번호 |
| `SMTP_FROM` | `코끼리 비즈니스 플랫폼 <no-reply@kokkiri.com>` | 발신자 표시 명칭 |
| `NOTIFICATION_RECEIVER_EMAILS` | `admin@kokkiri.com` | 신규 문의 알림을 수신할 이메일 |
| `KAKAO_API_URL` | `https://api.bizmessage.kakao.com/v1` | 알림톡 제공업체 API 주소 |
| `KAKAO_API_KEY` | (선택) | 카카오 알림톡 인증 API Key |
| `KAKAO_SENDER_KEY` | (선택) | 비즈니스 채널 발신 프로필 키 |
| `KAKAO_TEST_MODE` | `true` | 테스트 샌드박스(실발송 안 됨) / `false` (실발송) |

---

## 3. Coolify(쿠리파이) 배포 가이드 (Coolify Deployment)

### 단계 1: GitHub 저장소 연동
1. Coolify 대시보드 로그인 -> **Projects** -> **+ New Resource** 클릭
2. **Public / Private GitHub Repository** 선택 후 저장소 URL 지정 (`https://github.com/ladoxx/Kokkiri-V1.git`)
3. 브랜치: `main`

### 단계 2: 빌드 팩 설정
1. Build Pack: **Dockerfile** 선택
2. Dockerfile 경로: `./Dockerfile`
3. Port: `3000`

### 단계 3: 영구 볼륨(Persistent Storage) 설정
Coolify 애플리케이션의 **Storages** (또는 Persistent Storage) 메뉴에서 데이터 유실 방지를 위한 볼륨을 추가합니다:
- **Prisma DB 볼륨**: Destination `/app/prisma`
- **CMS 데이터 볼륨**: Destination `/app/data`
- **업로드 미디어 볼륨**: Destination `/app/public/uploads`

*(컨테이너가 처음 시작될 때 `docker-entrypoint.sh`가 빈 볼륨을 감지하고 빌드 시점에 생성된 DB 및 CMS 템플릿을 자동으로 채워 넣습니다.)*

### 단계 4: 환경 변수 등록
Coolify의 **Environment Variables** 탭에 다음 기본값을 입력합니다:
```env
NEXT_PUBLIC_SITE_URL=http://<서버공인IP>:3000
DATABASE_URL=file:/app/prisma/kokkiri.db
COOKIE_SECURE=false
ADMIN_INIT_EMAIL=admin@kokkiri.com
ADMIN_INIT_PASSWORD=KokkiriAdmin2026!#
```

### 단계 5: 접속 방식 설정

#### 옵션 A: 도메인 없이 직접 IP 주소로 접속하는 경우 (Flexible Direct IP)
1. Coolify **Domains** 입력란을 **비워두거나** `http://<서버공인IP>:3000` 입력.
2. Coolify **Configuration** -> **Network** 에서 **Port Mappings** 항목에 `3000:3000` 입력.
3. `COOKIE_SECURE=false` 필수.
4. 브라우저에서 `http://<서버공인IP>:3000/admin/login` 접속 가능.

#### 옵션 B: 정식 도메인 및 Cloudflare 연동 시
1. **Domains** 설정에 `https://your-domain.com` 등록.
2. Cloudflare DNS 설정: A 레코드 -> 서버 공인 IP (Proxy 켜짐).
3. Cloudflare SSL: **Full (strict)**.
4. 환경 변수: `COOKIE_SECURE=true`, `NEXT_PUBLIC_SITE_URL=https://your-domain.com`.

---

## 4. 로컬 및 VPS Docker Compose 실행 가이드 (Docker Compose)

VPS 터미널에서 `docker compose`로 직접 운영하는 경우:

```bash
# 1. 환경 변수 파일 생성
cp .env.example .env

# 2. 도메인 또는 IP에 맞게 .env 수정 (nano .env)
# NEXT_PUBLIC_SITE_URL="http://서버공인IP:3000"

# 3. 빌드 및 백그라운드 실행
docker compose up -d --build

# 4. 실시간 로그 확인
docker compose logs -f web
```

- **웹사이트 접속**: `http://<서버IP>:3000`
- **관리자 로그인**: `http://<서버IP>:3000/admin/login`
- **기본 관리자 계정**:
  - 아이디(이메일): `admin@kokkiri.com` (또는 .env의 `ADMIN_INIT_EMAIL`)
  - 비밀번호: `KokkiriAdmin2026!#` (또는 .env의 `ADMIN_INIT_PASSWORD`)

---

## 5. 데이터베이스 백업 및 복원 (SQLite)

별도의 데이터베이스 서버 설치나 복잡한 SQL 덤프 없이 파일 복사만으로 1초 만에 안전하게 백업 및 복원할 수 있습니다:

### 데이터베이스 백업
```bash
docker compose exec web cp /app/prisma/kokkiri.db /app/data/kokkiri_backup_$(date +%Y%m%d_%H%M%S).db
```

### 관리자 웹 패널을 통한 백업
관리자 센터 (`/admin/updates`)의 **스냅샷 & 롤백** 메뉴를 통해 마우스 클릭 한 번으로 모든 CMS 데이터와 데이터베이스의 스냅샷을 생성하고 즉시 복원할 수 있습니다.
