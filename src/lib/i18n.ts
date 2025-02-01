import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../i18n/locales/en';
import zh from '../i18n/locales/zh';

const i18n = createInstance();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    lng: 'zh', // 默认语言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 