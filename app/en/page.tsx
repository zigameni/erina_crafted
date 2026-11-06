import type { Metadata } from "next";

import { HomePage } from "@/components/home/home-page";
import { getContent, LOCALE_PATHS } from "@/lib/content";

import "../home.css";

const LOCALE = "en" as const;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent(LOCALE);

  return {
    title: { absolute: content.meta.title },
    description: content.meta.description,
    alternates: {
      canonical: LOCALE_PATHS[LOCALE],
      languages: { sq: LOCALE_PATHS.sq, en: LOCALE_PATHS.en },
    },
  };
}

export default async function EnglishPage() {
  const content = await getContent(LOCALE);

  return <HomePage content={content} locale={LOCALE} />;
}
