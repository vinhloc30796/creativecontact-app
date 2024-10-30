"use client";

import { UserData } from "@/app/types/UserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFormState } from "../FormStateNav";
import { useEffect, useState } from "react";

interface AboutSectionProps {
  userData: UserData;
  translations: {
    about: string;
    placeholder: string;
  };
}

export function AboutSection({ userData, translations }: AboutSectionProps) {
  const [about, setAbout] = useState(userData.about || '');
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    const isDirty = about !== (userData.about || '');
    setFieldDirty('about', isDirty);
    
    if (isDirty) {
      setFormData('about', { about });
    }
  }, [about, userData.about, setFieldDirty, setFormData]);

  return (
    <Card id="about">
      <CardHeader>
        <CardTitle>{translations.about}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          id="about" 
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={4} 
          className="max-w-2xl"
          placeholder={translations.placeholder}
        />
      </CardContent>
    </Card>
  );
}
