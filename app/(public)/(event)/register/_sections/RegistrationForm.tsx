// File: app/(public)/(event)/register/_sections/RegistrationForm.tsx

"use client";

import { writeUserInfo } from "@/app/actions/user/writeUserInfo";
import {
  ContactInfoData,
  contactInfoSchema,
} from "@/app/form-schemas/contact-info";
import {
  EventRegistrationData,
  eventRegistrationSchema,
} from "@/app/form-schemas/event-registration";
import {
  ProfessionalInfoData,
  professionalInfoSchema,
} from "@/app/form-schemas/professional-info";
import { EventRegistrationWithSlot } from "@/app/types/EventRegistration";
import { EventSlot } from "@/app/types/EventSlot";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ContactInfoStep } from "@/components/user/ContactInfoStep";
import { ProfessionalInfoStep } from "@/components/user/ProfessionalInfoStep";
import {
  type UserIndustryExperience,
  type UserInfo,
} from "@/drizzle/schema/user";
import { useAuth } from "@/hooks/useAuth"; // Import the new hook
import { useFormUserId } from "@/hooks/useFormUserId";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { ConfirmationPage } from "./ConfirmationPage";
import { ConfirmationStep } from "./ConfirmationStep";
import { DateSelectionStep } from "./DateSelectionStep";
import { EmailExistedStep } from "./EmailExistedStep";
import { checkExistingRegistration, createRegistration } from "./actions";
import { FormData, formSchema } from "./formSchema";

interface RegistrationFormProps {
  initialEventSlots: EventSlot[];
  lang?: string;
}

type FormContextType = UseFormReturn<
  ContactInfoData & ProfessionalInfoData & EventRegistrationData
>;

export default function RegistrationForm({
  initialEventSlots,
  lang = "en",
}: RegistrationFormProps) {
  // Auth
  const { user, isLoading, error: authError, isAnonymous } = useAuth();
  const {
    resolveFormUserId,
    userData,
    isLoading: isUserDataLoading,
  } = useFormUserId();
  // States
  const [formStep, setFormStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // Forms
  const [registrationStatus, setRegistrationStatus] = useState<
    "pending" | "confirmed" | "checked-in" | "cancelled"
  >("pending");
  const [existingRegistration, setExistingRegistration] =
    useState<EventRegistrationWithSlot | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  // Form setup
  const contactInfoForm = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneCountryCode: "84",
      phoneNumber: "",
      phoneCountryAlpha3: "VNM",
    },
  });

  const eventRegistrationForm = useForm<EventRegistrationData>({
    resolver: zodResolver(eventRegistrationSchema),
    mode: "onSubmit",
    defaultValues: {
      slot: "",
    },
  });

  const professionalInfoForm = useForm<ProfessionalInfoData>({
    resolver: zodResolver(professionalInfoSchema),
    mode: "onSubmit",
    defaultValues: {
      industryExperiences: [],
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      // Contact Info
      email: "",
      firstName: "",
      lastName: "",
      phoneCountryCode: "84",
      phoneNumber: "",
      phoneCountryAlpha3: "VNM",

      // Professional Info
      industryExperiences: [],

      // Event Registration
      slot: "",
    },
  });

  // Effects
  useEffect(() => {
    if (userData && !isLoading) {
      // Auto-fill form fields
      contactInfoForm.reset({
        email: userData.email,
        firstName: userData.firstName ?? "",
        lastName: userData.lastName ?? "",
        phoneCountryCode: userData.phoneCountryCode ?? "84",
        phoneNumber: userData.phoneNumber ?? "",
        phoneCountryAlpha3: userData.phoneCountryAlpha3 ?? "VNM",
      });
      professionalInfoForm.reset({
        industryExperiences: userData.industryExperiences || [],
      });
    }
  }, [userData, isLoading, professionalInfoForm, contactInfoForm]);

  // Update this function to sync professionalInfo state with the form
  const updateProfessionalInfo = (
    userInfo: UserInfo,
    industryExperiences?: UserIndustryExperience[],
  ) => {
    // Map the data to the new structure
    const professionalData: ProfessionalInfoData = {
      industryExperiences:
        industryExperiences?.map((exp) => ({
          industry: exp.industry,
          experienceLevel: exp.experienceLevel,
        })) || [],
      // ... map other fields from userInfo
    };

    // Update your form state
    professionalInfoForm.reset(professionalData);
  };

  const validateContactInfo = async () => {
    const result = await contactInfoForm.trigger();
    console.log("Form validation result:", result);
    if (!result) {
      console.error(
        "Form validation errors:",
        contactInfoForm.formState.errors,
      );
    }
    return result;
  };

  const validateEventRegistration = async () => {
    const result = await eventRegistrationForm.trigger();
    console.log("Event registration form validation result:", result);
    if (!result) {
      console.error(
        "Event registration form validation errors:",
        eventRegistrationForm.formState.errors,
      );
    }
    return result;
  };

  const validateProfessionalInfo = async () => {
    const result = await professionalInfoForm.trigger();
    console.log("Professional info validation result:", result);
    if (!result) {
      console.error(
        "Professional info validation errors:",
        professionalInfoForm.formState.errors,
      );
    }
    return result;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (authError) {
    return (
      <div>
        <p>Authentication Error: {authError}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const steps = [
    {
      title: "Contact Information",
      description: "Please provide your contact information",
      component: <ContactInfoStep form={contactInfoForm} />,
      form: contactInfoForm,
      fields: ["email", "firstName", "lastName", "phone"] as const,
    },
    {
      title: "Professional Information",
      description: "Please provide your professional information",
      component: (
        <ProfessionalInfoStep form={professionalInfoForm} lang={lang} />
      ),
      form: professionalInfoForm,
      fields: ["industryExperiences"] as const,
    },
    {
      title: "Select A Date",
      description: "Please select a slot for the event.",
      component: (
        <DateSelectionStep
          eventRegistrationForm={eventRegistrationForm}
          slots={initialEventSlots}
        />
      ),
      form: eventRegistrationForm,
      fields: ["slot"] as const,
    },
    {
      title: "Almost There!",
      description: "Please check if your information is correct.",
      component: (
        <ConfirmationStep
          contactInfoData={contactInfoForm.getValues()}
          eventRegistrationData={eventRegistrationForm.getValues()}
          professionalInfoData={professionalInfoForm.getValues()}
          slots={initialEventSlots}
        />
      ),
      form: form,
      fields: [] as const,
    },
  ];

  // Extract the current step
  const currentStep = steps[formStep];
  // Calculate progress percentage
  const progress = ((formStep + 1) / steps.length) * 100;

  const validateStep = async (step: number) => {
    const form = steps[step].form;
    const result = await form.trigger();
    return result;
  };

  const handleNextStep = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const isStepValid = await validateStep(formStep);
    if (isStepValid) {
      if (formStep === 0) {
        // Check for existing registration after email is entered
        const email = contactInfoForm.getValues("email");
        const {
          registration: existingRegistration,
          userInfo: existingUserInfo,
        } = await checkExistingRegistration(email);
        if (existingRegistration) {
          setExistingRegistration(existingRegistration);
        }
        if (existingUserInfo) {
          updateProfessionalInfo(existingUserInfo as UserInfo);
        }
        // return // Don't proceed to next step yet
      }
      setFormStep((prev) => Math.min(steps.length - 1, prev + 1));
    } else {
      // Merge errors from all forms
      const formErrors = {
        ...contactInfoForm.formState.errors,
        ...eventRegistrationForm.formState.errors,
        ...professionalInfoForm.formState.errors,
      };
      console.log("Validation failed:", formErrors);
    }
  };

  const handleConfirmNewRegistration = () => {
    setIsUpdating(true);
    setExistingRegistration(null);
    setFormStep(1); // Move to date selection step
  };

  const handleKeepExistingRegistration = () => {
    setExistingRegistration(null);
    setFormStep(0); // Go back to contact info step
    // Reset the forms
    contactInfoForm.reset();
    eventRegistrationForm.reset();
    professionalInfoForm.reset();
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    console.debug("Submit button clicked");
    console.debug("Current contact:", contactInfoForm.getValues());
    console.debug(
      "Current professional info:",
      professionalInfoForm.getValues(),
    );
    console.debug("isUpdating:", isUpdating);
    console.debug("isSubmitting:", isSubmitting);

    if (isSubmitting) {
      console.log("Form is already submitting, returning early");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const isContactInfoValid = await validateContactInfo();
      const isEventRegistrationValid = await validateEventRegistration();
      const isProfessionalInfoValid = validateProfessionalInfo();

      console.log("Contact info validation result:", isContactInfoValid);
      console.log(
        "Event registration validation result:",
        isEventRegistrationValid,
      );
      console.log(
        "Professional info validation result:",
        isProfessionalInfoValid,
      );

      if (
        !isContactInfoValid ||
        !isEventRegistrationValid ||
        !isProfessionalInfoValid
      ) {
        console.error("Form validation failed");
        setIsSubmitting(false);
        return;
      }

      const contactInfoData = contactInfoForm.getValues();
      const eventRegistrationData = eventRegistrationForm.getValues();
      const professionalInfoData = professionalInfoForm.getValues();
      const combinedData = {
        ...contactInfoData,
        ...eventRegistrationData,
        ...professionalInfoData,
      };

      // Either:
      // - formData.email is a confirmed email address (getUserId is not null)
      // - user is logged-in with a confirmed email address, but registering for their friend (we should create a new user)
      // - user is logged-in anonymously (a user is already created via signInAnonymously)
      const formUserId = await resolveFormUserId(contactInfoData.email);

      console.log("Combined data for submission:", combinedData);

      const [registrationResult, userInfoResult] = await Promise.all([
        createRegistration({
          // Contact Info & Social Media
          ...contactInfoData,

          // Event Registration
          slot: eventRegistrationData.slot,

          // Professional Info
          ...professionalInfoData,

          // Additional fields
          created_by: user?.id || null,
          is_anonymous: isAnonymous,
          existingRegistrationId: isUpdating
            ? existingRegistration?.id
            : undefined,
        }),
        formUserId && combinedData.industryExperiences
          ? writeUserInfo(
              formUserId,
              {
                phoneCountryCode: contactInfoData.phoneCountryCode,
                phoneNumber: contactInfoData.phoneNumber,
                phoneCountryAlpha3: contactInfoData.phoneCountryAlpha3,
                firstName: contactInfoData.firstName,
                lastName: contactInfoData.lastName,
              },
              professionalInfoData,
              {
                instagramHandle: combinedData.instagramHandle,
                facebookHandle: combinedData.facebookHandle,
              },
            )
          : Promise.resolve(null),
      ]);

      console.log("Registration result:", registrationResult);
      console.log("User info result:", userInfoResult);

      if (registrationResult.success) {
        setSubmitted(true);
        setRegistrationStatus(registrationResult.status);
      } else {
        throw new Error(registrationResult.error || "Registration failed");
      }

      if (userInfoResult && !userInfoResult.success) {
        console.error("Error writing user info:", userInfoResult.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during registration",
      );
    } finally {
      setIsSubmitting(false);
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (authError) {
    return (
      <div>
        <p>Authentication Error: {authError}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <ConfirmationPage
        contactInfoData={contactInfoForm.getValues()}
        eventRegistrationData={eventRegistrationForm.getValues()}
        professionalInfoData={professionalInfoForm.getValues()}
        slots={initialEventSlots}
        status={registrationStatus}
      />
    );
  }

  if (existingRegistration) {
    return (
      <EmailExistedStep
        existingRegistration={existingRegistration as EventRegistrationWithSlot}
        onConfirm={handleConfirmNewRegistration}
        onCancel={handleKeepExistingRegistration}
      />
    );
  }

  return (
    <FormProvider {...(currentStep.form as FormContextType)}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className={cn("flex flex-col gap-2")}
      >
        <div
          className={cn(
            "flex flex-col space-y-2 rounded-md border border-primary-foreground border-opacity-20 bg-slate-400 bg-opacity-10 p-4",
          )}
          style={{ backgroundColor: "#F6EBE4" }}
        >
          <h2 className="text-2xl font-semibold text-primary">
            {currentStep.title}
          </h2>
          <p>{currentStep.description}</p>
          <div>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading user information..."
                : `You're ` +
                  (user?.email ? `logged in as ${user.email}` : `a guest`)}
            </p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        {currentStep.component}
        <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row">
          <Button
            type="button"
            onClick={() => setFormStep((prev) => Math.max(0, prev - 1))}
            disabled={formStep === 0 || isSubmitting}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          {formStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting
                ? "Submitting..."
                : isUpdating
                  ? "Update"
                  : "Submit"}
            </Button>
          )}
        </div>
        {formError && (
          <div className="error-message mt-2 text-sm text-red-500">
            {formError}
          </div>
        )}
      </form>
    </FormProvider>
  );
}
