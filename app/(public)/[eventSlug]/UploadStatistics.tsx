"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

interface UploadStatisticsProps {
  eventSlug: string;
  eventTitle: string;
  artworkCount: number;
  countdown: number;
}

export const UploadStatistics = ({ eventSlug, eventTitle, artworkCount, countdown = 10 }: UploadStatisticsProps) => {
  // Router
  const router = useRouter();
  // State
  const [timeLeft, setTimeLeft] = useState(countdown);
  // I18n
  const { t } = useTranslation(["UploadStatistics"]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          router.push(`/${eventSlug}/upload`);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [eventSlug, router]);

  const progress = ((countdown - timeLeft) / countdown) * 100;

  return (
    <BackgroundDiv eventSlug={eventSlug}>
      <Card className="w-[450px] mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{eventTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col items-center">
            <h1 className="text-8xl font-bold text-accent">{artworkCount}</h1>
            <p className="text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <Button asChild className="w-full mb-4">
            <a href={`/${eventSlug}/upload`}>{t("upload")}</a>
          </Button>
          <div className="text-center text-sm text-muted-foreground mb-2">
            {t("redirecting", { countdown: timeLeft })}
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>
    </BackgroundDiv>
  );
}