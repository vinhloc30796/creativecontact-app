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
import { set } from "date-fns";

interface IndustryComboboxProps {
  value: Industry | null;
  onChange: (value: Industry) => void;
}

interface Skill {
  id: any;
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

interface SkillComboboxProps {
  selectedSkills?: string[];
  skills?: Skill[];
  value?: Skill | null;
  onChange?: (value: Skill) => void;
}

function SkillCombobox({
  selectedSkills,
  skills,
  value,
  onChange,
}: SkillComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value ? value.skillName : "Select Skill"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search skill..." />
          <CommandList>
            <CommandEmpty>No skill found</CommandEmpty>
            <CommandGroup>
              {skills?.map((skill) => (
                <CommandItem
                  key={skill.id}
                  value={skill.skillId}
                  onSelect={() => {
                    onChange?.(skill);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSkills?.includes(skill.skillName)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {skill.skillName}
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
  const [newSkill, setNewSkill] = useState<Skill | null>(null);
  const [userInputSkill, setUserInputSkill] = useState<string>("");
  const [userNewSkills, setUserNewSkills] = useState<Skill[] | null>(null);
  const { setFieldDirty, setFormData } = useFormState();

  const [selectedSkills, setSelectedSkills] = useState<
    {
      skillId: string;
      skillName: string;
      numberOfPeople: number;
    }[]
  >(
    userData.userSkills.map((skill) => ({
      skillId: skill.skillId,
      skillName: skill.skillName,
      numberOfPeople: skill.numberOfPeople,
    })) || [],
  );
  const [skills, setSkills] = useState<Skill[]>([]);
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
        const sortedSkills = data.sort((a: Skill, b: Skill) =>
          a.numberOfPeople > b.numberOfPeople ? -1 : 1,
        );
        setSkills(sortedSkills);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const industryExperiencesChanged =
      JSON.stringify(selectedIndustryExperiences) !==
      JSON.stringify(userData.industryExperiences || []);

    const selectedSkillsIds = selectedSkills.map((s) => s.skillId);

    setFieldDirty("professional", industryExperiencesChanged);
    const userSkillsIds = (userData.userSkills || []).map((s) => s.skillId);
    setFieldDirty(
      "professional",
      selectedSkillsIds.join(",") !== userSkillsIds.join(","),
    );
    const userNewSkillsIds = (userNewSkills || []).map((s) => s.skillId);
    setFormData("professional", {
      industryExperiences: selectedIndustryExperiences,
      userSkills: { skills: selectedSkillsIds },
      userNewSkills: userNewSkills,
    });
  }, [
    selectedIndustryExperiences,
    selectedSkills,
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

  const addSkill = () => {
    if (newSkill) {
      // Check if the skill already exists
      const existingSkill = selectedSkills.find(
        (s) => s.skillId === newSkill.id,
      );
      if (existingSkill) {
        console.log("Skill already exists:", newSkill);
        return;
      }
      console.log("Adding new skill:", newSkill);
      setSelectedSkills((current) => {
        const updatedSkills = [
          ...current,
          {
            skillId: newSkill.id,
            skillName: newSkill.skillName,
            numberOfPeople: newSkill.numberOfPeople,
          },
        ];
        console.log("Updated skills:", updatedSkills);
        return updatedSkills;
      });
      setNewSkill(null);
    }
  };

  const addUserInputSkill = () => {
    if (userInputSkill) {
      // Check if the skill already exists in the selectedSkills array
      if (selectedSkills.some((skill) => skill.skillName === userInputSkill)) {
        console.error("Skill already selected:", userInputSkill);
        return;
      }

      const newSkillId = crypto.randomUUID();
      const newSkill = {
        id: newSkillId,
        skillId: newSkillId,
        skillName: userInputSkill,
        numberOfPeople: 0,
      };
      console.log("Adding user input skill:", newSkill);
      setUserNewSkills((current) => {
        const updatedSkills = [...(current || []), newSkill];
        console.log("New skills with user input:", updatedSkills);
        return updatedSkills;
      });
      setSelectedSkills((current) => {
        const updatedSkills = [...current, newSkill];
        console.log("Updated skills with user input:", updatedSkills);
        return updatedSkills;
      });
      setUserInputSkill(""); // Clear the input field
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
              {selectedSkills.map((skill) => (
                <ComboBadge
                  key={skill.skillId}
                  data-id={skill.skillId}
                  leftContent={skill.skillName}
                  rightContent={skill.numberOfPeople}
                  leftColor="bg-primary"
                  rightColor="bg-primary/80"
                  onDelete={() => {
                    setSelectedSkills((prevSelectedSkills) =>
                      prevSelectedSkills.filter(
                        (s) => s.skillId !== skill.skillId,
                      ),
                    );
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <SkillCombobox
                selectedSkills={selectedSkills.map((s) => s.skillName)}
                skills={skills}
                value={newSkill}
                onChange={setNewSkill}
              />
              <Button onClick={addSkill} disabled={!newSkill}>
                Add Skill
              </Button>
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={userInputSkill}
                onChange={(e) => setUserInputSkill(e.target.value)}
                placeholder="Enter new skill"
                className="flex-1 rounded border p-2"
              />
              <Button onClick={addUserInputSkill} disabled={!userInputSkill}>
                Add User Input Skill
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
