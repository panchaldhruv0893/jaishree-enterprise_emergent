import { useEffect, useState } from "react";
import { Loader2, Download, Inbox } from "lucide-react";
import { adminApi, DRAWING_URL, getToken } from "@/lib/adminApi";

export default function EnquiriesPanel({ onAuthError }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await adminApi.get("/admin/quotes");
        setQuotes(data);
      } catch (err) {
        if (err.response?.status === 401) onAuthError();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const download = async (q) => {
    // fetch with auth header then trigger a browser download
    try {
      const res = await fetch(DRAWING_URL(q.id), { headers: { Authorization: `Bearer ${getToken()}` } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = q.drawing_name || "drawing";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(DRAWING_URL(q.id), "_blank");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" /></div>;
  if (!quotes.length)
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-neutral-400" data-testid="admin-quotes-empty">
        <Inbox size={32} />
        <p className="text-sm">No enquiries yet.</p>
      </div>
    );

  return (
    <div className="space-y-4" data-testid="admin-quotes">
      {quotes.map((q) => (
        <div key={q.id} className="rounded-xl border border-black/10 p-4" data-testid={`admin-quote-${q.id}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-neutral-900">{q.name} {q.company && <span className="text-neutral-500">· {q.company}</span>}</p>
              <p className="text-sm text-brand">{q.email}{q.phone && ` · ${q.phone}`}</p>
            </div>
            <span className="text-xs text-neutral-400">{new Date(q.created_at).toLocaleString()}</span>
          </div>
          <div className="mt-3 grid gap-x-6 gap-y-1 text-sm text-neutral-700 sm:grid-cols-2">
            <p><span className="text-neutral-400">Product:</span> {q.product}</p>
            {q.material && <p><span className="text-neutral-400">Material:</span> {q.material}</p>}
            {q.quantity && <p><span className="text-neutral-400">Quantity:</span> {q.quantity}</p>}
            {q.location && <p><span className="text-neutral-400">Location:</span> {q.location}</p>}
            {q.delivery_date && <p><span className="text-neutral-400">Delivery:</span> {q.delivery_date}</p>}
          </div>
          {q.specs && <p className="mt-2 text-sm text-neutral-600"><span className="text-neutral-400">Specs:</span> {q.specs}</p>}
          {q.message && <p className="mt-1 text-sm text-neutral-600"><span className="text-neutral-400">Message:</span> {q.message}</p>}
          {q.drawing_path && (
            <button
              onClick={() => download(q)}
              data-testid={`admin-quote-download-${q.id}`}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-1.5 text-xs font-semibold text-neutral-800 hover:border-brand hover:text-brand transition-colors"
            >
              <Download size={13} /> {q.drawing_name || "Drawing"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
