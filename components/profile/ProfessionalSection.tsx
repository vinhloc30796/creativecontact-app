// File: components/profile/ProfessionalSection.tsx

"use client";

import { useFormState } from "@/app/(protected)/profile/edit/FormStateNav";
import { ExperienceLevel, Industry, UserData } from "@/app/types/UserInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  experienceLevelsMapper,
  industriesMapper,
} from "@/drizzle/schema/user";
import { useTranslation } from "@/lib/i18n/init-client";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfessionalSectionProps {
  userData: UserData;
  lang?: string;
}

export function ProfessionalSection({
  userData,
  lang = "en",
}: ProfessionalSectionProps) {
  const { t } = useTranslation(lang, "ProfilePage");
  const [selectedIndustryExperiences, setSelectedIndustryExperiences] =
    useState(userData.industryExperiences || []);
  const [isAdding, setIsAdding] = useState(false);
  const [newIndustry, setNewIndustry] = useState<Industry | null>(null);
  const [newExperience, setNewExperience] = useState<ExperienceLevel | null>(
    null,
  );
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    const industryExperiencesChanged =
      JSON.stringify(selectedIndustryExperiences) !==
      JSON.stringify(userData.industryExperiences || []);

    setFieldDirty("professional", industryExperiencesChanged);

    setFormData("professional", {
      industryExperiences: selectedIndustryExperiences,
    });
  }, [
    selectedIndustryExperiences,
    userData.industryExperiences,
    setFieldDirty,
    setFormData,
  ]);

  const addIndustryExperience = () => {
    if (newIndustry && newExperience) {
      setSelectedIndustryExperiences((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          userId: userData.id,
          industry: newIndustry,
          experienceLevel: newExperience,
        },
      ]);
      setIsAdding(false);
      setNewIndustry(null);
      setNewExperience(null);
    }
  };

  return (
    <Card id="professional">
      <CardHeader>
        <CardTitle>{t("ProfessionalSection.professional")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label>{t("ProfessionalSection.currentIndustries")}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedIndustryExperiences.map((ie) => (
                <Badge key={ie.industry}>
                  {ie.industry} - {ie.experienceLevel}
                </Badge>
              ))}
            </div>

            {!isAdding ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Industry & Experience
              </Button>
            ) : (
              <div className="mt-2 flex gap-2">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {newIndustry || "Select Industry"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search industry..." />
                        <CommandList>
                          <CommandEmpty>No industry found</CommandEmpty>
                          <CommandGroup>
                            {industriesMapper.map((industry) => (
                              <CommandItem
                                key={industry.value}
                                value={industry.value}
                                onSelect={() =>
                                  setNewIndustry(industry.value as Industry)
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newIndustry === industry.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {industry.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {newExperience || "Select Experience"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search experience level..." />
                        <CommandList>
                          <CommandEmpty>No experience level found</CommandEmpty>
                          <CommandGroup>
                            {experienceLevelsMapper.map((level) => (
                              <CommandItem
                                key={level.value}
                                value={level.value}
                                onSelect={() =>
                                  setNewExperience(
                                    level.value as ExperienceLevel,
                                  )
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newExperience === level.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {level.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  onClick={addIndustryExperience}
                  disabled={!newIndustry || !newExperience}
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
