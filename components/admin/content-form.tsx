"use client";

import { useId, useState, type ChangeEvent, type ReactNode } from "react";

import { saveContentAction } from "@/app/zg-admin/content/actions";
import type { Locale, Material, ServiceItem, SiteContent, WorkItem } from "@/lib/content";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-canvas/70 px-3 py-2 text-sm text-cream outline-none transition-colors focus:border-gold/50";
const labelClass = "text-[11px] tracking-[0.14em] text-muted uppercase";
const addButtonClass =
  "rounded-full border border-line px-3 py-1.5 text-[11px] tracking-[0.12em] text-muted uppercase transition-colors hover:border-gold/40 hover:text-gold-soft";
const removeButtonClass =
  "rounded-full border border-line px-3 py-1.5 text-[11px] tracking-[0.12em] text-muted uppercase transition-colors hover:border-danger/40 hover:text-danger";

export function ContentForm({ locale, content }: { locale: Locale; content: SiteContent }) {
  const [draft, setDraft] = useState<SiteContent>(content);

  function update(mutate: (next: SiteContent) => void) {
    setDraft((previous) => {
      const next = structuredClone(previous);
      mutate(next);
      return next;
    });
  }

  return (
    <form action={saveContentAction} className="space-y-5 pb-24">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="content" value={JSON.stringify(draft)} />

      <Section title="Search & social preview" note="Title and description for search engines">
        <Field
          label="Page title"
          value={draft.meta.title}
          onChange={(value) => update((next) => void (next.meta.title = value))}
          wide
        />
        <Area
          label="Meta description"
          value={draft.meta.description}
          onChange={(value) => update((next) => void (next.meta.description = value))}
        />
      </Section>

      <Section title="Brand & header" note="Name, menu button and language link">
        <Field
          label="Brand name"
          value={draft.brand.name}
          onChange={(value) => update((next) => void (next.brand.name = value))}
        />
        <Field
          label="Brand suffix"
          value={draft.brand.sub}
          onChange={(value) => update((next) => void (next.brand.sub = value))}
        />
        <Field
          label="Instagram label"
          value={draft.header.instagramLabel}
          onChange={(value) => update((next) => void (next.header.instagramLabel = value))}
        />
        <Field
          label="Header button label"
          value={draft.header.cta}
          onChange={(value) => update((next) => void (next.header.cta = value))}
        />
        <Field
          label="Language link label"
          value={draft.langLink.label}
          onChange={(value) => update((next) => void (next.langLink.label = value))}
          hint={draft.langLink.href}
        />
      </Section>

      <Section title="Hero" note="The first screen visitors see">
        <Field
          label="Eyebrow"
          value={draft.hero.eyebrow}
          onChange={(value) => update((next) => void (next.hero.eyebrow = value))}
          wide
        />
        <Field
          label="Title, first line"
          value={draft.hero.title.line1}
          onChange={(value) => update((next) => void (next.hero.title.line1 = value))}
        />
        <Field
          label="Title, second line before the italic"
          value={draft.hero.title.line2Before}
          onChange={(value) => update((next) => void (next.hero.title.line2Before = value))}
        />
        <Field
          label="Italic word"
          value={draft.hero.title.emphasis}
          onChange={(value) => update((next) => void (next.hero.title.emphasis = value))}
        />
        <Field
          label="After the italic word"
          value={draft.hero.title.line2After}
          onChange={(value) => update((next) => void (next.hero.title.line2After = value))}
        />
        <Area
          label="Intro paragraph"
          value={draft.hero.lede}
          onChange={(value) => update((next) => void (next.hero.lede = value))}
        />
        <Field
          label="Button label"
          value={draft.hero.cta}
          onChange={(value) => update((next) => void (next.hero.cta = value))}
        />
        <Field
          label="Bottom-right note"
          value={draft.hero.footMeta}
          onChange={(value) => update((next) => void (next.hero.footMeta = value))}
        />
        <ImageField
          label="Hero image"
          value={draft.hero.image.src}
          onChange={(value) => update((next) => void (next.hero.image.src = value))}
          locale={locale}
          slot="hero"
        />
        <Field
          label="Hero image description"
          value={draft.hero.image.alt}
          onChange={(value) => update((next) => void (next.hero.image.alt = value))}
          wide
        />
      </Section>

      <Section title="The practice" note="Statement block under the hero">
        <Field
          label="Label"
          value={draft.intro.label}
          onChange={(value) => update((next) => void (next.intro.label = value))}
        />
        <Area
          label="Statement"
          value={draft.intro.heading}
          onChange={(value) => update((next) => void (next.intro.heading = value))}
        />
        <Area
          label="Body"
          value={draft.intro.body}
          onChange={(value) => update((next) => void (next.intro.body = value))}
        />
        <Area
          label="Small print (optional)"
          value={draft.intro.fineprint}
          onChange={(value) => update((next) => void (next.intro.fineprint = value))}
        />
      </Section>

      <Section title="Services" note="Rows on the left, images on the right">
        <Field
          label="Label"
          value={draft.services.label}
          onChange={(value) => update((next) => void (next.services.label = value))}
        />
        <Field
          label="Heading"
          value={draft.services.heading}
          onChange={(value) => update((next) => void (next.services.heading = value))}
        />
        <Field
          label="Caption under the image"
          value={draft.services.caption}
          onChange={(value) => update((next) => void (next.services.caption = value))}
          wide
        />

        {draft.services.items.map((service, index) => (
          <ItemCard
            key={index}
            title={`Service ${index + 1}`}
            onRemove={
              draft.services.items.length > 1
                ? () => update((next) => void next.services.items.splice(index, 1))
                : undefined
            }
          >
            <Field
              label="Title"
              value={service.title}
              onChange={(value) => update((next) => void (next.services.items[index].title = value))}
            />
            <Field
              label="Image description"
              value={service.alt}
              onChange={(value) => update((next) => void (next.services.items[index].alt = value))}
            />
            <Area
              label="Copy"
              value={service.copy}
              onChange={(value) => update((next) => void (next.services.items[index].copy = value))}
            />
            <ImageField
              label="Image"
              value={service.image}
              onChange={(value) => update((next) => void (next.services.items[index].image = value))}
              locale={locale}
              slot={`service-${index}`}
            />
          </ItemCard>
        ))}

        <div className="sm:col-span-2">
          <button
            type="button"
            className={addButtonClass}
            onClick={() =>
              update((next) =>
                void next.services.items.push({
                  title: "New service",
                  copy: "Describe this service.",
                  image:
                    "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1000&q=75",
                  alt: "Describe the photograph",
                } satisfies ServiceItem),
              )
            }
          >
            + Add service
          </button>
        </div>
      </Section>

      <Section title="Selected work" note="The asymmetric project grid">
        <Field
          label="Label"
          value={draft.work.label}
          onChange={(value) => update((next) => void (next.work.label = value))}
        />
        <Field
          label="Heading"
          value={draft.work.heading}
          onChange={(value) => update((next) => void (next.work.heading = value))}
        />
        <Area
          label="Note beside the heading"
          value={draft.work.note}
          onChange={(value) => update((next) => void (next.work.note = value))}
        />

        {draft.work.items.map((project, index) => (
          <ItemCard
            key={index}
            title={`Project ${index + 1}`}
            onRemove={
              draft.work.items.length > 1
                ? () => update((next) => void next.work.items.splice(index, 1))
                : undefined
            }
          >
            <Field
              label="Name"
              value={project.name}
              onChange={(value) => update((next) => void (next.work.items[index].name = value))}
            />
            <Field
              label="Material · year"
              value={project.meta}
              onChange={(value) => update((next) => void (next.work.items[index].meta = value))}
            />
            <ImageField
              label="Image"
              value={project.image}
              onChange={(value) => update((next) => void (next.work.items[index].image = value))}
              locale={locale}
              slot={`work-${index}`}
            />
            <Field
              label="Image description"
              value={project.alt}
              onChange={(value) => update((next) => void (next.work.items[index].alt = value))}
            />
            <label className="flex items-center gap-2 text-xs text-muted sm:col-span-2">
              <input
                type="checkbox"
                checked={project.portrait}
                onChange={(event) =>
                  update(
                    (next) => void (next.work.items[index].portrait = event.target.checked),
                  )
                }
                className="h-4 w-4 accent-[var(--color-gold)]"
              />
              Portrait crop (tall image, offset in the grid)
            </label>
          </ItemCard>
        ))}

        <div className="sm:col-span-2">
          <button
            type="button"
            className={addButtonClass}
            onClick={() =>
              update((next) =>
                void next.work.items.push({
                  name: "New commission",
                  meta: "Oak · 2026",
                  alt: "Describe the photograph",
                  image:
                    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=75",
                  portrait: false,
                } satisfies WorkItem),
              )
            }
          >
            + Add project
          </button>
        </div>
      </Section>

      <Section title="The studio" note="Studio image, statement and materials">
        <Field
          label="Label"
          value={draft.studio.label}
          onChange={(value) => update((next) => void (next.studio.label = value))}
        />
        <Field
          label="Italic words in the heading"
          value={draft.studio.heading.emphasis}
          onChange={(value) => update((next) => void (next.studio.heading.emphasis = value))}
        />
        <Field
          label="Heading, before the italic"
          value={draft.studio.heading.before}
          onChange={(value) => update((next) => void (next.studio.heading.before = value))}
        />
        <Field
          label="Heading, after the italic"
          value={draft.studio.heading.after}
          onChange={(value) => update((next) => void (next.studio.heading.after = value))}
        />
        <Area
          label="Body"
          value={draft.studio.body}
          onChange={(value) => update((next) => void (next.studio.body = value))}
        />
        <Field
          label="Link label"
          value={draft.studio.link}
          onChange={(value) => update((next) => void (next.studio.link = value))}
        />
        <ImageField
          label="Image"
          value={draft.studio.image.src}
          onChange={(value) => update((next) => void (next.studio.image.src = value))}
          locale={locale}
          slot="studio"
        />
        <Field
          label="Image description"
          value={draft.studio.image.alt}
          onChange={(value) => update((next) => void (next.studio.image.alt = value))}
        />
        <Field
          label="Caption"
          value={draft.studio.caption}
          onChange={(value) => update((next) => void (next.studio.caption = value))}
          wide
        />

        {draft.studio.materials.map((material, index) => (
          <div key={index} className="grid grid-cols-[1fr_auto] items-end gap-3">
            <Field
              label={`Material ${index + 1}`}
              value={material.name}
              onChange={(value) =>
                update((next) => void (next.studio.materials[index].name = value))
              }
            />
            <div className="flex items-end gap-2 pb-1">
              <label className="block">
                <span className={labelClass}>Colour</span>
                <input
                  type="color"
                  value={material.swatch}
                  onChange={(event) =>
                    update((next) => void (next.studio.materials[index].swatch = event.target.value))
                  }
                  className="mt-1.5 h-9 w-12 cursor-pointer rounded-lg border border-line bg-canvas/70"
                />
              </label>
              {draft.studio.materials.length > 1 && (
                <button
                  type="button"
                  className={removeButtonClass}
                  onClick={() => update((next) => void next.studio.materials.splice(index, 1))}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="sm:col-span-2">
          <button
            type="button"
            className={addButtonClass}
            onClick={() =>
              update((next) =>
                void next.studio.materials.push({
                  name: "New material",
                  swatch: "#b98b5e",
                } satisfies Material),
              )
            }
          >
            + Add material
          </button>
        </div>
      </Section>

      <Section title="Contact" note="What visitors use to reach the studio">
        <Field
          label="Label"
          value={draft.contact.label}
          onChange={(value) => update((next) => void (next.contact.label = value))}
        />
        <Field
          label="Email"
          value={draft.contact.email}
          onChange={(value) => update((next) => void (next.contact.email = value))}
        />
        <Field
          label="Phone (optional)"
          value={draft.contact.phone}
          onChange={(value) => update((next) => void (next.contact.phone = value))}
          hint="Shown under the paragraph when filled"
        />
        <Field
          label="Location (optional)"
          value={draft.contact.location}
          onChange={(value) => update((next) => void (next.contact.location = value))}
        />
        <Field
          label="Instagram handle"
          value={draft.contact.instagramHandle}
          onChange={(value) => update((next) => void (next.contact.instagramHandle = value))}
        />
        <Field
          label="Instagram URL"
          value={draft.contact.instagramUrl}
          onChange={(value) => update((next) => void (next.contact.instagramUrl = value))}
        />
        <Field
          label="Title, first line"
          value={draft.contact.title.line1}
          onChange={(value) => update((next) => void (next.contact.title.line1 = value))}
        />
        <Field
          label="Title, before the italic"
          value={draft.contact.title.before}
          onChange={(value) => update((next) => void (next.contact.title.before = value))}
        />
        <Field
          label="Italic word"
          value={draft.contact.title.emphasis}
          onChange={(value) => update((next) => void (next.contact.title.emphasis = value))}
        />
        <Field
          label="After the italic word"
          value={draft.contact.title.line2After}
          onChange={(value) => update((next) => void (next.contact.title.line2After = value))}
        />
        <Area
          label="Paragraph"
          value={draft.contact.lede}
          onChange={(value) => update((next) => void (next.contact.lede = value))}
        />
        <Area
          label="Small print (optional)"
          value={draft.contact.fineprint}
          onChange={(value) => update((next) => void (next.contact.fineprint = value))}
        />
      </Section>

      <Section title="Footer">
        <Field
          label="Staff link label"
          value={draft.footer.signIn}
          onChange={(value) => update((next) => void (next.footer.signIn = value))}
        />
        <Field
          label="Copyright name"
          value={draft.footer.copyrightName}
          onChange={(value) => update((next) => void (next.footer.copyrightName = value))}
        />
      </Section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface/95 px-4 py-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur">
        <p className="text-xs text-muted">
          Editing {locale === "sq" ? "Albanian" : "English"} content. Saving updates the live pages.
        </p>
        <button
          type="submit"
          className="rounded-full bg-gold px-5 py-2 text-xs font-semibold text-canvas transition-colors hover:bg-gold-soft"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="card p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-soft pb-4">
        <h2 className="text-sm font-semibold text-cream">{title}</h2>
        {note && <p className="text-[11px] text-muted/70">{note}</p>}
      </header>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line-soft bg-canvas/40 p-4 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] tracking-[0.16em] text-muted/70 uppercase">{title}</p>
        {onRemove && (
          <button type="button" className={removeButtonClass} onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className={labelClass}>{label}</span>
      <input
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <span className="mt-1 block text-[11px] break-all text-muted/50">{hint}</span>}
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block sm:col-span-2">
      <span className={labelClass}>{label}</span>
      <textarea
        className={`${inputClass} min-h-24 resize-y`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

/**
 * An image slot: thumbnail, editable URL, and an upload that replaces the
 * photo for this language and spot. Uploading again deletes the previous file
 * for the spot on the server, so each place keeps exactly one image.
 */
function ImageField({
  label,
  value,
  onChange,
  locale,
  slot,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  locale: Locale;
  slot: string;
}) {
  const urlId = useId();
  const fileId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);

    try {
      const body = new FormData();
      body.set("locale", locale);
      body.set("slot", slot);
      body.set("file", file);

      const response = await fetch("/api/admin/images", { method: "POST", body });
      const result = (await response.json()) as { ok?: boolean; url?: string; error?: string };

      if (!response.ok || !result.ok || !result.url) {
        setError(result.error ?? "Could not upload that image.");
      } else {
        onChange(result.url);
      }
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="sm:col-span-2">
      <label htmlFor={urlId} className={labelClass}>
        {label}
      </label>
      <div className="mt-1.5 flex gap-3">
        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-canvas">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an arbitrary image URL
            <img
              key={value}
              src={value}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="grid h-full place-items-center text-[10px] text-muted/50">
              No image
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            id={urlId}
            className={`${inputClass} mt-0`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              id={fileId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFile}
              disabled={busy}
            />
            <label
              htmlFor={fileId}
              className={`${addButtonClass} cursor-pointer ${busy ? "pointer-events-none opacity-50" : ""}`}
            >
              {busy ? "Uploading…" : "Upload image"}
            </label>
            <span className="text-[11px] text-muted/50">
              Replaces the photo for this spot. Save to publish.
            </span>
          </div>
          {error && <p className="mt-1.5 text-[11px] text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
}
