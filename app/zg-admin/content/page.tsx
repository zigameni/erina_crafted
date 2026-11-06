import Link from "next/link";

import { ContentForm } from "@/components/admin/content-form";
import {
  DEFAULT_LOCALE,
  getContent,
  LOCALE_LABELS,
  LOCALE_PATHS,
  LOCALES,
  type Locale,
} from "@/lib/content";
import { requireAdmin } from "@/lib/session";

export const metadata = {
  title: "Content",
  description: "Edit the public site's copy, images and contact details.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin("/zg-admin/content");

  const params = await searchParams;
  const locale: Locale = params.lang === "en" ? "en" : DEFAULT_LOCALE;
  const content = await getContent(locale);
  const saved = params.saved === "1";
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-gold/80 uppercase">Content</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight text-cream">
            Edit the site
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Every word and image on the public page lives in a JSON file per language. Saving
            here validates the content, writes the file and refreshes the live pages.
          </p>
        </div>

        <Link
          href={LOCALE_PATHS[locale]}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
        >
          Preview {LOCALE_LABELS[locale]} ↗
        </Link>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Content language">
        {LOCALES.map((option) => {
          const current = option === locale;
          return (
            <Link
              key={option}
              href={`/zg-admin/content?lang=${option}`}
              aria-current={current ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                current
                  ? "border-gold/40 bg-gold/10 text-gold-soft"
                  : "border-line text-muted hover:border-gold/30 hover:text-cream"
              }`}
            >
              {LOCALE_LABELS[option]}
              <span className="ml-2 font-mono text-[10px] text-muted/50">
                {LOCALE_PATHS[option]}
              </span>
            </Link>
          );
        })}
      </nav>

      {saved && (
        <p className="rounded-lg border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-gold-soft">
          Saved. The public pages have been refreshed.
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-xs leading-relaxed text-danger">
          Nothing was saved — {error}
        </p>
      )}

      <ContentForm key={locale} locale={locale} content={content} />
    </div>
  );
}
