import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uz from './locales/uz.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

export const LANGUAGES = [
  { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
      en: { translation: en },
    },
    fallbackLng: 'uz',
    supportedLngs: ['uz', 'ru', 'en'],
    interpolation: { escapeValue: false },
    detection: {
      // Tanlangan til localStorage'da saqlanadi (sahifa yangilanganda qoladi).
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'eduai_lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
