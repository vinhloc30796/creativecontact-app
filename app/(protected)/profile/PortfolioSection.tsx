import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { useTranslation } from "react-i18next";
import { PortfolioTabs } from "./PortfolioTabs";

interface PortfolioSectionProps {
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
  lang?: string;
}

export default function PortfolioSection({
  userData,
  existingPortfolioArtworks,
  lang = "en",
}: PortfolioSectionProps) {
  return (
    <div className="space-y-8">
      <PortfolioTabs
        userData={userData}
        existingPortfolioArtworks={existingPortfolioArtworks}
      />
    </div>
  );
} 