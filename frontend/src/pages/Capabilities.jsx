import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Settings, FileText, Layers, Ruler, Repeat, Factory, Cog, CircleDot, Disc, Flame, Info } from "lucide-react";
import SEO, { breadcrumbLd } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FadeUp, Stagger, StaggerItem } from "@/components/Reveal";
import { api } from "@/lib/api";
import { IMG } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

const ICONS = { Settings, FileText, Layers, Ruler, Repeat, Factory, Cog, CircleDot, Disc, Flame };

export default function Capabilities() {
  const [caps, setCaps] = useState([]);
  useEffect(() => {
    api.get("/capabilities").then((r) => setCaps(r.data)).catch(() => {});
  }, []);
  const confirmed = caps.filter((c) => c.status === "confirmed");
  const pending = caps.filter((c) => c.status === "pending");

  return (
    <>
      <SEO
        title="Capabilities & Quality | Jaishree Enterprise Ahmedabad"
        description="Custom manufacturing, built-to-print components, material selection support, dimensional inspection and small-batch repeat production from Ahmedabad. Every component manufactured to the approved drawing."
        path="/capabilities"
        jsonLd={breadcrumbLd([{ label: "Home", to: "/" }, { label: "Capabilities & Quality" }])}
      />
      <section className="bg-black text-white brushed-metal pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Capabilities & Quality" }]} />
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-6">Capabilities & Quality</p>
            <h1 className="font-display font-extrabold tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-4xl" data-testid="capabilities-headline">
              Made to drawing.<br />Checked before dispatch.
            </h1>
            <p className="mt-8 max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed">
              Every component we produce can be manufactured according to the approved drawing and
              application requirements — from a single replacement piece to scheduled repeat production.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="capabilities-grid">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {confirmed.map((c) => {
              const Icon = ICONS[c.icon] || Settings;
              return (
                <StaggerItem key={c.id} className="rounded-3xl bg-white border border-black/5 p-9 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)] transition-all duration-300">
                  <Icon size={24} className="text-brand" />
                  <h2 className="mt-5 font-display text-xl font-semibold tracking-tight text-neutral-900">{c.title}</h2>
                  <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{c.description}</p>
                </StaggerItem>
              );
            })}
          </Stagger>

          {pending.length > 0 && (
            <div className="mt-20">
              <FadeUp>
                <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-900 mb-3">Additional capabilities</h2>
                <p className="text-sm text-neutral-500 mb-8 max-w-2xl">
                  The following capabilities are being confirmed by our team. Enquire with your
                  requirement and we will confirm availability.
                </p>
              </FadeUp>
              <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pending.map((c) => {
                  const Icon = ICONS[c.icon] || Cog;
                  return (
                    <StaggerItem key={c.id} className="rounded-2xl bg-white/60 border border-dashed border-black/15 p-6">
                      <Icon size={18} className="text-neutral-400" />
                      <p className="mt-3 font-display text-sm font-semibold text-neutral-800 flex items-center gap-2 flex-wrap">
                        {c.title}
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                          <Info size={9} /> Confirming
                        </span>
                      </p>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <div className="overflow-hidden rounded-3xl">
              <img src={IMG.drill} alt="Precision machining detail" className="h-96 w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </FadeUp>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-4">Our Commitment</p>
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
                Quality is a process, not a promise.
              </h2>
              <p className="mt-6 text-base text-neutral-600 leading-relaxed">
                Every enquiry begins with a technical review. Material and manufacturing approach are
                confirmed with you before production, and each component is dimensionally inspected
                against the approved drawing before dispatch.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <Link
                to="/contact"
                data-testid="capabilities-quote-btn"
                onClick={() => trackEvent("quote_cta_click", { location: "capabilities" })}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-200"
              >
                Discuss your requirement <ArrowRight size={15} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
