import { useEffect } from "react";

const BASE = "https://jaishree-engineering.preview.emergentagent.com";

const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export default function SEO({ title, description, path = "/", jsonLd = null }) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", `${BASE}${path}`);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${BASE}${path}`);
    document.querySelectorAll("script[data-page-jsonld]").forEach((n) => n.remove());
    if (jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-page-jsonld", "true");
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, path, jsonLd]);
  return null;
}

export const breadcrumbLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.label,
    item: `${BASE}${it.to || "/"}`,
  })),
});
