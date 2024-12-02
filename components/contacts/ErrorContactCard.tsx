'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/init-client";
import { AlertCircle } from "lucide-react";

interface ErrorContactCardProps {
  lang: string;
  message?: string;
}

export function ErrorContactCard({ lang, message }: ErrorContactCardProps) {
  const { t } = useTranslation(lang, "ContactList");

  return (
    <Card className="col-span-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {message || t("errorLoadingContacts")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("tryAgainLater")}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            {t("retry")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
