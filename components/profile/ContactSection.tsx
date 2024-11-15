// File: components/profile/ContactSection.tsx

"use client";

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";
import { socialMediaMapper } from "@/utils/social_media";
// React
import { useFormState } from "@/app/(protected)/profile/edit/FormStateNav";
import { UserData } from "@/app/types/UserInfo";
import { CountryCodeSelector } from "@/components/profile/CountryCodeSelector";
import { useTranslation } from '@/lib/i18n/init-client';
import { useEffect, useState } from "react";

interface ContactSectionProps {
  userData: UserData;
  lang?: string;
}

export function ContactSection({ userData, lang = "en" }: ContactSectionProps) {
  const { t } = useTranslation(lang, "ProfilePage");
  const [email, setEmail] = useState(userData?.email || '');
  const [countryCode, setCountryCode] = useState(userData?.phoneCountryCode || "84");
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [instagram, setInstagram] = useState(userData?.instagramHandle || '');
  const [facebook, setFacebook] = useState(userData?.facebookHandle || '');
  const [open, setOpen] = useState(false);
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    if (!userData) return;

    const isDirty =
      email !== (userData?.email || '') ||
      countryCode !== (userData?.phoneCountryCode || '') ||
      phoneNumber !== (userData?.phoneNumber || '') ||
      instagram !== (userData?.instagramHandle || '') ||
      facebook !== (userData?.facebookHandle || '');

    setFieldDirty('contact', isDirty);
    // Always set form data, not just when dirty
    setFormData('contact', {
      email,
        phoneCountryCode: countryCode,
        phoneNumber,
        instagramHandle: instagram,
        facebookHandle: facebook
    });
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
          <div className="space-y-4 mt-2 max-w-md">
            {Object.entries(socialMediaMapper).map(([key, value]) => (
              <div key={key} className="relative flex items-center gap-4">
                <value.icon className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor={key}>{t(`ContactSection.${key.replace('Handle', '')}`)}</Label>
                  <Input
                    id={key}
                    value={key === 'instagramHandle' ? instagram : facebook}
                    onChange={(e) => key === 'instagramHandle' ? setInstagram(e.target.value) : setFacebook(e.target.value)}
                    placeholder={key === 'instagramHandle' ? '@username' : 'username'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
