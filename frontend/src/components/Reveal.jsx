import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export const FadeUp = ({ children, delay = 0, className = "", as = "div", ...rest }) => {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export const MaskedLine = ({ children, delay = 0, className = "", inView = false }) => {
  const anim = { y: 0 };
  const trigger = inView
    ? { whileInView: anim, viewport: { once: true, margin: "-40px" } }
    : { animate: anim };
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        {...trigger}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const Stagger = ({ children, className = "" }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 28 },
      show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Chapter = ({ number, label, dark = false }) => (
  <FadeUp className="flex items-center gap-4 mb-6">
    <span className={`font-display text-sm font-semibold tracking-widest ${dark ? "text-brand" : "text-brand"}`}>
      {number}
    </span>
    <span className={`h-px w-12 ${dark ? "bg-white/25" : "bg-black/15"}`} aria-hidden="true" />
    <span className={`text-sm font-medium uppercase tracking-[0.2em] ${dark ? "text-white/60" : "text-neutral-500"}`}>
      {label}
    </span>
  </FadeUp>
);
