"use server";

// React imports
import { Suspense } from "react";

// Next.js imports
import { redirect } from "next/navigation";

// API imports
import { fetchUserData } from "@/app/api/user/helper";
import { fetchUserPortfolioArtworksWithDetails } from "@/app/api/user/[id]/portfolio-artworks/helper";

// Type imports
import { UserData } from "@/app/types/UserInfo";

// Component imports
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader, LoadingUserHeader } from "@/components/wrappers/UserHeader";
import { BackButton } from "@/app/(protected)/profile/BackButton";
import PortfolioEditForm from "./PortfolioEditForm";

// Hook imports
import { useServerAuth } from "@/hooks/useServerAuth";

// Action imports
import { handleArtworkNotFound } from "./action";

interface PortfolioEditPageProps {
  params: {
    artworkId: string;
  };
  searchParams: {
    lang: string;
  };
}

export default async function PortfolioEditPage({
  params,
  searchParams,
}: PortfolioEditPageProps) {
  const lang = searchParams.lang || "en";
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();

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
    (artwork) => artwork.artworks?.id === params.artworkId
  );

  if (!currentArtwork && params.artworkId !== 'new') {
    console.error("Artwork not found: ", params.artworkId);
    redirect("/profile");
  }

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <Suspense fallback={<LoadingUserHeader />}>
          <UserHeader
            lang={lang}
            isLoggedIn={isLoggedIn}
            className="bg-background/80 backdrop-blur-sm"
          />
        </Suspense>

        <main className="relative z-20 mt-10 w-full flex-grow lg:mt-20">
          <div className="container mx-auto mb-4 px-4">
            <BackButton />
          </div>
          <div className="container mx-auto px-4">
            <PortfolioEditForm
              userData={userData}
              lang={lang}
              artwork={currentArtwork}
              isNew={params.artworkId === 'new'}
            />
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
