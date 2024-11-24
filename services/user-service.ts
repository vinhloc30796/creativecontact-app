import { z } from "zod";

import { writeUserInfo } from "@/app/actions/user/writeUserInfo";
import { type AboutInfoData } from "@/app/form-schemas/about-info";
import {
  contactInfoSchema,
  type ContactInfoData,
} from "@/app/form-schemas/contact-info";
import {
  professionalInfoSchema,
  type ProfessionalInfoData,
} from "@/app/form-schemas/professional-info";
import { type UserIndustryExperience } from "@/drizzle/schema/user";

export class UserService {
  static async updateUserInfo(
    userId: string,
    data: Partial<ContactInfoData & ProfessionalInfoData & AboutInfoData>,
  ) {
    const {
      firstName,
      lastName,
      userName,
      displayName,
      location,
      email,
      phoneCountryCode,
      phoneNumber,
      phoneCountryAlpha3,
      instagramHandle,
      facebookHandle,
      industryExperiences,
      about,
    } = data;

    return await writeUserInfo(
      userId,
      {
        firstName: firstName || "",
        lastName: lastName || "",
        userName: userName || "",
        displayName: displayName || "",
        phoneCountryCode: phoneCountryCode || "84",
        phoneNumber: phoneNumber || "",
        phoneCountryAlpha3: phoneCountryAlpha3 || "VNM",
      },
      {
        industryExperiences: (industryExperiences || []) as UserIndustryExperience[],
      },
      {
        instagramHandle,
        facebookHandle,
      },
    );
  }
}
