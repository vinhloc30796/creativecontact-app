// app/api/users/helper.ts
// This file is now empty or can be removed if no other functions rely on it.
// The getContacts, Contact interface, and dummyContacts have been moved or superseded.

import { db } from "@/lib/db";
import { userInfos, userIndustryExperience, type UserInfo, type UserIndustryExperience as RawUserIndustryExperience } from "@/drizzle/schema/user";
import { eq, sql } from "drizzle-orm";
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
export async function getServerContacts(
  limit: number = 5,
  lastCursor?: string,
  seed: string = ""
): Promise<{ contacts: UserContactView[]; nextCursor?: string }> {
  const pageSize = limit;
  const fetchSize = pageSize + 1;
  const hashExpr = sql`md5(${seed}::text || ${userInfos.id}::text)`;

  // Build paged sub-query of IDs with optional hash filter
  const baseQuery = db
    .select({ id: userInfos.id })
    .from(userInfos);
  const filtered = lastCursor
    ? baseQuery.where(sql`${hashExpr} > ${lastCursor}`)
    : baseQuery;
  // Alias the builder for joining (cast to any to satisfy TS)
  const sq = (filtered
    .orderBy(hashExpr)
    .limit(fetchSize)
    .as("sq") as any);

  // Fetch user details and industry experiences for paged IDs
  const rows = await db
    .select({
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
      hash: hashExpr,
    })
    .from(userInfos)
    .innerJoin(sq, eq(userInfos.id, sq.id))
    .leftJoin(
      userIndustryExperience,
      eq(userInfos.id, userIndustryExperience.userId)
    )
    .orderBy(hashExpr);

  // Assemble view models and track hashes for cursor
  const usersMap = new Map<string, UserContactView>();
  const hashMap = new Map<string, string>();
  rows.forEach((row) => {
    // record hash for this user
    hashMap.set(row.id, (row as any).hash);
    let user = usersMap.get(row.id);
    if (!user) {
      const constructedName =
        row.dbDisplayName || `${row.firstName || ""} ${row.lastName || ""}`.trim();
      user = {
        contactId: row.id,
        name: constructedName,
        firstName: row.firstName,
        lastName: row.lastName,
        role: row.occupation,
        location: row.location,
        slug: row.userName,
        profilePictureUrl:
          row.profilePicture === null ? undefined : row.profilePicture,
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

  const contactsArray = Array.from(usersMap.values());
  let nextCursor: string | undefined;
  if (contactsArray.length === fetchSize) {
    // Remove the extra record used only to detect more pages
    contactsArray.pop();
    // Use the last displayed item's hash as the cursor for the next page
    const lastDisplayed = contactsArray[contactsArray.length - 1];
    nextCursor = hashMap.get(lastDisplayed.contactId);
  }
  return { contacts: contactsArray, nextCursor };
}
