import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import viTranslations from './locales/vi.json';
import cnTranslations from './locales/cn.json'; // Import the Chinese translations

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        translation: viTranslations
      },
      en: {
        translation: enTranslations
      },

      cn: { // Add Chinese translations
        translation: cnTranslations
      }
    },
    fallbackLng: 'vi',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;
