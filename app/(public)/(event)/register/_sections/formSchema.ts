// File: app/(public)/(event)/register/_sections/formSchema.ts

import { z } from 'zod'
import { contactInfoSchema } from '@/app/form-schemas/contact-info'
import { eventRegistrationSchema } from '@/app/form-schemas/event-registration'
import { professionalInfoSchema } from '@/app/form-schemas/professional-info'

export const formSchema = contactInfoSchema
  .merge(eventRegistrationSchema)
  .merge(professionalInfoSchema)

export type FormData = z.infer<typeof formSchema>
