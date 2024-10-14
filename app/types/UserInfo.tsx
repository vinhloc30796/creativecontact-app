// File: app/types/UserInfo.tsx

export const industries = [
  'Advertising',
  'Architecture',
  'Arts and Crafts',
  'Design',
  'Fashion',
  'Film, Video, and Photography',
  'Music',
  'Performing Arts',
  'Publishing',
  'Software and Interactive',
  'Television and Radio',
  'Visual Arts',
  'Other'
] as const;

export const experienceLevels = [
  'Entry',
  'Junior',
  'Mid-level',
  'Senior',
  'Manager',
  'C-level'
] as const;

export type Industry = typeof industries[number];
export type ExperienceLevel = typeof experienceLevels[number];

export interface UserInfo {
  id: string;
  displayName: string | null;
  location: string | null;
  occupation: string | null;
  about: string | null;
  industries: Industry[] | null;
  experience: ExperienceLevel;
}

export interface UserData extends Omit<UserInfo, 'experience'> {
  // UserInfo fields
  id: string;
  displayName: string | null;
  location: string | null;
  occupation: string | null;
  about: string | null;
  // new fields
  email: string;
  isAnonymous: boolean;
  emailConfirmedAt: Date | null;
  firstName: string;
  lastName: string;
  phone: string;
  instagramHandle: string | null;
  facebookHandle: string | null;
  industries: Industry[];
  experience: ExperienceLevel | null;
}