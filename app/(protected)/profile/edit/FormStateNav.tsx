"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/init-client";
import { Briefcase, Mail, User, UserCircle } from "lucide-react";
import { createContext, useContext, useState } from "react";

export interface Section {
  id: string;
  label: string;
  iconName: string;
}

interface FormStateContextType {
  dirtyFields: Record<string, boolean>;
  setFieldDirty: (id: string, isDirty: boolean) => void;
  formData: Record<string, any>;
  setFormData: (id: string, data: any) => void;
}

const FormStateContext = createContext<FormStateContextType>({
  dirtyFields: {},
  setFieldDirty: () => {},
  formData: {},
  setFormData: () => {},
});

const IconMap: Record<string, React.ElementType> = {
  user: User,
  userCircle: UserCircle,
  briefcase: Briefcase,
  mail: Mail,
};

export function FormStateNav({
  sections,
  onSubmit,
  lang = "en",
}: {
  sections: Section[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  lang?: string;
}) {
  const { t } = useTranslation(lang, "ProfilePage");
  const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});
  const [formData, setFormDataState] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldDirty = (id: string, isDirty: boolean) => {
    console.debug("setFieldDirty", id, isDirty);
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
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormStateContext.Provider
      value={{ dirtyFields, setFieldDirty, formData, setFormData }}
    >
      <div className="lg:w-1/3">
        <div className="fixed lg:w-[calc(33.333%-2rem)]">
          <Card>
            <CardHeader>
              <CardTitle>{t('navigation.editProfile')}</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = IconMap[section.iconName];
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center rounded-lg p-2 transition-colors hover:bg-accent"
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
            <Button disabled={!isDirty || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? t('navigation.saving') : t('navigation.saveChanges')}
            </Button>
          </div>
        </div>
      </div>
    </FormStateContext.Provider>
  );
}

export const useFormState = () => useContext(FormStateContext);
