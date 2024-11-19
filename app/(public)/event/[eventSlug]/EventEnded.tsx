import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { useTranslation } from "@/lib/i18n/init-server";
import Image from "next/image";
import Link from "next/link";
interface EventEndedProps {
  eventName: string;
  eventSlug: string;
  lang?: string;
}
export default async function EventEnded({
  eventName,
  eventSlug,
  lang = "en",
}: EventEndedProps) {
  const { t } = await useTranslation(lang, "eventSlug");
  const { t: tButton } = await useTranslation(lang, "common");
  return (
    <BackgroundDiv eventSlug={eventSlug} shouldCenter={false}>
      <div className="fixed bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center backdrop-blur-sm">
        <Card className="min-w-[400px] bg-white">
          <CardHeader className="relative aspect-video w-full border-b">
            <Image
              src="/banner.jpg"
              alt="Card background"
              objectFit="cover"
              layout="fill"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-6">
            <CardTitle>{t("eventEnded.text")}</CardTitle>
            <p
              dangerouslySetInnerHTML={{
                __html: t("eventEnded.description", { eventSlug: eventName }),
              }}
            />
          </CardContent>
          <CardFooter>
            <Link
              href={`/`}
              className="text-sm font-semibold text-blue-400 hover:underline"
            >
              {tButton("backToHome")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </BackgroundDiv>
  );
}
