import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ar from './locales/ar.json';
import en from './locales/en.json';
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const APP_LANG = localStorage.setItem('APP_LANG', 'ar');
export let currentLang = localStorage.getItem('APP_LANG');
const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// const languageDetectorOptions = {
//   order: ['localStorage', 'navigator', 'htmlTag'],
//   // lookupLocalStorage: APP_LANG,
//   caches: ['localStorage'],
// };

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    lng: currentLang || 'ar', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// PAGE DIRECTION
if (currentLang === 'ar') {
  document.documentElement.lang = 'ar';
  document.documentElement.dir = 'rtl';
} else {
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
}

export const changeLanguage = (lang: string) => {
  currentLang = lang;
  i18n.changeLanguage(lang);
  localStorage.setItem('APP_LANG', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
};

export default i18n;
