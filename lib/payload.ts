import config from '@payload-config'
import type { Payload } from 'payload'
import { getPayload } from 'payload'

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
  const payload = await getPayload({
    config: config // Ensure config is properly exported as a promise
  })

  return payload
}
