'use client'

import styles from './_register.module.scss'
import { cn } from '@/lib/utils'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { useState } from 'react'
import event_slots from './event_slots.json'
import { CalendarIcon } from 'lucide-react'

const formSchema = z.object({
	// email: z.string().email('Invalid email address'),
	// firstName: z.string().min(3, 'First name must be at least 3 characters'),
	// lastName: z.string().min(3, 'Last name must be at least 3 characters'),
	// phone: z.string().refine((value) => value.length === 10, {
	// 	message: 'Phone number must be 10 characters long',
	// }),
	// slot: z.string().min(1, 'Please select a time slot'),
	email: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string(),
	slot: z.string(),
})

const RegisterForm: React.FC = () => {
	// 0. Form state.
	const [formStep, setFormStep] = useState(0)

	const slots = event_slots as {
		id: string
		time_start: string
		time_end: string
		capacity: number
	}[]

	const uniqueDates = Array.from(new Set(slots.map((slot) => slot.time_start.split('T')[0]))) as string[]
	const [date, setDate] = useState<Date | undefined>(new Date(uniqueDates[0]))

	function getSlotsForDate(date: string) {
		return slots.filter((slot) => slot.time_start.split('T')[0] === date)
	}

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	// 2. Define a submit handler.
	const [submitted, setSubmitted] = useState(false)
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values)
		setSubmitted(true)
	}

	// 3. Render the form.

	const steps = [
		{
			title: 'Contact Information',
			description: 'Please provide your contact information so we can check you in at the event or reach out to you if needed.',
			render: () => (
				<>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="name@mail.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex space-x-4">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input placeholder="Văn A" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input placeholder="Nguyễn" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input placeholder="0123456789" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</>
			),
		},
		{
			title: 'Select A Date',
			description: 'Please select a slot for the event.',
			render: () => (
				<>
					<FormItem className="space-y-2">
						<FormLabel>Pick a date</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !date && 'text-muted-foreground')}>
										{date ? format(date, 'PPP') : <span>Pick a date</span>}
										<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} disabled={(date) => !uniqueDates.includes(format(date, 'yyyy-MM-dd'))} />
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
					<FormField
						control={form.control}
						name="slot"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pick a time slot</FormLabel>
								<FormControl>
									<div className="flex flex-col gap-2">
										{getSlotsForDate(format(date as Date, 'yyyy-MM-dd')).map((slot) => {
											const isDisabled = slot.capacity === 40
											const isSelected = field.value === slot.id
											const selectedClass = isSelected ? 'bg-gray-100' : ''
											return (
												<Button
													variant={'outline'}
													key={slot.id}
													onClick={() => field.onChange(slot.id)}
													className={cn('w-full flex justify-between', selectedClass)}
													disabled={isDisabled}
												>
													<div className="font-normal">
														{slot.time_start.split('T')[1].slice(0, 5)} - {slot.time_end.split('T')[1].slice(0, 5)}
													</div>
													<div className="text-muted-foreground">{slot.capacity}/40</div>
												</Button>
											)
										})}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</>
			),
		},
	]

	const currentStep = steps[formStep]

	if (submitted) {
		return (
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-3xl font-semibold">Thank you!</h1>
				<p className="text-lg">You have successfully registered.</p>
			</div>
		)
	}

	return (
		<Form {...form}>
			<form
				// onSubmit={form.handleSubmit(onSubmit)}
				className={cn('flex flex-col gap-2', styles.form)}
			>
				<div className={cn('flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20', styles.step)}>
					<h2 className="text-2xl font-semibold">{currentStep.title}</h2>
					<p>{currentStep.description}</p>
				</div>
				{currentStep.render()}
				<div className="flex justify-between mt-2">
					<Button type="button" onClick={() => setFormStep((prev) => Math.max(0, prev - 1))} disabled={formStep === 0}>
						Back
					</Button>
					{formStep < steps.length - 1 && (
						<Button
							type="button"
							onClick={() => {
								// form.trigger()
								// if (form.formState.isValid) {
								// 	setFormStep((prev) => prev + 1)
								// } else {
								// 	console.log(form.formState.errors)
								// }
								setFormStep((prev) => prev + 1)
							}}
						>
							Next
						</Button>
					)}
					{formStep === steps.length - 1 && (
						<Button
							type="button"
							onClick={() => {
								setSubmitted(true)
							}}
						>
							Submit
						</Button>
					)}
				</div>
				{/* {form.formState.errors && <div className="mt-1 text-red-500 text-sm">There are errors in the form. Please fix them.</div>} */}
			</form>
		</Form>
	)
}

export default RegisterForm
