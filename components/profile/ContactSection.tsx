// File: components/profile/ContactSection.tsx

"use client";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsUpDown, Mail, Phone } from "lucide-react";
// Utils
import { cn } from "@/lib/utils";
import { countryCodes } from "@/utils/countries";
// React
import { useFormState } from "@/app/(protected)/profile/edit/FormStateNav";
import { UserData } from "@/app/types/UserInfo";
import { useTranslation } from '@/lib/i18n/init-client';
import { useEffect, useState } from "react";

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
                  key={code.value}
                  value={code.value}
                  onSelect={toggleCountryCode}
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

export function ContactSection({ userData, lang = "en" }: ContactSectionProps) {
  const { t } = useTranslation(lang, "ProfilePage");
  const [email, setEmail] = useState(userData?.email || '');
  const [countryCode, setCountryCode] = useState("1");
  const [phoneNumber, setPhoneNumber] = useState(userData?.phone?.replace(/^\+\d+/, '') || '');
  const [instagram, setInstagram] = useState(userData?.instagramHandle || '');
  const [facebook, setFacebook] = useState(userData?.facebookHandle || '');
  const [open, setOpen] = useState(false);
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    if (!userData) return;

    const fullPhone = phoneNumber ? `+${countryCode}${phoneNumber}` : '';
    const isDirty =
      email !== (userData?.email || '') ||
      fullPhone !== (userData?.phone || '') ||
      instagram !== (userData?.instagramHandle || '') ||
      facebook !== (userData?.facebookHandle || '');

    setFieldDirty('contact', isDirty);

    if (isDirty) {
      setFormData('contact', {
        email,
        phone: fullPhone,
        instagramHandle: instagram,
        facebookHandle: facebook
      });
    }
  }, [email, countryCode, phoneNumber, instagram, facebook, userData, setFieldDirty, setFormData]);

  if (!userData) {
    return null;
  }

  return (
    <Card id="contact">
      <CardHeader>
        <CardTitle>{t('ContactSection.contact')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">{t('ContactSection.email')}</Label>
          <div className="relative max-w-md">
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">{t('ContactSection.phone')}</Label>
          <div className="flex gap-2 max-w-md">
            <CountryCodeSelector value={countryCode} onChange={setCountryCode} />
            <div className="relative flex-1">
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
              />
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <Label>{t('ContactSection.socialLinks')}</Label>
          <div className="grid grid-cols-2 gap-4 mt-2 max-w-2xl">
            <div>
              <Label htmlFor="instagram">{t('ContactSection.instagram')}</Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="facebook">{t('ContactSection.facebook')}</Label>
              <Input
                id="facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="username"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
