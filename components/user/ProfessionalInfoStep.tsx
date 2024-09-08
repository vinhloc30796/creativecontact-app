// File: app/(public)/(event)/register/_sections/ProfessionalInfoStep.tsx

import { ProfessionalInfoData } from "@/app/form-schemas/professional-info"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation, Trans } from "react-i18next";

interface ProfessionalInfoStepProps {
  form: UseFormReturn<ProfessionalInfoData>
}

const industriesMapper = [
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

type IndustryType = typeof industriesMapper[number]['value']

const experienceLevelsMapper = [
  { value: 'Entry' as const, label: 'Entry' },
  { value: 'Junior' as const, label: 'Junior' },
  { value: 'Mid-level' as const, label: 'Mid-level' },
  { value: 'Senior' as const, label: 'Senior' },
  { value: 'Manager' as const, label: 'Manager' },
  { value: 'C-level' as const, label: 'C-level' }
] as const

type ExperienceType = typeof experienceLevelsMapper[number]['value']

const IndustrySelect = ({ form }: ProfessionalInfoStepProps) => {
  // State
  const [open, setOpen] = React.useState(false)
  // I18n
  const { t } = useTranslation(["ProfessionalInfoStep"], { keyPrefix: "IndustrySelect" });

  return (
    <FormField
      control={form.control}
      name="industries"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t("label")}</FormLabel>
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
                    ? t("selected", { count: field.value.length })
                    : t("select")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder={t("search")} />
                <CommandEmpty>{t("noIndustryFound")}</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {industriesMapper.map((industry) => (
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
          <FormMessage>{form.formState.errors.industries?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}

const ExperienceSelect = ({ form }: ProfessionalInfoStepProps) => {
  // State
  const [open, setOpen] = React.useState(false)
  // I18n
  const { t } = useTranslation(["ProfessionalInfoStep"], { keyPrefix: "ExperienceSelect" });

  return (
    <FormField
      control={form.control}
      name="experience"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t("label")}</FormLabel>
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
                    ? experienceLevelsMapper.find((level) => level.value === field.value)?.label
                    : t("select")}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder={t("search")} />
                <CommandEmpty>{t("noExperienceFound")}</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {experienceLevelsMapper.map((level) => (
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
          <FormMessage>{form.formState.errors.experience?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}

export function ProfessionalInfoStep({ form }: ProfessionalInfoStepProps) {
  // I18n
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <IndustrySelect form={form} />
      <ExperienceSelect form={form} />
    </div>
  )
}