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
  countdown: number | undefined;
}

export const UploadStatistics = ({ eventSlug, eventTitle, artworkCount, countdown }: UploadStatisticsProps) => {
  // Router
  const router = useRouter();
  // State
  const [timeLeft, setTimeLeft] = useState(countdown);
  // I18n
  const { t } = useTranslation(["UploadStatistics"]);

  useEffect(() => {
    if (countdown === undefined) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === undefined || prevTime <= 1) {
          clearInterval(timer);
          router.push(`/${eventSlug}/upload`);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [eventSlug, router, countdown]);

  const progress = countdown !== undefined ? ((countdown - (timeLeft ?? 0)) / countdown) * 100 : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-accent">{eventTitle}</h2>
      <div className="mb-4 flex flex-col items-center">
          <h3 className="text-8xl font-bold text-primary">{artworkCount}</h3>
          <p className="text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>
        {countdown !== undefined && (
          <>
            <div className="text-center text-sm text-muted-foreground mb-2">
              {t("redirecting", { countdown: timeLeft })}
            </div>
            <Progress value={progress} className="w-full" />
          </>
        )}
    </div>
  );
}