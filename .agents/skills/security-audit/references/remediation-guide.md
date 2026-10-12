# Next.js & Node.js Güvenlik Sıkılaştırma ve Yama Rehberi

Bu rehber, güvenlik taramasında tespit edilen yaygın açıkların nasıl giderileceğini gösteren pratik kod örneklerini içerir.

---

## 1. Next.js API Rotalarında Oturum ve Rol Doğrulama (Auth Guard)

Her `/api/admin/*` rotasının en başında token veya çerez doğrulaması yapılmalıdır:

```typescript
// Örnek: src/lib/auth/guard.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth/auth";

export async function requireAdminAuth(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  
  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Yetkisiz erişim: Giriş yapmanız gerekmektedir." },
        { status: 401 }
      ),
    };
  }

  const payload = await verifyJwtToken(token);
  if (!payload || !["ADMIN", "SUPER_ADMIN"].includes(payload.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Erişim reddedildi: Bu işlem için yönetici yetkisi gereklidir." },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user: payload };
}
```

Rota içinde kullanımı:

```typescript
// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth/guard";

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (!auth.authorized) return auth.response;

  // Güvenli işlem...
}
```

---

## 2. Next.js Güvenlik Başlıklarını (Security Headers) Eklemek

`next.config.ts` (veya `next.config.js`) dosyasına `headers()` fonksiyonunu ekleyin:

```typescript
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

---

## 3. Zod ile Girdi Doğrulama (Input Validation)

Tüm `POST` ve `PUT` istek gövdeleri Zod ile doğrulanmalıdır:

```typescript
import { z } from "zod";

const InquirySchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/),
  message: z.string().min(5).max(2000),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = InquirySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Geçersiz form verisi", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const cleanData = validation.data;
  // İşlem devam eder...
}
```

---

## 4. Güvenli Çerez (Cookie) Politikası

Kimlik doğrulama token'ı kullanıcıya set edilirken:

```typescript
const response = NextResponse.json({ success: true });
response.cookies.set({
  name: "admin_token",
  value: token,
  httpOnly: true, // XSS ile JavaScript tarafından okunamaz
  secure: process.env.NODE_ENV === "production", // Sadece HTTPS üzerinden iletilir
  sameSite: "lax", // CSRF saldırılarına karşı koruma
  maxAge: 60 * 60 * 24 * 7, // 7 gün
  path: "/",
});
return response;
```
