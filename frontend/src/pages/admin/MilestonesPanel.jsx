import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminApi, formatApiError } from "@/lib/adminApi";

export default function MilestonesPanel({ onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.get("/admin/milestones");
      setItems(data);
    } catch (err) {
      if (err.response?.status === 401) onAuthError();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const update = (id, k, v) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [k]: v } : it)));

  const save = async (item) => {
    setSavingId(item.id);
    try {
      await adminApi.post("/admin/milestones", item);
      toast.success("Milestone saved");
    } catch (err) {
      if (err.response?.status === 401) return onAuthError();
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (item) => {
    if (item.id && !item._new) {
      try { await adminApi.delete(`/admin/milestones/${item.id}`); }
      catch (err) { if (err.response?.status === 401) return onAuthError(); }
    }
    setItems((list) => list.filter((it) => it.id !== item.id));
    toast.success("Milestone removed");
  };

  const add = () => {
    const id = `ms-new-${Date.now()}`;
    setItems((list) => [...list, { id, _new: true, year: "", title: "", text: "", placeholder: false, order: (list.length + 1) }]);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" /></div>;

  return (
    <div className="space-y-4" data-testid="admin-milestones">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-black/10 p-4 space-y-3" data-testid={`admin-milestone-${item.id}`}>
          <div className="grid gap-3 sm:grid-cols-[120px_1fr_90px]">
            <div>
              <Label className="text-xs">Year</Label>
              <Input value={item.year} onChange={(e) => update(item.id, "year", e.target.value)} className="mt-1" data-testid={`admin-ms-year-${item.id}`} />
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={item.title} onChange={(e) => update(item.id, "title", e.target.value)} className="mt-1" data-testid={`admin-ms-title-${item.id}`} />
            </div>
            <div>
              <Label className="text-xs">Order</Label>
              <Input type="number" value={item.order ?? 0} onChange={(e) => update(item.id, "order", Number(e.target.value))} className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Text</Label>
            <Textarea rows={2} value={item.text} onChange={(e) => update(item.id, "text", e.target.value)} className="mt-1" data-testid={`admin-ms-text-${item.id}`} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                checked={!item.placeholder}
                onCheckedChange={(v) => update(item.id, "placeholder", !v)}
                data-testid={`admin-ms-placeholder-${item.id}`}
              />
              <span className="text-sm text-neutral-600">{item.placeholder ? "Placeholder (needs confirmation)" : "Confirmed milestone"}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="text-red-500" onClick={() => remove(item)} data-testid={`admin-ms-del-${item.id}`}>
                <Trash2 size={15} />
              </Button>
              <Button size="sm" className="bg-brand hover:bg-brand-dark" disabled={savingId === item.id} onClick={() => save(item)} data-testid={`admin-ms-save-${item.id}`}>
                {savingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} className="mr-1" /> Save</>}
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={add} data-testid="admin-ms-add">
        <Plus size={15} className="mr-1" /> Add milestone
      </Button>
    </div>
  );
}
