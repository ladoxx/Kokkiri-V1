---
name: security-audit
description: >-
  Comprehensive security audit and vulnerability detection skill. Use whenever the user asks to
  inspect, audit, or detect security vulnerabilities, system weaknesses, secret leaks, dependency flaws,
  authentication bugs, OWASP Top 10 risks, or security misconfigurations in web applications, APIs,
  or system codebases.
---

# Security Audit & Vulnerability Detection Skill

A systematic, defensive security audit runbook designed to detect code-level vulnerabilities, secret exposures, broken access control (OWASP A01), injection sinks (OWASP A03), insecure dependencies, and security header misconfigurations in modern web applications and backend systems.

---

## 🎯 When to Activate This Skill
Trigger this skill whenever:
- The user asks to audit the system or codebase for security vulnerabilities ("sistem güvenliğini ve açıklarını tara", "security audit yap", "vulnerability scan", "penetration testing checklist").
- Before production deployments or major releases.
- Checking API authentication and authorization mechanisms.
- Verifying protection against secret leaks, injection flaws, or OWASP Top 10 vulnerabilities.

---

## 🚀 Step-by-Step Security Audit Workflow

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. OTOMATİK TARAMA (Automated Dependency & Static Code Scan)           │
│    • npm audit / CVE veritabanı kontrolü                               │
│    • node scripts/security-audit.js ile statik kod taraması            │
├────────────────────────────────────────────────────────────────────────┤
│ 2. ERİŞİM KONTROLÜ & YETKİLENDİRME AUDITİ (OWASP A01: Access Control)   │
│    • /api/admin/* ve /admin/* rotalarının oturum/token doğrulaması     │
│    • RBAC & IDOR açıklarının incelenmesi                               │
├────────────────────────────────────────────────────────────────────────┤
│ 3. GİZLİ VERİ & PAROLA SIZINTILARI (Secrets & Sensitive Data Leak)     │
│    • .gitignore kontrolleri (.env, credentials)                        │
│    • Hardcoded API key, private key, JWT secret taraması               │
├────────────────────────────────────────────────────────────────────────┤
│ 4. ENJEKSİYON & GÜVENSİZ SİNKLER (OWASP A03: Injection & XSS)          │
│    • eval(), new Function(), dangerouslySetInnerHTML                   │
│    • child_process.exec, raw SQL injection ($queryRawUnsafe)           │
├────────────────────────────────────────────────────────────────────────┤
│ 5. GÜVENLİK BAŞLIKLARI & SUNUCU MİMARİSİ (OWASP A05: Misconfiguration) │
│    • CSP, HSTS, X-Frame-Options, X-Content-Type-Options                │
│    • CORS yapılandırması & Rate Limiting                               │
├────────────────────────────────────────────────────────────────────────┤
│ 6. RAPORLAMA & İYİLEŞTİRME (Severity Rating & Remediation Plan)        │
│    • Critical / High / Medium / Low / Info sınıflandırması             │
│    • Doğrudan uygulanabilir yama kodları ve düzeltme adımları          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Otomatik Güvenlik Taraması Çalıştırma

Projeyi taramak için dahili güvenlik tarayıcısını çalıştırın:

```bash
# Proje kök dizininde:
npm run security:check
# veya
node scripts/security-audit.js
```

Bu tarayıcı şu alanları otomatik olarak inceler:
1. **Paket Güvenliği (Dependencies):** Bilinen CVE zafiyetleri ve yamalanmamış bağımlılıklar.
2. **Hardcoded Secrets:** Açıkta duran API anahtarları, özel anahtarlar, veritabanı şifreleri.
3. **Admin API Yetkilendirmesi:** Kimlik doğrulaması eksik olan kritik uç noktalar.
4. **Güvensiz Fonksiyonlar:** `eval`, `execSync`, `dangerouslySetInnerHTML`, `queryRawUnsafe`.
5. **HTTP Güvenlik Başlıkları:** CSP, Clickjacking, MIME-sniffing ve HSTS başlıkları.

---

## 2. Derinlemesine Manuel Kontrol Listesi

### A. Yetkilendirme & Rota Koruması (Broken Access Control - OWASP A01)
- [ ] `/api/admin/*` altındaki tüm `GET`, `POST`, `PUT`, `DELETE`, `PATCH` fonksiyonlarında oturum kontrolü (ör. `verifyToken(req)` veya `getServerSession()`) var mı?
- [ ] Yetkisiz kullanıcı doğrudan `/admin` URL'sine girdiğinde middleware tarafından `/admin/login` sayfasına yönlendiriliyor mu?
- [ ] Nesne ID'leri (IDOR) sorgulanırken, kullanıcının o veriye erişim yetkisi doğrulanıyor mu?

### B. Gizli Anahtarlar & Çevre Değişkenleri (Sensitive Data Exposure)
- [ ] `.gitignore` dosyası `.env`, `.env.local`, `.env.*` dosyalarını içeriyor mu?
- [ ] Git commit geçmişinde (`git log`) sızmış API anahtarları veya token'lar var mı?
- [ ] İstemci tarafına (browser) `NEXT_PUBLIC_` ön ekiyle gereksiz gizli anahtar açılmış mı? (Sadece herkese açık anahtarlar `NEXT_PUBLIC_` olmalıdır).

### C. Girdi Doğrulama & Enjeksiyon Engelleme (Input Validation & Injection - OWASP A03)
- [ ] Tüm form ve API girdileri **Zod** veya eşdeğeri bir şema ile doğrulanıyor mu?
- [ ] Dosya yükleme uç noktalarında MIME türü, dosya boyutu ve dosya uzantısı beyaz listesi (whitelist) kontrol ediliyor mu?
- [ ] Kullanıcı girdileri doğrudan shell komutlarına (`exec()`) veya dinamik JS çalıştırmalarına (`eval()`) giriyor mu?
- [ ] HTML çıktısı verirken XSS sanitizasyonu yapılıyor mu?

### D. Güvenlik Başlıkları & CORS (Security Headers & Hardening)
Next.js projelerinde `next.config.ts` veya `src/middleware.ts` içine aşağıdaki başlıklar eklenmelidir:
```typescript
// Örnek Güvenlik Başlıkları Yapılandırması:
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // Clickjacking koruması
  { key: 'X-Content-Type-Options', value: 'nosniff' }, // MIME sniffing koruması
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:;"
  }
];
```

### E. Brute Force & Rate Limiting (Kaba Kuvvet & DoS Koruması)
- [ ] Giriş formu (`/api/auth/login`) ve iletişim formu (`/api/inquiries`) üzerinde IP tabanlı istek sınırlama (Rate Limiting) var mı?
- [ ] Şifreler `bcrypt` veya `argon2` ile yeterli maliyet faktörüyle (cost factor >= 10) tuzlanıp (salt) özetleniyor mu?

---

## 3. Güvenlik Raporu Formatı (Çıktı Şablonu)

Bir denetim tamamlandığında bulguları kullanıcıya şu standart yapıda sunun:

```markdown
# 🛡️ Güvenlik Denetimi & Zafiyet Raporu

### 📊 Genel Güvenlik Skoru: [XX / 100]
- **Kritik (Critical):** X adet (Derhal Düzeltilmeli)
- **Yüksek (High):** X adet (Öncelikli)
- **Orta (Medium):** X adet (Planlanmalı)
- **Düşük (Low):** X adet (İyileştirme)

---

### 🚨 Tespit Edilen Zafiyetler & Çözüm Kodları

#### 1. [CRITICAL] [Zafiyet Başlığı]
- **Kategori:** OWASP A01 (Broken Access Control)
- **Konum:** `src/app/api/.../route.ts:XX`
- **Açıklama:** [Zafiyetin ne olduğu ve oluşturduğu risk]
- **Düzeltme (Patch):**
```typescript
// Güvenli kod örneği
```
```

---

## 4. Ek Kaynaklar & Referanslar
- [OWASP Top 10 Web Uygulama Güvenlik Kontrolleri](./references/owasp-top-10.md)
- [Next.js & Node.js Güvenlik Sıkılaştırma Rehberi](./references/remediation-guide.md)
