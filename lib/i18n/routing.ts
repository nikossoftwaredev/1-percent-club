import { defineRouting } from "next-intl/routing";

export const SUPPORTED_LOCALES = ["en", "el", "es"] as const;

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES, 
  defaultLocale: SUPPORTED_LOCALES[0],
  localeDetection: true,
});