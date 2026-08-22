import { Mail, MapPin, Store } from "lucide-react";
import SEO, { breadcrumbLd } from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import RFQForm from "@/components/RFQForm";
import { FadeUp } from "@/components/Reveal";
import { COMPANY } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

export default function Contact() {
  return (
    <>
      <SEO
        title="Request a Quote | Contact Jaishree Enterprise Ahmedabad"
        description="Request a quotation for vacuum calibration sleeves, industrial pistons, cylinders or custom machinery parts. Upload your drawing. Jaishree Enterprise, Devjipura, Dudheshwar, Ahmedabad, Gujarat 380004."
        path="/contact"
        jsonLd={breadcrumbLd([{ label: "Home", to: "/" }, { label: "Contact" }])}
      />
      <section className="bg-black text-white brushed-metal pt-40 pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand mb-6">Contact / Request a Quote</p>
            <h1 className="font-display font-extrabold tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-4xl" data-testid="contact-headline">
              Let's build your component.
            </h1>
            <p className="mt-8 max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed">
              Share your requirement, dimensions or drawing — our team will review it and respond
              with a quotation.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#F5F5F7] py-24 sm:py-32" data-testid="contact-main">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-10">
            <FadeUp>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand mb-4">Visit Us</p>
                <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-900">{COMPANY.name}</h2>
                <p className="mt-3 flex items-start gap-2 text-sm text-neutral-600" data-testid="contact-address">
                  <MapPin size={15} className="mt-0.5 text-brand shrink-0" />
                  <span>{COMPANY.addressLines[0]}<br />{COMPANY.addressLines[1]}</span>
                </p>
                <a
                  href={`mailto:${COMPANY.email}`}
                  data-testid="contact-email-link"
                  onClick={() => trackEvent("email_click", { location: "contact_page" })}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
                >
                  <Mail size={15} /> {COMPANY.email}
                </a>
                <div className="mt-4">
                  <a
                    href={COMPANY.indiamart}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="contact-indiamart-link"
                    onClick={() => trackEvent("indiamart_click", { location: "contact_page" })}
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2.5 text-xs font-semibold text-neutral-800 hover:border-brand hover:text-brand transition-colors duration-200"
                  >
                    <Store size={14} /> Find us on IndiaMART
                  </a>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="overflow-hidden rounded-3xl border border-black/10 shadow-sm" data-testid="contact-map">
                <iframe
                  title="Map — Devjipura, Dudheshwar, Ahmedabad"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=72.5700%2C23.0300%2C72.6100%2C23.0650&layer=mapnik&marker=23.0470%2C72.5900"
                  className="h-80 w-full border-0"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-xs text-neutral-400">Map centered on Devjipura, Dudheshwar, Ahmedabad.</p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="rounded-2xl bg-white border border-black/5 p-6">
                <p className="text-sm font-semibold text-neutral-900">What happens after you submit?</p>
                <ol className="mt-3 space-y-2 text-sm text-neutral-600 list-decimal list-inside">
                  <li>Your enquiry reaches our team directly by email.</li>
                  <li>We review your requirement and drawing technically.</li>
                  <li>We respond with questions or a quotation.</li>
                </ol>
              </div>
            </FadeUp>
          </div>

          <div className="lg:col-span-7">
            <FadeUp delay={0.1}>
              <RFQForm source="contact" />
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
