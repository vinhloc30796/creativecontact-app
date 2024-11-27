// File: app/types/UserInfo.tsx
import {
  IndustryType,
  ExperienceType,
  UserInfo as DrizzleUserInfo,
  UserIndustryExperience,
} from "@/drizzle/schema/user";

export type Industry = IndustryType;
export type ExperienceLevel = ExperienceType;
export type UserInfo = DrizzleUserInfo;

export interface UserData extends Omit<DrizzleUserInfo, "experience"> {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  displayName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  phoneCountryAlpha3: string;
  isAnonymous: boolean;
  emailConfirmedAt: Date | null;
  location: string | null;
  occupation: string | null;
  about: string | null;
  profilePicture: string | null;
  instagramHandle: string | null;
  facebookHandle: string | null;
  industryExperiences: UserIndustryExperience[];
}
