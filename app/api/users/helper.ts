// app/api/users/helper.ts
// This file is now empty or can be removed if no other functions rely on it.
// The getContacts, Contact interface, and dummyContacts have been moved or superseded.

import { db } from "@/lib/db";
import { userInfos, userIndustryExperience, type UserInfo, type UserIndustryExperience as RawUserIndustryExperience } from "@/drizzle/schema/user";
import { eq } from "drizzle-orm";
// createClient from supabase/server might not be needed here if helper is purely for DB logic
// If getServerContacts needs auth context *passed to it*, then it's fine.

// Type for the processed industry experience to be included in the contact view
export type ProcessedIndustryExperience = Pick<RawUserIndustryExperience, 'industry' | 'experienceLevel'>;

// Define the view model for a contact, leveraging Drizzle types for applicable fields
export type UserContactView = {
  contactId: NonNullable<UserInfo['id']>; // Typically string (from uuid)
  name: string; // Computed field
  firstName: UserInfo['firstName']; // e.g., string | null
  lastName: UserInfo['lastName'];   // e.g., string | null
  role: UserInfo['occupation'];     // e.g., string | null
  location: UserInfo['location'];   // e.g., string | null
  slug: UserInfo['userName'];       // e.g., string | null (ensure your schema reflects notNull if it is)
  profilePictureUrl?: string;     // Derived from UserInfo['profilePicture'], string | undefined
  tags: string[]; // Added for contact view structure
  collaborationStatus: string[]; // Added for contact view structure
  industryExperiences: ProcessedIndustryExperience[]; // Added for contact view structure
};

// Function for server-side data fetching logic
export async function getServerContacts(): Promise<UserContactView[]> {
  const rows = await db.select({
    id: userInfos.id,
    dbDisplayName: userInfos.displayName,
    firstName: userInfos.firstName,
    lastName: userInfos.lastName,
    occupation: userInfos.occupation,
    location: userInfos.location,
    userName: userInfos.userName,
    profilePicture: userInfos.profilePicture,
    industry: userIndustryExperience.industry,
    experienceLevel: userIndustryExperience.experienceLevel,
  })
    .from(userInfos)
    .leftJoin(userIndustryExperience, eq(userInfos.id, userIndustryExperience.userId));

  const usersMap = new Map<string, UserContactView>();

  rows.forEach(row => {
    let user = usersMap.get(row.id);
    if (!user) {
      const constructedName = row.dbDisplayName || `${row.firstName || ''} ${row.lastName || ''}`.trim();
      user = {
        contactId: row.id,
        name: constructedName,
        firstName: row.firstName,
        lastName: row.lastName,
        role: row.occupation,
        location: row.location,
        slug: row.userName,
        profilePictureUrl: row.profilePicture === null ? undefined : row.profilePicture,
        tags: [],
        collaborationStatus: ["Open to Collaborations"],
        industryExperiences: [],
      };
      usersMap.set(row.id, user);
    }
    if (row.industry && row.experienceLevel) {
      user.industryExperiences.push({
        industry: row.industry,
        experienceLevel: row.experienceLevel,
      });
    }
  });

  return Array.from(usersMap.values());
}
