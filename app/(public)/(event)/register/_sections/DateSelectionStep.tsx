import React, { useState, useEffect } from 'react'
import { format, isBefore, startOfDay, parse } from 'date-fns'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UseFormReturn } from 'react-hook-form'
import { FormData } from './formSchema'
import { EventSlot, EventRegistration } from './types'
import { getSlotsForDate, getAvailableCapacity } from './utils'
import { getRegistrationsForSlots } from './actions'

interface DateSelectionStepProps {
	form: UseFormReturn<FormData>
	slots: EventSlot[]
}

export function DateSelectionStep({ form, slots }: DateSelectionStepProps) {
	const [date, setDate] = useState<Date | undefined>(undefined)
	const [registrations, setRegistrations] = useState<EventRegistration[]>([])
	const [slotTouched, setSlotTouched] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const timeZone = 'Asia/Bangkok' // UTC+7
	const today = startOfDay(new Date())

	const uniqueDates = Array.from(new Set(slots.map((slot) => slot.time_start.split('T')[0])))
	const firstAvailableDate = uniqueDates.find((dateString) => !isBefore(new Date(dateString), today))

	useEffect(() => {
		if (firstAvailableDate) {
			setDate(new Date(firstAvailableDate))
		}
	}, [firstAvailableDate])

	useEffect(() => {
		if (date) {
			setIsLoading(true)
			const slotsForDate = getSlotsForDate(slots, format(date, 'yyyy-MM-dd'))
			const slotIds = slotsForDate.map((slot) => slot.id)
			getRegistrationsForSlots(slotIds)
				.then(setRegistrations)
				.finally(() => setIsLoading(false))
		}
	}, [date, slots])

	const formatSlotTime = (timeString: string) => {
		const [hours, minutes] = timeString.split('T')[1].split(':')
		return `${hours}:${minutes}`
	}

	return (
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
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							defaultMonth={date || new Date(firstAvailableDate || '')}
							disabled={(date) => {
								return isBefore(date, today) || !uniqueDates.includes(format(date, 'yyyy-MM-dd'))
							}}
						/>
					</PopoverContent>
				</Popover>
				<FormMessage />
			</FormItem>
			<FormField
				control={form.control}
				name="slot"
				render={({ field }) => (
					<FormItem>
						<FormLabel className={slotTouched && form.formState.errors.slot ? 'text-destructive' : ''}>Pick a time slot</FormLabel>
						<FormControl>
							<div className="flex flex-col gap-2">
								{isLoading ? (
									<p>Loading available slots...</p>
								) : date && getSlotsForDate(slots, format(date, 'yyyy-MM-dd')).length === 0 ? (
									<p>No slots available for this date. Please select another date.</p>
								) : (
									date &&
									getSlotsForDate(slots, format(date, 'yyyy-MM-dd')).map((slot) => {
										const availableCapacity = getAvailableCapacity(slot, registrations)
										const isDisabled = availableCapacity === 0
										const isSelected = field.value === slot.id
										const selectedClass = isSelected ? 'bg-gray-100' : ''
										return (
											<Button
												type="button"
												variant={'outline'}
												key={slot.id}
												onClick={() => {
													form.clearErrors('slot')
													form.setValue('slot', slot.id, { shouldTouch: true, shouldValidate: true })
													setSlotTouched(true)
												}}
												className={cn('w-full flex justify-between', selectedClass)}
												disabled={isDisabled}
											>
												<div className="font-normal">
													{formatSlotTime(slot.time_start)} - {formatSlotTime(slot.time_end)}
												</div>
												<div className="text-muted-foreground">
													{availableCapacity}/{slot.capacity}
												</div>
											</Button>
										)
									})
								)}
							</div>
						</FormControl>
						{slotTouched && form.formState.errors.slot && <FormMessage>{form.formState.errors.slot.message}</FormMessage>}
					</FormItem>
				)}
			/>
		</>
	)
}
