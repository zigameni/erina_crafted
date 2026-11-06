import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "@/components/login-form";
import { isAuthConfigured, safeRedirectTarget } from "@/lib/auth";
import { isCredentialsConfigured } from "@/lib/credentials";

export const metadata = {
  title: "Admin sign in",
  description: "Sign in to the Ziga admin dashboard.",
};

export default async function AdminLoginPage({ searchParams }: PageProps<"/zg-login">) {
  const params = await searchParams;
  const next = safeRedirectTarget(params.next);
  const configured = isAuthConfigured() && isCredentialsConfigured();

  return (
    <div lang="en" className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-backdrop opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-60 left-1/2 h-[32rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(217,183,117,0.14),transparent_65%)] blur-2xl"
      />

      <header className="relative z-10">
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark size="sm" />
            <span className="text-xs font-semibold tracking-[0.26em] uppercase">Ziga</span>
          </Link>
          <Link
            href="/"
            className="text-xs tracking-[0.16em] text-muted uppercase transition-colors hover:text-cream"
          >
            ← Back home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] sm:p-10">
            <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] text-gold/80 uppercase">
              <span aria-hidden className="h-px w-6 bg-gold/50" />
              Admin access
            </div>

            <h1 className="mt-5 font-display text-3xl tracking-tight text-cream">
              Welcome back.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Sign in to reach{" "}
              <code className="font-mono text-xs text-cream">/zg-admin</code>. Sessions last
              eight hours and are signed as a JWT.
            </p>

            {!configured && (
              <div className="mt-6 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-xs leading-relaxed text-danger">
                Sign-in is not configured yet. Set{" "}
                <code className="font-mono">ADMIN_USERNAME</code>,{" "}
                <code className="font-mono">ADMIN_PASSWORD</code> and{" "}
                <code className="font-mono">JWT_SECRET</code> in{" "}
                <code className="font-mono">.env.local</code>, then restart the dev server.
              </div>
            )}

            <LoginForm next={next} disabled={!configured} />
          </div>

          <p className="mt-6 text-center text-xs text-muted/70">
            Protected area · unauthorised requests are redirected before rendering
          </p>
        </div>
      </main>
    </div>
  );
}
