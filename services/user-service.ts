import { z } from 'zod'

import { writeUserInfo } from '@/app/actions/user/writeUserInfo'
import { type AboutInfoData } from '@/app/form-schemas/about-info'
import { contactInfoSchema, type ContactInfoData } from '@/app/form-schemas/contact-info'
import { professionalInfoSchema, type ProfessionalInfoData } from '@/app/form-schemas/professional-info'

export class UserService {
  static async updateUserInfo(
    userId: string,
    data: Partial<ContactInfoData & ProfessionalInfoData & AboutInfoData>
  ) {
    const {
      firstName, lastName, displayName, location,
      email, phone, instagramHandle, facebookHandle,
      industries, experience,
      about
    } = data

    return await writeUserInfo(
      userId,
      {
        firstName: firstName || '',
        lastName: lastName || '',
        displayName,
        phone: phone || '',
      },
      {
        industries: industries || [] as ("Advertising" | "Architecture" | "Arts and Crafts" | "Design" | "Fashion" | "Film, Video, and Photography" | "Music" | "Performing Arts" | "Publishing" | "Software and Interactive" | "Television and Radio" | "Visual Arts" | "Other")[],
        experience: experience || null as "Entry" | "Junior" | "Mid-level" | "Senior" | "Manager" | "C-level" | null,
      },
      {
        instagramHandle,
        facebookHandle,
      }
    )
  }
}