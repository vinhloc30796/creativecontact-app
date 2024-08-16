import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormData } from './formSchema'

interface ProfessionalInfoStepProps {
  form: UseFormReturn<FormData>
}

const industries = [
  { value: 'Advertising' as const, label: 'Advertising' },
  { value: 'Architecture' as const, label: 'Architecture' },
  { value: 'Arts and Crafts' as const, label: 'Arts and Crafts' },
  { value: 'Design' as const, label: 'Design' },
  { value: 'Fashion' as const, label: 'Fashion' },
  { value: 'Film, Video, and Photography' as const, label: 'Film, Video, and Photography' },
  { value: 'Music' as const, label: 'Music' },
  { value: 'Performing Arts' as const, label: 'Performing Arts' },
  { value: 'Publishing' as const, label: 'Publishing' },
  { value: 'Software and Interactive' as const, label: 'Software and Interactive' },
  { value: 'Television and Radio' as const, label: 'Television and Radio' },
  { value: 'Visual Arts' as const, label: 'Visual Arts' },
  { value: 'Other' as const, label: 'Other' }
] as const

type IndustryType = typeof industries[number]['value']

const experienceLevels = [
  { value: 'Entry' as const, label: 'Entry' },
  { value: 'Junior' as const, label: 'Junior' },
  { value: 'Mid-level' as const, label: 'Mid-level' },
  { value: 'Senior' as const, label: 'Senior' },
  { value: 'Manager' as const, label: 'Manager' },
  { value: 'C-level' as const, label: 'C-level' }
] as const

const IndustrySelect = ({ form }: ProfessionalInfoStepProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <FormField
      control={form.control}
      name="industries"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Industries (Select all that apply)</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value?.length && "text-muted-foreground"
                  )}
                >
                  {field.value?.length
                    ? `${field.value.length} industries selected`
                    : "Select industries"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search industry..." />
                <CommandEmpty>No industry found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {industries.map((industry) => (
                      <CommandItem
                        key={industry.value}
                        value={industry.value}
                        onSelect={(currentValue) => {
                          const newValue = field.value || [];
                          const updatedValue = newValue.includes(currentValue as IndustryType)
                            ? newValue.filter((val) => val !== currentValue)
                            : [...newValue, currentValue as IndustryType];
                          form.setValue("industries", updatedValue, { shouldValidate: true });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value?.includes(industry.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {industry.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const ExperienceSelect = ({ form }: ProfessionalInfoStepProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <FormField
      control={form.control}
      name="experience"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Experience Level</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? experienceLevels.find((level) => level.value === field.value)?.label
                    : "Select experience level"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search level..." />
                <CommandEmpty>No level found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {experienceLevels.map((level) => (
                      <CommandItem
                        key={level.value}
                        value={level.value}
                        onSelect={(value) => {
                          form.setValue("experience", value as typeof level.value, { shouldValidate: true });
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === level.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {level.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const FieldInput = ({ form }: ProfessionalInfoStepProps) => (
  <FormField
    control={form.control}
    name="field"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Field</FormLabel>
        <FormControl>
          <Input
            placeholder="Enter your specific field or area of expertise"
            {...field}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-gray-500">
          Please provide your specific field or area of expertise within your industry.
          For example: &quot;UX Design&quot;, &quot;Digital Marketing&quot;, &quot;Front-end Development&quot;, etc.
        </p>
      </FormItem>
    )}
  />
)

export function ProfessionalInfoStep({ form }: ProfessionalInfoStepProps) {
  return (
    <>
      <IndustrySelect form={form} />
      <ExperienceSelect form={form} />
      <FieldInput form={form} />
    </>
  )
}