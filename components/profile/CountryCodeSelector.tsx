// File: components/profile/ContactSection.tsx

"use client";

// Components
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
// Utils
import { cn } from "@/lib/utils";
import { countryCodes } from "@/utils/countries";
// React
import { UserData } from "@/app/types/UserInfo";
import { useState } from "react";

interface ContactSectionProps {
  userData: UserData;
  lang?: string;
}

export function CountryCodeSelector({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);

  const toggleCountryCode = (value: string) => {
    onChange(value);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between"
        >
          {value ? `+${value} ${countryCodes.find((code) => code.value === value)?.flag}` : "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {countryCodes.map((code) => (
                <CommandItem
                  key={code.a3}
                  // this is the value that will be returned by the command
                  value={code.value} 
                  onSelect={toggleCountryCode}
                  // helper text to improve search
                  keywords={[code.label.toLowerCase(), code.a3.toLowerCase()]}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === code.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {code.flag} +{code.value} {code.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}