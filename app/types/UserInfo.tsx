// File: app/types/UserInfo.tsx

import { IndustryType, ExperienceType, UserInfo as DrizzleUserInfo } from '@/drizzle/schema/user';

export type Industry = IndustryType;
export type ExperienceLevel = ExperienceType;

export type UserInfo = DrizzleUserInfo;

export interface UserData extends Omit<DrizzleUserInfo, 'experience'> {
  email: string;
  isAnonymous: boolean;
  emailConfirmedAt: Date | null;
  industries: Industry[];
  experience: ExperienceLevel | null;
}