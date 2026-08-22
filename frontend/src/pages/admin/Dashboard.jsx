import { useState } from "react";
import { toast } from "sonner";
import { LogOut, KeyRound, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { adminApi, formatApiError } from "@/lib/adminApi";
import ProductsPanel from "@/pages/admin/ProductsPanel";
import CapabilitiesPanel from "@/pages/admin/CapabilitiesPanel";
import MilestonesPanel from "@/pages/admin/MilestonesPanel";
import EnquiriesPanel from "@/pages/admin/EnquiriesPanel";

export default function Dashboard({ user, onLogout }) {
  const authError = () => {
    toast.error("Session expired. Please sign in again.");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-neutral-50" data-testid="admin-dashboard">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-lg font-bold text-neutral-900">Content Manager</h1>
            <p className="text-xs text-neutral-400">Jaishree Enterprise · {user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <ChangePassword onAuthError={authError} />
            <Button variant="outline" size="sm" onClick={onLogout} data-testid="admin-logout">
              <LogOut size={14} className="mr-1.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products" data-testid="admin-tab-products">Products & Specs</TabsTrigger>
            <TabsTrigger value="capabilities" data-testid="admin-tab-capabilities">Capabilities</TabsTrigger>
            <TabsTrigger value="milestones" data-testid="admin-tab-milestones">History</TabsTrigger>
            <TabsTrigger value="enquiries" data-testid="admin-tab-enquiries">Enquiries</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsPanel onAuthError={authError} /></TabsContent>
          <TabsContent value="capabilities"><CapabilitiesPanel onAuthError={authError} /></TabsContent>
          <TabsContent value="milestones"><MilestonesPanel onAuthError={authError} /></TabsContent>
          <TabsContent value="enquiries"><EnquiriesPanel onAuthError={authError} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ChangePassword({ onAuthError }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      await adminApi.post("/auth/change-password", { current_password: current, new_password: next });
      toast.success("Password updated");
      setOpen(false);
      setCurrent(""); setNext("");
    } catch (err) {
      if (err.response?.status === 401 && err.response?.data?.detail !== "Current password is incorrect") return onAuthError();
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" data-testid="admin-change-password-open">
          <KeyRound size={14} className="mr-1.5" /> Password
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="admin-change-password-dialog">
        <DialogHeader><DialogTitle>Change password</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Current password</Label>
            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="mt-1.5" data-testid="admin-current-password" />
          </div>
          <div>
            <Label>New password <span className="text-xs text-neutral-400">(min 8 characters)</span></Label>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="mt-1.5" data-testid="admin-new-password" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={saving} className="bg-brand hover:bg-brand-dark" data-testid="admin-change-password-submit">
            {saving ? <Loader2 size={16} className="animate-spin" /> : "Update password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
