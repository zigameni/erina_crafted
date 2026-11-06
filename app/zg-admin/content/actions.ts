"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  DEFAULT_LOCALE,
  LOCALE_PATHS,
  parseContent,
  saveContent,
  type Locale,
} from "@/lib/content";
import { requireAdmin } from "@/lib/session";
import { pruneUploads } from "@/lib/uploads";

/**
 * Saves one locale's content. The form posts the whole document as JSON, so
 * the shape stays exactly what the page components read.
 *
 * Every write is re-checked against the session: a server action is a public
 * POST endpoint, so the layout guard is not enough on its own.
 */
export async function saveContentAction(formData: FormData) {
  await requireAdmin("/zg-admin/content");

  const requested = formData.get("locale");
  const locale: Locale = requested === "en" ? "en" : DEFAULT_LOCALE;
  const payload = formData.get("content");

  let error: string | null = null;

  try {
    if (typeof payload !== "string") throw new Error("No content was submitted.");

    const content = parseContent(locale, JSON.parse(payload));
    await saveContent(locale, content);

    // Housekeeping: uploaded photos for spots that no longer exist (a removed
    // project, say) would otherwise stay on disk forever. A failure here must
    // not undo a save that succeeded.
    await pruneUploads(locale, content).catch(() => {});

    revalidatePath(LOCALE_PATHS.sq);
    revalidatePath(LOCALE_PATHS.en);
    revalidatePath("/zg-admin/content");
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Could not save the content.";
  }

  if (error) {
    redirect(`/zg-admin/content?lang=${locale}&error=${encodeURIComponent(error)}`);
  }

  redirect(`/zg-admin/content?lang=${locale}&saved=1`);
}
