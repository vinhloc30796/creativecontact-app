import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Event } from '../../payload-types'

export interface EventSeedData {
  slug: string
  title: string
  status: Event['status']
  eventDate: string
  summary: string
  location: Event['location']
  content: Event['content']
  featuredImage: Event['featuredImage']
  [key: string]: any
}

export function makeEventSeed(data: EventSeedData) {
  return async () => {
    try {
      const payload = await getPayload({ config: configPromise })
      const created = await payload.create({ collection: 'events', data })
      console.log(`✓ seeded event '${data.slug}'`) 
    } catch (error) {
      console.error('Error seeding event', data.slug, error)
      throw error
    }
  }
}