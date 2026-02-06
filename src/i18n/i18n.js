import i18next from "i18next";

import * as en from './locales/en.json';
import * as ru from './locales/ru.json';
import {initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

export const languages = ['ru', 'en']

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
  lng: 'ru',
  debug: true,
  resources: {
    en: {
      translation: en
    },
    ru: {
      translation: ru
    }
  }
})

export default i18next;