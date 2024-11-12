"use client";

import { UserData } from "@/app/types/UserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useFormState } from "@/app/(protected)/profile/edit/FormStateNav";
import { useEffect, useState } from "react";
import { useTranslation } from '@/lib/i18n/init-client'

interface BasicInfoSectionProps {
  userData: UserData;
  lang?: string;
}

export function BasicInfoSection({ userData, lang = "en" }: BasicInfoSectionProps) {
  const { t } = useTranslation(lang, "ProfilePage");
  const [firstName, setFirstName] = useState(userData.firstName || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [displayName, setDisplayName] = useState(userData.displayName || '');
  const [location, setLocation] = useState(userData.location || '');
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    const isDirty = 
      firstName !== (userData.firstName || '') ||
      lastName !== (userData.lastName || '') ||
      displayName !== (userData.displayName || '') ||
      location !== (userData.location || '');

    setFieldDirty('basic', isDirty);
    // Always set form data, not just when dirty
    setFormData('basic', {
      firstName,
      lastName,
      displayName,
      location
    });
  }, [firstName, lastName, displayName, location, userData, setFieldDirty, setFormData]);

  return (
    <Card id="basic">
      <CardHeader>
        <CardTitle>{t('BasicInfoSection.basicInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{t('BasicInfoSection.firstName')}</Label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="max-w-md" 
            />
          </div>
          <div>
            <Label htmlFor="lastName">{t('BasicInfoSection.lastName')}</Label>
            <Input 
              id="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="max-w-md" 
            />
          </div>
        </div>
        <div>
          <Label htmlFor="displayName">{t('BasicInfoSection.displayName')}</Label>
          <Input 
            id="displayName" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="max-w-md" 
          />
        </div>
        <div>
          <Label htmlFor="location">{t('BasicInfoSection.location')}</Label>
          <div className="relative max-w-md">
            <Input
              id="location"
              value={location}
              disabled
              onChange={(e) => setLocation(e.target.value)}
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
