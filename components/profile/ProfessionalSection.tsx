"use client";

import { UserData, Industry, ExperienceLevel } from "@/app/types/UserInfo";
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
  const [selectedIndustryExperiences, setSelectedIndustryExperiences] = useState(
    userData.industryExperiences || []
  );
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    const industryExperiencesChanged = JSON.stringify(selectedIndustryExperiences) !== 
      JSON.stringify(userData.industryExperiences || []);
    
    setFieldDirty('professional', industryExperiencesChanged);
    
    setFormData('professional', {
      industryExperiences: selectedIndustryExperiences
    });
  }, [selectedIndustryExperiences, userData.industryExperiences, setFieldDirty, setFormData]);

  const toggleIndustryExperience = (industry: Industry, experienceLevel: ExperienceLevel) => {
    setSelectedIndustryExperiences(current => {
      const exists = current.find(ie => ie.industry === industry);
      if (exists) {
        return current.filter(ie => ie.industry !== industry);
      } else {
        return [...current, { 
          id: crypto.randomUUID(), 
          userId: userData.id, 
          industry, 
          experienceLevel 
        }];
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
              {selectedIndustryExperiences.map((ie) => (
                <Badge key={ie.industry}>
                  {ie.industry} - {ie.experienceLevel}
                </Badge>
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
                      !selectedIndustryExperiences.length && "text-muted-foreground"
                    )}
                  >
                    {selectedIndustryExperiences.length
                      ? `${selectedIndustryExperiences.length} selected`
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
                            onSelect={() => toggleIndustryExperience(industry.value as Industry, 'BEGINNER' as ExperienceLevel)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedIndustryExperiences.some(ie => ie.industry === industry.value) 
                                  ? "opacity-100" 
                                  : "opacity-0"
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
            <Label>{t('ProfessionalSection.experience')}</Label>
            <div className="max-w-md">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !selectedIndustryExperiences.length && "text-muted-foreground"
                    )}
                  >
                    {t('ProfessionalSection.select')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder={t('ProfessionalSection.search')} />
                    <CommandEmpty>{t('ProfessionalSection.noExperienceFound')}</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {experienceLevelsMapper.map((level) => (
                          <CommandItem
                            key={level.value}
                            value={level.value}
                            onSelect={(value) => {
                              if (selectedIndustryExperiences.length > 0) {
                                setSelectedIndustryExperiences(current => 
                                  current.map(ie => ({
                                    ...ie,
                                    experienceLevel: value as ExperienceLevel
                                  }))
                                );
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedIndustryExperiences.some(ie => ie.experienceLevel === level.value)
                                  ? "opacity-100"
                                  : "opacity-0"
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