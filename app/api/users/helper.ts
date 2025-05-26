// app/api/users/helper.ts
// This file is now empty or can be removed if no other functions rely on it.
// The getContacts, Contact interface, and dummyContacts have been moved or superseded.

import { db } from "@/lib/db";
import { userInfos, userIndustryExperience, type UserInfo, type UserIndustryExperience as RawUserIndustryExperience } from "@/drizzle/schema/user";
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
  // 1. Fetch all user infos, using original field names from the schema
  const usersFromDb = await db.select({
    id: userInfos.id,
    dbDisplayName: userInfos.displayName, // Use a distinct name if 'name' is a computed field
    firstName: userInfos.firstName,
    lastName: userInfos.lastName,
    occupation: userInfos.occupation,
    location: userInfos.location,
    userName: userInfos.userName,
    profilePicture: userInfos.profilePicture,
  }).from(userInfos);

  // 2. Fetch all industry experiences
  const allIndustryExperiences = await db
    .select({
      userId: userIndustryExperience.userId,
      industry: userIndustryExperience.industry,
      experienceLevel: userIndustryExperience.experienceLevel,
    })
    .from(userIndustryExperience);

  // 3. Map to UserContactView
  const usersWithExperiences = usersFromDb.map(uDb => {
    const experiences: ProcessedIndustryExperience[] = allIndustryExperiences
      .filter(exp => exp.userId === uDb.id)
      .map(exp => ({ industry: exp.industry, experienceLevel: exp.experienceLevel }));

    const constructedName = uDb.dbDisplayName || `${uDb.firstName || ''} ${uDb.lastName || ''}`.trim();

    const contactView: UserContactView = {
      contactId: uDb.id, // From userInfos.id
      name: constructedName,
      firstName: uDb.firstName,
      lastName: uDb.lastName,
      role: uDb.occupation,
      location: uDb.location,
      slug: uDb.userName,
      profilePictureUrl: uDb.profilePicture === null ? undefined : uDb.profilePicture,
      tags: [],
      collaborationStatus: ["Open to Collaborations"],
      industryExperiences: experiences,
    };
    return contactView;
  });

  return usersWithExperiences;
}
