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
import { ContactList } from "@/components/contacts/ContactList";
import { ErrorContactCard } from "@/components/contacts/ErrorContactCard";
import { ProfileCardSkeleton } from "@/components/profile/ProfileCardSkeleton";
import ErrorBoundary from "@/components/wrappers/ErrorBoundary";
import AnonymousProfilePage from "./AnonymousProfilePage";
import { ErrorPortfolioProjectCard } from "./ErrorPortfolioProjectCard";
import { ErrorProfileCard } from "./ErrorProfileCard";
import PortfolioSection from "./PortfolioSection";
import { ContactListSkeleton } from "@/components/contacts/ContactListSkeleton";

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
  const { t } = await useTranslation(lang, "ProfilePage");
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

  // Pre-fetch all data in parallel at the server level
  const [userDataResult, portfolioArtworksResult] =
    await Promise.allSettled([
      fetchUserData(user.id),
      fetchUserPortfolioArtworksWithDetails(user.id),
    ]);

  // Handle errors for each promise separately
  const userData =
    userDataResult.status === "fulfilled" ? userDataResult.value : null;
  const portfolioArtworks =
    portfolioArtworksResult.status === "fulfilled"
      ? portfolioArtworksResult.value
      : [];

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
                  <Tabs defaultValue="contacts">
                    <TabsList>
                      <TabsTrigger value="contacts">
                        {t("contactsHeader")}
                      </TabsTrigger>
                      <TabsTrigger value="portfolio">
                        {t("portfolioHeader")}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="contacts">
                      <ErrorBoundary fallback={<ErrorContactCard lang={lang} />}>
                        <Suspense fallback={<ContactListSkeleton />}>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                            <ContactList userId={user.id} lang={lang} />
                          </div>
                        </Suspense>
                      </ErrorBoundary>
                    </TabsContent>

                    <TabsContent value="portfolio">
                      {portfolioArtworksResult.status === "rejected" || !userData ? (
                        <ErrorPortfolioProjectCard lang={lang} />
                      ) : (
                        <ErrorBoundary fallback={<ErrorPortfolioProjectCard lang={lang} />}>
                          <PortfolioSection
                            userData={userData}
                            portfolioArtworks={portfolioArtworks}
                            lang={lang}
                          />
                        </ErrorBoundary>
                      )}
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
                  {portfolioArtworksResult.status === "rejected" || !userData ? (
                    <ErrorProfileCard lang={lang} />
                  ) : (
                    <ErrorBoundary fallback={<ErrorProfileCard lang={lang} />}>
                      <ProfileCard
                        userData={userData}
                        portfolioArtworks={portfolioArtworks}
                        lang={lang}
                      />
                    </ErrorBoundary>
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
