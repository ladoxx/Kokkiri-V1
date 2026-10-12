# KOKKIRI BUSINESS PLATFORM (주식회사 코끼리 통합 비즈니스 플랫폼)

공간의 가치를 높이는 새로운 기준 — KOKKIRI (프리미엄 클리닝), KOTO (종합 시설관리 & 보안), CHOKO (에코 라이프케어 소비재)를 하나로 융합한 엔터프라이즈 풀스택 한국어 비즈니스 웹 플랫폼입니다.

---

## 🌟 핵심 특징

1. **완전한 한국어 환경 & Pretendard 타이포그래피**
   - 불필요한 영문/다국어 전환기 없이 100% 한국어 공식 비즈니스 인터페이스 제공
   - 웹폰트 Pretendard 및 3대 브랜드별 차별화된 컬러 시스템 적용
2. **3대 통합 브랜드 생태계**
   - **KOKKIRI**: 오피스, 사옥, 상업 공간, 대형 빌딩, 준공 후 특수 시설 클리닝
   - **KOTO**: 종합 시설관리(FM), 기계/전기/소방 예방 정비, 24시간 보안 경비, 기업 조경, 외곽 펜스 시공
   - **CHOKO**: 100% 대나무 화장지/타월, 비건 반려견 사료, 편백 피톤치드 탈취제
     - **외부 공식 채널 리다이렉트**: 네이버 스마트스토어 & 쿠팡 구매 버튼 연동 및 아웃바운드 클릭 분석 (자체 결제/장바구니 배제)
3. **중앙 관리자 센터 & 고객 CRM (`/admin`)**
   - Bcrypt + HTTP-Only JWT 기반 역할별 권한 제어 (SUPER_ADMIN, ADMIN, MANAGER, STAFF)
   - 실시간 인입 문의 검색, 필터링, 진행 상태 변경, 내부 업무 메모 기록
4. **자동화 알림 엔진 (SMTP & 카카오 알림톡)**
   - 문의 접수 즉시 관리자 HTML 이메일 알림 및 고객 접수 알림톡 전송
   - 지수 백오프(Exponential Backoff) 기반 백그라운드 재시도 큐
5. **프로덕션 레디 인프라**
   - SQLite 3 (Prisma ORM 기반 단일 파일 제로 설정 데이터베이스)
   - Docker Multi-stage Standalone 빌드 & Docker Compose 지원 (영구 볼륨 마운트)
   - Coolify, VPS, Cloudflare 연동 완벽 호환

---

## 🚀 빠른 시작 (Local Development)

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
```

### 3. 테스트 실행 (Vitest)
```bash
npm test
```

### 4. 개발 서버 시작
```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 접속

### 5. 관리자 로그인
- 접속 주소: `http://localhost:3000/admin/login`
- 기본 관리자 계정: `admin@kokkiri.com`
- 초기 비밀번호: `KokkiriAdmin2026!#`

---

## 📦 프로덕션 빌드 & Docker 배포

상세한 배포 및 Coolify 설정 가이드는 [DEPLOYMENT.md](file:///c:/Users/black/OneDrive/Desktop/company/own/DEPLOYMENT.md)를 참고하세요.

```bash
# 로컬 Docker Compose 구동
docker compose up -d --build
```
