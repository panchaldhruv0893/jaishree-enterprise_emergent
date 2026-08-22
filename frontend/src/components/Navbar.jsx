import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

const linkCls = ({ isActive }) =>
  `text-sm font-medium transition-colors duration-200 ${
    isActive ? "text-white" : "text-white/60 hover:text-white"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const location = useLocation();
  const productsActive = location.pathname.startsWith("/products");

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between" aria-label="Main">
        <Link to="/" className="flex items-baseline gap-2 group" data-testid="nav-logo" aria-label="Jaishree Enterprise home">
          <span className="font-display font-extrabold text-white tracking-tight text-lg">JAISHREE</span>
          <span className="hidden sm:inline text-[10px] font-medium uppercase tracking-[0.25em] text-white/50 group-hover:text-white/80 transition-colors duration-200">
            Enterprise · Since 1983
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) =>
            l.children ? (
              <div key={l.label} className="relative group">
                <button
                  type="button"
                  data-testid={l.testid}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                    productsActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {l.label}
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 absolute left-0 top-full pt-3">
                  <div className="w-72 rounded-2xl bg-[#111] border border-white/10 shadow-2xl p-2">
                    <Link
                      to="/products"
                      data-testid="nav-products-all"
                      className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/5 transition-colors duration-150"
                    >
                      All Products
                    </Link>
                    {l.children.map((c) => (
                      <Link
                        key={c.to}
                        to={c.to}
                        data-testid={c.testid}
                        className="block px-4 py-2.5 rounded-xl text-sm text-white/65 hover:text-white hover:bg-white/5 transition-colors duration-150"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkCls} data-testid={l.testid}>
                {l.label}
              </NavLink>
            )
          )}
          <Link
            to="/contact"
            data-testid="nav-quote-btn"
            onClick={() => trackEvent("quote_cta_click", { location: "navbar" })}
            className="ml-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-200"
          >
            Request a Quote
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden text-white p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 px-5 py-6 space-y-1" data-testid="nav-mobile-menu">
          {NAV_LINKS.map((l) =>
            l.children ? (
              <div key={l.label}>
                <button
                  type="button"
                  data-testid="nav-mobile-products-toggle"
                  aria-expanded={productsOpen}
                  onClick={() => setProductsOpen(!productsOpen)}
                  className="w-full flex items-center justify-between py-3 text-base font-medium text-white"
                >
                  {l.label}
                  <ChevronDown size={16} className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`} />
                </button>
                {productsOpen && (
                  <div className="pl-4 pb-2 space-y-1">
                    <Link to="/products" data-testid="nav-mobile-products-all" onClick={() => setOpen(false)} className="block py-2 text-sm text-white/70">
                      All Products
                    </Link>
                    {l.children.map((c) => (
                      <Link key={c.to} to={c.to} data-testid={`${c.testid}-mobile`} onClick={() => setOpen(false)} className="block py-2 text-sm text-white/70">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={l.to} to={l.to} data-testid={`${l.testid}-mobile`} onClick={() => setOpen(false)} className="block py-3 text-base font-medium text-white">
                {l.label}
              </Link>
            )
          )}
          <Link
            to="/contact"
            data-testid="nav-mobile-quote-btn"
            onClick={() => setOpen(false)}
            className="mt-4 block text-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            Request a Quote
          </Link>
        </div>
      )}
    </header>
  );
}
