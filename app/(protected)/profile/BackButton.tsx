"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useProfileFormStore, isFormDirty } from "@/lib/stores/profile-form-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/init-client";

interface BackButtonProps {
  className?: string;
  lang?: string;
}

export function BackButton({ className, lang = "en" }: BackButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(lang, "ProfilePage");
  const { formData, dirtyFields } = useProfileFormStore();
  const isDirty = isFormDirty({ dirtyFields, formData } as any);
  const dirtyFieldCount = Object.values(dirtyFields).filter(Boolean).length;

  const handleBack = () => {
    if (isDirty) {
      setShowDialog(true);
    } else {
      router.push("/profile");
    }
  };

  const handleConfirm = () => {
    router.push("/profile");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`text-muted-foreground hover:text-foreground ${className}`}
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('navigation.backToProfile', 'Back to Profile')}
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('navigation.discardChanges', 'Discard Changes?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('navigation.discardChangesDescription', 'Do you want to discard {{count}} changes? If yes, your edits won\'t be effective.', { count: dirtyFieldCount })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('navigation.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{t('navigation.discardChanges', 'Discard Changes')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
