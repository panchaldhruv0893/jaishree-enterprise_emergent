import { useState } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/lib/api";
import { COMPANY, PRODUCT_OPTIONS } from "@/data/content";
import { trackEvent } from "@/lib/analytics";

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-shadow duration-200";

const Field = ({ label, required, children, htmlFor }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
      {label} {required && <span className="text-brand">*</span>}
    </label>
    {children}
  </div>
);

export default function RFQForm({ presetProduct = "", source = "contact" }) {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", location: "",
    product: presetProduct, material: "", specs: "", quantity: "",
    delivery_date: "", message: "", website: "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [quoteId, setQuoteId] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.product) {
      toast.error("Please fill in your name, business email and product required.");
      return;
    }
    setStatus("sending");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) {
        fd.append("drawing", file);
        trackEvent("drawing_upload", { source, product: form.product });
      }
      const res = await fetch(`${API}/quotes`, { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Submission failed");
      }
      const data = await res.json();
      setQuoteId(data.id);
      setStatus("success");
      trackEvent("quote_request", { source, product: form.product });
    } catch (err) {
      setStatus("idle");
      toast.error(err.message || "Something went wrong. Please email us directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-10 text-center" data-testid="rfq-success-message">
        <CheckCircle2 className="mx-auto text-brand" size={44} />
        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">Enquiry received.</h3>
        <p className="mt-3 text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
          Thank you — our team will review your requirement and respond shortly. A confirmation has been
          sent to your email{quoteId ? ` (reference ${quoteId.slice(0, 8)})` : ""}.
        </p>
        <p className="mt-4 text-sm text-neutral-600">
          Prefer email? Write to us at{" "}
          <a
            href={`mailto:${COMPANY.email}`}
            data-testid="rfq-success-email-link"
            onClick={() => trackEvent("email_click", { location: "rfq_success" })}
            className="text-brand font-medium hover:underline"
          >
            {COMPANY.email}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-black/10 bg-white p-6 sm:p-10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]" data-testid="rfq-form" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Name" required htmlFor="rfq-name">
          <input id="rfq-name" data-testid="rfq-name-input" className={inputCls} value={form.name} onChange={set("name")} autoComplete="name" required />
        </Field>
        <Field label="Company" htmlFor="rfq-company">
          <input id="rfq-company" data-testid="rfq-company-input" className={inputCls} value={form.company} onChange={set("company")} autoComplete="organization" />
        </Field>
        <Field label="Business Email" required htmlFor="rfq-email">
          <input id="rfq-email" type="email" data-testid="rfq-email-input" className={inputCls} value={form.email} onChange={set("email")} autoComplete="email" required />
        </Field>
        <Field label="Phone / WhatsApp" htmlFor="rfq-phone">
          <input id="rfq-phone" type="tel" data-testid="rfq-phone-input" className={inputCls} value={form.phone} onChange={set("phone")} autoComplete="tel" />
        </Field>
        <Field label="City & Country" htmlFor="rfq-location">
          <input id="rfq-location" data-testid="rfq-location-input" className={inputCls} value={form.location} onChange={set("location")} />
        </Field>
        <Field label="Product Required" required htmlFor="rfq-product">
          <select id="rfq-product" data-testid="rfq-product-select" className={inputCls} value={form.product} onChange={set("product")} required>
            <option value="">Select a product</option>
            {PRODUCT_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Material (if known)" htmlFor="rfq-material">
          <input id="rfq-material" data-testid="rfq-material-input" className={inputCls} value={form.material} onChange={set("material")} placeholder="e.g. EN8, SS304, brass" />
        </Field>
        <Field label="Quantity" htmlFor="rfq-quantity">
          <input id="rfq-quantity" data-testid="rfq-quantity-input" className={inputCls} value={form.quantity} onChange={set("quantity")} placeholder="e.g. 2 pieces / monthly batch" />
        </Field>
        <Field label="Dimensions / Specifications" htmlFor="rfq-specs">
          <input id="rfq-specs" data-testid="rfq-specs-input" className={inputCls} value={form.specs} onChange={set("specs")} placeholder="e.g. ID 110 mm × length 300 mm" />
        </Field>
        <Field label="Required Delivery Date" htmlFor="rfq-delivery">
          <input id="rfq-delivery" type="date" data-testid="rfq-delivery-input" className={inputCls} value={form.delivery_date} onChange={set("delivery_date")} />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Message" htmlFor="rfq-message">
          <textarea id="rfq-message" rows={4} data-testid="rfq-message-input" className={`${inputCls} resize-y`} value={form.message} onChange={set("message")} placeholder="Tell us about your application, working conditions or anything else relevant." />
        </Field>
      </div>

      <div className="mt-6">
        <label htmlFor="rfq-drawing" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
          Drawing Upload <span className="normal-case font-normal text-neutral-400">(PDF, JPG, PNG, DWG, DXF — max 10 MB)</span>
        </label>
        <label
          htmlFor="rfq-drawing"
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-black/20 bg-neutral-50 px-4 py-4 text-sm text-neutral-600 hover:border-brand hover:bg-brand-mist transition-colors duration-200"
          data-testid="rfq-drawing-dropzone"
        >
          <Upload size={16} className="text-brand shrink-0" />
          <span className="truncate">{file ? file.name : "Choose a drawing file"}</span>
          <input
            id="rfq-drawing"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
            className="sr-only"
            data-testid="rfq-drawing-input"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && f.size > 10 * 1024 * 1024) {
                toast.error("File must be under 10 MB.");
                e.target.value = "";
                return;
              }
              setFile(f || null);
            }}
          />
        </label>
      </div>

      <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <button
        type="submit"
        disabled={status === "sending"}
        data-testid="rfq-submit-btn"
        className="mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-brand px-10 py-3.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60 transition-colors duration-200"
      >
        {status === "sending" && <Loader2 size={16} className="animate-spin" />}
        {status === "sending" ? "Sending…" : "Submit Enquiry"}
      </button>
      <p className="mt-4 text-xs text-neutral-500">
        Your enquiry is sent directly to our team. You can also email{" "}
        <a href={`mailto:${COMPANY.email}`} data-testid="rfq-email-fallback" onClick={() => trackEvent("email_click", { location: "rfq_form" })} className="text-brand hover:underline">
          {COMPANY.email}
        </a>
      </p>
    </form>
  );
}
