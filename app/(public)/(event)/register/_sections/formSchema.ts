// File: app/(public)/(event)/register/_sections/formSchema.ts

import { z } from "zod";
import { experienceLevels } from "@/app/types/UserInfo";
import { industries } from "@/app/types/UserInfo";
import { contactInfoSchema, ContactInfoData } from "@/app/form-schemas/contact-info";
import { eventRegistrationSchema, EventRegistrationData } from "@/app/form-schemas/event-registration";
import { professionalInfoSchema, ProfessionalInfoData } from "@/app/form-schemas/professional-info";

export const formSchema = contactInfoSchema.merge(eventRegistrationSchema).merge(professionalInfoSchema);

export type FormData = ContactInfoData & EventRegistrationData & ProfessionalInfoData;
