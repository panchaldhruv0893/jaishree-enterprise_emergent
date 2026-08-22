import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, MapPin, Settings, FileText, Layers, Ruler, Repeat, Factory } from "lucide-react";
import SEO from "@/components/SEO";
import { FadeUp, MaskedLine, Stagger, StaggerItem, Chapter } from "@/components/Reveal";
import EditorialMarquee from "@/components/EditorialMarquee";
import { api } from "@/lib/api";
import { IMG, COMPANY, INDUSTRIES, EXPERIENCE } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

const CAP_ICONS = { Settings, FileText, Layers, Ruler, Repeat, Factory };

const PROCESS = [
  { n: "01", t: "Share your requirement", d: "Send a drawing, a sample or a description of the component you need." },
  { n: "02", t: "Technical review", d: "Our team reviews manufacturability, dimensions and application fit." },
  { n: "03", t: "Material & manufacturing confirmation", d: "Material and process approach are confirmed with you before production." },
  { n: "04", t: "Production & inspection", d: "The component is manufactured and dimensionally inspected against the drawing." },
  { n: "05", t: "Dispatch", d: "Finished components are packed and dispatched to your schedule." },
];

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section className="bg-black text-white brushed-metal" data-testid="home-hero">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-40 pb-16 sm:pt-48">
        <FadeUp delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-8" data-testid="hero-kicker">
            Jaishree Enterprise — Ahmedabad, India
          </p>
        </FadeUp>
        <h1 className="font-display font-extrabold tracking-tighter leading-[1.02] text-5xl sm:text-7xl lg:text-8xl" data-testid="hero-headline">
          <MaskedLine delay={0.25}>Precision Components.</MaskedLine>
          <MaskedLine delay={0.4}>Built for Industry.</MaskedLine>
          <MaskedLine delay={0.55} className="text-brand">Trusted Since 1983.</MaskedLine>
        </h1>
        <FadeUp delay={0.85} className="mt-10 max-w-2xl">
          <p className="text-base sm:text-lg text-white/60 leading-relaxed" data-testid="hero-subcopy">
            Jaishree Enterprise manufactures vacuum calibration sleeves, pistons, cylinders and custom
            engineering components for plastics-processing and metallurgical machinery.
          </p>
        </FadeUp>
        <FadeUp delay={1} className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/contact"
            data-testid="hero-quote-btn"
            onClick={() => trackEvent("quote_cta_click", { location: "hero" })}
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-200"
          >
            Request a Quote
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/products"
            data-testid="hero-products-btn"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:border-white/60 transition-colors duration-200"
          >
            Explore Products
          </Link>
        </FadeUp>
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
        <FadeUp delay={0.2}>
          <div className="relative h-[52vh] sm:h-[70vh] overflow-hidden rounded-3xl" data-testid="hero-image-frame">
            <motion.img
              src={IMG.hero}
              alt="Macro view of precision-machined metal surface"
              className="absolute inset-0 h-full w-full object-cover will-change-transform"
              style={{ y, scale }}
              loading="eager"
            />
            <div className="absolute inset-0 spotlight" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Machined. Inspected. Delivered.</p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

const FACTS = [
  { id: "founded", value: "1983", label: "Founded" },
  { id: "families", value: "4", label: "Product Families" },
  { id: "years", value: "40+", label: "Years Manufacturing" },
  { id: "base", value: "Ahmedabad", label: "Gujarat, India" },
];

function QuickFacts() {
  return (
    <section className="bg-white border-b border-black/8" data-testid="home-quick-facts">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Stagger className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-black/8">
          {FACTS.map((f) => (
            <StaggerItem key={f.id} className="py-10 sm:py-14 px-4 sm:px-8" data-testid={`fact-${f.id}`}>
              <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">{f.value}</p>
              <p className="mt-1 text-xs sm:text-sm uppercase tracking-[0.15em] text-neutral-500">{f.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="bg-white py-28 sm:py-36" data-testid="home-intro">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <Chapter number="01" label="Who We Are" />
        </div>
        <div className="lg:col-span-8">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight leading-[1.15] text-neutral-900">
              An Ahmedabad-based mechanical engineering and fabrication company, manufacturing
              dependable components for Indian and international industrial organizations.
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-8 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              From our manufacturing base in Devjipura, Dudheshwar, we produce vacuum calibration
              sleeves, industrial pistons, cylinders and custom precision-machined components —
              built to customer drawings and application requirements.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <Link to="/about" data-testid="intro-about-link" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all duration-200">
              More about us <ArrowRight size={15} />
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Heritage() {
  return (
    <section className="bg-black text-white py-28 sm:py-40 brushed-metal" data-testid="home-heritage">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Chapter number="02" label="Our Heritage" dark />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <FadeUp>
              <p className="font-display font-extrabold tracking-tighter leading-none text-[22vw] lg:text-[13rem] text-outline select-none" aria-hidden="true">
                1983
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight -mt-6 sm:-mt-12">
                Engineering since 1983.
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p className="mt-8 text-base sm:text-lg text-white/60 leading-relaxed max-w-xl">
                For more than four decades, Jaishree Enterprise has grown alongside Ahmedabad's
                industrial ecosystem — supporting machinery manufacturers with practical engineering,
                precision components and dependable service.
              </p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <Link to="/history" data-testid="heritage-history-link" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all duration-200">
                Our history <ArrowRight size={15} />
              </Link>
            </FadeUp>
          </div>
          <div className="lg:col-span-5">
            <FadeUp delay={0.2}>
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <img src={IMG.blueprint} alt="Engineering drawing being reviewed" className="h-72 w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get("/products").then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  return (
    <section className="bg-[#F5F5F7] py-28 sm:py-36" data-testid="home-products">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Chapter number="03" label="What We Manufacture" />
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">
              Four product families.<br />One standard of precision.
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <Link to="/products" data-testid="products-view-all" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all duration-200">
              View all products <ArrowRight size={15} />
            </Link>
          </FadeUp>
        </div>
        {products.length > 0 && (
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <StaggerItem key={p.slug}>
              <Link
                to={`/products/${p.slug}`}
                data-testid={`product-card-${p.slug}`}
                className="group block overflow-hidden rounded-3xl bg-white border border-black/5 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:shadow-[0_25px_60px_-25px_rgba(0,0,0,0.3)] transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
                  <ArrowUpRight className="absolute top-5 right-5 text-white/80 group-hover:text-brand transition-colors duration-200" size={22} />
                </div>
                <div className="p-8">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">{p.name}</h3>
                  <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{p.tagline}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        )}
      </div>
    </section>
  );
}

function IndustriesSection() {
  return (
    <section className="bg-black text-white py-28 sm:py-36 brushed-metal" data-testid="home-industries">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Chapter number="04" label="Industries Served" dark />
        <FadeUp>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl mb-14">
            Components for the machines that keep industry moving.
          </h2>
        </FadeUp>
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-3xl overflow-hidden">
          {INDUSTRIES.map((ind) => (
            <StaggerItem key={ind.id} className="bg-[#0d0d0d] p-8 hover:bg-[#141414] transition-colors duration-300">
              <h3 className="font-display text-lg font-semibold tracking-tight">{ind.title}</h3>
              <p className="mt-3 text-sm text-white/55 leading-relaxed">{ind.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeUp delay={0.2}>
          <Link to="/industries" data-testid="industries-view-all" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all duration-200">
            Explore industries <ArrowRight size={15} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="bg-white py-28 sm:py-36" data-testid="home-experience">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Chapter number="05" label="Manufacturing Experience" />
        <FadeUp>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 max-w-3xl">
            Components supplied to organizations including:
          </h2>
        </FadeUp>
        <Stagger className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {EXPERIENCE.map((name) => (
            <StaggerItem key={name} className="rounded-2xl border border-black/8 bg-[#F5F5F7] px-6 py-8 flex items-center justify-center text-center hover:border-brand/40 transition-colors duration-300">
              <span className="font-display text-base font-semibold tracking-tight text-neutral-800">{name}</span>
            </StaggerItem>
          ))}
        </Stagger>
        <FadeUp delay={0.2}>
          <p className="mt-8 text-xs text-neutral-400 max-w-2xl">
            Listed as manufacturing experience only. No endorsement, partnership or current contract is implied.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="bg-[#F5F5F7] py-28 sm:py-36" data-testid="home-process">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Chapter number="06" label="Custom Manufacturing Process" />
        <FadeUp>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-16 max-w-3xl">
            From drawing to dispatch, in five clear steps.
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-0">
            {PROCESS.map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.06}>
                <div className="flex gap-8 py-8 border-b border-black/8 group" data-testid={`process-step-${i}`}>
                  <span className="font-display text-sm font-bold text-brand pt-1">{s.n}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-neutral-900 group-hover:text-brand transition-colors duration-200">{s.t}</h3>
                    <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <div className="lg:col-span-5">
            <FadeUp delay={0.2} className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-3xl">
                <img src={IMG.drill} alt="Precision machining in progress" className="h-96 w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesOverview() {
  const [caps, setCaps] = useState([]);
  useEffect(() => {
    api.get("/capabilities").then((r) => setCaps(r.data.filter((c) => c.status === "confirmed"))).catch(() => {});
  }, []);

  return (
    <section className="bg-black text-white py-28 sm:py-36 brushed-metal" data-testid="home-capabilities">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Chapter number="07" label="Capabilities & Quality" dark />
        <FadeUp>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-6 max-w-3xl">
            Every component, manufactured to the approved drawing.
          </h2>
          <p className="text-white/55 text-base sm:text-lg max-w-2xl mb-14 leading-relaxed">
            Custom manufacturing, material selection support and dimensional inspection — applied to
            every enquiry, from a single replacement piece to repeat production.
          </p>
        </FadeUp>
        {caps.length > 0 && (
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {caps.map((c) => {
            const Icon = CAP_ICONS[c.icon] || Settings;
            return (
              <StaggerItem key={c.id} className="rounded-3xl bg-[#111] border border-white/10 p-8 hover:border-brand/50 hover:-translate-y-1 transition-all duration-300">
                <Icon size={22} className="text-brand" />
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-white/55 leading-relaxed">{c.description}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
        )}
        <FadeUp delay={0.2}>
          <Link to="/capabilities" data-testid="capabilities-view-all" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all duration-200">
            Capabilities & quality in detail <ArrowRight size={15} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="bg-white py-28 sm:py-36" data-testid="home-location">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <Chapter number="08" label="Where We Are" />
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">
              Manufacturing from the heart of industrial Ahmedabad.
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-lg">
              Our facility in Devjipura, Dudheshwar places us within reach of Gujarat's GIDC industrial
              clusters — close to the OEMs and manufacturers we serve.
            </p>
            <p className="mt-6 flex items-start gap-2 text-sm text-neutral-700">
              <MapPin size={16} className="mt-0.5 text-brand shrink-0" />
              <span>{COMPANY.name}, {COMPANY.addressLines[0]}, {COMPANY.addressLines[1]}</span>
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <Link to="/contact" data-testid="location-visit-link" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all duration-200">
              Plan a visit <ArrowRight size={15} />
            </Link>
          </FadeUp>
        </div>
        <FadeUp delay={0.2}>
          <div className="overflow-hidden rounded-3xl">
            <img src={IMG.facility} alt="Industrial manufacturing facility" className="h-96 w-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-black text-white py-32 sm:py-44 brushed-metal" data-testid="home-final-cta">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 text-center">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-8">Request a Quotation</p>
          <h2 className="font-display font-extrabold tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[1.05]">
            <MaskedLine inView>Have a drawing?</MaskedLine>
            <MaskedLine inView delay={0.15} className="text-white/40">We'll manufacture it.</MaskedLine>
          </h2>
        </FadeUp>
        <FadeUp delay={0.3} className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            data-testid="final-cta-quote-btn"
            onClick={() => trackEvent("quote_cta_click", { location: "final_cta" })}
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-10 py-4 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-200"
          >
            Request a Quote
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <a
            href={`mailto:${COMPANY.email}`}
            data-testid="final-cta-email-link"
            onClick={() => trackEvent("email_click", { location: "final_cta" })}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-10 py-4 text-sm font-semibold text-white hover:border-white/60 transition-colors duration-200"
          >
            {COMPANY.email}
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SEO
        title="Jaishree Enterprise | Precision Engineering Company Ahmedabad — Since 1983"
        description="Vacuum calibration sleeves, industrial pistons, cylinders and custom machinery parts manufactured in Ahmedabad, Gujarat since 1983. Plastic extrusion machinery components India. Request a quote."
        path="/"
      />
      <Hero />
      <QuickFacts />
      <Intro />
      <Heritage />
      <EditorialMarquee />
      <FeaturedProducts />
      <IndustriesSection />
      <Experience />
      <Process />
      <CapabilitiesOverview />
      <LocationSection />
      <FinalCTA />
    </>
  );
}
