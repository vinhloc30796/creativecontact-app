// File: app/(public)/(event)/register/_sections/formSchema.ts

import { ContactInfoData, contactInfoSchema } from "@/app/form-schemas/contact-info";
import { EventRegistrationData, eventRegistrationSchema } from "@/app/form-schemas/event-registration";
import { ProfessionalInfoData, professionalInfoSchema } from "@/app/form-schemas/professional-info";

export const formSchema = contactInfoSchema.merge(eventRegistrationSchema).merge(professionalInfoSchema);

export type FormData = ContactInfoData & EventRegistrationData & ProfessionalInfoData;
