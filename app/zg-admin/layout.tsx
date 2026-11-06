import Link from "next/link";
import { headers } from "next/headers";

import { BrandMark } from "@/components/brand-mark";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAdmin } from "@/lib/session";

export const metadata = {
  title: "Admin dashboard",
  description: "Ziga admin area.",
};

export default async function AdminLayout({ children }: LayoutProps<"/zg-admin">) {
  const session = await requireAdmin();
  // Stamped by the proxy guard, so the shell can mark the current section
  // without becoming a client component.
  const pathname = (await headers()).get("x-admin-path") ?? "/zg-admin";
  const onContent = pathname.startsWith("/zg-admin/content");
  const section = onContent ? "Content" : "Overview";

  const navItems = [
    { label: "Overview", href: "/zg-admin", active: !onContent, soon: false },
    { label: "Content", href: "/zg-admin/content", active: onContent, soon: false },
    { label: "Settings", href: "/zg-admin", active: false, soon: true },
  ];

  return (
    <div lang="en" className="flex min-h-screen flex-col lg:flex-row">
      <aside className="border-b border-line-soft bg-surface/60 lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark size="sm" />
            <span className="flex flex-col leading-none">
              <span className="text-[11px] font-semibold tracking-[0.26em] uppercase">
                Ziga
              </span>
              <span className="mt-1 text-[10px] tracking-[0.24em] text-muted/70 uppercase">
                admin
              </span>
            </span>
          </Link>
          <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] text-gold lg:hidden">
            /zg-admin
          </span>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-1 lg:px-3 lg:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                item.active
                  ? "bg-gold/10 text-gold-soft"
                  : "text-muted hover:bg-surface-2/70 hover:text-cream"
              }`}
            >
              <span>{item.label}</span>
              {item.soon && (
                <span className="ml-3 hidden text-[9px] tracking-[0.16em] text-muted/50 uppercase lg:inline">
                  soon
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden px-3 pb-5 lg:mt-8 lg:block">
          <div className="rounded-lg border border-line-soft bg-canvas/60 p-3">
            <p className="text-[10px] tracking-[0.18em] text-muted/60 uppercase">Signed in</p>
            <p className="mt-1 truncate font-mono text-xs text-cream">{session.sub}</p>
            <p className="mt-1 text-[11px] text-muted/70">role · {session.role}</p>
          </div>
          <div className="mt-3">
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-line-soft px-5 sm:px-8">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="tracking-[0.18em] uppercase">Admin</span>
            <span aria-hidden className="text-muted/40">
              /
            </span>
            <span className="text-cream">{section}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-xs text-muted transition-colors hover:text-cream sm:inline"
            >
              View site ↗
            </Link>
            <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
              <span className="max-w-32 truncate font-mono text-[11px] text-cream">
                {session.sub}
              </span>
            </span>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>

        <div className="px-5 pb-6 lg:hidden">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
