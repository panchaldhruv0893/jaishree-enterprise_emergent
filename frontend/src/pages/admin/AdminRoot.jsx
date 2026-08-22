import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { adminApi, getToken, clearToken } from "@/lib/adminApi";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";

export default function AdminRoot() {
  const [user, setUser] = useState(null); // null=checking, false=logged out, obj=logged in
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    document.title = "Owner Login · Jaishree Enterprise";
    (async () => {
      if (!getToken()) {
        setUser(false);
        setChecking(false);
        return;
      }
      try {
        const { data } = await adminApi.get("/auth/me");
        setUser(data);
      } catch {
        clearToken();
        setUser(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  const logout = () => {
    clearToken();
    setUser(false);
  };

  if (checking)
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950" data-testid="admin-checking">
        <Loader2 className="animate-spin text-white" />
      </div>
    );

  if (!user) return <Login onLogin={setUser} />;
  return <Dashboard user={user} onLogout={logout} />;
}
