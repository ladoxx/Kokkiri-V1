import { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/data/initial-data";
import { getStoredProducts } from "@/lib/data/products-store";
import { SITE_CONFIG } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  // 1. High Priority Hub Pages
  const mainHubRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/cleaning", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/koto", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/choko", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" as const },
  ];

  // 2. Core Service & Solution Pages
  const serviceRoutes = [
    { path: "/cleaning/services", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/cleaning/projects", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/cleaning/request-quote", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/koto/facility-management", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/koto/services", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/koto/security", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/koto/landscaping", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/koto/fence", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/koto/projects", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/koto/request-quote", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/projects", priority: 0.8, changeFrequency: "weekly" as const },
  ];

  // 3. Brand & Company Informational Pages
  const infoRoutes = [
    { path: "/about", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/brands", priority: 0.75, changeFrequency: "monthly" as const },
    { path: "/news", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/request-quote", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/choko/products", priority: 0.8, changeFrequency: "weekly" as const },
  ];

  // 4. Legal & Policy Pages
  const legalRoutes = [
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  // 5. Dynamic Products (combine initial data and stored data)
  const stored = getStoredProducts();
  const allProducts = Array.from(
    new Map([...PRODUCTS, ...stored].map((item) => [item.slug, item])).values()
  );

  const productRoutes = allProducts.map((prod) => ({
    path: `/choko/products/${prod.slug}`,
    priority: 0.75,
    changeFrequency: "weekly" as const,
  }));

  const allEntries = [
    ...mainHubRoutes,
    ...serviceRoutes,
    ...infoRoutes,
    ...productRoutes,
    ...legalRoutes,
  ];

  const now = new Date();

  return allEntries.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
