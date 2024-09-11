'use client';
import i18n from "i18next";
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useEffect, useState } from 'react';
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { buildResources } from "./settings";

const hostUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const runsOnServerSide = typeof window === 'undefined'

const resourcesLangCard = {
  en: {
    translation: {
      LangCard: {
        cardTitle: "Welcome to our App",
        cardDescription: "Learn how to use the Trans component",
        regularText: "This is a regular translation.",
        transText: "This is a <strong>Trans component</strong> example with a <3>link<1/></3>.",
        linkText: "documentation",
        switchLanguage: "Switch to French"
      }
    }
  },

  fr: {
    translation: {
      LangCard: {
        cardTitle: "Bienvenue dans notre Application",
        cardDescription: "Apprenez à utiliser le composant Trans",
        regularText: "Ceci est une traduction régulière.",
        transText: "Voici un exemple de composant <strong>Trans</strong> avec un <3>lien<1/></3>.",
        linkText: "documentation",
        switchLanguage: "Passer à la langue vietnamienne"
      }
    }
  },

  vi: {
    translation: {
      LangCard: {
        cardTitle: "Chào mừng đến với ứng dụng của chúng tôi",
        cardDescription: "Học cách sử dụng thành phần Trans",
        regularText: "Đây là một ví dụ về dịch thuật thông thường.",
        transText: "Đây là một ví dụ về thành phần <strong>Trans</strong> với một <3>liên kết<1/></3>.",
        linkText: "tài liệu",
        switchLanguage: "Chuyển sang tiếng Anh"
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .use(ChainedBackend)
  .init({
    backend: {
      backends: [
        // if a namespace can't be loaded via normal http-backend loadPath, 
        //then the inMemoryLocalBackend will try to return the correct resources
        HttpBackend,
        resourcesToBackend(buildResources)
      ],
      backendOptions: [{
        loadPath: `${hostUrl}/translations/{{lng}}/{{ns}}.json`
      }]
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    partialBundledLanguages: true
  })

export default i18n;

interface UseTranslationOptions {
  keyPrefix?: string
}

export function useTranslation(lng: string, ns: string | string[], options: UseTranslationOptions = {}) {
  const ret = useTranslationOrg(ns, options)
  const { i18n } = ret
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage])
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return
      i18n.changeLanguage(lng)
    }, [lng, i18n])
  }
  return ret
}