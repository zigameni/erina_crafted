import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * The site's content model.
 *
 * Every string the home page renders lives in `content/site.<locale>.json`, so
 * the admin panel edits content rather than code, and adding a language means
 * adding one file. Reads and writes are server-only — this module uses `fs` and
 * must never be imported by a client component (types are fine).
 */

export const LOCALES = ["en", "sq"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "sq";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  sq: "Shqip",
};

/** The default language sits at the root; every other language gets a prefix. */
export const LOCALE_PATHS: Record<Locale, string> = {
  sq: "/",
  en: "/en",
};

export type Image = { src: string; alt: string };
export type NavLink = { href: string; label: string };
export type SplitHeading = { before: string; emphasis: string; after: string };
export type HeroTitle = { line1: string; line2Before: string; emphasis: string; line2After: string };
export type ContactTitle = { line1: string; before: string; emphasis: string; line2After: string };

export type ServiceItem = { title: string; copy: string; image: string; alt: string };
export type WorkItem = { name: string; meta: string; alt: string; image: string; portrait: boolean };
export type Material = { name: string; swatch: string };

export type SiteContent = {
  locale: Locale;
  meta: { title: string; description: string };
  brand: { name: string; sub: string };
  nav: NavLink[];
  header: { instagramLabel: string; cta: string };
  langLink: { href: string; label: string; hreflang: string };
  hero: {
    eyebrow: string;
    title: HeroTitle;
    lede: string;
    cta: string;
    footMeta: string;
    image: Image;
  };
  intro: { label: string; heading: string; body: string; fineprint: string };
  services: { label: string; heading: string; caption: string; items: ServiceItem[] };
  work: { label: string; heading: string; note: string; items: WorkItem[] };
  studio: {
    label: string;
    heading: SplitHeading;
    body: string;
    caption: string;
    image: Image;
    materials: Material[];
    link: string;
  };
  contact: {
    label: string;
    title: ContactTitle;
    lede: string;
    email: string;
    phone: string;
    location: string;
    instagramHandle: string;
    instagramUrl: string;
    fineprint: string;
  };
  footer: { signIn: string; copyrightName: string };
};

const CONTENT_DIR = path.join(process.cwd(), "content");

export function contentFile(locale: Locale): string {
  return path.join(CONTENT_DIR, `site.${locale}.json`);
}

/* ---------- validation ---------- */

const LIMIT = { tiny: 80, short: 200, line: 400, text: 1600 };

function fail(field: string, expectation: string): never {
  throw new Error(`${field} ${expectation}`);
}

function record(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(field, "must be an object.");
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string, max = LIMIT.line, allowEmpty = false): string {
  if (typeof value !== "string") fail(field, "must be text.");
  const trimmed = value.trim();
  if (!allowEmpty && trimmed.length === 0) fail(field, "cannot be empty.");
  if (trimmed.length > max) fail(field, `must be at most ${max} characters.`);
  return trimmed;
}

function optionalText(value: unknown, field: string, max = LIMIT.line): string {
  return text(value ?? "", field, max, true);
}

function list(value: unknown, field: string, min: number, max: number): unknown[] {
  if (!Array.isArray(value)) fail(field, "must be a list.");
  if (value.length < min) fail(field, `needs at least ${min} item(s).`);
  if (value.length > max) fail(field, `can hold at most ${max} items.`);
  return value;
}

function url(value: unknown, field: string): string {
  const candidate = text(value, field, LIMIT.text);
  if (candidate.startsWith("/")) return candidate;
  if (/^https?:\/\/[^\s]+$/i.test(candidate)) return candidate;
  fail(field, "must start with https://, http:// or /.");
}

function anchor(value: unknown, field: string): string {
  const candidate = text(value, field, LIMIT.short);
  if (!candidate.startsWith("#")) fail(field, "must be an in-page anchor starting with #.");
  return candidate;
}

function swatch(value: unknown, field: string): string {
  const candidate = text(value, field, 7);
  if (!/^#[0-9a-f]{6}$/i.test(candidate)) fail(field, "must be a hex colour like #b98b5e.");
  return candidate;
}

function email(value: unknown, field: string): string {
  const candidate = text(value, field, LIMIT.short);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(candidate)) fail(field, "must be an email address.");
  return candidate;
}

/**
 * Turns untrusted JSON (a file on disk, or the admin form) into a SiteContent.
 * Throws with a field-specific message rather than letting a bad shape reach
 * the page.
 */
export function parseContent(locale: Locale, input: unknown): SiteContent {
  const root = record(input, "content");
  const meta = record(root.meta, "meta");
  const brand = record(root.brand, "brand");
  const header = record(root.header, "header");
  const langLink = record(root.langLink, "langLink");
  const hero = record(root.hero, "hero");
  const heroTitle = record(hero.title, "hero.title");
  const heroImage = record(hero.image, "hero.image");
  const intro = record(root.intro, "intro");
  const services = record(root.services, "services");
  const work = record(root.work, "work");
  const studio = record(root.studio, "studio");
  const studioHeading = record(studio.heading, "studio.heading");
  const studioImage = record(studio.image, "studio.image");
  const contact = record(root.contact, "contact");
  const contactTitle = record(contact.title, "contact.title");
  const footer = record(root.footer, "footer");

  return {
    locale,
    meta: {
      title: text(meta.title, "meta.title", LIMIT.short),
      description: text(meta.description, "meta.description", LIMIT.line),
    },
    brand: {
      name: text(brand.name, "brand.name", LIMIT.tiny),
      sub: text(brand.sub, "brand.sub", LIMIT.tiny),
    },
    nav: list(root.nav, "nav", 1, 6).map((item, index) => {
      const link = record(item, `nav[${index}]`);
      return { href: anchor(link.href, `nav[${index}].href`), label: text(link.label, `nav[${index}].label`, LIMIT.tiny) };
    }),
    header: {
      instagramLabel: text(header.instagramLabel, "header.instagramLabel", LIMIT.tiny),
      cta: text(header.cta, "header.cta", LIMIT.tiny),
    },
    langLink: {
      href: text(langLink.href, "langLink.href", LIMIT.short),
      label: text(langLink.label, "langLink.label", LIMIT.tiny),
      hreflang: text(langLink.hreflang, "langLink.hreflang", 5),
    },
    hero: {
      eyebrow: text(hero.eyebrow, "hero.eyebrow", LIMIT.short),
      title: {
        line1: text(heroTitle.line1, "hero.title.line1", LIMIT.short),
        line2Before: text(heroTitle.line2Before, "hero.title.line2Before", LIMIT.short, true),
        emphasis: text(heroTitle.emphasis, "hero.title.emphasis", LIMIT.tiny),
        line2After: text(heroTitle.line2After, "hero.title.line2After", 20, true),
      },
      lede: text(hero.lede, "hero.lede", LIMIT.text),
      cta: text(hero.cta, "hero.cta", LIMIT.tiny),
      footMeta: text(hero.footMeta, "hero.footMeta", LIMIT.short),
      image: { src: url(heroImage.src, "hero.image.src"), alt: text(heroImage.alt, "hero.image.alt", LIMIT.line) },
    },
    intro: {
      label: text(intro.label, "intro.label", LIMIT.tiny),
      heading: text(intro.heading, "intro.heading", LIMIT.text),
      body: text(intro.body, "intro.body", LIMIT.text),
      fineprint: optionalText(intro.fineprint, "intro.fineprint", LIMIT.text),
    },
    services: {
      label: text(services.label, "services.label", LIMIT.tiny),
      heading: text(services.heading, "services.heading", LIMIT.line),
      caption: text(services.caption, "services.caption", LIMIT.short),
      items: list(services.items, "services.items", 1, 6).map((item, index) => {
        const service = record(item, `services.items[${index}]`);
        return {
          title: text(service.title, `services.items[${index}].title`, LIMIT.short),
          copy: text(service.copy, `services.items[${index}].copy`, LIMIT.text),
          image: url(service.image, `services.items[${index}].image`),
          alt: text(service.alt, `services.items[${index}].alt`, LIMIT.line),
        };
      }),
    },
    work: {
      label: text(work.label, "work.label", LIMIT.tiny),
      heading: text(work.heading, "work.heading", LIMIT.line),
      note: text(work.note, "work.note", LIMIT.line),
      items: list(work.items, "work.items", 1, 9).map((item, index) => {
        const entry = record(item, `work.items[${index}]`);
        return {
          name: text(entry.name, `work.items[${index}].name`, LIMIT.short),
          meta: text(entry.meta, `work.items[${index}].meta`, LIMIT.tiny),
          alt: text(entry.alt, `work.items[${index}].alt`, LIMIT.line),
          image: url(entry.image, `work.items[${index}].image`),
          portrait: entry.portrait === true || entry.portrait === "true" || entry.portrait === "on",
        };
      }),
    },
    studio: {
      label: text(studio.label, "studio.label", LIMIT.tiny),
      heading: {
        before: text(studioHeading.before, "studio.heading.before", LIMIT.short, true),
        emphasis: text(studioHeading.emphasis, "studio.heading.emphasis", LIMIT.tiny),
        after: text(studioHeading.after, "studio.heading.after", LIMIT.short, true),
      },
      body: text(studio.body, "studio.body", LIMIT.text),
      caption: text(studio.caption, "studio.caption", LIMIT.short),
      image: { src: url(studioImage.src, "studio.image.src"), alt: text(studioImage.alt, "studio.image.alt", LIMIT.line) },
      materials: list(studio.materials, "studio.materials", 1, 8).map((item, index) => {
        const material = record(item, `studio.materials[${index}]`);
        return {
          name: text(material.name, `studio.materials[${index}].name`, LIMIT.tiny),
          swatch: swatch(material.swatch, `studio.materials[${index}].swatch`),
        };
      }),
      link: text(studio.link, "studio.link", LIMIT.tiny),
    },
    contact: {
      label: text(contact.label, "contact.label", LIMIT.tiny),
      title: {
        line1: text(contactTitle.line1, "contact.title.line1", LIMIT.short),
        before: text(contactTitle.before, "contact.title.before", LIMIT.short, true),
        emphasis: text(contactTitle.emphasis, "contact.title.emphasis", LIMIT.tiny),
        line2After: text(contactTitle.line2After, "contact.title.line2After", 20, true),
      },
      lede: text(contact.lede, "contact.lede", LIMIT.text),
      email: email(contact.email, "contact.email"),
      phone: optionalText(contact.phone, "contact.phone", LIMIT.tiny),
      location: optionalText(contact.location, "contact.location", LIMIT.short),
      instagramHandle: optionalText(contact.instagramHandle, "contact.instagramHandle", LIMIT.tiny),
      instagramUrl: url(contact.instagramUrl, "contact.instagramUrl"),
      fineprint: optionalText(contact.fineprint, "contact.fineprint", LIMIT.text),
    },
    footer: {
      signIn: text(footer.signIn, "footer.signIn", LIMIT.tiny),
      copyrightName: text(footer.copyrightName, "footer.copyrightName", LIMIT.short),
    },
  };
}

/* ---------- read / write ---------- */

export async function getContent(locale: Locale): Promise<SiteContent> {
  const raw = await fs.readFile(contentFile(locale), "utf8");
  return parseContent(locale, JSON.parse(raw));
}

/**
 * Writes through a temporary file and renames it into place, so a crash
 * mid-write cannot leave the site serving half a JSON document.
 */
export async function saveContent(locale: Locale, content: SiteContent): Promise<void> {
  const file = contentFile(locale);
  const payload = `${JSON.stringify({ ...content, locale }, null, 2)}\n`;
  const temporary = `${file}.${process.pid}.tmp`;

  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.writeFile(temporary, payload, "utf8");
  await fs.rename(temporary, file);
}
