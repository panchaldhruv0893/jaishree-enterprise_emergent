import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, ShieldCheck, UserRound } from "lucide-react";
import SEO, { breadcrumbLd } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FadeUp, Chapter, Stagger, StaggerItem } from "@/components/Reveal";
import { IMG, INDUSTRIES, EXPERIENCE } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

const GENERATIONS = [
  {
    gen: "First Generation",
    year: "1983",
    name: "Hasmukhlal Panchal",
    role: "The Founder",
    text: "In 1983, Hasmukhlal Panchal laid the foundation of Jaishree Enterprise through determination, technical skill, and years of tireless hard work. He believed that no detail was too small and no compromise on quality was ever acceptable. His honesty, discipline, and pride in craftsmanship established the principles on which the company continues to operate today.",
  },
  {
    gen: "Second Generation",
    year: null,
    name: "Ajay Panchal",
    role: "Strengthening the Foundation",
    text: "The second generation, Ajay Panchal, carried his father's vision forward with the same dedication and sense of responsibility. He strengthened customer relationships, expanded the company's manufacturing experience, and ensured that every product leaving the workshop reflected the Panchal family's commitment to precision, reliability, and trust.",
  },
  {
    gen: "Third Generation",
    year: null,
    name: "Dhruv Panchal",
    role: "Carrying the Legacy Forward",
    text: "Representing the third generation, Dhruv Panchal carries forward the values established by his grandfather and strengthened by his father. With a modern engineering and technology-driven outlook, he seeks to preserve the company's trusted traditions while preparing Jaishree Enterprise for a new era of innovation, advanced manufacturing, and global opportunity.",
  },
];

function LegacySection() {
  return (
    <section className="bg-white py-28 sm:py-40" data-testid="about-legacy">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeUp className="max-w-3xl mx-auto text-center mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-6">Our Family Legacy</p>
          <h2
            className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.12]"
            data-testid="legacy-headline"
          >
            Three Generations.<br />One Standard of Excellence.
          </h2>
        </FadeUp>
        <FadeUp delay={0.12} className="max-w-2xl mx-auto text-center mb-20 sm:mb-28">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-neutral-800 mb-4">
            A Legacy Built by Hand, Heart and Hard Work
          </h3>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Jaishree Enterprise is the story of three generations united by one belief: a company's reputation
            is built through the quality of every component it delivers.
          </p>
        </FadeUp>

        <div className="relative max-w-4xl mx-auto">
          <div
            className="absolute left-6 sm:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-200 sm:-translate-x-1/2"
            aria-hidden="true"
          />
          <div className="space-y-16 sm:space-y-24">
            {GENERATIONS.map((g, i) => (
              <FadeUp key={g.name} delay={i * 0.1}>
                <div
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12 pl-16 sm:pl-0 ${
                    i % 2 === 1 ? "sm:flex-row-reverse" : ""
                  }`}
                  data-testid={`legacy-generation-${i + 1}`}
                >
                  <span
                    className="absolute left-6 sm:left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-brand ring-[5px] ring-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                    aria-hidden="true"
                  />
                  <div className="w-full sm:w-[38%] shrink-0">
                    <div
                      className="aspect-[4/5] rounded-3xl bg-[#F5F5F7] border border-black/8 flex flex-col items-center justify-center gap-3"
                      data-testid={`legacy-portrait-placeholder-${i + 1}`}
                    >
                      <UserRound size={40} className="text-neutral-300" aria-hidden="true" />
                      <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                        Portrait to be added
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-[62%]">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-2">
                      {g.gen}{g.year ? ` · Est. ${g.year}` : ""}
                    </p>
                    <h4 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                      {g.name}
                    </h4>
                    <p className="mt-1 text-sm font-medium text-neutral-500">{g.role}</p>
                    <p className="mt-4 text-base text-neutral-600 leading-relaxed">{g.text}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp delay={0.15} className="max-w-3xl mx-auto text-center mt-24 sm:mt-32">
          <p
            className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-neutral-900 leading-snug"
            data-testid="legacy-quote"
          >
            "Machines may evolve and generations may change, but our commitment to quality will always remain."
          </p>
        </FadeUp>
        <FadeUp delay={0.25} className="max-w-2xl mx-auto text-center mt-10">
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed" data-testid="legacy-closing">
            For the Panchal family, Jaishree Enterprise is not simply a business. It is the result of decades
            of sacrifice, knowledge passed from father to son, and a shared responsibility to leave something
            meaningful for the generation that follows. Every component we manufacture carries a part of that
            legacy.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

const ETHOS = [
  {
    icon: Target,
    title: "Mission",
    text: "To manufacture precision components that match every drawing, specification and application — reliably, and on schedule — for OEMs and plant-maintenance teams.",
  },
  {
    icon: Eye,
    title: "Vision",
    text: "To grow as a dependable, long-term engineering partner for plastics-processing, extrusion and metallurgical machinery manufacturers across India.",
  },
  {
    icon: ShieldCheck,
    title: "Commitment",
    text: "To manufacture strictly to the approved drawing, inspect every component before dispatch, and respond promptly to every enquiry we receive.",
  },
];

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
              industries. From its manufacturing base in Devjipura, Dudheshwar, the company has built
              long-standing experience producing dependable components for Indian and international
              industrial organizations.
            </p>
          </FadeUp>
        </div>
      </section>

      <LegacySection />

      <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="about-ethos">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Chapter number="01" label="Mission, Vision & Commitment" />
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {ETHOS.map((e) => (
              <StaggerItem
                key={e.title}
                data-testid={`ethos-${e.title.toLowerCase()}`}
                className="rounded-3xl bg-white border border-black/5 p-8 hover:-translate-y-1 hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.2)] transition-all duration-300"
              >
                <e.icon size={24} className="text-brand" />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-neutral-900">{e.title}</h3>
                <p className="mt-3 text-sm text-neutral-600 leading-relaxed">{e.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32" data-testid="about-who">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4"><Chapter number="02" label="Who We Are" /></div>
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
            <Chapter number="03" label="What We Manufacture" />
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
          <div className="lg:col-span-4"><Chapter number="04" label="Engineering Philosophy" dark /></div>
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
            <Chapter number="05" label="Ahmedabad Manufacturing Heritage" />
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
