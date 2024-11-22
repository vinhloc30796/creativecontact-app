"use server";

import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { PortfolioTabs } from "./PortfolioTabs";

interface PortfolioSectionProps {
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
  lang?: string;
}

export default async function PortfolioSection({
  userData,
  existingPortfolioArtworks,
  lang = "en",
}: PortfolioSectionProps) {
  return (
    <div className="space-y-8">
      <PortfolioTabs
        userData={userData}
        existingPortfolioArtworks={existingPortfolioArtworks}
        lang={lang}
      />
    </div>
  );
}
