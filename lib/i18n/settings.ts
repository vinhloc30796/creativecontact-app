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

export const buildResources = (
  language: string,
  namespace: string,
  callback: (error: Error | null, resources: Record<string, any> | null) => void
) => {
  const filePath = `./translations/${language}/${namespace}.json`
  console.log("resourcesToBackend: trying to load resources from", filePath);
  import(filePath)
    .then((resources) => {
      console.log("resourcesToBackend: loaded resources", resources, "from", filePath);
      callback(null, resources)
    })
    .catch((error) => {
      console.error("resourcesToBackend: error loading resources", error);
      console.error("current location:", process.cwd());
      callback(error, null)
    })
}