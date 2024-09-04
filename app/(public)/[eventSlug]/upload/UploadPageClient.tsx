// File: app/(public)/[eventSlug]/upload/UploadPageClient.tsx

"use client";

import { ContactInfoData, contactInfoSchema } from '@/app/form-schemas/contact-info';
import { ProfessionalInfoData, professionalInfoSchema } from '@/app/form-schemas/professional-info';
import { ArtworkInfoData, artworkInfoSchema } from '@/app/form-schemas/artwork-info';
import { ArtworkInfoStep } from '@/components/artwork/ArtworkInfoStep';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Separator } from "@/components/ui/separator";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ContactInfoStep } from '@/components/user/ContactInfoStep';
import { ProfessionalInfoStep } from '@/components/user/ProfessionalInfoStep';
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { useAuth } from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';

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

function createEmailLink(event: {
  id: string;
  name: string;
  slug: string;
}) {
  const email = `hello+${event.slug}@creativecontact.vn`;
  const emailSubject = `Upload Files for Event: ${event.name}`;
  const emailBody = `Hi Creative Contact,

  I'd like to upload files for the event "${event.name}".`
  return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
}

export default function UploadPageClient({ eventSlug, eventData, recentEvents }: UploadPageClientProps) {
  if (!eventData) {
    return (
      <BackgroundDiv eventSlug={eventSlug}>
        <Card className="w-[400px] mx-auto mt-10">
          <CardHeader
            className="border-b aspect-video bg-accent-foreground text-accent-foreground"
            style={{
              backgroundImage: `url(/${eventSlug}-background.png)`,
              backgroundSize: 'cover',
            }}
          >
          </CardHeader>
          <CardContent className='p-6 flex flex-col gap-2'>
            <CardTitle>Event Not Found</CardTitle>
            <p className="mb-4">The event &quot;{eventSlug}&quot; does not exist. Did you mean one of these?</p>
            <div className="space-y-2">
              {recentEvents.map((recentEvent) => (
                <Button key={recentEvent.id} asChild variant="outline" className="w-full">
                  <Link href={`/${recentEvent.slug}/upload`}>
                    {recentEvent.name}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </BackgroundDiv>
    );
  }

  const emailLink = createEmailLink(eventData);
  // Auth
  const { user, isLoading, error: authError, isAnonymous } = useAuth();
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artworkUUID, setArtworkUUID] = useState<string | null>(null);
  // Form setup
  const [formStep, setFormStep] = useState(0);
  const contactInfoForm = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
    },
  });

  const professionalInfoForm = useForm<ProfessionalInfoData>({
    resolver: zodResolver(professionalInfoSchema),
    mode: 'onSubmit',
    defaultValues: {
      industries: [],
      experience: undefined,
    },
  });

  const artworkForm = useForm<ArtworkInfoData>({
    resolver: zodResolver(artworkInfoSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
    },
  });

  // Actions
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const contactInfoResult = await contactInfoForm.trigger();
      console.log('contactInfoForm', contactInfoForm.formState.errors);
      const professionalInfoResult = await professionalInfoForm.trigger();
      console.log('professionalInfoForm', professionalInfoForm.formState.errors);
      const artworkResult = await artworkForm.trigger();
      console.log('artworkForm', artworkForm.formState.errors);
      return contactInfoResult && professionalInfoResult && artworkResult;
    } catch (error) {
      console.error('error', error);
    }
  };

  const handleUpload = (uuid: string | null) => {
    setArtworkUUID(uuid);
  };

  const steps = [
    {
      title: 'Contact Information',
      description: 'Please provide your contact information',
      component: <ContactInfoStep form={contactInfoForm} />,
      form: contactInfoForm,
    },
    {
      title: 'Professional Information',
      description: 'Please provide your professional information',
      component: <ProfessionalInfoStep form={professionalInfoForm} />,
      form: professionalInfoForm,
    },
    {
      title: 'Artwork Information',
      description: 'Please provide more information about your artwork',
      component: <ArtworkInfoStep form={artworkForm} />,
      form: artworkForm,
    },
    {
      title: 'Upload Files',
      description: `Upload files for the event "${eventData.name}"`,
      component: (
        <>
          <MediaUpload onUpload={handleUpload} />
          <p className="text-sm text-foreground mb-2">Alternatively, you can email us:</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href={emailLink}>Email Us</Link>
          </Button>
        </>
      ),
    },
  ];

  // Extract the current step
  const currentStep = steps[formStep];
  // Calculate progress percentage
  const progress = ((formStep + 1) / steps.length) * 100

  const handleNextStep = async () => {
    console.log('formStep', formStep);
    const form = currentStep.form;
    if (form) {
      const isValid = await form.trigger();
      if (isValid) {
        setFormStep((prev) => prev + 1);
      }
      else {
        console.error('invalid form', form.formState.errors);
      }
    }
  };

  return (
    <BackgroundDiv eventSlug={eventSlug}>
      <Card className="w-[400px] mx-auto mt-10">
        <CardHeader
          className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: `url(/${eventSlug}-background.png)`,
            backgroundSize: 'cover',
          }}
        >
        </CardHeader>
        <CardContent className='p-6 flex flex-col gap-2'>
          <div
            className='flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md'
            style={{ backgroundColor: '#F6EBE4' }}
          >
            <h2 className="text-2xl font-semibold text-primary">{currentStep.title}</h2>
            <p>{currentStep.description}</p>
            <div>
              <p className="text-muted-foreground text-sm">
                {isLoading ? 'Loading user information...' : `You're ` + (user?.email ? `logged in as ${user.email}` : `a guest`)}
              </p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          <FormProvider {...currentStep.form as unknown as FormContextType}>
            {currentStep.component}
            <div className="flex flex-col sm:flex-row justify-between mt-2 gap-2">
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
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              )}
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </BackgroundDiv>
  );
}