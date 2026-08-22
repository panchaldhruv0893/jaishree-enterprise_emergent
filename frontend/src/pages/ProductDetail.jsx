import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Info } from "lucide-react";
import SEO, { breadcrumbLd } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import RFQForm from "@/components/RFQForm";
import { FadeUp, MaskedLine, Stagger, StaggerItem } from "@/components/Reveal";
import { api } from "@/lib/api";
import { FAQS_SLEEVES } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

const PRODUCT_LABELS = {
  "vacuum-calibration-sleeves": "Vacuum Calibration Sleeves",
  pistons: "Industrial Pistons",
  cylinders: "Industrial Cylinders",
  "custom-components": "Custom Engineering Components",
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    api.get(`/products/${slug}`).then((r) => setProduct(r.data)).catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="bg-black text-white min-h-screen pt-40 px-8">
        <p data-testid="product-not-found">Product not found. <Link to="/products" className="text-brand underline">View all products</Link></p>
      </div>
    );
  }
  if (!product) {
    return <div className="bg-black min-h-screen" data-testid="product-loading" />;
  }

  const isSleeves = slug === "vacuum-calibration-sleeves";
  const jsonLd = [
    breadcrumbLd([{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: product.name }]),
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.tagline,
      image: product.image,
      brand: { "@type": "Organization", name: "Jaishree Enterprise" },
      manufacturer: { "@type": "Organization", name: "Jaishree Enterprise", address: "328-5, Devjipura, Dudheshwar, Ahmedabad, Gujarat 380004, India" },
    },
    ...(isSleeves
      ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS_SLEEVES.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }]
      : []),
  ];

  return (
    <>
      <SEO title={product.seo?.title || product.name} description={product.seo?.description || product.tagline} path={`/products/${slug}`} jsonLd={jsonLd} />

      <section className="bg-black text-white brushed-metal pt-40 pb-20" ref={heroRef}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Products", to: "/products" }, { label: product.name }]} />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-6">{product.name}</p>
          <h1 className="font-display font-extrabold tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-4xl" data-testid="product-headline">
            <MaskedLine>{product.tagline}</MaskedLine>
          </h1>
          <FadeUp delay={0.4} className="mt-10 flex flex-wrap gap-4">
            <a
              href="#rfq"
              data-testid="product-hero-quote-btn"
              onClick={() => trackEvent("quote_cta_click", { location: "product_hero", product: slug })}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-200"
            >
              Request a Quote <ArrowRight size={16} />
            </a>
            <a
              href="#rfq"
              data-testid="product-hero-drawing-btn"
              onClick={() => trackEvent("drawing_upload_intent", { product: slug })}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:border-white/60 transition-colors duration-200"
            >
              Submit a Drawing
            </a>
          </FadeUp>
        </div>
        <div className="mx-auto max-w-7xl px-5 sm:px-8 mt-16">
          <FadeUp>
            <div className="relative h-[45vh] sm:h-[60vh] overflow-hidden rounded-3xl">
              <motion.img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover will-change-transform" style={{ y }} />
              <div className="absolute inset-0 spotlight" aria-hidden="true" />
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" data-testid="product-overview">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-4">Overview</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">Product overview</h2>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {product.overview.map((p, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">{p}</p>
              </FadeUp>
            ))}
            <FadeUp delay={0.2}>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.applications.map((a) => (
                  <span key={a} className="rounded-full border border-black/10 bg-neutral-50 px-4 py-2 text-xs font-medium text-neutral-700">{a}</span>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="product-benefits">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-4">{isSleeves ? "Key Benefits" : "Highlights"}</p>
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-14 max-w-2xl">
              Engineered around your application.
            </h2>
          </FadeUp>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.benefits.map((b) => (
              <StaggerItem key={b.title} className="rounded-3xl bg-white border border-black/5 p-8 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)] transition-all duration-300">
                <Check size={20} className="text-brand" />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-neutral-900 flex items-center gap-2 flex-wrap">
                  {b.title}
                  {b.pending && (
                    <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                      Confirm availability
                    </span>
                  )}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{b.text}</p>
              </StaggerItem>
            ))}
          </Stagger>

          {product.configurations?.length > 0 && (
            <div className="mt-16">
              <FadeUp>
                <h3 className="font-display text-2xl font-bold tracking-tight text-neutral-900 mb-8">Available configurations</h3>
              </FadeUp>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {product.configurations.map((c) => (
                  <FadeUp key={c.name} className="rounded-2xl bg-white border border-black/5 p-6">
                    <p className="font-display text-sm font-semibold text-neutral-900 flex items-center gap-2 flex-wrap">
                      {c.name}
                      {c.pending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                          <Info size={10} /> Being confirmed
                        </span>
                      )}
                    </p>
                    {c.note && <p className="mt-1.5 text-xs text-neutral-500">{c.note}</p>}
                  </FadeUp>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-black text-white py-24 sm:py-32 brushed-metal" data-testid="product-specs">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-4">Specifications</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">Technical specification</h2>
            <p className="mt-6 text-sm text-white/55 leading-relaxed">
              Components are manufactured to the approved drawing and application requirements.
              Share your drawing or sample for a confirmed specification.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FadeUp>
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <table className="w-full text-sm" data-testid="product-spec-table">
                  <tbody>
                    {product.specs.map((s, i) => (
                      <tr key={s.label} className={i % 2 === 0 ? "bg-white/[0.04]" : "bg-transparent"}>
                        <th scope="row" className="px-6 py-4 text-left font-medium text-white/60 w-1/2 sm:w-2/5">{s.label}</th>
                        <td className="px-6 py-4 text-white/90">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" data-testid="product-gallery">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-4">Gallery</p>
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-14">Precision, up close.</h2>
          </FadeUp>
          <Stagger className={`grid grid-cols-1 gap-6 ${product.gallery.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
            {product.gallery.map((g, i) => {
              const src = typeof g === "string" ? g : g.src;
              const caption = typeof g === "string" ? null : g.caption;
              const span = i === 0 || (product.gallery.length === 4 && i === 3) ? "sm:col-span-2" : "";
              return (
                <StaggerItem key={i} className={span}>
                  <figure className="group overflow-hidden rounded-3xl relative">
                    <img src={src} alt={caption || `${product.name} — detail ${i + 1}`} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    {caption && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-10 pb-4 text-xs font-medium text-white/90" data-testid={`gallery-caption-${i}`}>
                        {caption}
                      </figcaption>
                    )}
                  </figure>
                </StaggerItem>
              );
            })}
          </Stagger>
          <FadeUp delay={0.2}>
            <p className="mt-6 text-xs text-neutral-400">
              {product.real_photos
                ? "Actual Jaishree Enterprise components and engineering renders."
                : "Representative industrial imagery. Product photographs will be replaced with actual component photography."}
            </p>
          </FadeUp>
        </div>
      </section>

      {isSleeves && (
        <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="product-faq">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-4">FAQ</p>
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-12">Common questions</h2>
            </FadeUp>
            <div className="space-y-4">
              {FAQS_SLEEVES.map((f, i) => (
                <FadeUp key={i} delay={i * 0.05} className="rounded-2xl bg-white border border-black/5 p-7">
                  <h3 className="font-display text-base font-semibold text-neutral-900">{f.q}</h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{f.a}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="rfq" className="bg-[#F5F5F7] py-24 sm:py-32 border-t border-black/5" data-testid="product-rfq">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-4">Request a Quote</p>
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">
                Tell us what you need.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-xl mx-auto">
                Share your dimensions, drawing or sample reference — our team will review and respond.
              </p>
            </FadeUp>
          </div>
          <RFQForm presetProduct={PRODUCT_LABELS[slug] || ""} source={`product:${slug}`} />
        </div>
      </section>
    </>
  );
}
