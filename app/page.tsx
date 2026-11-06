import type { Metadata } from "next";

import { HomePage } from "@/components/home/home-page";
import { DEFAULT_LOCALE, getContent, LOCALE_PATHS } from "@/lib/content";

import "./home.css";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent(DEFAULT_LOCALE);

  return {
    title: { absolute: content.meta.title },
    description: content.meta.description,
    alternates: {
      canonical: LOCALE_PATHS[DEFAULT_LOCALE],
      languages: { sq: LOCALE_PATHS.sq, en: LOCALE_PATHS.en },
    },
  };
}

export default async function Page() {
  const content = await getContent(DEFAULT_LOCALE);

  return <HomePage content={content} locale={DEFAULT_LOCALE} />;
}
