// File: components/profile/ProfessionalSection.tsx

"use client";

import { useFormState } from "@/app/(protected)/profile/edit/FormStateNav";
import { ExperienceLevel, Industry, UserData } from "@/app/types/UserInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComboBadge } from "@/components/ui/combo-badge";
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
import { Badge } from "../ui/badge";
import { use } from "i18next";

import { useQuery } from "@tanstack/react-query";
import { get } from "http";
import { getAllSkills } from "@/app/api/skills/helper";

interface IndustryComboboxProps {
  value: Industry | null;
  onChange: (value: Industry) => void;
}

interface Skill {
  skillId: string;
  skillName: string;
  numberOfPeople: number;
}

function IndustryCombobox({ value, onChange }: IndustryComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value || "Select Industry"}
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
                  onSelect={() => {
                    onChange(industry.value as Industry);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === industry.value ? "opacity-100" : "opacity-0",
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
  );
}

interface ExperienceComboboxProps {
  value: ExperienceLevel | null;
  onChange: (value: ExperienceLevel) => void;
}

function ExperienceCombobox({ value, onChange }: ExperienceComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value || "Select Experience"}
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
                  onSelect={() => {
                    onChange(level.value as ExperienceLevel);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === level.value ? "opacity-100" : "opacity-0",
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
  );
}

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
    useState(
      (userData.industryExperiences || []).map((ie) => ({
        ...ie,
        id: ie.id || crypto.randomUUID(),
      })),
    );
  const [isAdding, setIsAdding] = useState(false);
  const [newIndustry, setNewIndustry] = useState<Industry | null>(null);
  const [newExperience, setNewExperience] = useState<ExperienceLevel | null>(
    null,
  );
  const { setFieldDirty, setFormData } = useFormState();

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }
        const data = await response.json();
        setSkills(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSkillClick = (skill: string) => {
    setSelectedSkills((prevSelectedSkills) =>
      prevSelectedSkills.includes(skill)
        ? prevSelectedSkills.filter((s) => s !== skill)
        : [...prevSelectedSkills, skill],
    );
  };

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
      const newId = crypto.randomUUID();
      console.log("Adding new item with ID:", newId);

      setSelectedIndustryExperiences((current) => [
        ...current,
        {
          id: newId,
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

  const deleteIndustryExperience = (idToDelete: string) => {
    console.log("Deleting item with ID:", idToDelete);

    setSelectedIndustryExperiences((current) => {
      console.log("Current items:", current);

      return current.filter((ie) => {
        console.log("Comparing:", ie.id, idToDelete);
        return ie.id !== idToDelete;
      });
    });
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
                <ComboBadge
                  key={ie.id}
                  data-id={ie.id}
                  leftContent={ie.industry}
                  rightContent={ie.experienceLevel}
                  leftColor="bg-primary"
                  rightColor="bg-primary/80"
                  onDelete={() => {
                    console.log("Deleting badge with ID:", ie.id);
                    deleteIndustryExperience(ie.id);
                  }}
                />
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
                  <IndustryCombobox
                    value={newIndustry}
                    onChange={setNewIndustry}
                  />
                </div>

                <div className="flex-1">
                  <ExperienceCombobox
                    value={newExperience}
                    onChange={setNewExperience}
                  />
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
          <div className="space-y-2">
            <Label>{t("ProfessionalSection.skills")}</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: Skill) => (
                <ComboBadge
                  key={skill.skillId}
                  data-id={skill.skillId}
                  leftContent={skill.skillName}
                  rightContent={skill.numberOfPeople}
                  leftColor="bg-primary"
                  rightColor="bg-primary/80"
                  onDelete={() => {
                    console.log("Deleting badge with ID:", skill.skillId);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
