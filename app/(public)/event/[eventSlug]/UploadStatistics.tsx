"use client";

import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/init-client";
import EventLogo from "@/components/branding/EventLogo";

interface UploadStatisticsProps {
  eventSlug: string;
  eventTitle: string;
  artworkCount: number;
  countdown: number | undefined;
}

export const UploadStatistics = ({ eventSlug, eventTitle, artworkCount, countdown }: UploadStatisticsProps) => {
  console.log("[UploadStatistics] Starting render");

  // Router
  const router = useRouter();
  // State
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [isClient, setIsClient] = useState(false);

  // I18n - wrap in try-catch to handle potential initialization errors
  const { t } = useTranslation("en", "UploadStatistics", {
    useSuspense: true,
  });

  // Handle client-side initialization
  useEffect(() => {
    console.log("[UploadStatistics] Client-side initialization");
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || countdown === undefined) return;
    console.log("[UploadStatistics] Setting up countdown timer");

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
  }, [eventSlug, router, countdown, isClient]);

  const progress = countdown !== undefined ? ((countdown - (timeLeft ?? 0)) / countdown) * 100 : 0;

  console.log("[UploadStatistics] Rendering with progress:", progress);

  // Only render on client side to avoid hydration mismatch
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-center">
        <EventLogo eventSlug={eventSlug} eventTitle={eventTitle} className="w-[15vw] h-auto fill-muted" />
      </div>
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