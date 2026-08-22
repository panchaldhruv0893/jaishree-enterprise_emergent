import Marquee from "react-fast-marquee";
import { MARQUEE_ITEMS } from "@/data/content";

export default function EditorialMarquee({ dark = false }) {
  return (
    <div
      className={`py-6 border-y overflow-hidden ${dark ? "bg-black border-white/10" : "bg-white border-black/5"}`}
      data-testid="editorial-marquee"
      aria-hidden="true"
    >
      <Marquee speed={28} gradient={false} pauseOnHover>
        {MARQUEE_ITEMS.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className={`mx-8 text-sm font-medium uppercase tracking-[0.3em] whitespace-nowrap ${dark ? "text-white/45" : "text-neutral-400"}`}>
              {item}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-brand" : "bg-brand"}`} />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
