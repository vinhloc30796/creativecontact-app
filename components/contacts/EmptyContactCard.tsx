"use server"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/init-server";
import { TFunction } from "i18next";

interface EmptyContactCardProps {
  lang: string;
}

export async function EmptyContactCard({ lang }: EmptyContactCardProps) {
  const { t } = await useTranslation(lang, "ContactCard");
  return (
    <div className="col-span-full">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500">{t("EmptyContactCard.description")}</p>
            <Button className="mt-4">
              {t("findContacts")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 