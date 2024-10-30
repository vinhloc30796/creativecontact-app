"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/init-client";
import { useProfileFormStore, isFormDirty } from "@/lib/stores/profile-form-store";
import { Briefcase, Mail, User, UserCircle } from "lucide-react";
import { useState } from "react";

export interface Section {
  id: string;
  label: string;
  iconName: string;
}

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { formData, dirtyFields, resetForm } = useProfileFormStore();
  const isDirty = isFormDirty({ dirtyFields, formData } as any);
  const dirtyFieldCount = Object.values(dirtyFields).filter(Boolean).length;

  const handleSubmit = async () => {
    if (!isDirty || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form state after successful submission
      resetForm();
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            {isSubmitting 
              ? t('navigation.saving') 
              : dirtyFieldCount > 0 
                ? t('navigation.saveChangesWithCount', { count: dirtyFieldCount })
                : t('navigation.saveChanges')
            }
          </Button>
        </div>
      </div>
    </div>
  );
}

// Export the hook for components to use
export const useFormState = useProfileFormStore;
