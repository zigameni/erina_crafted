"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type LoginFormProps = {
  next: string;
  disabled?: boolean;
};

export function LoginForm({ next, disabled = false }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const busy = pending || disabled;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, next }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Sign in failed. Please try again.");
        setPending(false);
        return;
      }

      router.replace(data.redirectTo ?? next);
      router.refresh();
    } catch {
      setError("Network error. Check your connection and try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-[11px] tracking-[0.18em] text-muted uppercase"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="admin"
          className="w-full rounded-lg border border-line bg-canvas/70 px-4 py-3 text-sm text-cream placeholder:text-muted/50 transition-colors focus:border-gold/50 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-[11px] tracking-[0.18em] text-muted uppercase"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-line bg-canvas/70 px-4 py-3 pr-16 text-sm text-cream placeholder:text-muted/50 transition-colors focus:border-gold/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 px-4 text-[11px] tracking-[0.12em] text-muted uppercase transition-colors hover:text-cream"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
        {!pending && <span aria-hidden>→</span>}
      </button>
    </form>
  );
}
