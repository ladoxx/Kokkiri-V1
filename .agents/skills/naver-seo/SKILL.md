---
name: naver-seo
description: Guidelines, agent tools, and best practices for Naver Search Advisor (네이버 서치어드바이저) SEO and Korean e-commerce product SEO.
---

# Naver SEO & E-Commerce Optimization Skill

## Overview
This skill provides automated tools, agent procedures, and guidelines for optimizing websites and products for the South Korean search engine **Naver (네이버)**.

## Naver Search Advisor Specifications

1. **Title Tag Rules**:
   - Optimal character length: **20 to 38 Korean characters**.
   - Structure: `[Primary Product/Keyword] [Key Hook/Specification] | [Brand Name]`
   - Avoid keyword duplication or artificial stacking (penalized by Naver DIA/C-Rank).

2. **Meta Description Rules**:
   - Optimal character length: **60 to 110 Korean characters**.
   - High CTR formula: `[Product Name] + [Core Value/Certification] + [Call to Action: 네이버 스마트스토어/공식몰 안내]`

3. **Naver Yeti Crawler & Robots.txt**:
   - Ensure `User-agent: Yeti` has access to `/`.
   - Ensure sitemap and canonical URLs are declared.

4. **Product Rich Snippets (Schema.org JSON-LD)**:
   - Provide `@type: "Product"` with `name`, `description`, `image`, `sku`, `brand`, `offers`, and `sameAs: [naverSmartStoreUrl]`.

## Agent Tools & Commands
- **Prepare/Run SEO Agent**: `npm run seo:prepare` or `npm run seo:agent`
- **Audit All Public Pages**: `npm run seo:check`
- **Code Agent**: [naver-seo-agent.ts](file:///src/lib/seo/agent/naver-seo-agent.ts)
- **API Endpoint**: `POST /api/admin/products/seo` (actions: `generate`, `batch-optimize`)
