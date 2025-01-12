import { getPayload } from 'payload'
import { cache } from 'react'
import type { Payload } from 'payload'
import config from '@payload-config'

/**
 * Initializes and caches a Payload CMS instance for server-side operations.
 * This hook should only be used in server-side code (e.g. API routes, Server Actions)
 * and should NOT be exposed directly in React components or client-side code.
 * 
 * The instance is cached to prevent recreation on every request, improving performance.
 * 
 * @returns Promise<Payload> A cached Payload CMS instance
 */
export const usePayload = cache(async (): Promise<Payload> => {
  const payload = await getPayload({
    config,
  })
  console.debug('[usePayload] Payload instance created, with collections:', Object.keys(payload.collections))
  return payload
})
