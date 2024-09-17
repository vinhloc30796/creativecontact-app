// Actions
import { sendArtworkUploadConfirmationEmail } from "@/app/actions/email/artworkDetails";
import { sendArtworkCreditRequestEmail } from "@/app/actions/email/creditRequest";
import { checkUserIsAnonymous } from "@/app/actions/user/auth";
import { signUpUser } from "@/app/actions/user/signUp";
import { writeUserInfo } from "@/app/actions/user/writeUserInfo";
import { createArtwork, insertArtworkCredit, insertArtworkEvents } from "./actions";
// Types & Form schemas
import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import { ArtworkInfoData } from "@/app/form-schemas/artwork-info";
import { ProfessionalInfoData } from "@/app/form-schemas/professional-info";
// Utils
import { performUpload } from "./client";
import { ContactInfoData } from "@/app/form-schemas/contact-info";

export async function handleUserInfo(
  contactInfoData: ContactInfoData,
  professionalInfoData: ProfessionalInfoData,
  resolveFormUserId: (email: string) => Promise<string>
) {
  const formUserId = await resolveFormUserId(contactInfoData.email);
  const writeUserInfoResult = await writeUserInfo(
    formUserId,
    {
      phone: contactInfoData.phone,
      firstName: contactInfoData.firstName,
      lastName: contactInfoData.lastName,
    },
    {
      industries: professionalInfoData.industries,
      experience: professionalInfoData.experience,
    },
    {
      instagramHandle: contactInfoData.instagramHandle,
      facebookHandle: contactInfoData.facebookHandle,
    },
    false,
    false
  );
  return { formUserId, writeUserInfoResult };
}

export async function handleFileUpload(artworkUUID: string, files: File[], thumbnailFileName: string) {
  const { results: uploadedResults, errors: uploadErrors } = await performUpload(artworkUUID, files, thumbnailFileName);
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

export async function handleArtworkCreation(artworkData: ArtworkInfoData, formUserId: string, eventSlug: string) {
  const createResult = await createArtwork(formUserId, artworkData);
  const insertArtworkEventsResult = await insertArtworkEvents(createResult.artwork.id, eventSlug);
  return { createResult, insertArtworkEventsResult };
}

export async function handleCoArtists(artworkData: ArtworkInfoData, artworkCreditData: ArtworkCreditInfoData, eventSlug: string) {
  for (const coartist of artworkCreditData.coartists || []) {
    const signupResult = await signUpUser(coartist.email);
    if (!signupResult) throw new Error("Signup anonymous failed");

    await writeUserInfo(
      signupResult.id,
      {
        phone: "",
        firstName: coartist.first_name,
        lastName: coartist.last_name,
      },
      {
        industries: [],
        experience: null,
      },
      {
        instagramHandle: undefined,
        facebookHandle: undefined,
      },
      false,
      false
    );

    await insertArtworkCredit(
      artworkData.uuid,
      signupResult.id,
      coartist.title
    );

    await sendArtworkCreditRequestEmail(
      coartist.email,
      `${coartist.first_name} ${coartist.last_name}`,
      artworkData.title,
      eventSlug
    );
  }
}

export async function sendConfirmationEmail(contactInfoData: ContactInfoData, artworkData: ArtworkInfoData, eventSlug: string) {
  const shouldConfirmEmail = (await checkUserIsAnonymous(contactInfoData.email)) ?? true;
  return await sendArtworkUploadConfirmationEmail(
    contactInfoData.email,
    `${contactInfoData.firstName} ${contactInfoData.lastName}`,
    artworkData.title,
    eventSlug,
    shouldConfirmEmail
  );
}
