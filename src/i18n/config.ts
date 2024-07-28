import { createInstance } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import enTranslation from "./en/translation.json";
import jaTranslation from "./ja/translation.json";
import jaZodTranslation from "./ja/zod.json";

export const resources = {
  en: { translation: enTranslation },
  ja: {
    translation: jaTranslation,
    zod: jaZodTranslation,
  },
} as const;

const i18nInstance = createInstance();

i18nInstance
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export { i18nInstance };

z.setErrorMap(makeZodI18nMap({ t: i18nInstance.t }));

export { z };
