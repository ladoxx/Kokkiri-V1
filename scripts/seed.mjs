import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BRANDS, SERVICES, PROJECTS, PRODUCTS, NEWS_LIST, COMPANY_INFO } from "../src/lib/data/initial-data.ts";

const RoleType = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
};

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting KOKKIRI database seeding...");

  // 1. Initial Admin User
  const adminEmail = process.env.ADMIN_INIT_EMAIL || "admin@kokkiri.com";
  const adminPassword = process.env.ADMIN_INIT_PASSWORD || "KokkiriAdmin2026!#";
  const adminName = process.env.ADMIN_INIT_NAME || "최고 관리자";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      role: RoleType.SUPER_ADMIN,
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: RoleType.SUPER_ADMIN,
      phone: "010-1234-5678",
      isActive: true,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Brands
  for (const b of BRANDS) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        nameKo: b.nameKo,
        slogan: b.slogan,
        description: b.description,
        primaryColor: b.primaryColor,
        secondaryColor: b.secondaryColor,
        surfaceColor: b.surfaceColor,
      },
      create: {
        slug: b.slug,
        name: b.name,
        nameKo: b.nameKo,
        slogan: b.slogan,
        description: b.description,
        primaryColor: b.primaryColor,
        secondaryColor: b.secondaryColor,
        surfaceColor: b.surfaceColor,
      },
    });

    // 3. Services under Brand
    const brandServices = SERVICES.filter((s) => s.brandSlug === b.slug);
    for (const s of brandServices) {
      await prisma.service.upsert({
        where: { slug: s.slug },
        update: {
          title: s.title,
          subtitle: s.subtitle,
          summary: s.summary,
          description: s.description,
          features: s.features,
          isFeatured: s.isFeatured,
          order: s.order,
        },
        create: {
          brandId: brand.id,
          slug: s.slug,
          title: s.title,
          subtitle: s.subtitle,
          summary: s.summary,
          description: s.description,
          features: s.features,
          isFeatured: s.isFeatured,
          order: s.order,
        },
      });
    }

    // 4. Projects under Brand
    const brandProjects = PROJECTS.filter((p) => p.brandSlug === b.slug);
    for (const p of brandProjects) {
      const existing = await prisma.project.findFirst({
        where: { title: p.title },
      });
      if (!existing) {
        await prisma.project.create({
          data: {
            brandId: brand.id,
            title: p.title,
            category: p.category,
            client: p.client,
            location: p.location,
            completedDate: p.completedDate,
            summary: p.summary,
            description: p.description,
            coverImage: p.coverImage,
            galleryImages: [],
            isFeatured: p.isFeatured,
            isVisible: true,
          },
        });
      }
    }
  }
  console.log("✅ Brands, Services, and Projects seeded");

  // 5. CHOKO Products & Categories
  for (const prod of PRODUCTS) {
    let cat = await prisma.productCategory.findUnique({
      where: { slug: prod.category.toLowerCase().replace(/\s+/g, "-") },
    });
    if (!cat) {
      cat = await prisma.productCategory.create({
        data: {
          name: prod.category,
          slug: prod.category.toLowerCase().replace(/\s+/g, "-"),
          description: `${prod.category} 카테고리`,
        },
      });
    }

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        summary: prod.summary,
        description: prod.description,
        categoryId: cat.id,
        naverUrl: prod.naverUrl,
        coupangUrl: prod.coupangUrl,
        isFeatured: prod.isFeatured,
      },
      create: {
        slug: prod.slug,
        name: prod.name,
        summary: prod.summary,
        description: prod.description,
        categoryId: cat.id,
        mainImage: prod.mainImage,
        galleryImages: prod.galleryImages,
        detailsJson: {
          features: prod.features,
          specs: prod.specs,
        },
        naverUrl: prod.naverUrl,
        coupangUrl: prod.coupangUrl,
        isFeatured: prod.isFeatured,
        isVisible: true,
      },
    });
  }
  console.log("✅ CHOKO Products seeded");

  // 6. News Posts
  for (const n of NEWS_LIST) {
    await prisma.post.upsert({
      where: { slug: n.slug },
      update: {
        title: n.title,
        excerpt: n.excerpt,
        content: n.content,
        category: n.category,
      },
      create: {
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt,
        content: n.content,
        category: n.category,
        isPublished: true,
      },
    });
  }
  console.log("✅ News posts seeded");

  // 7. Site Settings
  for (const [key, val] of Object.entries(COMPANY_INFO)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: val },
      create: { key, value: val, category: "company" },
    });
  }
  console.log("✅ Company settings seeded");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
