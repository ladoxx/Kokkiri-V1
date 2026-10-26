import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/data/initial-data";

export const SITE_CONFIG = {
  name: "KOKKIRI",
  corporateName: "주식회사 코끼리",
  fullName: "KOKKIRI (주식회사 코끼리)",
  slogan: "공간의 가치를 높이는 새로운 기준",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://kokkiri.com",
  defaultOgImage: "/brand/kokkiri-elephant-logo.png",
  locale: "ko_KR",
  author: "주식회사 코끼리",
  publisher: "주식회사 코끼리",
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  naverVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
  
  // Real company details from project data
  businessNumber: COMPANY_INFO.businessNumber,
  ceo: COMPANY_INFO.ceo,
  phone: COMPANY_INFO.phone,
  email: COMPANY_INFO.email,
  quoteEmail: COMPANY_INFO.quoteEmail,
  address: COMPANY_INFO.address,
  operatingHours: COMPANY_INFO.operatingHours,
  emergencyPhone: COMPANY_INFO.emergencyPhone,

  // Service regions (Local SEO)
  serviceRegions: [
    "파주",
    "문산",
    "운정",
    "일산",
    "고양",
    "김포",
    "서울",
    "경기도",
  ],
};

export interface PageSeoProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Builds Next.js App Router metadata object with canonical, OG, Twitter, and verification
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage,
  ogType = "website",
  noIndex = false,
}: PageSeoProps): Metadata {
  const canonicalUrl = `${SITE_CONFIG.url}${path === "/" ? "" : path}`;
  const image = ogImage || SITE_CONFIG.defaultOgImage;
  const fullImageUrl = image.startsWith("http") ? image : `${SITE_CONFIG.url}${image}`;

  const defaultKeywords = [
    "코끼리",
    "KOKKIRI",
    "시설관리",
    "청소",
    "정기청소",
    "사무실청소",
    "건물청소",
    "병원청소",
    "상가청소",
    "특수청소",
    "보안",
    "경비",
    "조경",
    "펜스",
    "울타리",
    "친환경제품",
    "CHOKO",
    "KOTO",
    "대나무화장지",
    "비건사료",
    "파주청소",
    "일산청소",
    "고양시설관리",
    "김포시설관리",
  ];

  const mergedKeywords = Array.from(new Set([...keywords, ...defaultKeywords]));

  return {
    title,
    description,
    keywords: mergedKeywords,
    authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.publisher,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: ogType,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@kokkiri_official",
    },
  };
}

/**
 * Organization Schema.org JSON-LD
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.fullName,
    alternateName: ["KOKKIRI", "코끼리", "주식회사 코끼리"],
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/brand/kokkiri-elephant-logo.png`,
    description: SITE_CONFIG.slogan,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address,
      addressCountry: "KR",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE_CONFIG.phone,
        contactType: "customer service",
        areaServed: "KR",
        availableLanguage: ["Korean"],
      },
    ],
  };
}

/**
 * LocalBusiness Schema.org JSON-LD
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.url}/#localbusiness`,
    name: SITE_CONFIG.fullName,
    image: `${SITE_CONFIG.url}/brand/kokkiri-elephant-logo.png`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address,
      addressLocality: "Seoul",
      addressRegion: "Seoul",
      addressCountry: "KR",
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: SITE_CONFIG.serviceRegions.map((region) => ({
      "@type": "AdministrativeArea",
      name: region,
    })),
  };
}

/**
 * Service Schema.org JSON-LD
 */
export interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  providerName?: string;
  areaServed?: string[];
}

export function getServiceSchema({
  name,
  description,
  serviceType,
  url,
  providerName = SITE_CONFIG.fullName,
  areaServed = SITE_CONFIG.serviceRegions,
}: ServiceSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: `${SITE_CONFIG.url}${url}`,
    provider: {
      "@type": "Organization",
      name: providerName,
      url: SITE_CONFIG.url,
    },
    areaServed: areaServed.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
  };
}

/**
 * BreadcrumbList Schema.org JSON-LD
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: SITE_CONFIG.url,
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/**
 * Product Schema.org JSON-LD
 */
export interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  brandName?: string;
  url: string;
  price?: string | number;
  priceCurrency?: string;
  naverUrl?: string;
  coupangUrl?: string;
  inStock?: boolean;
}

export function getProductSchema({
  name,
  description,
  image,
  sku,
  brandName = "CHOKO (주식회사 코끼리)",
  url,
  price,
  priceCurrency = "KRW",
  naverUrl,
  coupangUrl,
  inStock = true,
}: ProductSchemaProps) {
  const fullImageUrl = image.startsWith("http") ? image : `${SITE_CONFIG.url}${image}`;
  const sameAs = [naverUrl, coupangUrl].filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: fullImageUrl,
    sku,
    brand: {
      "@type": "Brand",
      name: brandName,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.url}${url}`,
      priceCurrency,
      ...(price !== undefined && price !== "" ? { price: String(price) } : {}),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_CONFIG.fullName,
        url: SITE_CONFIG.url,
      },
    },
  };
}

/**
 * FAQPage Schema.org JSON-LD
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
