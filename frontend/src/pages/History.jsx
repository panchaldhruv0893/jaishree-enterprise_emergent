import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO, { breadcrumbLd } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FadeUp } from "@/components/Reveal";
import { api } from "@/lib/api";
import { IMG } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

export default function History() {
  const [milestones, setMilestones] = useState([]);
  useEffect(() => {
    api.get("/milestones").then((r) => setMilestones(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <SEO
        title="Our History | Jaishree Enterprise — Engineering Since 1983, Ahmedabad"
        description="Since 1983, Jaishree Enterprise has grown alongside Ahmedabad's industrial ecosystem — supporting machinery manufacturers with practical engineering, precision components and dependable service."
        path="/history"
        jsonLd={breadcrumbLd([{ label: "Home", to: "/" }, { label: "Our History" }])}
      />
      <section className="bg-black text-white brushed-metal pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Our History" }]} />
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-6">Our History</p>
            <h1 className="font-display font-extrabold tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-4xl" data-testid="history-headline">
              Since 1983.
            </h1>
            <p className="mt-8 max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed">
              Since 1983, Jaishree Enterprise has grown alongside Ahmedabad's industrial ecosystem —
              supporting machinery manufacturers with practical engineering, precision components and
              dependable service.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" data-testid="history-timeline">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <div className="relative pl-10 sm:pl-16">
            <span className="absolute left-3 sm:left-5 top-0 bottom-0 w-px bg-black/10" aria-hidden="true" />
            <div className="space-y-16">
              {milestones.map((m, i) => (
                <FadeUp key={m.id} delay={i * 0.05}>
                  <div className="relative" data-testid={`milestone-${m.id}`}>
                    <span className={`absolute -left-10 sm:-left-16 top-1.5 flex h-6 w-6 sm:h-10 sm:w-10 items-center justify-center rounded-full border ${m.placeholder ? "border-dashed border-black/20 bg-white" : "border-brand bg-brand"}`} aria-hidden="true">
                      <span className={`h-1.5 w-1.5 rounded-full ${m.placeholder ? "bg-black/20" : "bg-white"}`} />
                    </span>
                    <p className={`font-display text-sm font-bold tracking-widest ${m.placeholder ? "text-neutral-400" : "text-brand"}`}>{m.year}</p>
                    <h2 className={`mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight ${m.placeholder ? "text-neutral-400" : "text-neutral-900"}`}>
                      {m.title}
                    </h2>
                    <p className={`mt-3 text-sm sm:text-base leading-relaxed max-w-xl ${m.placeholder ? "text-neutral-400 italic" : "text-neutral-600"}`}>
                      {m.text}
                    </p>
                    {m.placeholder && (
                      <span className="mt-3 inline-block rounded-full bg-neutral-100 border border-black/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                        Editable milestone — owner to update
                      </span>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black text-white brushed-metal py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <img src={IMG.blueprint} alt="Engineering blueprint — four decades of manufacturing" className="h-80 w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </FadeUp>
          <div>
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                The next chapter starts with your component.
              </h2>
              <p className="mt-6 text-base text-white/60 leading-relaxed">
                Share a drawing or requirement and put four decades of manufacturing experience to work.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <Link to="/contact" data-testid="history-quote-btn" onClick={() => trackEvent("quote_cta_click", { location: "history" })} className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-200">
                Request a Quote <ArrowRight size={15} />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
