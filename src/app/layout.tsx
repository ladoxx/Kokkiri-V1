import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_CONFIG, getOrganizationSchema, getLocalBusinessSchema } from "@/lib/seo/config";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "KOKKIRI | 시설관리·청소·보안·조경 전문기업",
    template: "%s | KOKKIRI",
  },
  description:
    "KOKKIRI(주식회사 코끼리)는 수도권 사업장을 위한 시설관리, 정기 청소, 4K AI CCTV 보안, 조경 관리, 펜스 시공 및 친환경 에코 제품을 제공하는 종합 비즈니스 플랫폼입니다.",
  keywords: [
    "KOKKIRI",
    "코끼리",
    "주식회사 코끼리",
    "시설관리",
    "청소",
    "정기청소",
    "병원청소",
    "건물청소",
    "사무실청소",
    "상가청소",
    "특수청소",
    "보안",
    "경비",
    "조경",
    "펜스",
    "울타리",
    "친환경제품",
    "비건사료",
    "대나무화장지",
    "대나무티슈",
    "일회용타월",
    "파주청소",
    "일산청소",
    "고양청소",
    "김포시설관리",
    "서울시설관리",
  ],
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.publisher,
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    title: "KOKKIRI | 시설관리·청소·보안·조경 전문기업",
    description: "공간의 가치를 높이는 새로운 기준 — 청소, 시설관리, AI 보안, 조경, 친환경 라이프케어 통합 기업 플랫폼",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}${SITE_CONFIG.defaultOgImage}`,
        width: 1200,
        height: 630,
        alt: "KOKKIRI 공식 비즈니스 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOKKIRI | 시설관리·청소·보안·조경 전문기업",
    description: "청소, 시설관리, AI 보안, 조경, 친환경 라이프케어 통합 기업 플랫폼",
    images: [`${SITE_CONFIG.url}${SITE_CONFIG.defaultOgImage}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
        ? { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION }
        : {}),
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#173F30",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const localBusinessSchema = getLocalBusinessSchema();

  return (
    <html lang="ko">
      <head>
        <JsonLd data={[organizationSchema, localBusinessSchema]} />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#F8F8F4] text-[#202622]">
        {children}
      </body>
    </html>
  );
}
