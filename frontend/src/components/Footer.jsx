import { Link } from "react-router-dom";
import { Mail, MapPin, Store } from "lucide-react";
import { COMPANY, NAV_LINKS, EXPERIENCE } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

export default function Footer() {
  return (
    <footer className="bg-black text-white brushed-metal" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <p className="font-display font-extrabold text-2xl tracking-tight">JAISHREE ENTERPRISE</p>
            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/40">Precision Components · Since 1983</p>
            <p className="mt-6 text-sm text-white/60 leading-relaxed max-w-sm">
              Mechanical engineering and precision fabrication from Ahmedabad, Gujarat — serving the
              plastics-processing, extrusion, metallurgical and industrial machinery sectors.
            </p>
            <a
              href={`mailto:${COMPANY.email}`}
              data-testid="footer-email-link"
              onClick={() => trackEvent("email_click", { location: "footer" })}
              className="mt-6 inline-flex items-center gap-2 text-sm text-brand hover:text-white transition-colors duration-200"
            >
              <Mail size={15} /> {COMPANY.email}
            </a>
            <p className="mt-3 flex items-start gap-2 text-sm text-white/60">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              <span>
                {COMPANY.addressLines[0]}
                <br />
                {COMPANY.addressLines[1]}
              </span>
            </p>
            <a
              href={COMPANY.indiamart}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-indiamart-link"
              onClick={() => trackEvent("indiamart_click", { location: "footer" })}
              className="mt-4 inline-flex items-center gap-2 text-sm text-white/60 hover:text-brand transition-colors duration-200"
            >
              <Store size={15} /> Find us on IndiaMART
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-5">Products</p>
            <ul className="space-y-3 text-sm">
              {NAV_LINKS[1].children.map((c) => (
                <li key={c.to}>
                  <Link to={c.to} className="text-white/65 hover:text-white transition-colors duration-150" data-testid={`footer-${c.testid}`}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-5">Company</p>
            <ul className="space-y-3 text-sm">
              {["/industries", "/capabilities", "/about", "/history", "/contact"].map((to) => {
                const l = NAV_LINKS.find((n) => n.to === to);
                return (
                  <li key={to}>
                    <Link to={to} className="text-white/65 hover:text-white transition-colors duration-150" data-testid={`footer-${l.testid}`}>
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-5">Experience</p>
            <ul className="space-y-3 text-sm text-white/65">
              {EXPERIENCE.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Jaishree Enterprise. All rights reserved.
          </p>
          <p className="text-xs text-white/35 max-w-xl">
            Company names are listed as manufacturing experience only and do not imply endorsement,
            partnership or current contracts.
          </p>
        </div>
      </div>
    </footer>
  );
}
