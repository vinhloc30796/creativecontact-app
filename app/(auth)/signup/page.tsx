'use client'

import { writeUserInfo } from '@/app/actions/user/writeUserInfo';
import { ContactInfoData, contactInfoSchema } from '@/app/form-schemas/contact-info';
import { ProfessionalInfoData, professionalInfoSchema } from '@/app/form-schemas/professional-info';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HeroTitle } from '@/components/ui/typography';
import { ContactInfoStep } from '@/components/user/ContactInfoStep';
import { ProfessionalInfoStep } from '@/components/user/ProfessionalInfoStep';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { ExperienceType, IndustryType } from '@/drizzle/schema/user';
import { useFormUserId } from '@/hooks/useFormUserId';
import { useTranslation } from '@/lib/i18n/init-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

const signupSchema = z.object({
  ...contactInfoSchema.shape,
  ...professionalInfoSchema.shape,
})

type SignupData = z.infer<typeof signupSchema>
type FormContextType = UseFormReturn<ContactInfoData & ProfessionalInfoData>

export default function SignupPage(
  props: {
    searchParams: Promise<{
      lang: string;
    }>;
  }
) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "en";
  const [step, setStep] = useState(0)
  const { t } = useTranslation(lang, ['formSteps'])
  const router = useRouter()
  const { resolveFormUserId, userData, isLoading } = useFormUserId()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfoForm = useForm<ContactInfoData>({
    resolver: zodResolver(contactInfoSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneCountryCode: '84',
      phoneNumber: '',
      phoneCountryAlpha3: 'VNM',
    },
  })

  const professionalInfoForm = useForm<ProfessionalInfoData>({
    resolver: zodResolver(professionalInfoSchema),
    mode: 'onSubmit',
    defaultValues: {
      industryExperiences: []
    },
  })

  useEffect(() => {
    if (userData && !isLoading) {
      contactInfoForm.reset({
        email: userData.email,
        firstName: userData.firstName ?? '',
        lastName: userData.lastName ?? '',
        phoneCountryCode: userData.phoneCountryCode ?? '84',
        phoneNumber: userData.phoneNumber ?? '',
        phoneCountryAlpha3: userData.phoneCountryAlpha3 ?? 'VNM',
      })
      professionalInfoForm.reset({
        industryExperiences: userData.industryExperiences || []
      })
    }
  }, [userData, isLoading, contactInfoForm, professionalInfoForm])

  const steps = [
    {
      title: t('ContactInfoStep.title'),
      description: t('ContactInfoStep.description'),
      component: <ContactInfoStep form={contactInfoForm} lang={lang} />,
      form: contactInfoForm,
    },
    {
      title: t('ProfessionalInfoStep.title'),
      description: t('ProfessionalInfoStep.description'),
      component: <ProfessionalInfoStep form={professionalInfoForm} lang={lang} />,
      form: professionalInfoForm,
    },
  ]

  const currentStep = steps[step]
  const progress = ((step + 1) / steps.length) * 100

  const handleNextStep = async () => {
    const form = currentStep.form
    const isValid = await form.trigger()
    if (isValid) {
      setStep((prev) => prev + 1)
    } else {
      console.error('invalid form', form.formState.errors)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const contactInfoData = contactInfoForm.getValues()
      const professionalInfoData = professionalInfoForm.getValues()

      const formUserId = await resolveFormUserId(contactInfoData.email)

      const writeUserInfoResult = await writeUserInfo(
        formUserId,
        {
          phoneCountryCode: contactInfoData.phoneCountryCode,
          phoneNumber: contactInfoData.phoneNumber,
          phoneCountryAlpha3: contactInfoData.phoneCountryAlpha3,
          firstName: contactInfoData.firstName,
          lastName: contactInfoData.lastName,
        },
        {
          industryExperiences: professionalInfoData.industryExperiences.map(exp => ({
            industry: exp.industry as IndustryType,
            experienceLevel: exp.experienceLevel as ExperienceType
          }))
        },
        {
          instagramHandle: contactInfoData.instagramHandle,
          facebookHandle: contactInfoData.facebookHandle,
        },
      )

      console.log('Write user info successful:', writeUserInfoResult)

      // Redirect to a success page or dashboard
      router.push('/signup-success')
    } catch (error) {
      console.error('error', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BackgroundDiv
      shouldCenter={false}
      className={cn(
        'flex flex-col md:flex-row h-screen w-full overflow-hidden'
      )}
    >
      {/* Hero / Illustration section */}
      <div
        className={cn(
          'order-2 md:order-1 flex-1 hidden md:block',
          "bg-[url('/banner.jpg')] bg-cover bg-center"
        )}
      />

      {/* Signup form section */}
      <div
        className={cn(
          'order-1 md:order-2 flex-1',
          'flex items-center justify-center'
        )}
      >
        <Suspense fallback={<Loading />}>
          <Card className="w-[90%] max-w-[420px] overflow-hidden border-4 border-black shadow-[4px_4px_0_0_#000]">
            {/* Mobile banner */}
            <CardHeader
              className="aspect-video md:hidden bg-[url('/banner.jpg')] bg-cover bg-center relative"
            />
            <CardContent className="p-6 flex flex-col gap-6">
              {/* Brand heading */}
              <HeroTitle
                size="small"
                bordered="black"
                variant="accent"
                className="text-black text-center"
              >
                SIGN&nbsp;UP
              </HeroTitle>

              {/* Step information */}
              <div className="flex flex-col gap-2 bg-sunglow/10 p-4 mb-2 rounded-md border border-sunglow/40">
                <h2 className="text-2xl font-semibold text-black">{currentStep.title}</h2>
                <p>{currentStep.description}</p>
                <Progress
                  value={progress}
                  className="w-full bg-sunglow/20"
                  indicatorClassName="bg-sunglow"
                />
              </div>

              {/* Form */}
              <FormProvider {...(currentStep.form as unknown as FormContextType)}>
                <form onSubmit={currentStep.form.handleSubmit(step === steps.length - 1 ? handleSubmit : handleNextStep)}>
                  {currentStep.component}
                  <div className="flex justify-between mt-4">
                    {step > 0 && (
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => setStep((prev) => prev - 1)}
                        disabled={isSubmitting}
                        className="bg-sunglow text-black hover:bg-yellow-400 focus-visible:ring-yellow-500"
                      >
                        {t('Button.back')}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-sunglow text-black hover:bg-yellow-400 focus-visible:ring-yellow-500"
                    >
                      {isSubmitting
                        ? t('Button.submitting')
                        : step === steps.length - 1
                          ? t('Button.submit')
                          : t('Button.next')}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </BackgroundDiv>
  )
}
