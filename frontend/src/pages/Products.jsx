import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SEO, { breadcrumbLd } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FadeUp, Stagger, StaggerItem, Chapter } from "@/components/Reveal";
import { api } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get("/products").then((r) => setProducts(r.data)).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  return (
    <>
      <SEO
        title="Products | Vacuum Calibration Sleeves, Pistons, Cylinders | Jaishree Enterprise"
        description="Product catalog: vacuum calibration sleeves, industrial pistons, industrial cylinders and custom engineering components manufactured in Ahmedabad, Gujarat."
        path="/products"
        jsonLd={breadcrumbLd([{ label: "Home", to: "/" }, { label: "Products" }])}
      />
      <section className="bg-black text-white brushed-metal pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Products" }]} />
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-6">Product Catalog</p>
            <h1 className="font-display font-extrabold tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[1.05]" data-testid="products-headline">
              Engineered components,<br />made to your drawing.
            </h1>
            <p className="mt-8 max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed">
              Four product families, each manufactured to customer drawings and application
              requirements — with customization available across dimensions, materials and quantities.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="products-grid-section">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Chapter number="01" label="Catalog" />
          {!loaded && <p className="text-sm text-neutral-400">Loading products…</p>}
          {products.length > 0 && (
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((p) => (
              <StaggerItem key={p.slug}>
                <article
                  className="group overflow-hidden rounded-3xl bg-white border border-black/5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:shadow-[0_25px_60px_-25px_rgba(0,0,0,0.3)] transition-all duration-300"
                  data-testid={`catalog-card-${p.slug}`}
                >
                  <Link to={`/products/${p.slug}`} className="block relative h-72 overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" aria-hidden="true" />
                    <ArrowUpRight className="absolute top-5 right-5 text-white/80 group-hover:text-brand transition-colors duration-200" size={24} />
                    <h2 className="absolute bottom-6 left-8 right-8 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">{p.name}</h2>
                  </Link>
                  <div className="p-8">
                    <p className="text-sm text-neutral-600 leading-relaxed">{p.tagline}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(p.applications || []).slice(0, 3).map((a) => (
                        <span key={a} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">{a}</span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs font-medium text-brand">Customization available — dimensions, material, quantity</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to={`/products/${p.slug}`}
                        data-testid={`catalog-view-${p.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-black transition-colors duration-200"
                      >
                        View Product <ArrowRight size={13} />
                      </Link>
                      <Link
                        to={`/products/${p.slug}#rfq`}
                        data-testid={`catalog-quote-${p.slug}`}
                        onClick={() => trackEvent("quote_cta_click", { location: "catalog", product: p.slug })}
                        className="inline-flex items-center gap-2 rounded-full border border-brand px-6 py-2.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white transition-colors duration-200"
                      >
                        Request a Quote
                      </Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
