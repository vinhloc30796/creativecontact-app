// File: app/(public)/(event)/register/_sections/RegistrationForm.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import styles from './_register.module.scss'
import { formSchema, FormData } from './formSchema'
import { EventSlot, EventRegistration, EventRegistrationWithSlot } from './types'
import { ContactInfoStep } from './ContactInfoStep'
import { DateSelectionStep } from './DateSelectionStep'
import { ConfirmationStep } from './ConfirmationStep'
import { EmailExistedStep } from './EmailExistedStep'
import { ConfirmationPage } from './ConfirmationPage'
import { createRegistration, signInAnonymously, checkExistingRegistration } from './actions'
import { createClient } from '@/utils/supabase/client'

interface RegistrationFormProps {
	initialEventSlots: EventSlot[]
}

export default function RegistrationForm({ initialEventSlots }: RegistrationFormProps) {
	const [formStep, setFormStep] = useState(0)
	const [submitted, setSubmitted] = useState(false)
	const [userId, setUserId] = useState<string | null>(null)
	const [isAnonymous, setIsAnonymous] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'confirmed' | 'checked-in' | 'cancelled'>('pending')
	const [existingRegistration, setExistingRegistration] = useState<EventRegistration | null>(null)

	const supabase = createClient()

	useEffect(() => {
		const checkAuthStatus = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser()
				if (error) {
					console.error('Error during authentication check:', error)
					setError('An unexpected error occurred during authentication')
				}
				if (user) {
					setUserId(user.id)
					setIsAnonymous(user.app_metadata.provider === 'anonymous')
				} else {
					const anonymousUser = await signInAnonymously()
					if (anonymousUser) {
						setUserId(anonymousUser.id)
						setIsAnonymous(true)
					} else {
						throw new Error('Failed to sign in anonymously')
					}
				}
			} catch (error) {
				console.error('Error during authentication check:', error)
				setError('An unexpected error occurred during authentication')
			} finally {
				setIsLoading(false)
			}
		}

		checkAuthStatus()
	}, [supabase.auth])

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			phone: '',
			slot: '',
		},
	})

	const steps = [
		{
			title: 'Contact Information',
			description: 'Please provide your contact information.',
			component: <ContactInfoStep form={form} />,
			fields: ['email', 'firstName', 'lastName', 'phone'] as const,
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

	const currentStep = steps[formStep]

	const validateStep = async () => {
		const fieldsToValidate = currentStep.fields
		const result = await form.trigger(fieldsToValidate)
		return result
	}

	const handleNextStep = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault()
		const isStepValid = await validateStep()
		if (isStepValid) {
			if (formStep === 0) {
				// Check for existing registration after email is entered
				const email = form.getValues('email')
				const existing = await checkExistingRegistration(email)
				if (existing) {
					setExistingRegistration(existing)
					return // Don't proceed to next step yet
				}
			}
			setFormStep((prev) => Math.min(steps.length - 1, prev + 1))
		} else {
			console.log('Validation failed:', form.formState.errors)
		}
	}

	const handleConfirmNewRegistration = () => {
		setExistingRegistration(null)
		setFormStep(1) // Move to date selection step
	}

	const handleKeepExistingRegistration = () => {
		setExistingRegistration(null)
		setFormStep(0) // Go back to contact info step
		form.reset() // Reset the form
	}

	const handleSubmit = form.handleSubmit(async (data) => {
		if (isSubmitting) {
			return
		}

		setIsSubmitting(true)
		setError(null)

		try {
			const result = await createRegistration({
				...data,
				created_by: userId,
				is_anonymous: isAnonymous,
				existingRegistrationId: existingRegistration?.id,
			})

			if (result.success) {
				setSubmitted(true)
				setRegistrationStatus(result.status)
			} else {
				throw new Error(result.error || 'Registration failed')
			}
		} catch (error) {
			console.error('Error during registration:', error)
			setError(error instanceof Error ? error.message : 'An unexpected error occurred')
		} finally {
			setIsSubmitting(false)
		}
	})

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (error) {
		return (
			<div>
				<p>Error: {error}</p>
				<Button onClick={() => window.location.reload()}>Retry</Button>
			</div>
		)
	}

	if (submitted) {
		return <ConfirmationPage formData={form.getValues()} slots={initialEventSlots} status={registrationStatus} />
	}

	if (existingRegistration) {
		return <EmailExistedStep existingRegistration={existingRegistration as EventRegistrationWithSlot} onConfirm={handleConfirmNewRegistration} onCancel={handleKeepExistingRegistration} />
	}

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit} className={cn('flex flex-col gap-2', styles.form)}>
				<div
					className={cn('flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20', styles.step)}
					style={{ backgroundColor: '#F6EBE4' }}
				>
					<h2 className="text-2xl font-semibold">{currentStep.title}</h2>
					<p>{currentStep.description}</p>
				</div>
				{currentStep.component}
				<div className="flex justify-between mt-2">
					<Button type="button" onClick={() => setFormStep((prev) => Math.max(0, prev - 1))} disabled={formStep === 0 || isSubmitting}>
						Back
					</Button>
					{formStep < steps.length - 1 ? (
						<Button type="button" onClick={handleNextStep} disabled={isSubmitting}>
							Next
						</Button>
					) : (
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Submitting...' : 'Submit Registration'}
						</Button>
					)}
				</div>
				{error && <p className="text-red-500 mt-2">{error}</p>}
			</form>
		</Form>
	)
}
