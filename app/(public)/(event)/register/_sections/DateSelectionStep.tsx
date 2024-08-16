import { EventRegistration } from '@/app/types/EventRegistration'
import { EventSlot } from '@/app/types/EventSlot'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { format, isBefore, startOfDay } from 'date-fns'
import { CalendarIcon, InfoIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { getRegistrationsForSlots } from './actions'
import { FormData } from './formSchema'
import { formatDateTime, getAvailableCapacity, getSlotsForDate } from './utils'

interface DateSelectionStepProps {
  form: UseFormReturn<FormData>
  slots: EventSlot[]
}

export function DateSelectionStep({ form, slots }: DateSelectionStepProps) {
  console.log('DateSelectionStep slots are:', slots)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [slotTouched, setSlotTouched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const today = startOfDay(new Date())

  const uniqueDates = Array.from(new Set(slots.map((slot) => format(slot.time_start, "yyyy-MM-dd"))))
  const firstAvailableDate = uniqueDates.find((dateString) => !isBefore(new Date(dateString), today))
  console.debug(`uniqueDates: ${uniqueDates}, firstAvailableDate: ${firstAvailableDate}`)

  useEffect(() => {
    if (firstAvailableDate) {
      setDate(new Date(firstAvailableDate))
    }
  }, [firstAvailableDate])

  useEffect(() => {
    if (date) {
      let dateStr = format(date, 'yyyy-MM-dd')
      console.log('DateSelectionStep dateStr is:', dateStr)
      setIsLoading(true)
      const slotsForDate = getSlotsForDate(slots, dateStr)
      const slotIds = slotsForDate.map((slot) => slot.id)
      getRegistrationsForSlots(slotIds)
        .then(setRegistrations)
        .finally(() => setIsLoading(false))
    }
  }, [date, slots])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setIsCalendarOpen(false)  // Close the popover when a date is selected
  }

  return (
    <>
      <FormItem className="space-y-2">
        <FormLabel>Pick a date</FormLabel>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !date && 'text-muted-foreground')}>
                {date ? formatDateTime(date.toISOString(), 'PPP') : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
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
            <FormLabel className={cn(slotTouched && form.formState.errors.slot ? 'text-destructive' : '', 'block mt-2')}>
              <div className="flex justify-between">
                <span>Pick a time slot</span>
                <span>Occupied</span>
              </div>
            </FormLabel>
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
                    const timeStartStr = format(slot.time_start, 'HH:mm')
                    const timeEndStr = format(slot.time_end, 'HH:mm')
                    const specialNotes = slot.special_notes ? `Special notes: ${slot.special_notes}` : undefined
                    return (
                      <TooltipProvider key={slot.id}>
                        <Button
                          type="button"
                          variant={'outline'}
                          onClick={() => {
                            form.clearErrors('slot')
                            form.setValue('slot', slot.id, { shouldTouch: true, shouldValidate: true })
                            setSlotTouched(true)
                          }}
                          className={cn('w-full flex justify-between items-center', selectedClass)}
                          disabled={isDisabled}
                        >
                          <div className="font-normal flex items-center">
                            {timeStartStr} - {timeEndStr}
                            {specialNotes && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{specialNotes}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <div className="text-muted-foreground">
                            {slot.capacity - availableCapacity}/{slot.capacity}
                          </div>
                        </Button>
                      </TooltipProvider>
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
