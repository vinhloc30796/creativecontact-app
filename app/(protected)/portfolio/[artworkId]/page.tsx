// React imports
import { Suspense, use } from "react";

// Next.js imports
import { redirect } from "next/navigation";

// API imports
import { fetchUserData } from "@/app/api/user/helper";
import {
  calculateUserDataUsage,
  fetchUserPortfolioArtworksWithDetails,
} from "@/app/api/user/[id]/portfolio-artworks/helper";

// Type imports
import { UserData } from "@/app/types/UserInfo";

// Component imports
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { LoadingUserHeader } from "@/components/wrappers/LoadingUserHeader";
import { Header } from "@/components/Header";
import { BackButton } from "@/app/(protected)/profile/BackButton";
import PortfolioEditForm from "./PortfolioEditForm";

// Hook imports
import { getServerAuth } from "@/hooks/useServerAuth";

// Action imports
import { handleArtworkNotFound } from "./action";

// Translation imports
import { getServerTranslation } from "@/lib/i18n/init-server";

interface PortfolioEditPageProps {
  params: Promise<{
    artworkId: string;
  }>;
  searchParams: Promise<{
    lang: string;
  }>;
}

export default async function PortfolioEditPage(props: PortfolioEditPageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const lang = searchParams.lang || "en";
  const { t } = await getServerTranslation(lang, ["HomePage", "EventPage"]);
  const { user, isLoggedIn, isAnonymous } = await getServerAuth();

  if (!isLoggedIn || isAnonymous) {
    redirect("/login");
  }

  let userData: UserData | null = null;
  if (user) {
    try {
      userData = await fetchUserData(user.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  if (!userData) {
    return null;
  }

  const portfolioArtworks = await fetchUserPortfolioArtworksWithDetails(
    userData.id,
  );

  const currentArtwork = portfolioArtworks.find(
    (artwork) => artwork.artworks?.id === params.artworkId,
  );

  const dataUsage = await calculateUserDataUsage(userData.id);

  if (!currentArtwork && params.artworkId !== "new") {
    console.error("Artwork not found: ", params.artworkId);
    redirect("/profile");
  }

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <Suspense fallback={<LoadingUserHeader />}>
          <Header
            t={t}
            className="bg-background/80 backdrop-blur-xs"
          />
        </Suspense>

        <main className="relative z-20 mt-10 w-full grow lg:mt-20">
          <div className="w-full px-4 sm:px-8 md:px-16 mb-4">
            <BackButton />
          </div>
          <div className="w-full px-4 sm:px-8 md:px-16">
            <PortfolioEditForm
              dataUsage={dataUsage}
              userData={userData}
              lang={lang}
              artwork={currentArtwork}
              isNew={params.artworkId === "new"}
            />
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
