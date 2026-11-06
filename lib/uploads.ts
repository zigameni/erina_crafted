import { promises as fs } from "node:fs";
import path from "node:path";

import type { Locale, SiteContent } from "@/lib/content";

/**
 * Uploaded images, one file per language and image "slot".
 *
 * The site's shipped photography is remote (Unsplash) and stays the default:
 * an upload simply replaces the URL in the content file. Because a slot can
 * only ever show one image, uploading again deletes the previous file, and
 * `pruneUploads` removes files whose slot no longer appears in the content.
 *
 * Server-only: writes to `public/uploads`, which the app serves at `/uploads/…`.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads/";
const MAX_BYTES = 8 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

/** Slots mirror the image fields in the admin form: hero, studio, service-N, work-N. */
const SLOT = /^(hero|studio|service-\d{1,2}|work-\d{1,2})$/;

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

function prefixFor(locale: Locale, slot: string): string {
  return `${locale}-${slot}-`;
}

async function listUploads(): Promise<string[]> {
  try {
    return await fs.readdir(UPLOAD_DIR);
  } catch {
    return [];
  }
}

/**
 * Stores one image for a slot and returns its public URL. Only the image type
 * decides the extension, and the slot is checked against a strict pattern, so a
 * crafted request cannot choose the path.
 */
export async function uploadImage(locale: Locale, slot: string, file: File): Promise<string> {
  if (!SLOT.test(slot)) throw new Error("That image spot is not recognised.");

  const extension = EXTENSIONS[file.type];
  if (!extension) throw new Error("Use a JPEG, PNG, WebP, AVIF or GIF image.");
  if (file.size === 0) throw new Error("That file is empty.");
  if (file.size > MAX_BYTES) throw new Error("Images must be under 8 MB.");

  const prefix = prefixFor(locale, slot);
  const name = `${prefix}${Date.now()}${extension}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));

  // One image per spot: the previous upload for this language and place goes.
  const stale = (await listUploads()).filter(
    (existing) => existing !== name && existing.startsWith(prefix),
  );
  await Promise.all(
    stale.map((existing) => fs.rm(path.join(UPLOAD_DIR, existing), { force: true })),
  );

  return `${PUBLIC_PREFIX}${name}`;
}

function usedUploads(content: SiteContent): Set<string> {
  return new Set(
    [
      content.hero.image.src,
      content.studio.image.src,
      ...content.services.items.map((item) => item.image),
      ...content.work.items.map((item) => item.image),
    ].filter((src) => src.startsWith(PUBLIC_PREFIX)),
  );
}

/**
 * Deletes this language's uploads that the saved content no longer references —
 * for example the photo of a project that was removed from the list.
 */
export async function pruneUploads(locale: Locale, content: SiteContent): Promise<void> {
  const used = usedUploads(content);
  const prefix = `${locale}-`;
  const orphans = (await listUploads()).filter(
    (name) => name.startsWith(prefix) && !used.has(`${PUBLIC_PREFIX}${name}`),
  );

  await Promise.all(orphans.map((name) => fs.rm(path.join(UPLOAD_DIR, name), { force: true })));
}
