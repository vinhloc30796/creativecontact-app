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
import AnonymousProfilePage from "./AnonymousProfilePage";
import { ErrorProfileCard } from "./ErrorProfileCard";
import ProfilePageTabs from "./ProfilePageTabs";

interface ProfilePageProps {
  params: {};
  searchParams: {
    lang: string;
  };
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, ["ProfilePage", "ContactList"]);
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();

  // Early return for anonymous users
  if (!isLoggedIn || !user?.id) {
    return (
      <AnonymousProfilePage
        lang={lang}
        isLoggedIn={isLoggedIn}
        errorMessage={cookies().get("error_message")?.value}
      />
    );
  }

  // Get user data synchronously as it's needed for the layout
  const userData = await fetchUserData(user.id);

  // Create the promise but don't await it
  const portfolioArtworksPromise = fetchUserPortfolioArtworksWithDetails(user.id);

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
                  <ProfilePageTabs
                    user={user}
                    userData={userData}
                    params={params}
                    searchParams={searchParams}
                    portfolioArtworksPromise={portfolioArtworksPromise}
                  />
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
