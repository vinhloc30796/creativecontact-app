// File: app/(protected)/profile/page.tsx

// API imports
import { fetchUserPortfolioArtworksWithDetails } from "@/app/api/user/[id]/portfolio-artworks/helper";
import { fetchUserData } from "@/app/api/user/helper";

// UI imports
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Wrapper imports
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";

// Hook imports
import { useServerAuth } from "@/hooks/useServerAuth";
import { useTranslation } from "@/lib/i18n/init-server";
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
  searchParams: {
    lang: string;
  };
}

export default async function UserPage({
  params,
  searchParams,
}: UserPageProps) {
  const username = (await params).username;
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, ["ProfilePage", "ContactList"]);
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();

  const userId = await getUserIdByUsername(username);

  const userData = await fetchUserData(userId!);

  // Create the promise but don't await it
  const portfolioArtworksPromise = fetchUserPortfolioArtworksWithDetails(
    userId!,
  );

  async function checkCurrentUser() {
    if (user?.id === userId) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <UserHeader
          lang={lang}
          isLoggedIn={isLoggedIn}
          className="bg-background/80 backdrop-blur-sm"
        />
        <main className="mt-10 w-full flex-grow justify-between lg:mt-20">
          <div className="w-full px-4 sm:px-8 md:px-16">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full overflow-y-auto pr-0 lg:w-2/3 lg:pr-6">
                <div className="mb-6">
                  <Tabs defaultValue="portfolio">
                    <TabsList>
                      <TabsTrigger value="portfolio">
                        {t("portfolioHeader")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="portfolio">
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
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div
                className={cn(
                  "mt-6 w-full",
                  "max-h-[calc(100vh-225px)] overflow-y-scroll",
                  "lg:mt-0 lg:w-1/3 lg:pl-6",
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
