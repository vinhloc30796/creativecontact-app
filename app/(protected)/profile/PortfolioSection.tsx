"use client";

import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { PortfolioTabs } from "./PortfolioTabs";

interface PortfolioSectionProps {
  userData: UserData | null;
  portfolioArtworks: PortfolioArtworkWithDetails[];
  lang?: string;
}

export default function PortfolioSection({
  userData,
  portfolioArtworks,
  lang = "en",
}: PortfolioSectionProps) {
  if (!userData || !portfolioArtworks) return null;

  return (
    <div className="space-y-8">
      <PortfolioTabs
        userData={userData}
        existingPortfolioArtworks={portfolioArtworks}
        lang={lang}
      />
    </div>
  );
}
