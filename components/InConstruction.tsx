import { getServerTranslation } from "@/lib/i18n/init-server";
import Image from "next/image";
import { ConstructionIcon } from "./icons/ConstructionIcon";
import { Card, CardContent, CardHeader } from "./ui/card";

export default async function InConstruction({ lang }: { lang: string }) {
  const { t } = await getServerTranslation(lang, "inConstruction");
  return (
    <Card className="min-w-xl mx-auto mt-10 max-w-3xl">
      <CardHeader className="relative aspect-video border-b bg-accent-foreground text-accent-foreground">
        <Image
          src="/banner.jpg"
          alt="Creative Contact - Banner"
          fill
          className="object-cover"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-6 text-center">
        <div className="inline-flex flex-col items-center justify-center gap-2 text-3xl sm:flex-row">
          <ConstructionIcon className="h-10 w-10" />
          <span className="mt-2 font-bold sm:mt-0">
            {t("inConstruction.title")}
          </span>
        </div>
        <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
          {t("inConstruction.description")}
        </p>
      </CardContent>
    </Card>
  );
}
