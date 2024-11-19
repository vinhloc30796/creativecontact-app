"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ErrorMessage({ errorMessage }: { errorMessage: string }) {
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, []);

  return null;
}
