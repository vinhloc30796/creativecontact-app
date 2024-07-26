"use client";

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import styles from './_register.module.scss'

// Import your UI components here
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from "@/components/ui/separator"

// Define your event slots
import eventSlots from './event_slots.json'

// Define the event slot type
interface EventSlot {
  id: string;
  timeStart: string;
  timeEnd: string;
  capacity: number;
}

// Define the form schema
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(3, 'First name must be at least 3 characters'),
  lastName: z.string().min(3, 'Last name must be at least 3 characters'),
  phone: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: 'Phone number must be 10 digits',
  }),
  slot: z.string().min(1, 'Please select a time slot'),
})

type FormData = z.infer<typeof formSchema>

interface RegistrationFormProps {
  initialEventSlots: EventSlot[];
}

export default function RegistrationForm({ initialEventSlots }: RegistrationFormProps) {
  const [formStep, setFormStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [slotTouched, setSlotTouched] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      slot: "",
    },
  })

  const slots = initialEventSlots as {
    id: string
    timeStart: string
    timeEnd: string
    capacity: number
  }[]

  const uniqueDates = Array.from(new Set(slots.map((slot) => slot.timeStart.split('T')[0]))) as string[]
  const [date, setDate] = useState<Date | undefined>(new Date(uniqueDates[0]))

  function getSlotsForDate(date: string) {
    return slots.filter((slot) => slot.timeStart.split('T')[0] === date)
  }

  const steps = [
    {
      title: 'Contact Information',
      description: 'Please provide your contact information.',
      fields: ['email', 'firstName', 'lastName', 'phone'] as const,
      render: () => (
        <>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
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
                    <Input placeholder="John" {...field} />
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
                    <Input placeholder="Doe" {...field} />
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
                  <Input placeholder="1234567890" {...field} />
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
      fields: ['slot'] as const,
      render: () => (
        <>
          <FormItem className="space-y-2">
            <FormLabel>Pick a date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
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
                  defaultMonth={date}
                  disabled={(date) =>
                    !uniqueDates.includes(format(date, 'yyyy-MM-dd'))
                  }
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
                <FormLabel
                  className={slotTouched && form.formState.errors.slot ? "text-destructive" : ""}
                >
                  Pick a time slot
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    {getSlotsForDate(format(date as Date, 'yyyy-MM-dd')).map(
                      (slot) => {
                        const isDisabled = slot.capacity === 40
                        const isSelected = field.value === slot.id
                        const selectedClass = isSelected ? 'bg-gray-100' : ''
                        return (
                          <Button
                            type="button"
                            variant={'outline'}
                            key={slot.id}
                            onClick={(e) => {
                              e.preventDefault()
                              console.log('Selected slot:', slot)
                              form.clearErrors('slot')
                              form.setValue('slot', slot.id, { shouldTouch: true, shouldValidate: true })
                              setSlotTouched(true)
                            }}
                            className={cn(
                              'w-full flex justify-between',
                              selectedClass
                            )}
                            disabled={isDisabled}
                          >
                            <div className="font-normal">
                              {slot.timeStart.split('T')[1].slice(0, 5)} -{' '}
                              {slot.timeEnd.split('T')[1].slice(0, 5)}
                            </div>
                            <div className="text-muted-foreground">
                              {slot.capacity}/40
                            </div>
                          </Button>
                        )
                      }
                    )}
                  </div>
                </FormControl>
                {slotTouched && form.formState.errors.slot && (
                  <FormMessage>{form.formState.errors.slot.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </>
      ),
    },
  ]

  const currentStep = steps[formStep]

  const validateStep = async () => {
    const fieldsToValidate = currentStep.fields
    if (formStep === 1) {
      setSlotTouched(true)  // Add this line
      if (!form.getValues('slot')) {
        form.setError('slot', { type: 'manual', message: 'Please select a time slot' })
        return false
      }
      return true
    }
    const result = await form.trigger(fieldsToValidate)
    return result
  }

  const handleNextStep = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    const isStepValid = await validateStep()
    if (isStepValid) {
      setFormStep((prev) => Math.min(steps.length - 1, prev + 1))
    } else {
      console.log('Step validation failed:', form.formState.errors)
    }
  }

  const handlePrevStep = () => {
    setFormStep((prev) => Math.max(0, prev - 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await form.trigger()
    if (isValid) {
      console.log('Form submitted:', form.getValues())
      setSubmitted(true)
    } else {
      console.error('Form validation failed:', form.formState.errors)
    }
  }

  if (submitted) {
    const selectedSlot = slots.find(slot => slot.id === form.getValues('slot'))
    const selectedSlotDate = selectedSlot?.timeStart.split('T')[0]
    const selectedSlotTimeRange = `${selectedSlot?.timeStart.split('T')[1].slice(0, 5)}-${selectedSlot?.timeEnd.split('T')[1].slice(0, 5)}`
    return (
      <>
        <div className="flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20">
          <h1 className="text-2xl font-semibold">Thank you, {form.getValues('firstName') + ' ' + form.getValues('lastName')}!</h1>
          <p className="text-lg">You have successfully registered the <span className="font-medium">{selectedSlotTimeRange}</span> slot on <span className="font-medium">{selectedSlotDate}</span>!</p>
          <Separator />
          <p className="text-lg font-medium">Here is your information below</p>
          <ul>
            <li><a href={`mailto:${form.getValues('email')}`}>{form.getValues('email')}</a></li>
            <li><a href={`tel:${form.getValues('phone')}`}>{form.getValues('phone')}</a></li>
            {/* Get the slot date & time */}
            <li>{
              
            }</li>
          </ul>
        </div>
      </>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn('flex flex-col gap-2', styles.form)}>
        <div
          className={cn(
            'flex flex-col space-y-2 p-4 bg-slate-400 bg-opacity-10 rounded-md border border-primary-foreground border-opacity-20',
            styles.step
          )}
        >
          <h2 className="text-2xl font-semibold">{currentStep.title}</h2>
          <p>{currentStep.description}</p>
        </div>
        {currentStep.render()}
        <div className="flex justify-between mt-2">
          <Button
            type="button"
            onClick={handlePrevStep}
            disabled={formStep === 0}
          >
            Back
          </Button>
          {formStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </Form>
  )
}
