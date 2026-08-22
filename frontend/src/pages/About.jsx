import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO, { breadcrumbLd } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FadeUp, Chapter } from "@/components/Reveal";
import { IMG, INDUSTRIES, EXPERIENCE } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

export default function About() {
  return (
    <>
      <SEO
        title="About Us | Jaishree Enterprise — Precision Engineering Ahmedabad Since 1983"
        description="Founded in 1983, Jaishree Enterprise is an Ahmedabad-based mechanical engineering and fabrication company serving plastics-processing, extrusion and metallurgical machinery industries."
        path="/about"
        jsonLd={breadcrumbLd([{ label: "Home", to: "/" }, { label: "About Us" }])}
      />
      <section className="bg-black text-white brushed-metal pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "About Us" }]} />
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-6">About Us</p>
            <h1 className="font-display font-extrabold tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[1.08] max-w-4xl" data-testid="about-headline">
              Four decades of dependable manufacturing.
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-3xl text-base sm:text-lg text-white/60 leading-relaxed" data-testid="about-story">
              Founded in 1983, Jaishree Enterprise is an Ahmedabad-based mechanical engineering and
              fabrication company serving the plastics-processing, extrusion and metallurgical machinery
              industries. From its manufacturing base in Tavdipura, Shahibaug, the company has built
              long-standing experience producing dependable components for Indian and international
              industrial organizations.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" data-testid="about-who">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4"><Chapter number="01" label="Who We Are" /></div>
          <div className="lg:col-span-8">
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
                A practical engineering partner, not just a supplier.
              </h2>
              <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
                We work with OEMs, engineering companies, plant-maintenance teams and MSME
                manufacturers who need components that fit, perform and arrive as specified. Our
                approach is straightforward: understand the application, confirm the drawing, and
                manufacture to it.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="about-what">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <Chapter number="02" label="What We Manufacture" />
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
                Precision components for industrial machinery.
              </h2>
              <ul className="mt-8 space-y-4">
                {["Vacuum calibration sleeves for pipe extrusion", "Industrial pistons", "Industrial cylinders and cylindrical components", "Custom precision-machined and fabricated components", "Replacement components built to customer drawings"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-neutral-700">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
          <div className="lg:col-span-6">
            <FadeUp delay={0.15}>
              <div className="overflow-hidden rounded-3xl">
                <img src={IMG.cnc} alt="Precision machining at Jaishree Enterprise" className="h-96 w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-black text-white brushed-metal py-24 sm:py-32" data-testid="about-philosophy">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4"><Chapter number="03" label="Engineering Philosophy" dark /></div>
          <div className="lg:col-span-8">
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                "Understand the application. Confirm the drawing. Manufacture to it. Inspect before it leaves."
              </h2>
              <p className="mt-8 text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl">
                Customer-focused manufacturing means the requirement leads the process — dimensions,
                materials and quantities are defined by your application, not by a catalog.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-2">
                {INDUSTRIES.map((i) => (
                  <span key={i.id} className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/70">{i.title}</span>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" data-testid="about-heritage">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Chapter number="04" label="Ahmedabad Manufacturing Heritage" />
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
                Rooted in one of India's oldest industrial cities.
              </h2>
              <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed">
                Ahmedabad's manufacturing ecosystem has shaped how we work — practical, responsive and
                built on long relationships. Our experience includes supplying components to
                organizations such as {EXPERIENCE.slice(0, -1).join(", ")} and {EXPERIENCE[EXPERIENCE.length - 1]}.
              </p>
              <p className="mt-4 text-xs text-neutral-400">
                Listed as manufacturing experience only. No endorsement, partnership or current contract is implied.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <Link to="/contact" data-testid="about-quote-btn" onClick={() => trackEvent("quote_cta_click", { location: "about" })} className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-200">
                Work with us <ArrowRight size={15} />
              </Link>
            </FadeUp>
          </div>
          <FadeUp delay={0.15}>
            <div className="overflow-hidden rounded-3xl">
              <img src={IMG.facility} alt="Industrial Ahmedabad" className="h-96 w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
