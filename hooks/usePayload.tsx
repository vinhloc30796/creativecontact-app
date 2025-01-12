import { getPayload } from 'payload'
import { cache } from 'react'
import type { Payload } from 'payload'
import config from '@payload-config'

// Cache the payload instance to avoid recreating on every request
export const usePayload = cache(async (): Promise<Payload> => {
  const payload = await getPayload({
    config,
  })
  console.debug('[usePayload] Payload instance created, with collections:', Object.keys(payload.collections))
  return payload
})
