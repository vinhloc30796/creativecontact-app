import { EventRegistration } from '@/app/types/EventRegistration';
import { EventSlot } from '@/app/types/EventSlot';
import ExpandableText from '@/components/ExpandableText';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { format, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { getRegistrationsForSlots } from './actions';
import { EventRegistrationData } from './formSchema';
import { formatDateTime, getAvailableCapacity, getSlotsForDate } from './utils';

interface DateSelectionStepProps {
  eventRegistrationForm: UseFormReturn<EventRegistrationData>;
  slots: EventSlot[];
}

export function DateSelectionStep({ eventRegistrationForm, slots }: DateSelectionStepProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [slotTouched, setSlotTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const today = startOfDay(new Date());

  const uniqueDates = Array.from(new Set(slots.map((slot) => format(slot.time_start, "yyyy-MM-dd"))));
  const firstAvailableDate = uniqueDates.find((dateString) => !isBefore(new Date(dateString), today));

  useEffect(() => {
    if (firstAvailableDate) {
      setDate(new Date(firstAvailableDate));
    }
  }, [firstAvailableDate]);

  useEffect(() => {
    if (date) {
      let dateStr = format(date, 'yyyy-MM-dd');
      setIsLoading(true);
      const slotsForDate = getSlotsForDate(slots, dateStr);
      const slotIds = slotsForDate.map((slot) => slot.id);
      getRegistrationsForSlots(slotIds)
        .then(setRegistrations)
        .finally(() => setIsLoading(false));
    }
  }, [date, slots]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
  };

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
                return isBefore(date, today) || !uniqueDates.includes(format(date, 'yyyy-MM-dd'));
              }}
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
      <FormField
        control={eventRegistrationForm.control}
        name="slot"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(slotTouched && eventRegistrationForm.formState.errors.slot ? 'text-destructive' : '', 'block mt-2')}>
              <div className="flex justify-between">
                <span>Pick a time slot</span>
              </div>
            </FormLabel>
            <FormControl>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Occupied</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3}>Loading available slots...</TableCell>
                    </TableRow>
                  ) : date && getSlotsForDate(slots, format(date, 'yyyy-MM-dd')).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>No slots available for this date. Please select another date.</TableCell>
                    </TableRow>
                  ) : (
                    date &&
                    getSlotsForDate(slots, format(date, 'yyyy-MM-dd')).map((slot) => {
                      const availableCapacity = getAvailableCapacity(slot, registrations);
                      const isDisabled = availableCapacity === 0;
                      const isSelected = field.value === slot.id;
                      const timeStartStr = format(slot.time_start, 'HH:mm');
                      const timeEndStr = format(slot.time_end, 'HH:mm');

                      return (
                        <>
                          <TableRow
                            key={slot.id}
                            className={cn(
                              isSelected && 'bg-muted',
                              isDisabled && 'opacity-50',
                              'cursor-pointer'
                            )}
                            onClick={() => {
                              if (!isDisabled) {
                                eventRegistrationForm.clearErrors('slot');
                                eventRegistrationForm.setValue('slot', slot.id, { shouldTouch: true, shouldValidate: true });
                                setSlotTouched(true);
                              }
                            }}
                          >
                            <TableCell>
                              <p>{timeStartStr} - {timeEndStr}</p>
                              {slot.special_notes && (
                                <ExpandableText text={slot.special_notes} textClassName='text-muted-foreground' />
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {slot.capacity - availableCapacity}/{slot.capacity}
                            </TableCell>
                            <TableCell>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </FormControl>
            {slotTouched && eventRegistrationForm.formState.errors.slot && <FormMessage>{eventRegistrationForm.formState.errors.slot.message}</FormMessage>}
          </FormItem >
        )
        }
      />
    </>
  );
}