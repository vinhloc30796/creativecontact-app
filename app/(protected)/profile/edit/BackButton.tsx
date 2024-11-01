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

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const router = useRouter();
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
        Back to Profile
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to discard {dirtyFieldCount} changes? If yes, your edits won&apos;t be effective.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
