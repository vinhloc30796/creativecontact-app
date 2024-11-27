"use client";

import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { PortfolioTabs } from "./PortfolioTabs";
import { useQuery } from "@tanstack/react-query";

interface PortfolioSectionProps {
  userDataPromise: Promise<UserData | null>;
  portfolioPromise: Promise<PortfolioArtworkWithDetails[]>;
  lang?: string;
}

export default function PortfolioSection({
  userDataPromise,
  portfolioPromise,
  lang = "en",
}: PortfolioSectionProps) {
  const { data: userData } = useQuery({
    queryKey: ['userData'],
    queryFn: () => userDataPromise,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  const { data: portfolioArtworks } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => portfolioPromise,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

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
