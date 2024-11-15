"use client";

import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EventLogo from "@/components/branding/EventLogo";

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
          router.push(`/event/${eventSlug}/upload`);
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
      <EventLogo eventSlug={eventSlug} eventTitle={eventTitle} className="w-[15vw] h-auto fill-muted" />
      <div className="my-4 flex flex-col items-center">
        <p className="text-md font-semibold text-accent">
          [{artworkCount} {t("description")}]
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