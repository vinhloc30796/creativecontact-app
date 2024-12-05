// Actions
import { sendArtworkUploadConfirmationEmail } from "@/app/actions/email/artworkDetails";
import { sendArtworkCreditRequestEmail } from "@/app/actions/email/creditRequest";
import {
  checkUserIsAnonymous,
  checkUserIsAnonymousById,
  getUserId,
} from "@/app/actions/user/auth";
import { signUpUser } from "@/app/actions/user/signUp";
import { writeUserInfo } from "@/app/actions/user/writeUserInfo";
import {
  createArtwork,
  insertArtworkCredit,
  insertArtworkEvents,
} from "./actions";
// Types & Form schemas
import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import { ArtworkInfoData } from "@/app/form-schemas/artwork-info";
import { ProfessionalInfoData } from "@/app/form-schemas/professional-info";
// Utils
import { performUpload } from "./client";
import { ContactInfoData } from "@/app/form-schemas/contact-info";
import { Industry, ExperienceLevel } from "@/app/types/UserInfo";
import { fetchArtworkCredits } from "@/app/api/artworks/[id]/credits/helper";
import { check } from "drizzle-orm/mysql-core";

export async function handleUserInfo(
  contactInfoData: ContactInfoData,
  professionalInfoData: ProfessionalInfoData,
  resolveFormUserId: (email: string) => Promise<string>,
) {
  const formUserId = await resolveFormUserId(contactInfoData.email);
  const writeUserInfoResult = await writeUserInfo(
    formUserId,
    {
      phoneCountryCode: "84",
      phoneNumber: contactInfoData.phoneNumber,
      phoneCountryAlpha3: "VNM",
      firstName: contactInfoData.firstName,
      lastName: contactInfoData.lastName,
    },
    {
      industryExperiences: professionalInfoData.industryExperiences,
    },
    {
      instagramHandle: contactInfoData.instagramHandle,
      facebookHandle: contactInfoData.facebookHandle,
    },
    false,
    false,
  );
  return { formUserId, writeUserInfoResult };
}

export async function handleFileUpload(
  artworkUUID: string,
  files: File[],
  thumbnailFileName: string,
  setUploadProgress: (
    progress: number,
    uploadedCount: number,
    totalCount: number,
  ) => void,
) {
  const totalFileCount = files.length;
  const { results: uploadedResults, errors: uploadErrors } =
    await performUpload(
      artworkUUID,
      files,
      thumbnailFileName,
      (progress, uploadedCount) => {
        setUploadProgress(progress, uploadedCount, totalFileCount);
      },
    );
  if (uploadErrors.length > 0) {
    throw new Error(uploadErrors.join(", "));
  }
  return uploadedResults;
}

export async function handleFileUploadAlwaysFails() {
  throw new Error("File upload always fails");
  const uploadedResults = [];
  return uploadedResults;
}

export async function handleArtworkCreation(
  artworkData: ArtworkInfoData,
  formUserId: string,
  eventSlug: string,
) {
  const createResult = await createArtwork(formUserId, artworkData);
  const insertArtworkEventsResult = await insertArtworkEvents(
    createResult.artwork.id,
    eventSlug,
  );
  return { createResult, insertArtworkEventsResult };
}

export async function handleCoArtists(
  artworkData: ArtworkInfoData,
  artworkCreditData: ArtworkCreditInfoData,
  eventSlug: string,
) {
  for (const coartist of artworkCreditData.coartists || []) {
    console.log("coartist", coartist);
    let existingUser = await checkUserIsAnonymous(coartist.email);
    console.log("existingUserEmail", existingUser);
    const userId = await getUserId(coartist.email);
    if (existingUser === false) {
      await insertArtworkCredit(artworkData.id, userId!, coartist.title);
    }

    if (existingUser === null) {
      existingUser = await checkUserIsAnonymousById(coartist.userId!);
      console.log("existingUserId", existingUser);

      if (existingUser === null) {
        throw new Error("User not found");
      }
      if (existingUser === false) {
        await insertArtworkCredit(
          artworkData.id,
          coartist.userId!,
          coartist.title,
        );
      }
    }

    // isAnonymous is true if the user is not found, false if the user is found

    // BUG: This will signin the anonymous user and logout the current user
    /*     else {
      const signupResult = await signUpUser(coartist.email);
      if (!signupResult) throw new Error("Signup anonymous failed");

      await writeUserInfo(
        signupResult.id,
        {
          phoneCountryCode: "84",
          phoneNumber: "",
          phoneCountryAlpha3: "VNM",
          firstName: coartist.first_name,
          lastName: coartist.last_name,
        },
        {
          industryExperiences: [],
        },
        {
          instagramHandle: undefined,
          facebookHandle: undefined,
        },
        false,
        false,
      );

      await insertArtworkCredit(
        artworkData.id,
        signupResult.id,
        coartist.title,
      );

      await sendArtworkCreditRequestEmail(
        coartist.email,
        `${coartist.first_name} ${coartist.last_name}`,
        artworkData.title,
        eventSlug,
      );
    } */
  }
}

export async function sendConfirmationEmail(
  contactInfoData: ContactInfoData,
  artworkData: ArtworkInfoData,
  eventSlug: string,
) {
  const shouldConfirmEmail =
    (await checkUserIsAnonymous(contactInfoData.email)) ?? true;
  return await sendArtworkUploadConfirmationEmail(
    contactInfoData.email,
    `${contactInfoData.firstName} ${contactInfoData.lastName}`,
    artworkData.title,
    eventSlug,
    shouldConfirmEmail,
  );
}
