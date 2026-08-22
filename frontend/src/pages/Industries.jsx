import SEO, { breadcrumbLd } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import EditorialMarquee from "@/components/EditorialMarquee";
import { FadeUp, Chapter } from "@/components/Reveal";
import { INDUSTRIES, IMG } from "@/data/content";

export default function Industries() {
  return (
    <>
      <SEO
        title="Industries Served | Plastic Extrusion & Metallurgical Equipment Components India | Jaishree Enterprise"
        description="Components for plastic extrusion and pipe manufacturing, plastics-processing machinery, metallurgical equipment, industrial OEMs, plant maintenance and GIDC-based MSME manufacturers across Gujarat."
        path="/industries"
        jsonLd={breadcrumbLd([{ label: "Home", to: "/" }, { label: "Industries" }])}
      />
      <section className="bg-black text-white brushed-metal pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Industries" }]} />
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-6">Industries</p>
            <h1 className="font-display font-extrabold tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-4xl" data-testid="industries-headline">
              Built for the sectors we know best.
            </h1>
            <p className="mt-8 max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed">
              Four decades of component manufacturing for machinery builders, plant teams and
              manufacturers — focused on dimensional fit, equipment reliability and responsive local support.
            </p>
          </FadeUp>
        </div>
      </section>

      <EditorialMarquee />

      <section className="bg-white py-24 sm:py-32" data-testid="industries-list">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-24">
          {INDUSTRIES.map((ind, i) => (
            <div key={ind.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center`} data-testid={`industry-${ind.id}`}>
              <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <Chapter number={String(i + 1).padStart(2, "0")} label="Industry" />
                <FadeUp>
                  <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900">{ind.title}</h2>
                  <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">{ind.text}</p>
                </FadeUp>
              </div>
              <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <FadeUp delay={0.15}>
                  <div className="overflow-hidden rounded-3xl">
                    <img
                      src={[IMG.cnc, IMG.components, IMG.drill, IMG.hero, IMG.blueprint, IMG.facility][i % 6]}
                      alt={ind.title}
                      className="h-72 w-full object-cover hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                </FadeUp>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
