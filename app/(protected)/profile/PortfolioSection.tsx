"use client";

import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { PortfolioTabs } from "./PortfolioTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, use } from "react";
import { ErrorPortfolioProjectCard } from "./ErrorPortfolioProjectCard";

interface PortfolioSectionProps {
  showButtons: boolean;
  userData: UserData | null;
  portfolioArtworksPromise: Promise<PortfolioArtworkWithDetails[]>;
  lang?: string;
}

export default function PortfolioSection({
  showButtons,
  userData,
  portfolioArtworksPromise,
  lang = "en",
}: PortfolioSectionProps) {
  if (!userData) return null;

  return (
    <div className="border border-[#1A1A1A] rounded-none bg-[#FCFAF5]">
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioContent
          showButtons={showButtons}
          userData={userData}
          portfolioArtworksPromise={portfolioArtworksPromise}
          lang={lang}
        />
      </Suspense>
    </div>
  );
}

function PortfolioContent({
  showButtons,
  userData,
  portfolioArtworksPromise,
  lang,
}: PortfolioSectionProps) {
  const portfolioArtworks = use(portfolioArtworksPromise);

  if (!userData) {
    return <ErrorPortfolioProjectCard lang={lang || "en"} />;
  }

  return (
    <PortfolioTabs
      showButtons={showButtons}
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
