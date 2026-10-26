import fs from "fs";
import path from "path";
import { PRODUCTS as INITIAL_PRODUCTS, ProductItem } from "./initial-data";
import { analyzeAndGenerateNaverSeo, batchOptimizeProductsSeo } from "@/lib/seo/agent/naver-seo-agent";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

function ensureInitialized(): ProductItem[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(PRODUCTS_FILE)) {
      const content = fs.readFileSync(PRODUCTS_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Write initial products if not yet created
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), "utf-8");
    return INITIAL_PRODUCTS;
  } catch (err) {
    console.error("Error initializing products store:", err);
    return INITIAL_PRODUCTS;
  }
}

export function getStoredProducts(): ProductItem[] {
  return ensureInitialized();
}

export function getProductById(id: string): ProductItem | undefined {
  const items = getStoredProducts();
  return items.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): ProductItem | undefined {
  const items = getStoredProducts();
  return items.find((p) => p.slug === slug);
}

export function saveProduct(data: Partial<ProductItem> & { name: string; autoSeo?: boolean }): ProductItem {
  const items = [...getStoredProducts()];
  const existingIndex = data.id ? items.findIndex((p) => p.id === data.id) : -1;

  // Auto-run Naver SEO Agent if SEO fields are absent or autoSeo flag is true
  const shouldRunAutoSeo =
    data.autoSeo === true ||
    !data.metaTitle ||
    !data.metaDesc ||
    !data.keywords ||
    data.keywords.length === 0;

  let seoMeta = {
    metaTitle: data.metaTitle,
    metaDesc: data.metaDesc,
    keywords: data.keywords,
    seoScore: data.seoScore,
    seoGeneratedAt: data.seoGeneratedAt,
  };

  if (shouldRunAutoSeo) {
    const analysis = analyzeAndGenerateNaverSeo(data, {
      preserveExisting: !data.autoSeo,
    });
    seoMeta = {
      metaTitle: data.metaTitle || analysis.metaTitle,
      metaDesc: data.metaDesc || analysis.metaDesc,
      keywords: data.keywords && data.keywords.length > 0 ? data.keywords : analysis.keywords,
      seoScore: analysis.seoScore,
      seoGeneratedAt: analysis.generatedAt,
    };
  }

  if (existingIndex >= 0) {
    // Update
    const current = items[existingIndex];
    const updated: ProductItem = {
      ...current,
      ...data,
      slug: data.slug || current.slug,
      name: data.name || current.name,
      category: data.category || current.category,
      summary: data.summary || current.summary,
      description: data.description || current.description,
      mainImage: data.mainImage || current.mainImage,
      galleryImages: data.galleryImages || current.galleryImages,
      naverUrl: typeof data.naverUrl === "string" ? data.naverUrl.trim() : (data.naverUrl !== undefined ? data.naverUrl : current.naverUrl),
      coupangUrl: typeof data.coupangUrl === "string" ? data.coupangUrl.trim() : (data.coupangUrl !== undefined ? data.coupangUrl : current.coupangUrl),
      isFeatured: typeof data.isFeatured === "boolean" ? data.isFeatured : current.isFeatured,
      features: Array.isArray(data.features) ? data.features : (data.features !== undefined ? data.features : current.features),
      specs: Array.isArray(data.specs) ? data.specs : (data.specs !== undefined ? data.specs : current.specs),
      price: data.price !== undefined ? data.price : current.price,
      metaTitle: seoMeta.metaTitle || current.metaTitle,
      metaDesc: seoMeta.metaDesc || current.metaDesc,
      keywords: seoMeta.keywords || current.keywords,
      seoScore: seoMeta.seoScore !== undefined ? seoMeta.seoScore : current.seoScore,
      seoGeneratedAt: seoMeta.seoGeneratedAt || current.seoGeneratedAt,
    };
    items[existingIndex] = updated;
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(items, null, 2), "utf-8");
    return updated;
  } else {
    // Create new product
    const id = data.id || `prod-${Date.now()}`;
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, "-")
        .replace(/^-|-$/g, "") ||
      `prod-${Date.now()}`;

    const created: ProductItem = {
      id,
      slug,
      name: data.name,
      category: data.category || "친환경 라이프케어",
      summary: data.summary || "",
      description: data.description || "",
      features: Array.isArray(data.features) ? data.features : ["친환경 프리미엄 원료", "생분해성 포장"],
      specs: Array.isArray(data.specs) ? data.specs : [{ label: "원산지", value: "대한민국" }],
      mainImage: data.mainImage || "/images/products/choko-bamboo-paper.jpg",
      galleryImages: data.galleryImages || [],
      naverUrl: typeof data.naverUrl === "string" ? data.naverUrl.trim() : (data.naverUrl || ""),
      coupangUrl: typeof data.coupangUrl === "string" ? data.coupangUrl.trim() : (data.coupangUrl || ""),
      isFeatured: data.isFeatured ?? true,
      price: data.price,
      metaTitle: seoMeta.metaTitle,
      metaDesc: seoMeta.metaDesc,
      keywords: seoMeta.keywords,
      seoScore: seoMeta.seoScore,
      seoGeneratedAt: seoMeta.seoGeneratedAt,
    };
    items.unshift(created);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(items, null, 2), "utf-8");
    return created;
  }
}

export function deleteProduct(id: string): boolean {
  const items = getStoredProducts();
  const filtered = items.filter((p) => p.id !== id);
  if (filtered.length !== items.length) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
  return false;
}

export function batchOptimizeAllStoredProducts() {
  const items = getStoredProducts();
  const { optimized, report } = batchOptimizeProductsSeo(items);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(optimized, null, 2), "utf-8");
  return { products: optimized, report };
}
