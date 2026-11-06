import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";

const features = [
  {
    title: "Guarded before render",
    body: "The request guard verifies the session before a single admin byte is rendered. No flash of protected content, no client-side trust.",
    tag: "proxy.ts",
  },
  {
    title: "Signed, not stored",
    body: "A short-lived HS256 JWT lives in an HttpOnly, SameSite=Lax cookie. There is no session table to migrate or leak.",
    tag: "lib/auth.ts",
  },
  {
    title: "Built to be reused",
    body: "Auth, credentials and session helpers are small, env-driven modules. Copy the folder into the next app and change two variables.",
    tag: "lib/credentials.ts",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign in",
    body: "POST credentials to /api/auth/login. The route compares them in constant time and throttles repeated failures.",
  },
  {
    step: "02",
    title: "Receive a token",
    body: "A JWT is signed with JWT_SECRET and set as an HttpOnly cookie, scoped to the site root for eight hours.",
  },
  {
    step: "03",
    title: "Reach /zg-admin",
    body: "The cookie is verified on every request. Invalid or expired tokens are cleared and bounced to sign-in.",
  },
];

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-backdrop opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-72 left-1/2 h-[38rem] w-[62rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(217,183,117,0.16),transparent_65%)] blur-2xl"
      />

      <header className="relative z-10 border-b border-line-soft/80">
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-3">
            <BrandMark />
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-[0.24em] uppercase">Ziga</span>
              <span className="mt-1 text-[11px] tracking-[0.32em] text-muted/70 uppercase">
                crafted
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a className="transition-colors hover:text-cream" href="#foundation">
              Foundation
            </a>
            <a className="transition-colors hover:text-cream" href="#access">
              Access
            </a>
            <Link className="transition-colors hover:text-cream" href="/zg-login">
              Sign in
            </Link>
          </nav>

          <Link
            href="/zg-admin"
            className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-soft transition-colors hover:border-gold/70 hover:bg-gold/15"
          >
            Admin access
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <section className="mx-auto grid w-full max-w-6xl gap-14 px-6 pt-20 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-[11px] tracking-[0.18em] text-muted uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Next.js 16 · App Router · JWT
            </span>

            <h1 className="mt-7 text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl">
              A quiet foundation for{" "}
              <em className="font-display text-gold-soft not-italic">crafted</em> web apps.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Three pages, one private area, zero ceremony. A public home, a signed-in
              admin dashboard behind <code className="font-mono text-cream">/zg-admin</code>,
              and the small auth layer both of them share — ready to build on for the next
              project.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/zg-admin"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-gold-soft"
              >
                Open the dashboard
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/zg-login"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium text-cream transition-colors hover:border-gold/40 hover:text-gold-soft"
              >
                Admin sign in
              </Link>
            </div>

            <p className="mt-6 font-mono text-xs text-muted/70">
              /zg-admin → 307 → /zg-login → JWT cookie → /zg-admin
            </p>
          </div>

          <div className="card relative overflow-hidden p-2">
            <div className="rounded-xl bg-surface-2/60 p-6">
              <div className="flex items-center justify-between text-[11px] tracking-[0.2em] text-muted uppercase">
                <span>Route map</span>
                <span className="font-mono tracking-normal text-muted/60">v1</span>
              </div>

              <ul className="mt-6 space-y-3">
                <RouteRow path="/" label="Home" access="Public" />
                <RouteRow path="/zg-login" label="Admin sign in" access="Public" />
                <RouteRow path="/zg-admin" label="Admin dashboard" access="JWT only" locked />
                <RouteRow path="/api/auth/*" label="Auth endpoints" access="Server" />
              </ul>

              <div className="mt-6 rounded-lg border border-line-soft bg-canvas/70 p-4">
                <p className="font-mono text-[11px] leading-relaxed text-muted">
                  <span className="text-gold">set-cookie:</span> ziga_admin_session=eyJhbGci…
                  <br />
                  HttpOnly · SameSite=Lax · Path=/ · 8h
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="foundation" className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="flex flex-col gap-3 border-t border-line-soft pt-10 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl tracking-tight text-cream">
              What the foundation gives you
            </h2>
            <p className="max-w-sm text-sm text-muted">
              Everything below is already wired, typed and running — no placeholders to
              hunt down.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="card group flex flex-col p-6 transition-colors hover:border-gold/25"
              >
                <h3 className="text-base font-semibold text-cream">{feature.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{feature.body}</p>
                <p className="mt-6 font-mono text-[11px] text-gold/70">{feature.tag}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="access" className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="card overflow-hidden">
            <div className="grid gap-px bg-line-soft md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.step} className="bg-surface p-7">
                  <span className="font-mono text-xs text-gold/70">{step.step}</span>
                  <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 border-t border-line-soft bg-surface-2/40 px-7 py-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Credentials and the signing secret live in{" "}
                <code className="font-mono text-cream">.env.local</code>.
              </p>
              <Link
                href="/zg-login"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/10"
              >
                Try the sign-in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-line-soft">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-7 text-xs text-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Ziga · foundation release</span>
          <span className="font-mono">Next.js · React · Tailwind · jose</span>
        </div>
      </footer>
    </div>
  );
}

function RouteRow({
  path,
  label,
  access,
  locked = false,
}: {
  path: string;
  label: string;
  access: string;
  locked?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-line-soft/70 bg-canvas/40 px-4 py-3">
      <span className="flex items-center gap-3">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-gold" : "bg-muted/40"}`}
        />
        <span className="font-mono text-xs text-cream">{path}</span>
        <span className="hidden text-xs text-muted sm:inline">{label}</span>
      </span>
      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] tracking-[0.12em] uppercase ${
          locked
            ? "border-gold/30 bg-gold/10 text-gold"
            : "border-line text-muted/80"
        }`}
      >
        {access}
      </span>
    </li>
  );
}
