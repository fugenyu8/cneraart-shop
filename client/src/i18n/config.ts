import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import zh from './locales/zh.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import th from './locales/th.json';
import vi from './locales/vi.json';
import id from './locales/id.json';
import tr from './locales/tr.json';
import zhHant from './locales/zh-Hant.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      de: { translation: de },
      fr: { translation: fr },
      es: { translation: es },
      it: { translation: it },
      pt: { translation: pt },
      ru: { translation: ru },
      ja: { translation: ja },
      ko: { translation: ko },
      ar: { translation: ar },
      hi: { translation: hi },
      th: { translation: th },
      vi: { translation: vi },
      id: { translation: id },
      tr: { translation: tr },
      'zh-Hant': { translation: zhHant },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'zh-Hant', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'ko', 'ar', 'hi', 'th', 'vi', 'id', 'tr'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    debug: false,
  });

export default i18n;
