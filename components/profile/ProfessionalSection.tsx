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
import { useState } from "react";

interface Translations {
  professional: string;
  currentIndustries: string;
  experience: string;
  select: string;
  search: string;
  noExperienceFound: string;
}

interface IndustrySectionProps {
  userData: UserData;
  translations: Translations;
}

export function ProfessionalSection({ userData, translations }: IndustrySectionProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(userData.industries || []);

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
        <CardTitle>{translations.professional}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label>{translations.currentIndustries}</Label>
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
                      : translations.select}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder={translations.search} />
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
            <Label htmlFor="experience">{translations.experience}</Label>
            <div className="max-w-md">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !userData.experience && "text-muted-foreground"
                    )}
                  >
                    {userData.experience
                      ? experienceLevelsMapper.find((level: any) => level.value === userData.experience)?.label
                      : translations.select}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder={translations.search} />
                    <CommandEmpty>{translations.noExperienceFound}</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {experienceLevelsMapper.map((level: any) => (
                          <CommandItem
                            key={level.value}
                            value={level.value}
                            onSelect={(value) => {
                              // TODO: Handle selection
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                userData.experience === level.value ? "opacity-100" : "opacity-0"
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