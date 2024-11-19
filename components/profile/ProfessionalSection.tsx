"use client";

import { UserData } from "@/app/types/UserInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { experienceLevelsMapper, industriesMapper } from "@/drizzle/schema/user";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState, useEffect } from "react";
import { useFormState } from "@/app/(protected)/profile/edit/FormStateNav";
import { useTranslation } from '@/lib/i18n/init-client'

interface ProfessionalSectionProps {
  userData: UserData;
  lang?: string;
}

export function ProfessionalSection({ userData, lang = "en" }: ProfessionalSectionProps) {
  const { t } = useTranslation(lang, "ProfilePage");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(userData.industries || []);
  const [selectedExperience, setSelectedExperience] = useState<string>(userData.experience || '');
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    const industriesChanged = JSON.stringify(selectedIndustries) !== JSON.stringify(userData.industries || []);
    const experienceChanged = selectedExperience !== (userData.experience || '');
    const isDirty = industriesChanged || experienceChanged;
    
    setFieldDirty('professional', isDirty);
    // Always set form data, not just when dirty
    setFormData('professional', {
        industries: selectedIndustries,
        experience: selectedExperience
    });
  }, [selectedIndustries, selectedExperience, userData.industries, userData.experience, setFieldDirty, setFormData]);

  const toggleIndustry = (value: string) => {
    setSelectedIndustries(current => {
      if (current.includes(value)) {
        return current.filter(i => i !== value);
      } else {
        return [...current, value];
      }
    });
  };

  return (
    <Card id="professional">
      <CardHeader>
        <CardTitle>{t('ProfessionalSection.professional')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label>{t('ProfessionalSection.currentIndustries')}</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedIndustries.map((industry) => (
                <Badge key={industry}>{industry}</Badge>
              ))}
            </div>
            <div className="max-w-md">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !selectedIndustries.length && "text-muted-foreground"
                    )}
                  >
                    {selectedIndustries.length
                      ? `${selectedIndustries.length} selected`
                      : t('ProfessionalSection.select')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder={t('ProfessionalSection.search')} />
                    <CommandEmpty>No industry found</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {industriesMapper.map((industry) => (
                          <CommandItem
                            key={industry.value}
                            value={industry.value}
                            onSelect={toggleIndustry}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedIndustries.includes(industry.value) ? "opacity-100" : "opacity-0"
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
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">{t('ProfessionalSection.experience')}</Label>
            <div className="max-w-md">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !selectedExperience && "text-muted-foreground"
                    )}
                  >
                    {selectedExperience
                      ? experienceLevelsMapper.find((level: any) => level.value === selectedExperience)?.label
                      : t('ProfessionalSection.select')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder={t('ProfessionalSection.search')} />
                    <CommandEmpty>{t('ProfessionalSection.noExperienceFound')}</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {experienceLevelsMapper.map((level: any) => (
                          <CommandItem
                            key={level.value}
                            value={level.value}
                            onSelect={(value) => setSelectedExperience(value)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedExperience === level.value ? "opacity-100" : "opacity-0"
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}