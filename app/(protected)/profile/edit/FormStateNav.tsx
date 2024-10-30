"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createContext, useContext, useState } from "react";
import { Briefcase, Mail, User, UserCircle } from 'lucide-react';

export interface Section {
  id: string;
  label: string;
  iconName: string;
}

interface Translations {
  editProfile: string;
  basicInfo: string;
  about: string;
  professional: string;
  contact: string;
  saveChanges: string;
}

interface FormStateContextType {
  dirtyFields: Record<string, boolean>;
  setFieldDirty: (id: string, isDirty: boolean) => void;
  formData: Record<string, any>;
  setFormData: (id: string, data: any) => void;
}

const FormStateContext = createContext<FormStateContextType>({
  dirtyFields: {},
  setFieldDirty: () => { },
  formData: {},
  setFormData: () => { },
});

const IconMap: Record<string, React.ElementType> = {
  'user': User,
  'userCircle': UserCircle,
  'briefcase': Briefcase,
  'mail': Mail,
};

export function FormStateNav({
  sections,
  translations,
  onSubmit,
}: {
  sections: Section[];
  translations: Translations;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}) {
  const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});
  const [formData, setFormDataState] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldDirty = (id: string, isDirty: boolean) => {
    setDirtyFields((prev) => ({ ...prev, [id]: isDirty }));
  };

  const setFormData = (id: string, data: any) => {
    setFormDataState((prev) => ({ ...prev, [id]: data }));
  };

  const isDirty = Object.values(dirtyFields).some(Boolean);

  const handleSubmit = async () => {
    if (!isDirty || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset dirty state after successful submission
      setDirtyFields({});
    } catch (error) {
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormStateContext.Provider value={{ dirtyFields, setFieldDirty, formData, setFormData }}>
      <div className="lg:w-1/3">
        <div className="fixed lg:w-[calc(33.333%-2rem)]">
          <Card>
            <CardHeader>
              <CardTitle>{translations.editProfile}</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = IconMap[section.iconName];
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {section.label}
                    </a>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
          <div className="my-5 flex justify-end space-x-4 pb-8">
            <Button 
              disabled={!isDirty || isSubmitting} 
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Saving...' : translations.saveChanges}
            </Button>
          </div>
        </div>
      </div>
    </FormStateContext.Provider>
  );
}

export const useFormState = () => useContext(FormStateContext);
