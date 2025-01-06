import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import common from '../locales/en/common.json';
import auth from '../locales/en/auth.json';
import account from '../locales/en/account.json';
import categories from '../locales/en/categories.json';
import transaction from '../locales/en/transaction.json';
import settings from '../locales/en/settings.json';

export const resources = {
  en: {
    common,
    auth,
    account,
    categories,
    transaction,
    settings,
  },
} as const;

i18n.use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    resources,
    defaultNS: 'common',
  });
