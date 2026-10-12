# OWASP Top 10 Güvenlik Kontrol Listesi

Bu referans dokümanı, web uygulamaları ve API'lar için temel OWASP Top 10 kategorilerini ve her biri için pratik denetim adımlarını açıklar.

---

## A01:2021 - Broken Access Control (Bozuk Erişim Kontrolü)
- **Risk:** Yetkisiz kullanıcıların ayrıcalıklı sayfalara veya verilere erişebilmesi.
- **Denetim:**
  - Tüm `/admin` sayfalarının istemci ve sunucu tarafında doğrulanması.
  - API uç noktalarında `Authorization: Bearer <token>` veya HTTP-only cookie oturum doğrulaması.
  - Nesne ID'si üzerinden yapılan sorgularda (IDOR) veri sahibinin kontrol edilmesi.

## A02:2021 - Cryptographic Failures (Kriptografik Hatalar)
- **Risk:** Hassas verilerin açık metin veya zayıf şifrelemeyle saklanması/iletilmesi.
- **Denetim:**
  - Parolaların `bcrypt` veya `argon2` ile hash'lenmesi (asla MD5 veya SHA1 kullanılmamalı).
  - Tüm bağlantıların HTTPS üzerinden zorlanması (HSTS başlığı).
  - JWT secret anahtarlarının en az 256-bit karmaşıklıkta olması.

## A03:2021 - Injection (Enjeksiyon)
- **Risk:** SQL, NoSQL, OS Command ve XSS enjeksiyonları.
- **Denetim:**
  - Veritabanı sorgularında Prisma veya ORM parametreli sorguların kullanılması (`$queryRawUnsafe` kaçınılmalı).
  - Kullanıcı girdilerinin kabuk komutlarına (`exec`, `spawn`) doğrudan eklenmemesi.
  - React tarafında `dangerouslySetInnerHTML` kullanılmaması veya `DOMPurify` ile arındırılması.

## A04:2021 - Insecure Design (Güvensiz Tasarım)
- **Risk:** Güvenlik gereksinimlerinin mimari aşamada göz ardı edilmesi.
- **Denetim:**
  - Hassas formlara rate-limit (istek sınırlama) konulması.
  - Hata mesajlarında sunucu stack trace veya iç veritabanı yollarının gösterilmemesi.

## A05:2021 - Security Misconfiguration (Güvenlik Yanlış Yapılandırması)
- **Risk:** Varsayılan parolalar, açık bırakılmış debug uç noktaları, eksik güvenlik başlıkları.
- **Denetim:**
  - `X-Frame-Options: SAMEORIGIN` (Clickjacking engelleme).
  - `X-Content-Type-Options: nosniff` (MIME sniffing engelleme).
  - `Content-Security-Policy` (CSP) tanımlanması.
  - Üretim ortamında ayrıntılı hata ayıklama (debug) bayraklarının kapatılması.

## A06:2021 - Vulnerable and Outdated Components (Güvensiz & Eski Bileşenler)
- **Risk:** Bilinen CVE zafiyetlerine sahip npm/pip paketleri.
- **Denetim:**
  - Düzenli `npm audit` çalıştırılması.
  - Bakımı bırakılmış veya güvenilmez üçüncü taraf kütüphanelerin kaldırılması.

## A07:2021 - Identification and Authentication Failures (Kimlik & Kimlik Doğrulama Hataları)
- **Risk:** Zayıf parola politikası, oturum sabitleme (session fixation), kaba kuvvet saldırılarına açık giriş.
- **Denetim:**
  - Giriş uç noktalarında kaba kuvvet (brute-force) gecikmesi veya IP kısıtlaması.
  - Çıkış yapıldığında oturum çerezinin sunucuda geçersiz kılınması (`Max-Age=0`).
  - Çerezlerde `HttpOnly`, `Secure` ve `SameSite=Lax/Strict` bayraklarının zorunlu tutulması.

## A08:2021 - Software and Data Integrity Failures (Yazılım & Veri Bütünlüğü Hataları)
- **Risk:** Doğrulanmamış CDN veya harici script kaynaklarının çalıştırılması.
- **Denetim:**
  - Dış script yüklemelerinde Subresource Integrity (SRI) hash'leri kullanılması.
  - CI/CD hatlarında imzasız paketlerin engellenmesi.

## A09:2021 - Security Logging and Monitoring Failures (Güvenlik Günlüğü & İzleme Hataları)
- **Risk:** Güvenlik olaylarının (başarısız girişler, yetki aşımları) kaydedilmemesi.
- **Denetim:**
  - Başarısız giriş denemelerinin ve şüpheli isteklerin loglanması.
  - Loglara parola, kredi kartı veya kişisel verilerin açık yazılmaması.

## A10:2021 - Server-Side Request Forgery (SSRF)
- **Risk:** Sunucunun kullanıcı kontrolündeki URL'lere doğrulanmadan istek atması.
- **Denetim:**
  - Harici URL alan API uç noktalarında IP aralıklarının (127.0.0.1, 169.254.169.254, özel LAN) engellenmesi.
  - URL şemasının yalnızca `https:` ile sınırlandırılması.
