import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi, setToken, formatApiError } from "@/lib/adminApi";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await adminApi.post("/auth/login", { email, password });
      setToken(data.token);
      onLogin(data);
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-6" data-testid="admin-login">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
            <Lock size={20} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Owner Login</h1>
          <p className="mt-1 text-sm text-neutral-400">Jaishree Enterprise · Content Manager</p>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-8 shadow-xl">
          <div>
            <Label htmlFor="admin-email" className="text-sm">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              data-testid="admin-login-email"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="admin-password" className="text-sm">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              data-testid="admin-login-password"
              className="mt-1.5"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" data-testid="admin-login-error">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="w-full bg-brand hover:bg-brand-dark"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
