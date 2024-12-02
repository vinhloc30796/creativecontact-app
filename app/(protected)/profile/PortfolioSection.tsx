"use client";

import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { PortfolioTabs } from "./PortfolioTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, use } from "react";
import { ErrorPortfolioProjectCard } from "./ErrorPortfolioProjectCard";


interface PortfolioSectionProps {
  userData: UserData | null;
  portfolioArtworksPromise: Promise<PortfolioArtworkWithDetails[]>;
  lang?: string;
}

export default function PortfolioSection({
  userData,
  portfolioArtworksPromise,
  lang = "en",
}: PortfolioSectionProps) {
  if (!userData) return null;

  return (
    <div className="space-y-8">
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioContent 
          userData={userData}
          portfolioArtworksPromise={portfolioArtworksPromise}
          lang={lang}
        />
      </Suspense>
    </div>
  );
}

function PortfolioContent({
  userData,
  portfolioArtworksPromise,
  lang
}: PortfolioSectionProps) {
  const portfolioArtworks = use(portfolioArtworksPromise);

  if (!userData) {
    return <ErrorPortfolioProjectCard lang={lang || "en"} />;
  }
  
  return (
    <PortfolioTabs
      userData={userData}
      existingPortfolioArtworks={portfolioArtworks}
      lang={lang}
    />
  );
}

function PortfolioSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}
