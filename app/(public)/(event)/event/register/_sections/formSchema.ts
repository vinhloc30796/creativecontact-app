import { z } from 'zod'

export const formSchema = z.object({
	email: z.string().email('Invalid email address'),
	firstName: z.string().min(3, 'First name must be at least 3 characters'),
	lastName: z.string().min(3, 'Last name must be at least 3 characters'),
	phone: z.string().refine((value) => /^\d{10}$/.test(value), {
		message: 'Phone number must be 10 digits',
	}),
	slot: z.string().min(1, 'Please select a time slot'),
})

export type FormData = z.infer<typeof formSchema>
