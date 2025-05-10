import configPromise from "@payload-config"; // Renamed to signify it's a promise
import type { Payload } from "payload";
import { getPayload } from "payload";

/**
 * Initializes a Payload CMS instance for server-side operations.
 * This hook should only be used in server-side code (e.g. API routes, Server Actions)
 * and should NOT be exposed directly in React components or client-side code.
 *
 * For more information on using PayloadToken with the local API, see:
 * https://www.reddit.com/r/PayloadCMS/comments/1gxo8g9/how_to_use_the_payloadtoken_with_the_local_api/
 * https://github.com/payloadcms/payload/discussions/6596
 *
 * @returns Promise<Payload> A Payload CMS instance
 */
export const getCustomPayload = async (): Promise<Payload> => {
  let resolvedConfig: Awaited<typeof configPromise>; // Explicitly type resolvedConfig

  try {
    console.log('[GET_CUSTOM_PAYLOAD] Attempting to resolve payload config promise...');
    resolvedConfig = await configPromise;
    console.log('[GET_CUSTOM_PAYLOAD] Successfully resolved payload config promise.');

    if (resolvedConfig) {
      console.log('[GET_CUSTOM_PAYLOAD] Resolved payload config exists.');
      console.log('[GET_CUSTOM_PAYLOAD]   - DB type:', typeof resolvedConfig.db);
      if (resolvedConfig.db && typeof resolvedConfig.db === 'object') {
        // If db is an object, log its keys to help identify where the connection string might be
        console.log('[GET_CUSTOM_PAYLOAD]   - DB object keys:', Object.keys(resolvedConfig.db).join(', '));
        // Forcing a look at a common postgres connection string path, safely
        const connString = (resolvedConfig.db as any)?.pool?.options?.connectionString || (resolvedConfig.db as any)?.options?.connectionString || (resolvedConfig.db as any)?.connectionString;
        if (connString && typeof connString === 'string') {
          console.log('[GET_CUSTOM_PAYLOAD]   - DB Connection String Snippet:', connString.substring(0, 100) + '...');
        }
      }
      console.log('[GET_CUSTOM_PAYLOAD]   - Collections count:', resolvedConfig.collections?.length);
      console.log('[GET_CUSTOM_PAYLOAD]   - Secret set:', !!resolvedConfig.secret);
    } else {
      console.error('[GET_CUSTOM_PAYLOAD] CRITICAL: Resolved payload config is null or undefined after await.');
      throw new Error('Resolved payload config is null or undefined');
    }

  } catch (e) {
    console.error('[GET_CUSTOM_PAYLOAD] CRITICAL: Error during payload config resolution or inspection:', e);
    throw e; // Re-throw to ensure getPayload is not called with faulty config
  }

  console.log('[GET_CUSTOM_PAYLOAD] Attempting to call getPayload with resolved config...');
  const payloadInstance = await getPayload({
    config: resolvedConfig, // Pass the resolved config
  });
  console.log('[GET_CUSTOM_PAYLOAD] Successfully called getPayload.');

  return payloadInstance;
};
