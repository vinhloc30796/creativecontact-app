"use client";

import { UserData } from "@/app/types/UserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone } from "lucide-react";
import { useFormState } from "../FormStateNav";
import { useEffect, useState } from "react";

interface ContactSectionProps {
  userData: UserData;
  translations: {
    contact: string;
    email: string;
    phone: string;
    socialLinks: string;
    instagram: string;
    facebook: string;
  };
}

export function ContactSection({ userData, translations }: ContactSectionProps) {
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [instagram, setInstagram] = useState(userData.instagramHandle || '');
  const [facebook, setFacebook] = useState(userData.facebookHandle || '');
  const { setFieldDirty, setFormData } = useFormState();

  useEffect(() => {
    const isDirty = 
      email !== (userData.email || '') ||
      phone !== (userData.phone || '') ||
      instagram !== (userData.instagramHandle || '') ||
      facebook !== (userData.facebookHandle || '');

    setFieldDirty('contact', isDirty);
    
    if (isDirty) {
      setFormData('contact', { email, phone, instagramHandle: instagram, facebookHandle: facebook });
    }
  }, [email, phone, instagram, facebook, userData, setFieldDirty, setFormData]);

  return (
    <Card id="contact">
      <CardHeader>
        <CardTitle>{translations.contact}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">{translations.email}</Label>
          <div className="relative max-w-md">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">{translations.phone}</Label>
          <div className="relative max-w-md">
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <Separator />
        <div>
          <Label>{translations.socialLinks}</Label>
          <div className="grid grid-cols-2 gap-4 mt-2 max-w-2xl">
            <div>
              <Label htmlFor="instagram">{translations.instagram}</Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="facebook">{translations.facebook}</Label>
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
