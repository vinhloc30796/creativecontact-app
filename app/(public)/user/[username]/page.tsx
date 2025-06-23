// File: app/(public)/user/[username]/page.tsx

// API imports
import { fetchUserPortfolioArtworksWithDetails } from "@/app/api/user/[id]/portfolio-artworks/helper";
import { fetchUserData } from "@/app/api/user/helper";

// UI imports
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Wrapper imports
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { Header } from "@/components/Header";

// Hook imports
import { getServerAuth } from "@/hooks/useServerAuth";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";

// Next.js imports
import { Suspense } from "react";
// Local component import

import { ProfileCardSkeleton } from "@/components/profile/ProfileCardSkeleton";
import ErrorBoundary from "@/components/wrappers/ErrorBoundary";

import { getUserIdByUsername } from "@/app/actions/user/auth";
import PortfolioSection from "@/app/(protected)/profile/PortfolioSection";
import { ErrorPortfolioProjectCard } from "@/app/(protected)/profile/ErrorPortfolioProjectCard";
import { ErrorProfileCard } from "@/app/(protected)/profile/ErrorProfileCard";

interface UserPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    lang: string;
  }>;
}

export default async function UserPage({
  params,
  searchParams,
}: UserPageProps) {
  const username = (await params).username;
  const lang = (await searchParams).lang || "en";
  const { t } = await getServerTranslation(lang, [
    "HomePage",
    "ProfilePage",
    "ContactList",
  ]);
  const { user, isLoggedIn, isAnonymous } = await getServerAuth();

  const userId = await getUserIdByUsername(username);

  const userData = await fetchUserData(userId!);

  // Create the promise but don't await it
  const portfolioArtworksPromise = fetchUserPortfolioArtworksWithDetails(
    userId!,
  );

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <Header
          t={t}
          className="bg-background/80 backdrop-blur-xs"
        />
        <main className="mt-10 w-full grow justify-between lg:mt-20 pb-16 lg:pb-0">
          <div className="w-full px-4 sm:px-8 md:px-16">
            <div className="flex flex-col lg:flex-row">
              <div
                className={cn(
                  "w-full order-2 lg:order-1 lg:w-2/3 2xl:w-3/4 -mt-px lg:mt-0",
                  "lg:h-[calc(100vh-225px)] lg:flex lg:flex-col",
                )}
              >
                <ErrorBoundary
                  fallback={<ErrorPortfolioProjectCard lang={lang} />}
                >
                  <PortfolioSection
                    showButtons={false}
                    userData={userData}
                    portfolioArtworksPromise={portfolioArtworksPromise}
                    lang={lang}
                  />
                </ErrorBoundary>
              </div>

              <div
                className={cn(
                  "w-full order-1 lg:order-2 lg:w-1/3 2xl:w-1/4 lg:-ml-px",
                  "lg:max-h-[calc(100vh-225px)] lg:overflow-y-scroll no-scrollbar",
                  "-mt-px lg:mt-0",
                )}
              >
                <Suspense fallback={<ProfileCardSkeleton />}>
                  {userData ? (
                    <ProfileCard
                      showButtons={false}
                      userData={userData}
                      portfolioArtworksPromise={portfolioArtworksPromise}
                      lang={lang}
                    />
                  ) : (
                    <ErrorProfileCard lang={lang} />
                  )}
                </Suspense>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
