'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/init-client";

interface EmptyContactCardProps {
  lang?: string;
}

export function EmptyContactCard({ lang = "en" }: EmptyContactCardProps) {
  const { t } = useTranslation(lang, "ContactCard", {
    useSuspense: false
  });
  
  return (
    <div className="col-span-full">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500">{t("EmptyContactCard.description")}</p>
            <Button className="mt-4">
              {t("EmptyContactCard.findContacts")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 