import { createInstance } from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { buildResources, getOptions } from './settings';

const hostUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface I18nOptions {
  lng: string
  ns: string | string[]
  options?: any
}

const initI18next = async ({ lng, ns, options }: I18nOptions) => {
  const i18nInstance = createInstance()
  await i18nInstance
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
      interpolation: {
        escapeValue: false
      },
      partialBundledLanguages: true,
      ...getOptions({ lng, ns }),
      ...options
    })
  return i18nInstance
}

interface UseTranslationOptions {
  keyPrefix?: string
}

export async function useTranslation(lng: string, ns: string | string[], options: UseTranslationOptions = {}) {
  console.debug("useTranslation: initI18next", lng, ns, options)
  const i18nextInstance = await initI18next({ lng, ns, options })
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance
  }
}