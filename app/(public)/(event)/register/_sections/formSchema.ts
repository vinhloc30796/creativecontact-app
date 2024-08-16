import { z } from 'zod'

export const formSchema = z.object({
	email: z.string().email('Invalid email address'),
	firstName: z.string().min(3, 'First name must be at least 3 characters'),
	lastName: z.string().min(3, 'Last name must be at least 3 characters'),
	phone: z.string().refine((value) => /^\d{10}$/.test(value), {
		message: 'Phone number must be 10 digits',
	}),
	// IndustryInfoStep fields
	industries: z.array(z.string()).min(1, "Please select at least one industry"),
	experience: z.enum(["Entry", "Junior", "Mid-level", "Senior", "Manager", "C-level"]),
	field: z.string().min(1, "Please enter your specific field or area of expertise"),
	// DateSelectionStep fields
	slot: z.string().min(1, 'Please select a time slot'),
	existingRegistrationId: z.string().optional(),
})

export type FormData = z.infer<typeof formSchema>
