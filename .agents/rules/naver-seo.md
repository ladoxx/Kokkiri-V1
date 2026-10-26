# Naver Search Advisor & E-Commerce SEO Rules

## Core Principles for Korean Search Engine (Naver) SEO

1. **Title Length & Structure**:
   - Optimal Title: 20–38 Korean characters.
   - Format: `[핵심 상품명/키워드] [특징] | CHOKO 코끼리`
   - Naver mobile SERP truncates titles over ~40 characters with `...`. Keep important keywords in the first 15–20 characters.

2. **Meta Description**:
   - Optimal Description: 60–110 Korean characters.
   - Must contain: (1) Core product/service value, (2) Eco/quality trust indicators, (3) Clear Call-to-Action (e.g. `공식 네이버 스마트스토어에서 빠른 배송으로 만나보세요.`).

3. **Open Graph & Yeti Crawler**:
   - Naver's crawler (`Yeti`) heavily indexes `og:title`, `og:description`, and `og:image`.
   - `og:image` must be high quality (1200x630 or 800x800 square).
   - In `robots.ts`, always allow `User-agent: Yeti`.

4. **Product Schema (JSON-LD)**:
   - For all e-commerce products, output Schema.org `Product` with `offers`, `brand`, and `sameAs` pointing to official Naver SmartStore (`https://smartstore.naver.com/...`).

5. **Auto-SEO Agent**:
   - When new products are added, use the Naver SEO Agent (`src/lib/seo/agent/naver-seo-agent.ts`) or run `npm run seo:prepare` to ensure 100/100 compliance scores.
