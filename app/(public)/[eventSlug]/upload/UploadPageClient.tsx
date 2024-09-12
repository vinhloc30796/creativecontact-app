// File: app/(public)/[eventSlug]/upload/UploadPageClient.tsx

"use client";

// Actions
import { sendArtworkUploadConfirmationEmail } from "@/app/actions/email/artworkDetails";
import { sendArtworkCreditRequestEmail } from "@/app/actions/email/creditRequest";
import { checkUserIsAnonymous } from "@/app/actions/user/auth";
import { signUpUser } from "@/app/actions/user/signUp";
import { writeUserInfo } from "@/app/actions/user/writeUserInfo";
import { createArtwork, insertArtworkAssets, insertArtworkCredit, insertArtworkEvents } from "./actions";
// Types & Form schemas
import { ArtworkCreditInfoData, artworkCreditInfoSchema } from "@/app/form-schemas/artwork-credit-info";
import { ArtworkInfoData, artworkInfoSchema } from "@/app/form-schemas/artwork-info";
import { ContactInfoData, contactInfoSchema } from "@/app/form-schemas/contact-info";
import { ProfessionalInfoData, professionalInfoSchema } from "@/app/form-schemas/professional-info";
import { ThumbnailSupabaseFile } from "@/app/types/SupabaseFile";
// Custom
import { EventNotFound } from "@/app/(public)/[eventSlug]/EventNotFound";
import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { ProfessionalInfoStep } from "@/components/user/ProfessionalInfoStep";
// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ContactInfoStep } from "@/components/user/ContactInfoStep";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { toast } from "sonner";
// Hooks, contexts, i18n
import { ThumbnailProvider, useThumbnail } from "@/contexts/ThumbnailContext";
import { ArtworkProvider, useArtwork } from "@/contexts/ArtworkContext";
import { useAuth } from "@/hooks/useAuth";
import { useFormUserId } from "@/hooks/useFormUserId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
// Utils
import { createEmailLink } from "@/lib/links";
import { v4 as uuidv4 } from "uuid";
import { performUpload } from "./client";


interface UploadPageClientProps {
  eventSlug: string;
  eventData?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  recentEvents: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

type FormContextType = UseFormReturn<ContactInfoData & ProfessionalInfoData>;

export default function UploadPageClient({ eventSlug, eventData, recentEvents }: UploadPageClientProps) {
  return (
    <ArtworkProvider>
      <ThumbnailProvider>
        <UploadPageContent eventSlug={eventSlug} eventData={eventData} recentEvents={recentEvents} />
      </ThumbnailProvider>
    </ArtworkProvider>
  );
}

function UploadPageContent({ eventSlug, eventData, recentEvents }: UploadPageClientProps) {
  // Router
  const router = useRouter();
  // Auth
  const { user, isLoading, error: authError, isAnonymous } = useAuth();
  const { resolveFormUserId, userData, isLoading: isUserDataLoading } = useFormUserId();
  // Context
  const { currentArtwork, artworks, setCurrentArtwork, addArtwork } = useArtwork();
  const { thumbnailFileName } = useThumbnail(); // Use the context here
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artworkUUID, setArtworkUUID] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isNewArtwork, setIsNewArtwork] = useState(true);
  // I18n
  const { t, i18n } = useTranslation(["eventSlug", "formSteps"]);
  // Form setup
  const [formStep, setFormStep] = useState(0);
  const contactInfoForm = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const professionalInfoForm = useForm<ProfessionalInfoData>({
    resolver: zodResolver(professionalInfoSchema),
    mode: "onSubmit",
    defaultValues: {
      industries: [],
      experience: undefined,
    },
  });

  const artworkForm = useForm<ArtworkInfoData>({
    resolver: zodResolver(artworkInfoSchema),
    mode: "onSubmit",
    defaultValues: {
      uuid: currentArtwork?.uuid || "",
      title: currentArtwork?.title || "",
      description: currentArtwork?.description || "",
    },
  });

  const artworkCreditForm = useForm<ArtworkCreditInfoData>({
    resolver: zodResolver(artworkCreditInfoSchema),
    mode: "onSubmit",
    defaultValues: {
      coartists: [],
    },
  });

  // Effects
  useEffect(() => {
    if (userData && !isLoading) {
      // Auto-fill form fields
      contactInfoForm.reset({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
      });
      professionalInfoForm.reset({
        industries: userData.industries || [],
        experience: userData.experience || undefined,
      });
    }
  }, [userData, isLoading, professionalInfoForm, contactInfoForm]);

  if (!eventData) {
    return (
      <EventNotFound recentEvents={recentEvents} eventSlug={eventSlug} />
    );
  }
  const emailLink = createEmailLink(eventData);

  // Actions
  const handleArtworkSubmit = async (data: ArtworkInfoData) => {
    let processedData = data;
    if (!processedData.uuid) {
      // Create new artwork
      const uuid = uuidv4();
      console.debug("Creating new UUID", uuid);
      processedData.uuid = uuid;
      console.debug("Updated current artwork", processedData);
    }
    addArtwork(processedData);
    setCurrentArtwork(processedData);
    artworkForm.setValue("uuid", processedData?.uuid || "");
    artworkForm.setValue("title", processedData?.title || "");
    artworkForm.setValue("description", processedData?.description || "");
    setArtworkUUID(processedData.uuid); // Update artworkUUID state
    console.log("artworkUUID set to:", processedData.uuid);
  }

  // Callback function to update pending files
  const handlePendingFilesUpdate = (files: File[]) => {
    setPendingFiles(files);
  };

  const handleValidation = async () => {
    const contactInfoResult = await contactInfoForm.trigger();
    console.log("contactInfoForm", contactInfoForm.formState.errors);
    const professionalInfoResult = await professionalInfoForm.trigger();
    console.log("professionalInfoForm", professionalInfoForm.formState.errors);
    const artworkResult = await artworkForm.trigger();
    console.log("artworkForm", artworkForm.formState.errors);
    const artworkCreditResult = await artworkCreditForm.trigger();
    console.log("artworkCreditForm", artworkCreditForm.formState.errors);
    return contactInfoResult && professionalInfoResult && artworkResult && artworkCreditResult;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const isValid = await handleValidation();
      if (!isValid) return false;
      // Get form values
      const contactInfoData = contactInfoForm.getValues();
      const professionalInfoData = professionalInfoForm.getValues();
      const artworkData = artworkForm.getValues();
      const artworkCreditData = artworkCreditForm.getValues();
      // Debug
      console.debug('Submit button clicked')
      console.debug('Current contact:', contactInfoForm.getValues())
      console.debug('Current professional info:', professionalInfoForm.getValues())
      console.debug('Current artwork info:', artworkForm.getValues())
      console.debug('Current artwork credit info:', artworkCreditForm.getValues())
      console.debug('isSubmitting:', isSubmitting)
      // Hook into user ID
      const formUserId = await resolveFormUserId(contactInfoData.email);
      // Write user info
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
        }
      );
      console.log("Write user info successful:", writeUserInfoResult);
      // Create artwork in the database
      if (isNewArtwork) {
        const formUserId = await resolveFormUserId(contactInfoForm.getValues().email);
        const createResult = await createArtwork(
          formUserId,
          artworkData
        );
        const insertArtworkEventsResult = await insertArtworkEvents(
          createResult.artwork.id,
          eventSlug
        );
        console.log("Artwork created:", createResult, "and artwork events inserted:", insertArtworkEventsResult);
      } else {
        console.log("Using existing artwork:", artworkData.uuid);
      }
      // Perform media upload
      if (pendingFiles.length == 0) {
        toast.error("No files to upload");
        return false;
      } else if (!artworkUUID) {
        toast.error("Artwork UUID not set");
        return false;
      } else if (!thumbnailFileName) {
        toast.error("Thumbnail file not set");
        return false;
      }
      const files = pendingFiles.map(file => new File([file], file.name, { type: file.type }));
      const { results: uploadedResults, errors: uploadErrors } = await performUpload(artworkUUID, files, thumbnailFileName);
      if (uploadErrors.length > 0) {
        console.error("handleAssetUpload: errors", uploadErrors);
        toast.error(
          t("UploadFailure.title"), {
          description: t("UploadFailure.description", { value: uploadErrors }),
          duration: 5000,
        });
        return false;
      }
      // Insert assets
      const insertAssetsResult = await insertArtworkAssets(
        artworkData.uuid,
        uploadedResults
      );
      console.log("Insert assets successful:", insertAssetsResult);

      // Signup anonymously for each co-artist
      // and write their info to the database
      // then insert the artwork credits
      for (const coartist of artworkCreditData.coartists || []) {
        // sign up the coartist
        const signupResult = await signUpUser(coartist.email);
        console.log("Signup anonymous successful:", signupResult);
        if (!signupResult) {
          console.error("Signup anonymous failed:", signupResult);
          return false;
        }
        // write the coartist's info to the database
        const writeUserInfoResult = await writeUserInfo(
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
          false,
          false
        );
        if (writeUserInfoResult.success) {
          console.log("Write user info successful:", writeUserInfoResult);
        } else {
          console.error("Write user info failed:", writeUserInfoResult);
        }
        // insert the artwork credits
        const insertArtworkCreditResult = await insertArtworkCredit(
          artworkData.uuid,
          signupResult.id,
          coartist.title
        );
        console.log("Insert artwork credit successful:", insertArtworkCreditResult);
        // send the artwork credit request email
        const emailResult = await sendArtworkCreditRequestEmail(
          coartist.email,
          `${coartist.first_name} ${coartist.last_name}`,
          artworkData.title,
          eventSlug
        );
        console.log("Credit request email sent:", emailResult);
      }

      // Prepare params for the confirmation page
      const params = new URLSearchParams({
        email: contactInfoData.email,
        userId: formUserId,
        artworkId: artworkData.uuid,
        emailSent: 'true', // Assuming email was sent successfully,
        lang: i18n?.language || 'en',
      });
      // Send artwork details email
      if (insertAssetsResult) {
        const contactInfoData = contactInfoForm.getValues();
        const artworkData = artworkForm.getValues();
        const shouldConfirmEmail = (await checkUserIsAnonymous(contactInfoData.email)) ?? true;

        // Send confirmation email
        const emailResult = await sendArtworkUploadConfirmationEmail(
          contactInfoData.email,
          `${contactInfoData.firstName} ${contactInfoData.lastName}`,
          artworkData.title,
          eventSlug,
          shouldConfirmEmail
        );

        // Update the params to include the email sending status
        params.set('emailSent', emailResult.success ? 'true' : 'false');
      }
      const confirmedUrl = `/${eventSlug}/upload-confirmed?${params.toString()}`;
      // Show success toast
      toast.success(t("UploadSuccess.title"), {
        description: t("UploadSuccess.description", { confirmedUrl }),
        action: <a href={confirmedUrl}>{t("UploadSuccess.action")}</a>,
        duration: 5000,
      });
      // Use window.location for a full page reload and navigation
      console.debug("Redirecting to confirmation page with params", params.toString());
      // window.location.href = `/${eventSlug}/upload-confirmed?${params.toString()}`;
      return await router.push(confirmedUrl);
    } catch (error) {
      console.error("error", error);
      toast.error(t("UploadFailure.title"), {
        description: t("UploadFailure.description", { value: error }),
        duration: 5000,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: t("formSteps:ContactInfoStep.title"),
      description: t("formSteps:ContactInfoStep.description"),
      component: <ContactInfoStep form={contactInfoForm} />,
      form: contactInfoForm,
      handlePreSubmit: async (data: ContactInfoData) => {
        // Add any custom logic for contact info submission
        console.log("Contact info submitted:", data);
      },
    },
    {
      title: t("formSteps:ProfessionalInfoStep.title"),
      description: t("formSteps:ProfessionalInfoStep.description"),
      component: <ProfessionalInfoStep form={professionalInfoForm} />,
      form: professionalInfoForm,
      handlePreSubmit: async (data: ProfessionalInfoData) => {
        // Add any custom logic for professional info submission
        console.log("Professional info submitted:", data);
      },
    },
    {
      title: t("formSteps:ArtworkInfoStep.title"),
      description: t("formSteps:ArtworkInfoStep.description"),
      component: (
        <>
          <ArtworkInfoStep
            form={artworkForm}
            artworks={artworks}
          />
          <Separator className="my-2" />
          <ArtworkCreditInfoStep form={artworkCreditForm} />
        </>
      ),
      form: artworkForm,
      handlePreSubmit: async (data: ArtworkInfoData) => {
        // Add any custom logic for artwork info submission
        console.log("Artwork info submitted:", data);
        await handleArtworkSubmit(data);
        // Handle artwork credit info
        const artworkCreditData = artworkCreditForm.getValues();
        console.log("Artwork credit info submitted:", artworkCreditData);
        // Add logic to save artwork credit info
      },
    },
    {
      title: t("formSteps:MediaUpload.title"),
      description: <Trans
        i18nKey="formSteps:MediaUpload.description"
        values={{ artworkTitle: currentArtwork?.title ?? t("formSteps:MediaUpload.fallback") }}
        components={{ strong: <strong /> }}
      />,
      component: (
        <>
          <MediaUpload
            artworkUUID={artworkUUID || undefined}
            emailLink={emailLink}
            isNewArtwork={true}
            // Pass the callback function
            onPendingFilesUpdate={handlePendingFilesUpdate}
          />
        </>
      ),
      form: null,
      handlePreSubmit: async (data: ArtworkInfoData) => {
        // Add any custom logic for artwork info submission
        console.log("Artwork asset submitted:", data);
      },
    },
  ];

  // Extract the current step
  const currentStep = steps[formStep];
  // Calculate progress percentage
  const progress = ((formStep + 1) / steps.length) * 100

  const handleNextStep = async () => {
    console.log("Current formStep:", formStep);
    const currentStepData = steps[formStep];
    const form = currentStepData.form;
    if (form) {
      const formData = form.getValues();
      currentStepData.handlePreSubmit && await currentStepData.handlePreSubmit(formData as any);
      const isValid = await form.trigger();
      if (isValid) {
        setFormStep((prev) => {
          console.log("Updating formStep to:", prev + 1);
          return prev + 1;
        });
      } else {
        console.error("invalid form", form.formState.errors);
      }
    }
  };
  return (
    <BackgroundDiv eventSlug={eventSlug}>
      <Card className="w-[400px] mx-auto mt-10">
        <CardHeader
          className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: `url(/${eventSlug}-background.png), url(/banner.jpg)`,
            backgroundSize: "cover",
          }}
        >
        </CardHeader>
        <CardContent className="p-6 flex flex-col gap-2">
          <div
            className="flex flex-col space-y-2 p-4 bg-primary bg-opacity-10 rounded-md"
          >
            <h2 className="text-2xl font-semibold text-primary">{currentStep.title}</h2>
            <p>{currentStep.description}</p>
            <div>
              <p className="text-muted-foreground text-sm">
                {isLoading ? t("state.loading") : (user?.email ? t("state.loggedIn", { email: user.email }) : t("state.loggedOut"))}
              </p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          <FormProvider {...currentStep.form as unknown as FormContextType}>
            {currentStep.component || <div>Loading Media Upload...</div>}
            <div className="flex flex-col sm:flex-row justify-between mt-2 gap-2">
              <Button
                type="button"
                onClick={() => setFormStep((prev) => Math.max(0, prev - 1))}
                disabled={formStep === 0 || isSubmitting}
                className="w-full sm:w-auto"
              >
                {t("Button.back")}
              </Button>
              {formStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? t("Button.loading") : t("Button.next")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSubmitting ? t("Button.submitting") : t("Button.submit")}
                </Button>
              )}
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </BackgroundDiv>
  );
}