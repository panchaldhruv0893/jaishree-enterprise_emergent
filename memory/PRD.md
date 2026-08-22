# Jaishree Enterprise — B2B Manufacturing Website

## Original problem statement
Production-ready, responsive, multi-page B2B website for Jaishree Enterprise (mechanical engineering & precision fabrication, founded 1983, Tavdipura, Shahibaug, Ahmedabad). Products: vacuum calibration sleeves, industrial pistons, cylinders, custom components, replacement parts. Apple-inspired minimal premium design, industrial-blue accent (user choice), RFQ generation with drawing upload, email to jaishreeenterprise@yahoo.com, CMS-editable products/capabilities/milestones, full SEO (sitemap, robots, JSON-LD, OG), no invented claims. Award-worthy motion: framer-motion reveals, lenis smooth scroll, kinetic masked hero, editorial marquee, parallax.

## User personas
- Procurement teams / engineers at OEMs seeking built-to-drawing components
- Plant-maintenance teams needing replacement parts
- MSME manufacturers in Gujarat GIDC clusters
- Business owners evaluating a 40+ year manufacturing partner

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis + react-fast-marquee, react-router multi-page (/, /products, /products/:slug, /industries, /capabilities, /about, /history, /contact)
- Backend: FastAPI + MongoDB. Collections: products, capabilities, milestones, quotes. Emergent managed Resend email (EMERGENT_EMAIL_KEY) + Emergent object storage (EMERGENT_LLM_KEY) for drawing uploads
- Admin CMS: /api/admin/* endpoints guarded by X-Admin-Token header (products/capabilities/milestones upsert, quotes list)

## Core requirements (static)
- Multi-page catalog with product detail pages (spec tables, gallery, RFQ per product)
- RFQ form: all brief fields + drawing upload (PDF/JPG/PNG/DWG/DXF, 10MB), honeypot + rate limit, email to owner + confirmation to enquirer
- No fake stats/testimonials/certifications; unconfirmed capabilities shown as editable "being confirmed" placeholders
- SEO: per-page titles/descriptions, canonical, OG, Organization/LocalBusiness/Product/FAQ/Breadcrumb JSON-LD, sitemap.xml, robots.txt
- Analytics-ready events via dataLayer (quote_request, drawing_upload, email_click, quote_cta_click)

## Implemented (2026-08-22)
- Full 8-page site with dark/light alternating chapters, masked hero reveal, parallax hero image, marquee, bento grids
- Backend: content APIs, RFQ endpoint with storage upload + Resend email (verified live), admin CMS endpoints
- Seeded CMS: 4 products, 10 capabilities (4 pending-confirmation placeholders), 4 milestones (2 editable placeholders)
- Real photography: 5 owner-supplied sleeve photos/renders (/images/sleeve-*) + web-sourced piston/cylinder photos (Pexels, free license) with gallery captions on all product pages
- IndiaMART storefront linked (https://www.indiamart.com/jaishree-enterprise-ahmedabad/) on Contact page and footer, tracked via indiamart_click event
- Bugfix: async-loaded Stagger grids (catalog, home products/capabilities) gated on data presence — framer-motion stagger children mounting after parent in-view stayed at opacity 0
- Verified: RFQ submit via UI + curl (drawing stored, email sent, download link works), honeypot, extension validation, mobile menu, contact map, catalog rendering

## Backlog
- P0: Owner replaces remaining placeholder imagery (pistons, cylinders, custom components) with real photos — sleeve photos DONE 2026-08-22 (5 real photos/renderings in /images/, sleeves page + home card); confirms pending capabilities (CNC, grinding, honing, welding; water-jacket/cool-neck sleeves; repair work); updates milestone placeholders
- P1: Owner-facing CMS UI (currently API + token only); phone number / street address when supplied
- P2: Real product photos in WebP/AVIF pipeline; blog/technical resources for SEO; WhatsApp CTA
