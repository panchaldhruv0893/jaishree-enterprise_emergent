import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminApi, formatApiError } from "@/lib/adminApi";

const linesToArr = (s) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const arrToLines = (a) => (Array.isArray(a) ? a.join("\n") : "");

export default function ProductsPanel({ onAuthError }) {
  const [products, setProducts] = useState([]);
  const [slug, setSlug] = useState("");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/products");
      setProducts(data);
      if (data.length) selectProduct(data[0], data);
    } catch (err) {
      if (err.response?.status === 401) onAuthError();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const selectProduct = (p, list = products) => {
    const prod = list.find((x) => x.slug === p.slug) || p;
    setSlug(prod.slug);
    setForm({
      name: prod.name || "",
      tagline: prod.tagline || "",
      image: prod.image || "",
      published: prod.published !== false,
      overview: arrToLines(prod.overview),
      applications: arrToLines(prod.applications),
      specs: (prod.specs || []).map((s) => ({ ...s })),
      benefits: (prod.benefits || []).map((b) => ({ ...b })),
      gallery: (prod.gallery || []).map((g) =>
        typeof g === "string" ? { src: g, caption: "" } : { ...g }
      ),
    });
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setRow = (key, i, field, v) =>
    setForm((f) => {
      const rows = [...f[key]];
      rows[i] = { ...rows[i], [field]: v };
      return { ...f, [key]: rows };
    });
  const addRow = (key, obj) => setForm((f) => ({ ...f, [key]: [...f[key], obj] }));
  const delRow = (key, i) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        tagline: form.tagline,
        image: form.image,
        published: form.published,
        overview: linesToArr(form.overview),
        applications: linesToArr(form.applications),
        specs: form.specs.filter((s) => s.label),
        benefits: form.benefits.filter((b) => b.title),
        gallery: form.gallery.filter((g) => g.src),
      };
      await adminApi.put(`/admin/products/${slug}`, payload);
      toast.success("Product saved");
      setProducts((ps) => ps.map((p) => (p.slug === slug ? { ...p, ...payload } : p)));
    } catch (err) {
      if (err.response?.status === 401) return onAuthError();
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" /></div>;
  if (!form) return <p className="text-sm text-neutral-500">No products found.</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-1" data-testid="admin-product-list">
        {products.map((p) => (
          <button
            key={p.slug}
            onClick={() => selectProduct(p)}
            data-testid={`admin-product-item-${p.slug}`}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              p.slug === slug ? "bg-brand text-white" : "hover:bg-neutral-100 text-neutral-700"
            }`}
          >
            {p.name}
            {p.published === false && <span className="ml-1 text-xs opacity-70">(hidden)</span>}
          </button>
        ))}
      </aside>

      <div className="space-y-6" data-testid="admin-product-form">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1.5" data-testid="admin-product-name" />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={form.image} onChange={(e) => set("image", e.target.value)} className="mt-1.5" data-testid="admin-product-image" />
          </div>
        </div>
        <div>
          <Label>Tagline</Label>
          <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className="mt-1.5" data-testid="admin-product-tagline" />
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3">
          <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} data-testid="admin-product-published" />
          <span className="text-sm text-neutral-700">{form.published ? "Published (visible on website)" : "Hidden from website"}</span>
        </div>

        <div>
          <Label>Overview <span className="text-xs text-neutral-400">(one paragraph per line)</span></Label>
          <Textarea rows={4} value={form.overview} onChange={(e) => set("overview", e.target.value)} className="mt-1.5" data-testid="admin-product-overview" />
        </div>
        <div>
          <Label>Applications <span className="text-xs text-neutral-400">(one per line)</span></Label>
          <Textarea rows={4} value={form.applications} onChange={(e) => set("applications", e.target.value)} className="mt-1.5" data-testid="admin-product-applications" />
        </div>

        <RowEditor
          title="Specifications"
          rows={form.specs}
          fields={[["label", "Label"], ["value", "Value"]]}
          onChange={(i, f, v) => setRow("specs", i, f, v)}
          onAdd={() => addRow("specs", { label: "", value: "" })}
          onDelete={(i) => delRow("specs", i)}
          testid="specs"
        />
        <RowEditor
          title="Benefits"
          rows={form.benefits}
          fields={[["title", "Title"], ["text", "Description"]]}
          onChange={(i, f, v) => setRow("benefits", i, f, v)}
          onAdd={() => addRow("benefits", { title: "", text: "" })}
          onDelete={(i) => delRow("benefits", i)}
          testid="benefits"
        />
        <RowEditor
          title="Gallery"
          rows={form.gallery}
          fields={[["src", "Image URL"], ["caption", "Caption"]]}
          onChange={(i, f, v) => setRow("gallery", i, f, v)}
          onAdd={() => addRow("gallery", { src: "", caption: "" })}
          onDelete={(i) => delRow("gallery", i)}
          testid="gallery"
        />

        <div className="sticky bottom-4 flex justify-end">
          <Button onClick={save} disabled={saving} className="bg-brand hover:bg-brand-dark shadow-lg" data-testid="admin-product-save">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={15} className="mr-2" /> Save changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RowEditor({ title, rows, fields, onChange, onAdd, onDelete, testid }) {
  return (
    <div className="rounded-xl border border-black/10 p-4" data-testid={`admin-${testid}-editor`}>
      <div className="mb-3 flex items-center justify-between">
        <Label className="text-sm font-semibold">{title}</Label>
        <Button size="sm" variant="outline" onClick={onAdd} data-testid={`admin-${testid}-add`}>
          <Plus size={14} className="mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-start gap-2">
            {fields.map(([key, ph]) => (
              key === "text" ? (
                <Textarea key={key} rows={2} placeholder={ph} value={row[key] || ""}
                  onChange={(e) => onChange(i, key, e.target.value)} className="flex-1" data-testid={`admin-${testid}-${key}-${i}`} />
              ) : (
                <Input key={key} placeholder={ph} value={row[key] || ""}
                  onChange={(e) => onChange(i, key, e.target.value)} className="flex-1" data-testid={`admin-${testid}-${key}-${i}`} />
              )
            ))}
            <Button size="icon" variant="ghost" onClick={() => onDelete(i)} className="text-red-500 shrink-0" data-testid={`admin-${testid}-del-${i}`}>
              <Trash2 size={15} />
            </Button>
          </div>
        ))}
        {rows.length === 0 && <p className="text-xs text-neutral-400">No entries yet.</p>}
      </div>
    </div>
  );
}
