"use client";

import { UserData } from "@/app/types/UserInfo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useFormState } from "../FormStateNav";
import { useEffect, useState } from "react";

interface BasicInfoSectionProps {
  userData: UserData;
  translations: {
    basicInfo: string;
    firstName: string;
    lastName: string;
    displayName: string;
    location: string;
  };
}

export function BasicInfoSection({ userData, translations }: BasicInfoSectionProps) {
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
    
    if (isDirty) {
      setFormData('basic', { firstName, lastName, displayName, location });
    }
  }, [firstName, lastName, displayName, location, userData, setFieldDirty, setFormData]);

  return (
    <Card id="basic">
      <CardHeader>
        <CardTitle>{translations.basicInfo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">{translations.firstName}</Label>
            <Input 
              id="firstName" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="max-w-md" 
            />
          </div>
          <div>
            <Label htmlFor="lastName">{translations.lastName}</Label>
            <Input 
              id="lastName" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="max-w-md" 
            />
          </div>
        </div>
        <div>
          <Label htmlFor="displayName">{translations.displayName}</Label>
          <Input 
            id="displayName" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="max-w-md" 
          />
        </div>
        <div>
          <Label htmlFor="location">{translations.location}</Label>
          <div className="relative max-w-md">
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
