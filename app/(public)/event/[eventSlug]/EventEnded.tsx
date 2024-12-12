import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { getServerTranslation } from "@/lib/i18n/init-server";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

interface EventEndedProps {
  eventName: string;
  eventSlug: string;
  lang?: string;
}

export default function EventEnded({ eventName, eventSlug, lang = "en" }: EventEndedProps) {
  console.log("[EventEnded] Starting component render with props:", { eventName, eventSlug, lang });

  try {
    console.log("[EventEnded] About to get translations");
    const { t } = use(getServerTranslation(lang, 'eventSlug'));
    console.log("[EventEnded] Got eventSlug translations");
    
    const { t: tButton } = use(getServerTranslation(lang, 'common'));
    console.log("[EventEnded] Got common translations");

    console.log("[EventEnded] About to render component");
    return (
      <BackgroundDiv eventSlug={eventSlug} shouldCenter={false}>
        <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center backdrop-blur-sm">
          <Card className="min-w-[400px] bg-white">
            <CardHeader
              className="border-b relative w-full aspect-video">
              <Image
                src="/banner.jpg"
                alt="Card background"
                objectFit="cover"
                layout="fill"
              />
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-2">
              <CardTitle>
                {t('eventEnded.text')}
              </CardTitle>
              <p
                dangerouslySetInnerHTML={{ __html: t('eventEnded.description', { eventSlug: eventName }) }}
              />
            </CardContent>
            <CardFooter>
              <Link href={`/`} className="text-sm text-blue-400 font-semibold hover:underline">
                {tButton('backToHome')}
              </Link>
            </CardFooter>
          </Card>
        </div>
      </BackgroundDiv>
    );
  } catch (error) {
    console.error("[EventEnded] Error in component:", error);
    throw error;
  }
}
