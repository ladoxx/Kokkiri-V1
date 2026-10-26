/**
 * KOKKIRI SEO Comprehensive Audit Script
 * Runs with: npm run seo:check
 */

const fs = require('fs');
const path = require('path');

console.log('\n======================================================');
console.log('🔍 KOKKIRI SEO & SEMANTIC AUDIT SYSTEM');
console.log('======================================================\n');

let totalErrors = 0;
let totalWarnings = 0;

// 1. Scan Public Route Pages
function getPages(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      getPages(full, list);
    } else if (file === 'page.tsx') {
      list.push(full);
    }
  }
  return list;
}

const publicPages = getPages('src/app/(public)');
console.log(`📄 Checking ${publicPages.length} public route pages...`);

const titlesMap = new Map();
const pageResults = [];

for (const p of publicPages) {
  const content = fs.readFileSync(p, 'utf8');
  const normalizedPath = p.split(path.sep).join('/');
  const relPath = normalizedPath
    .replace('src/app/(public)', '')
    .replace(/\/page\.tsx$/, '') || '/';

  // Handle Redirect pages (e.g., redirect("/contact"))
  if (/redirect\(['"`]/.test(content)) {
    pageResults.push({
      relPath,
      title: '↪️ Redirect page (Route stub to /contact)',
      status: '✅ PASS',
      errors: [],
      warnings: [],
    });
    continue;
  }

  // Title Extraction
  const titleRegex = /title:\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/;
  const titleMatch = content.match(titleRegex);
  const title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3]) : null;

  // Description Extraction
  const descRegex = /description:\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`)/;
  const descMatch = content.match(descRegex);
  const description = descMatch ? (descMatch[1] || descMatch[2] || descMatch[3]) : null;

  // H1 Tag Check
  const h1Matches = content.match(/<h1[\s>]/g) || [];
  // For home page, H1 is inside HeroSection component
  const hasH1 = h1Matches.length > 0 || (relPath === '/' && /HeroSection/.test(content));
  const multipleH1 = h1Matches.length > 1;

  // Canonical / Metadata Builder Check
  const hasMetaBuilder = /buildPageMetadata/.test(content);

  // Structured Data Check
  const hasJsonLd = /<JsonLd[\s>]/.test(content);

  // Error checks
  const errors = [];
  const warnings = [];

  if (!title) {
    errors.push('Missing SEO Title');
  } else {
    if (titlesMap.has(title)) {
      errors.push(`Duplicate Title with ${titlesMap.get(title)}`);
    } else {
      titlesMap.set(title, relPath);
    }
  }

  if (!description) {
    errors.push('Missing Meta Description');
  }

  if (!hasH1) {
    errors.push('Missing H1 heading');
  }

  if (multipleH1) {
    warnings.push(`Multiple H1 headings detected (${h1Matches.length})`);
  }

  if (!hasMetaBuilder) {
    errors.push('Does not use centralized buildPageMetadata');
  }

  if (!hasJsonLd) {
    warnings.push('Missing page-level JSON-LD structured data');
  }

  if (errors.length > 0) totalErrors += errors.length;
  if (warnings.length > 0) totalWarnings += warnings.length;

  pageResults.push({
    relPath,
    title: title ? title.slice(0, 35) + '...' : '❌ NONE',
    status: errors.length === 0 ? '✅ PASS' : '❌ FAIL',
    errors,
    warnings,
  });
}

// Print page results table
for (const res of pageResults) {
  console.log(`  ${res.status} [${res.relPath.padEnd(30)}] ${res.title}`);
  if (res.errors.length > 0) {
    res.errors.forEach((e) => console.log(`     ⚠️  Error: ${e}`));
  }
  if (res.warnings.length > 0) {
    res.warnings.forEach((w) => console.log(`     ℹ️  Warning: ${w}`));
  }
}

// 2. Scan Component Images for Alt Attributes
console.log('\n🖼️  Checking images across UI components...');
const componentDirs = ['src/components/ui', 'src/components/layout'];
let totalImages = 0;
let missingAltImages = 0;

function scanImages(dir) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanImages(full);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const imgTags = content.match(/<(?:img|Image)\b[^>]*>/gi) || [];
      totalImages += imgTags.length;

      imgTags.forEach((tag) => {
        const hasAlt = /\balt\s*=\s*["'{`]/i.test(tag);
        if (!hasAlt) {
          missingAltImages++;
          totalErrors++;
          console.log(`  ❌ Missing alt attribute in ${file}: ${tag.slice(0, 50)}...`);
        }
      });
    }
  }
}

componentDirs.forEach(scanImages);
console.log(`  Scanned ${totalImages} image elements. Missing alt tags: ${missingAltImages}`);

// 3. Technical SEO Configuration Check
console.log('\n⚙️  Checking Technical SEO files...');
const robotsPath = path.join('src/app/robots.ts');
const sitemapPath = path.join('src/app/sitemap.ts');
const layoutPath = path.join('src/app/layout.tsx');

if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  const hasYeti = /Yeti/i.test(robotsContent);
  const hasAdminBlock = /\/admin/.test(robotsContent);
  const hasSitemapRef = /sitemap/i.test(robotsContent);
  console.log(`  ✅ robots.ts present (Naver Yeti: ${hasYeti ? 'YES' : 'NO'}, Admin Blocked: ${hasAdminBlock ? 'YES' : 'NO'}, Sitemap Ref: ${hasSitemapRef ? 'YES' : 'NO'})`);
  if (!hasYeti || !hasAdminBlock || !hasSitemapRef) totalWarnings++;
} else {
  console.log(`  ❌ robots.ts MISSING!`);
  totalErrors++;
}

if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const hasCleaning = /\/cleaning/.test(sitemapContent);
  const hasKoto = /\/koto/.test(sitemapContent);
  const hasProducts = /products/i.test(sitemapContent);
  console.log(`  ✅ sitemap.ts present (Cleaning: ${hasCleaning ? 'YES' : 'NO'}, Koto: ${hasKoto ? 'YES' : 'NO'}, Products: ${hasProducts ? 'YES' : 'NO'})`);
} else {
  console.log(`  ❌ sitemap.ts MISSING!`);
  totalErrors++;
}

if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  const hasNaverMeta = /naver-site-verification/i.test(layoutContent);
  const hasGoogleMeta = /google/i.test(layoutContent);
  const hasOrgSchema = /Organization/i.test(layoutContent);
  console.log(`  ✅ layout.tsx verification tags (Naver Tag: ${hasNaverMeta ? 'YES' : 'NO'}, Google Tag: ${hasGoogleMeta ? 'YES' : 'NO'}, Org Schema: ${hasOrgSchema ? 'YES' : 'NO'})`);
}

// Summary
console.log('\n======================================================');
if (totalErrors === 0) {
  console.log(`🎉 SEO AUDIT PASSED! (Errors: 0, Warnings: ${totalWarnings})`);
  console.log('All public routes are properly configured for Google & Naver SEO.');
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.log(`🚨 SEO AUDIT FAILED with ${totalErrors} errors and ${totalWarnings} warnings.`);
  console.log('======================================================\n');
  process.exit(1);
}
