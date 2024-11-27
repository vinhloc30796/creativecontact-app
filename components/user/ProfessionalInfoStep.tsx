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
import { useTranslation } from "react-i18next";
import { industriesMapper, experienceLevelsMapper, IndustryType, ExperienceType } from "@/drizzle/schema/user";

interface ProfessionalInfoStepProps {
  form: UseFormReturn<ProfessionalInfoData>
}

const IndustryExperienceSelect = ({ form }: ProfessionalInfoStepProps) => {
  // State
  const [open, setOpen] = React.useState(false)
  // I18n
  const { t } = useTranslation(["ProfessionalInfoStep"], { keyPrefix: "IndustrySelect" });

  return (
    <FormField
      control={form.control}
      name="industryExperiences"
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
                          const exists = newValue.find(ie => ie.industry === currentValue);
                          const updatedValue = exists
                            ? newValue.filter(ie => ie.industry !== currentValue)
                            : [...newValue, { 
                                industry: currentValue as IndustryType,
                                experienceLevel: 'Entry' as ExperienceType
                              }];
                          form.setValue("industryExperiences", updatedValue, { shouldValidate: true });
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value?.some(ie => ie.industry === industry.value) ? "opacity-100" : "opacity-0"
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
          <FormMessage>{form.formState.errors.industryExperiences?.message}</FormMessage>
        </FormItem>
      )}
    />
  )
}

export function ProfessionalInfoStep({ form }: ProfessionalInfoStepProps) {
  return (
    <div className="space-y-4">
      <IndustryExperienceSelect form={form} />
    </div>
  )
}