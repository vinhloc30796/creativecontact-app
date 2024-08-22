// File: app/(public)/(event)/register/_sections/RegistrationForm.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import styles from './_register.module.scss'
import { formSchema, professionalInfoSchema, FormData, ProfessionalInfoData, CombinedFormData } from './formSchema'
import { EventRegistration } from './types'
import { EventRegistrationWithSlot } from '@/app/types/EventRegistration'
import { EventSlot } from '@/app/types/EventSlot'
import { ContactInfoStep } from './ContactInfoStep'
import { DateSelectionStep } from './DateSelectionStep'
import { ConfirmationStep } from './ConfirmationStep'
import { EmailExistedStep } from './EmailExistedStep'
import { ConfirmationPage } from './ConfirmationPage'
import { createRegistration, signInAnonymously, checkExistingRegistration, writeUserInfo } from './actions'
import { createClient } from '@/utils/supabase/client'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/hooks/useAuth'; // Import the new hook
import { ProfessionalInfoStep } from './ProfessionalInfoStep'

interface RegistrationFormProps {
  initialEventSlots: EventSlot[]
}

export default function RegistrationForm({ initialEventSlots }: RegistrationFormProps) {
  // Auth
  const { user, isLoading, error: authError, isAnonymous } = useAuth();
  // States
  const [formStep, setFormStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  // Forms
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'confirmed' | 'checked-in' | 'cancelled'>('pending');
  const [existingRegistration, setExistingRegistration] = useState<EventRegistrationWithSlot | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      // Date selection fields
      slot: '',
    },
  })

  const professionalInfoForm = useForm<ProfessionalInfoData>({
    resolver: zodResolver(professionalInfoSchema),
    mode: 'onSubmit',
    defaultValues: {
      industries: [],
      experience: undefined,
    },
  })

  // Update this function to sync professionalInfo state with the form
  const updateProfessionalInfo = (data: ProfessionalInfoData) => {
    console.debug('Updating professionalInfoForm values to:', data)
    professionalInfoForm.reset(data) // Reset the form with new data
  }

  const validateFormData = async () => {
    const result = await form.trigger()
    console.log('Form validation result:', result)
    if (!result) {
      console.error('Form validation errors:', form.formState.errors)
    }
    return result
  }

  const validateProfessionalInfo = () => {
    const professionalInfoData = professionalInfoForm.getValues()
    const validationResult = professionalInfoSchema.safeParse(professionalInfoData)
    console.log('professionalInfoData', professionalInfoData, 'Professional info validation result:', validationResult.success)
    if (!validationResult.success) {
      console.error('Professional info validation errors:', validationResult.error.errors)
    }
    return validationResult.success
  }


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
      title: 'Contact Information',
      description: 'Please provide your contact information',
      component: <ContactInfoStep form={form} />,
      fields: ['email', 'firstName', 'lastName', 'phone'] as const,
    },
    {
      title: 'Professional Information',
      description: 'Please provide your professional information',
      component: (
        <ProfessionalInfoStep
          form={professionalInfoForm}
          onSubmit={(data) => {
            updateProfessionalInfo(data)
            setFormStep((prev) => Math.min(steps.length - 1, prev + 1))
          }}
          renderButtons={(onSubmit) => (
            <div className="flex flex-col sm:flex-row justify-between mt-2 gap-2">
              <Button
                type="button"
                onClick={() => setFormStep((prev) => Math.max(0, prev - 1))}
                disabled={formStep === 0 || isSubmitting}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        />
        
      ),
      fields: [] as const,
    },
    {
      title: 'Select A Date',
      description: 'Please select a slot for the event.',
      component: <DateSelectionStep form={form} slots={initialEventSlots} />,
      fields: ['slot'] as const,
    },
    {
      title: 'Confirm Information',
      description: 'Please review and confirm your information.',
      component: <ConfirmationStep formData={form.getValues()} slots={initialEventSlots} />,
      fields: [] as const,
    },
  ]

  // Extract the current step
  const currentStep = steps[formStep]
  // Calculate progress percentage
  const progress = ((formStep + 1) / steps.length) * 100

  const validateStep = async () => {
    const fieldsToValidate = currentStep.fields
    const result = await form.trigger(fieldsToValidate)
    return result
  }

  const handleNextStep = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (formStep === 1) {
      // Professional Info step is handled by its own form
      return
    }
    const isStepValid = await validateStep()
    if (isStepValid) {
      if (formStep === 0) {
        // Check for existing registration after email is entered
        const email = form.getValues('email')
        const {registration: existingRegistration, userInfo: existingUserInfo } = await checkExistingRegistration(email)
        if (existingRegistration) {
          setExistingRegistration(existingRegistration)
        }
        if (existingUserInfo) {
          updateProfessionalInfo(existingUserInfo as ProfessionalInfoData)
        }
        // return // Don't proceed to next step yet
      }
      setFormStep((prev) => Math.min(steps.length - 1, prev + 1))
    } else {
      console.log('Validation failed:', form.formState.errors)
    }
  }

  const handleConfirmNewRegistration = () => {
    setIsUpdating(true);
    setExistingRegistration(null);
    setFormStep(1); // Move to date selection step
  }

  const handleKeepExistingRegistration = () => {
    setExistingRegistration(null);
    setFormStep(0); // Go back to contact info step
    form.reset(); // Reset the form
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    console.log('Submit button clicked')
    console.log('Current form values:', form.getValues())
    console.log('Current professional info:', professionalInfoForm.getValues())
    console.log('isUpdating:', isUpdating)
    console.log('isSubmitting:', isSubmitting)

    if (isSubmitting) {
      console.log('Form is already submitting, returning early')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const isFormValid = await validateFormData()
      const isProfessionalInfoValid = validateProfessionalInfo()

      console.log('Form validation result:', isFormValid)
      console.log('Professional info validation result:', isProfessionalInfoValid)

      if (!isFormValid || !isProfessionalInfoValid) {
        console.error('Form validation failed')
        setIsSubmitting(false)
        return
      }

      const formData = form.getValues()
      const professionalInfoData = professionalInfoForm.getValues()
      const combinedData: CombinedFormData = {
        ...formData,
        ...professionalInfoData,
      }

      console.log('Combined data for submission:', combinedData)

      const [registrationResult, userInfoResult] = await Promise.all([
        createRegistration({
          ...combinedData,
          created_by: user?.id || null,
          is_anonymous: isAnonymous,
          existingRegistrationId: isUpdating ? existingRegistration?.id : undefined,
        }),
        user?.id && isProfessionalInfoValid
          ? writeUserInfo(user.id, {
            industries: combinedData.industries,
            experience: combinedData.experience,
          })
          : Promise.resolve(null),
      ])

      console.log('Registration result:', registrationResult)
      console.log('User info result:', userInfoResult)

      if (registrationResult.success) {
        setSubmitted(true)
        setRegistrationStatus(registrationResult.status)
      } else {
        throw new Error(registrationResult.error || 'Registration failed')
      }

      if (userInfoResult && !userInfoResult.success) {
        console.error('Error writing user info:', userInfoResult.error)
      }
    } catch (error) {
      console.error('Error during registration:', error)
      setFormError(error instanceof Error ? error.message : 'An unexpected error occurred during registration')
    } finally {
      setIsSubmitting(false)
      setIsUpdating(false)
    }
  }


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
    return <ConfirmationPage formData={form.getValues()} slots={initialEventSlots} status={registrationStatus} />
  }

  if (existingRegistration) {
    return <EmailExistedStep
      existingRegistration={existingRegistration as EventRegistrationWithSlot}
      onConfirm={handleConfirmNewRegistration}
      onCancel={handleKeepExistingRegistration}
    />
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className={cn('flex flex-col gap-2', styles.form)}>
        <div
          className={cn('flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20', styles.step)}
          style={{ backgroundColor: '#F6EBE4' }}
        >
          <h2 className="text-2xl font-semibold text-primary">{currentStep.title}</h2>
          <p>{currentStep.description}</p>
          <div>
            <p className="text-muted-foreground text-sm">
              {`You're ` + (user?.email ? `logged in as ${user.email}` : `a guest`)}
            </p>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        {currentStep.component}
        {formStep !== 1 && (
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
                {isSubmitting ? 'Submitting...' : isUpdating ? 'Update Registration' : 'Submit Registration'}
              </Button>
            )}
          </div>
        )}
        {formError && (
          <div className="error-message mt-2 text-red-500 text-sm">
            {formError}
          </div>
        )}
      </form>
    </Form>
  )
}
