import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { loginRequest, setToken } from "@/lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await loginRequest(email, password);
      setToken(res.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <form
        onSubmit={submit}
        data-testid="admin-login-form"
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-md ring-1 ring-border sm:p-10"
      >
        <span
          aria-hidden="true"
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-gold"
        >
          <Lock className="h-6 w-6" />
        </span>
        <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">
          Organizer Login
        </h1>
        <p className="mt-2 text-center text-sm text-charcoal/60">
          Dalleo Open Digital Clubhouse
        </p>
        <div className="mt-8 flex flex-col gap-5">
          <label className="block">
            <span className="text-sm font-bold text-charcoal">Email</span>
            <input
              type="email"
              required
              autoComplete="username"
              data-testid="login-email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-base shadow-sm focus:border-forest"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-charcoal">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              data-testid="login-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-base shadow-sm focus:border-forest"
            />
          </label>
          {error && (
            <p role="alert" data-testid="login-error" className="rounded-xl bg-red-700/10 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            data-testid="login-submit"
            disabled={busy}
            className="min-h-12 rounded-full bg-forest px-8 py-3 text-base font-extrabold text-cream shadow-sm transition-colors duration-200 hover:bg-forest-soft disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
