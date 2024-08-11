'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { sendForgotEmail } from './actions'

const formSchema = z.object({
	identifier: z.string().min(1, 'Email or phone number is required'),
})

type FormData = z.infer<typeof formSchema>

export default function ForgotForm() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitMessage, setSubmitMessage] = useState<string | null>(null)

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			identifier: '',
		},
	})

	const onSubmit = async (data: FormData) => {
		setIsSubmitting(true)
		setSubmitMessage(null)

		try {
			const result = await sendForgotEmail(data.identifier)
			if (result.success) {
				setSubmitMessage('If a matching registration was found, an email has been sent with your event details.')
			} else {
				setSubmitMessage(result.error || 'An error occurred. Please try again.')
			}
		} catch (error) {
			setSubmitMessage('An unexpected error occurred. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="container mx-auto max-w-md p-4">
			<h1 className="text-2xl font-bold mb-4">Forgot Registration Details</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="identifier"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email or Phone Number</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Enter your email or phone number" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Sending...' : 'Send Details'}
					</Button>
				</form>
			</Form>
			{submitMessage && <p className="mt-4 text-sm text-gray-600">{submitMessage}</p>}
		</div>
	)
}
