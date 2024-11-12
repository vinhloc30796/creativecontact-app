"use client";

import { UserData } from "@/app/types/UserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "@/app/(protected)/profile/edit/FormStateNav";
import { useEffect, useState } from "react";
import { useTranslation } from '@/lib/i18n/init-client'

interface AboutSectionProps {
  userData: UserData;
  lang?: string;
}

export function AboutSection({ userData, lang = "en" }: AboutSectionProps) {
  const { t } = useTranslation(lang, "ProfilePage");
  const [about, setAbout] = useState(userData.about || '');
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    const isDirty = about !== (userData.about || '');
    setFieldDirty('about', isDirty);
    // Always set form data, not just when dirty
    setFormData('about', { about });
  }, [about, userData.about, setFieldDirty, setFormData]);

  return (
    <Card id="about">
      <CardHeader>
        <CardTitle>{t('AboutSection.about')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={4}
          className="max-w-2xl"
          placeholder={t('AboutSection.aboutPlaceholder')}
        />
      </CardContent>
    </Card>
  );
}
