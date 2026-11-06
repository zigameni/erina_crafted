import Link from "next/link";

import { SESSION_COOKIE, SESSION_ISSUER, SESSION_MAX_AGE, isAuthConfigured } from "@/lib/auth";
import { isCredentialsConfigured, getAdminUsername } from "@/lib/credentials";
import { getAdminSessionDetails } from "@/lib/session";

function formatUtc(value: Date | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(value);
}

export default async function AdminOverviewPage() {
  const details = await getAdminSessionDetails();

  // The layout guard already redirects anonymous visitors; this is the
  // session-specific data for the page itself.
  const username = details?.session.sub ?? getAdminUsername() ?? "admin";
  const sessionHours = Math.round(SESSION_MAX_AGE / 3600);
  const credentialsReady = isCredentialsConfigured();
  const secretReady = isAuthConfigured();

  const stats = [
    { label: "Session", value: details ? "Active" : "Unknown", hint: "verified on request" },
    { label: "Role", value: details?.session.role ?? "admin", hint: "scope of access" },
    {
      label: "Expires",
      value: formatUtc(details?.expiresAt ?? null),
      hint: `${sessionHours}h token lifetime`,
    },
    { label: "Transport", value: "HttpOnly", hint: "same-site cookie" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-gold/80 uppercase">Overview</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-cream">
            Welcome back, {username}.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            The private area of the starter. Every value below comes from the live JWT
            session — nothing here is mocked.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
        >
          Public site ↗
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <p className="text-[10px] tracking-[0.18em] text-muted/70 uppercase">
              {stat.label}
            </p>
            <p className="mt-2 truncate text-lg font-semibold text-cream">{stat.value}</p>
            <p className="mt-1 text-[11px] text-muted/60">{stat.hint}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-cream">Session details</h2>
            <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 text-[10px] tracking-[0.14em] text-gold uppercase">
              JWT · HS256
            </span>
          </div>

          <dl className="mt-5 divide-y divide-line-soft text-sm">
            <DetailRow label="Subject" value={details?.session.sub ?? "—"} mono />
            <DetailRow label="Cookie" value={SESSION_COOKIE} mono />
            <DetailRow label="Issuer" value={SESSION_ISSUER} mono />
            <DetailRow label="Issued" value={formatUtc(details?.issuedAt ?? null)} />
            <DetailRow label="Expires" value={formatUtc(details?.expiresAt ?? null)} />
          </dl>

          <div className="mt-6 rounded-lg border border-line-soft bg-canvas/60 px-4 py-3">
            <p className="text-[11px] leading-relaxed text-muted">
              Sign out clears the cookie client-side and on the server. Any request without a
              valid signature is redirected to{" "}
              <code className="font-mono text-cream">/zg-login</code> by the proxy guard.
            </p>
          </div>
        </section>

        <div className="space-y-4">
          <section className="card p-6">
            <h2 className="text-sm font-semibold text-cream">Environment</h2>
            <ul className="mt-4 space-y-3">
              <CheckRow
                label="JWT_SECRET"
                state={secretReady ? "ok" : "missing"}
                note="32+ characters"
              />
              <CheckRow
                label="ADMIN_USERNAME"
                state={credentialsReady ? "ok" : "missing"}
                note="admin identity"
              />
              <CheckRow
                label="ADMIN_PASSWORD"
                state={credentialsReady ? "ok" : "missing"}
                note="constant-time compare"
              />
              <CheckRow
                label="Secure cookie"
                state={process.env.NODE_ENV === "production" ? "ok" : "warn"}
                note={
                  process.env.NODE_ENV === "production"
                    ? "enabled"
                    : "production builds only"
                }
              />
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-sm font-semibold text-cream">Next steps</h2>
            <ol className="mt-4 space-y-3 text-sm text-muted">
              <NextStep index="01" text="Replace the starter credentials with real ones." />
              <NextStep index="02" text="Add your first content model to this dashboard." />
              <NextStep index="03" text="Persist data in a database and scope it per admin." />
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-2.5">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`truncate text-right text-xs text-cream ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function CheckRow({
  label,
  state = "missing",
  note,
}: {
  label: string;
  state?: "ok" | "warn" | "missing";
  note: string;
}) {
  const dot =
    state === "ok" ? "bg-gold" : state === "warn" ? "bg-gold/50" : "bg-danger";
  const text =
    state === "ok"
      ? "text-muted/70"
      : state === "warn"
        ? "text-gold/70"
        : "text-danger";

  return (
    <li className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 font-mono text-[11px] text-cream">
        <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </span>
      <span className={`text-[11px] ${text}`}>
        {state === "missing" ? "not set" : note}
      </span>
    </li>
  );
}

function NextStep({ index, text }: { index: string; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="font-mono text-[11px] text-gold/70">{index}</span>
      <span className="text-xs leading-relaxed">{text}</span>
    </li>
  );
}
