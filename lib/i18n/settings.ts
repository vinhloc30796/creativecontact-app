export const fallbackLng = 'en'
export const defaultNS = 'translation'
export const languages = [fallbackLng, 'vi']

interface GetOptionsParams {
  lng: string
  ns: string | string[]
}

export function getOptions({ lng = fallbackLng, ns = defaultNS }: GetOptionsParams) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  }
}

// Import all translation files statically
import enTranslation from '@/public/translations/en/translation.json'
import viTranslation from '@/public/translations/vi/translation.json'

type Resources = {
  [key in 'en' | 'vi']: {
    [key in 'translation']: typeof enTranslation
  }
}

const resources: Resources = {
  en: { translation: enTranslation },
  vi: { translation: viTranslation }
}

export const buildResources = (
  language: 'en' | 'vi',
  namespace: 'translation',
  callback: (error: Error | null, resources: typeof enTranslation | null) => void
) => {
  try {
    const resource = resources[language]?.[namespace]
    if (resource) {
      console.log("[resourcesToBackend] loaded resources", resource, "from", language, namespace);
      callback(null, resource)
    } else {
      throw new Error(`Translation not found for ${language}/${namespace}`)
    }
  } catch (error) {
    console.error("[resourcesToBackend] error loading resources", error)
    callback(error as Error, null)
  }
}