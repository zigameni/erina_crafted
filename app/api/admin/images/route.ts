import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, type Locale } from "@/lib/content";
import { getAdminSession } from "@/lib/session";
import { uploadImage } from "@/lib/uploads";

/**
 * Receives one image from the content editor and returns its public URL.
 *
 * A route handler rather than a server action so the editor can swap a single
 * image without submitting the whole document, and so the failure modes are
 * plain JSON status codes.
 */
export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Sign in again to upload images." }, { status: 401 });
  }

  // Uploads change the site, so refuse a cross-site post even though the
  // session cookie is SameSite-protected.
  const origin = request.headers.get("origin");
  if (origin) {
    let sameOrigin = false;
    try {
      sameOrigin = new URL(origin).host === request.headers.get("host");
    } catch {
      sameOrigin = false;
    }
    if (!sameOrigin) {
      return NextResponse.json({ ok: false, error: "Cross-origin upload refused." }, { status: 403 });
    }
  }

  const form = await request.formData();
  const locale: Locale = form.get("locale") === "en" ? "en" : DEFAULT_LOCALE;
  const slot = String(form.get("slot") ?? "");
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No image was received." }, { status: 400 });
  }

  try {
    const url = await uploadImage(locale, slot, file);
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not save that image." },
      { status: 400 },
    );
  }
}
