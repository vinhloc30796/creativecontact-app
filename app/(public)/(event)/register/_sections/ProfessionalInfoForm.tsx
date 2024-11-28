"use client"

import { ProfessionalInfoData } from '@/app/form-schemas/professional-info';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { industriesMapper, experienceLevelsMapper, experienceLevels, industries } from '@/drizzle/schema/user';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';

export const ProfessionalInfoForm = () => {
  const { control } = useForm<ProfessionalInfoData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "industryExperiences"
  });

  // Lift state up to parent component
  const [fieldStates, setFieldStates] = useState(
    fields.map(() => ({
      industryOpen: false,
      experienceOpen: false,
      industry: "",
      experience: ""
    }))
  );

  const updateFieldState = (index: number, updates: Partial<typeof fieldStates[0]>) => {
    setFieldStates(prev => {
      const newStates = [...prev];
      newStates[index] = { ...newStates[index], ...updates };
      return newStates;
    });
  };

  return (
    <form>
      {fields.map((field, index) => {
        const currentState = fieldStates[index] || {
          industryOpen: false,
          experienceOpen: false,
          industry: "",
          experience: ""
        };

        return (
          <div key={field.id} className="flex gap-4 items-center mb-4">
            <Popover 
              open={currentState.industryOpen} 
              onOpenChange={(open) => updateFieldState(index, { industryOpen: open })}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={currentState.industryOpen}
                  className="w-[200px] justify-between"
                >
                  {currentState.industry
                    ? industriesMapper.find((i) => i.value === currentState.industry)?.label
                    : "Select industry..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search industry..." />
                  <CommandList>
                    <CommandEmpty>No industry found.</CommandEmpty>
                    <CommandGroup>
                      {industriesMapper.map((ind) => (
                        <CommandItem
                          key={ind.value}
                          value={ind.value}
                          onSelect={(currentValue) => {
                            updateFieldState(index, {
                              industry: currentValue === currentState.industry ? "" : currentValue,
                              industryOpen: false
                            });
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentState.industry === ind.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {ind.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover 
              open={currentState.experienceOpen} 
              onOpenChange={(open) => updateFieldState(index, { experienceOpen: open })}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={currentState.experienceOpen}
                  className="w-[200px] justify-between"
                >
                  {currentState.experience
                    ? experienceLevelsMapper.find((e) => e.value === currentState.experience)?.label
                    : "Select experience..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search experience level..." />
                  <CommandList>
                    <CommandEmpty>No experience level found.</CommandEmpty>
                    <CommandGroup>
                      {experienceLevelsMapper.map((exp) => (
                        <CommandItem
                          key={exp.value}
                          value={exp.value}
                          onSelect={(currentValue) => {
                            updateFieldState(index, {
                              experience: currentValue === currentState.experience ? "" : currentValue,
                              experienceOpen: false
                            });
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentState.experience === exp.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {exp.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button 
              type="button" 
              variant="destructive"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        );
      })}
      
      <Button
        type="button"
        onClick={() => {
          append({ 
            industry: industries[0], 
            experienceLevel: experienceLevels[0] 
          });
          setFieldStates(prev => [...prev, {
            industryOpen: false,
            experienceOpen: false,
            industry: "",
            experience: ""
          }]);
        }}
        className="mt-4"
      >
        Add Industry Experience
      </Button>
    </form>
  );
};