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

// Define a more generic type for namespace data
type NamespaceData = { [key: string]: unknown };

// Update the function to dynamically import resources
export const buildResources = async (
  language: string, // Accept any language string
  namespace: string, // Allow any string namespace
  callback: (error: Error | null, resources: NamespaceData | null) => void // Adjust callback type
) => {
  try {
    // Dynamically import the JSON file based on language and namespace
    // Use /* webpackMode: "eager" */ to ensure Vercel bundles these files
    const resourceModule = await import(
      /* webpackMode: "eager" */
      `@/public/translations/${language}/${namespace}.json`
    );
    const resource = resourceModule.default;

    console.log(`[resourcesToBackend] Dynamically loaded resources for ${language}/${namespace}`);
    callback(null, resource);

  } catch (error) {
    console.error(`[resourcesToBackend] Error dynamically loading ${language}/${namespace}:`, error);
    // Explicitly check if the error is due to the module not being found
    if (error instanceof Error && 'code' in error && error.code === 'MODULE_NOT_FOUND') {
      console.error(`Ensure the file exists: public/translations/${language}/${namespace}.json`);
      callback(new Error(`Translation file not found: ${language}/${namespace}.json`), null);
    } else {
      callback(error instanceof Error ? error : new Error('Unknown error during resource loading'), null);
    }
  }
};