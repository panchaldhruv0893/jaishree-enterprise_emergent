import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items, dark = true }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8" data-testid="breadcrumbs">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        <li>
          <Link to="/" className={`${dark ? "text-white/50 hover:text-white" : "text-neutral-500 hover:text-black"} transition-colors duration-150`} data-testid="breadcrumb-home">
            Home
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={12} className={dark ? "text-white/30" : "text-neutral-300"} aria-hidden="true" />
            {it.to ? (
              <Link to={it.to} className={`${dark ? "text-white/50 hover:text-white" : "text-neutral-500 hover:text-black"} transition-colors duration-150`} data-testid={`breadcrumb-${i}`}>
                {it.label}
              </Link>
            ) : (
              <span className={dark ? "text-white/85" : "text-neutral-800"} aria-current="page" data-testid={`breadcrumb-${i}`}>
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
