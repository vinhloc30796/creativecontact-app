// File: app/(public)/[eventSlug]/upload/UploadPageClient.tsx

"use client";

// Actions
import { insertArtworkAssets } from "./actions";
import {
  handleArtworkCreation,
  handleCoArtists,
  handleFileUpload,
  handleUserInfo,
  sendConfirmationEmail,
} from "./client-helpers";
// Types & Form schemas
import {
  ArtworkCreditInfoData,
  artworkCreditInfoSchema,
} from "@/app/form-schemas/artwork-credit-info";
import {
  ArtworkInfoData,
  artworkInfoSchema,
} from "@/app/form-schemas/artwork-info";
import {
  ContactInfoData,
  contactInfoSchema,
} from "@/app/form-schemas/contact-info";
import {
  ProfessionalInfoData,
  professionalInfoSchema,
} from "@/app/form-schemas/professional-info";
// Custom
import { EventNotFound } from "@/app/(public)/[eventSlug]/EventNotFound";
import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ContactInfoStep } from "@/components/user/ContactInfoStep";
import { ProfessionalInfoStep } from "@/components/user/ProfessionalInfoStep";
// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
// Hooks, contexts, i18n
import { ArtworkProvider, useArtwork } from "@/contexts/ArtworkContext";
import { ThumbnailProvider, useThumbnail } from "@/contexts/ThumbnailContext";
import { useAuth } from "@/hooks/useAuth";
import { useFormUserId } from "@/hooks/useFormUserId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useUploadStore } from "@/stores/uploadStore";
// Utils
import { createEmailLink } from "@/lib/links";
import { v4 as uuidv4 } from "uuid";

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

export default function UploadPageClient({
  eventSlug,
  eventData,
  recentEvents,
}: UploadPageClientProps) {
  return (
    <ArtworkProvider>
      <ThumbnailProvider>
        <UploadPageContent
          eventSlug={eventSlug}
          eventData={eventData}
          recentEvents={recentEvents}
        />
      </ThumbnailProvider>
    </ArtworkProvider>
  );
}

function UploadPageContent({
  eventSlug,
  eventData,
  recentEvents,
}: UploadPageClientProps) {
  // Router
  const router = useRouter();
  // Auth
  const { user, isLoading, error: authError, isAnonymous } = useAuth();
  const {
    resolveFormUserId,
    userData,
    isLoading: isUserDataLoading,
  } = useFormUserId();
  // Context
  const { currentArtwork, artworks, setCurrentArtwork, addArtwork } =
    useArtwork();
  const { thumbnailFileName } = useThumbnail();
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artworkUUID, setArtworkUUID] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isNewArtwork, setIsNewArtwork] = useState(true);
  // I18n
  const { t, i18n } = useTranslation(["eventSlug", "formSteps"]);
  // Form setup
  const [formStep, setFormStep] = useState(0);
  // Upload progress
  const {
    uploadProgress,
    uploadedFileCount,
    totalFileCount,
    setUploadProgress,
    resetUploadProgress,
  } = useUploadStore();

  const contactInfoForm = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneCountryCode: "",
      phoneNumber: "",
      instagramHandle: undefined,
      facebookHandle: undefined,
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
        firstName: userData.firstName ?? '',
        lastName: userData.lastName ?? '',
        phoneCountryCode: userData.phoneCountryCode ?? '',
        phoneNumber: userData.phoneNumber ?? '',
        instagramHandle: userData.instagramHandle || undefined,
        facebookHandle: userData.facebookHandle || undefined,
      });
      professionalInfoForm.reset({
        industries: userData.industries || [],
        experience: userData.experience || undefined,
      });
    }
  }, [userData, isLoading, professionalInfoForm, contactInfoForm]);

  if (!eventData) {
    return <EventNotFound recentEvents={recentEvents} eventSlug={eventSlug} />;
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
  };

  // Callback function to update pending files
  const handlePendingFilesUpdate = (files: File[]) => {
    setPendingFiles(files);
  };

  async function validateForms() {
    const validationResult = await Promise.all([
      contactInfoForm.trigger(),
      professionalInfoForm.trigger(),
      artworkForm.trigger(),
      artworkCreditForm.trigger(),
    ]);

    return validationResult.every((result) => result === true);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    resetUploadProgress();
    try {
      const isValid = await validateForms();
      if (!isValid) return false;

      const contactInfoData = contactInfoForm.getValues();
      const professionalInfoData = professionalInfoForm.getValues();
      const artworkData = artworkForm.getValues();
      const artworkCreditData = artworkCreditForm.getValues();

      const { formUserId, writeUserInfoResult } = await handleUserInfo(
        contactInfoData,
        professionalInfoData,
        resolveFormUserId,
      );
      console.log("Write user info successful:", writeUserInfoResult);

      if (pendingFiles.length === 0) {
        toast.error("No files to upload");
        return false;
      } else if (!artworkUUID) {
        toast.error("Artwork UUID not set");
        return false;
      } else if (!thumbnailFileName) {
        toast.error("Thumbnail file not set");
        return false;
      }

      // Upload files then record artwork into database
      const files = pendingFiles.map(
        (file) => new File([file], file.name, { type: file.type }),
      );
      const uploadedResults = await handleFileUpload(
        artworkUUID,
        files,
        thumbnailFileName,
        setUploadProgress,
      );
      // const uploadedResults = await handleFileUploadAlwaysFails();
      const { createResult, insertArtworkEventsResult } =
        await handleArtworkCreation(artworkData, formUserId, eventSlug);
      console.log(
        "Artwork created:",
        createResult,
        "and artwork events inserted:",
        insertArtworkEventsResult,
      );

      // Insert assets
      const insertAssetsResult = await insertArtworkAssets(
        artworkData.uuid,
        uploadedResults,
      );
      console.log("Insert assets successful:", insertAssetsResult);

      // Signup co-artists and record their info
      await handleCoArtists(artworkData, artworkCreditData, eventSlug);

      // Send confirmation email
      const emailResult = await sendConfirmationEmail(
        contactInfoData,
        artworkData,
        eventSlug,
      );
      const params = new URLSearchParams({
        email: contactInfoData.email,
        userId: formUserId,
        artworkId: artworkData.uuid,
        emailSent: emailResult.success ? "true" : "false",
        lang: i18n?.language || "en",
      });

      const confirmedUrl = `/${eventSlug}/upload-confirmed?${params.toString()}`;
      toast.success(t("UploadSuccess.title"), {
        description: t("UploadSuccess.description", { confirmedUrl }),
        action: <a href={confirmedUrl}>{t("UploadSuccess.action")}</a>,
        onAutoClose: (t) => {
          console.debug(`Toast with id ${t.id} has been closed automatically`);
          // Redirect to the confirmation page
          window.location.href = confirmedUrl;
        },
        duration: 5000,
      });

      // Redirect to the confirmation page
      const navigationTimeout = 5000; // 5 seconds
      const navigationPromise = router.push(confirmedUrl);
      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(
          () => reject(new Error("Navigation timeout")),
          navigationTimeout,
        ),
      );
      // Try to navigate to the confirmation page, if it fails, redirect to the confirmation page
      try {
        await Promise.race([navigationPromise, timeoutPromise]);
        console.log("Navigation completed");
      } catch (err) {
        console.error("Navigation failed or timed out", err);
        window.location.href = confirmedUrl;
      }
    } catch (error) {
      console.error("error", error);
      toast.error(t("UploadFailure.title"), {
        description: t("UploadFailure.description", { value: error }),
        duration: 5000,
      });
      return false;
    } finally {
      setIsSubmitting(false);
      resetUploadProgress();
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
          <ArtworkInfoStep form={artworkForm} artworks={artworks} />
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
      description: (
        <Trans
          i18nKey="formSteps:MediaUpload.description"
          values={{
            artworkTitle:
              currentArtwork?.title ?? t("formSteps:MediaUpload.fallback"),
          }}
          components={{ strong: <strong /> }}
        />
      ),
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

  const renderCurrentStep = () => {
    const currentStep = steps[formStep];

    if (!currentStep.form) {
      // If there's no form (e.g., MediaUpload step), just render the component
      return currentStep.component;
    }

    return (
      <FormProvider {...(currentStep.form as any)}>
        {currentStep.component}
      </FormProvider>
    );
  };

  // Extract the current step
  const currentStep = steps[formStep];
  // Calculate progress percentage
  const progress = ((formStep + 1) / steps.length) * 100;

  const handleNextStep = async () => {
    console.log("Current formStep:", formStep);
    const currentStepData = steps[formStep];
    const form = currentStepData.form;
    if (form) {
      const formData = form.getValues();
      currentStepData.handlePreSubmit &&
        (await currentStepData.handlePreSubmit(formData as any));
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
      <Card className="mx-auto mt-10 w-[400px]">
        <CardHeader
          className="aspect-video border-b bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: `url(/${eventSlug}-background.png), url(/banner.jpg)`,
            backgroundSize: "cover",
          }}
        ></CardHeader>
        <CardContent className="flex flex-col gap-2 p-6">
          <div className="flex flex-col space-y-2 rounded-md bg-primary bg-opacity-10 p-4">
            <h2 className="text-2xl font-semibold text-primary">
              {currentStep.title}
            </h2>
            <p>{currentStep.description}</p>
            <div>
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? t("state.loading")
                  : user?.email
                    ? t("state.loggedIn", { email: user.email })
                    : t("state.loggedOut")}
              </p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          {/* Form */}
          {renderCurrentStep()}
          {/* Buttons */}
          <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row">
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
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
              >
                {isSubmitting ? t("Button.submitting") : t("Button.submit")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Upload Progress Dialog */}
      {isSubmitting && uploadProgress > 0 && (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="mb-2 text-2xl font-bold">
                {t("UploadProgress.title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {t("UploadProgress.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <p className="text-sm text-gray-700">
                {t("UploadProgress.fileCount", {
                  current: uploadedFileCount,
                  total: totalFileCount,
                })}
              </p>
              <Progress value={uploadProgress} className="mt-2 w-full" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </BackgroundDiv>
  );
}
