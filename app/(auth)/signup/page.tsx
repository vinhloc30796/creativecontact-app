'use client'

import React, { useState, useEffect, use } from 'react';
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { ContactInfoStep } from '@/components/user/ContactInfoStep'
import { ProfessionalInfoStep } from '@/components/user/ProfessionalInfoStep'
import { useTranslation } from '@/lib/i18n/init-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useFormUserId } from '@/hooks/useFormUserId'
import { writeUserInfo } from '@/app/actions/user/writeUserInfo'
import { useRouter } from 'next/navigation'
import { contactInfoSchema, ContactInfoData } from '@/app/form-schemas/contact-info'
import { professionalInfoSchema, ProfessionalInfoData } from '@/app/form-schemas/professional-info'
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'
import { IndustryType, ExperienceType } from '@/drizzle/schema/user'

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
  const searchParams = use(props.searchParams);
  const lang = searchParams.lang || "en";
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
    <BackgroundDiv>
      <Card className="w-[400px] mx-auto mt-10">
        <CardHeader
          className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/signup-background.png), url(/banner.jpg)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className="p-6 flex flex-col gap-2">
          <div
            className="flex flex-col space-y-2 p-4 bg-primary bg-opacity-10 rounded-md"
          >
            <h2 className="text-2xl font-semibold text-primary">{currentStep.title}</h2>
            <p>{currentStep.description}</p>
            <Progress value={progress} className="w-full" />
          </div>
          <FormProvider {...currentStep.form as unknown as FormContextType}>
            <form onSubmit={currentStep.form.handleSubmit(step === steps.length - 1 ? handleSubmit : handleNextStep)}>
              {currentStep.component}
              <div className="flex justify-between mt-4">
                {step > 0 && (
                  <Button type="button" onClick={() => setStep((prev) => prev - 1)} disabled={isSubmitting}>
                    {t('Button.back')}
                  </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
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
    </BackgroundDiv>
  )
}
