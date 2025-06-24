// File: app/(protected)/profile/page.tsx

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
import { ContactList } from "@/components/contacts/ContactList";
import { ErrorContactCard } from "@/components/contacts/ErrorContactCard";
import { ProfileCardSkeleton } from "@/components/profile/ProfileCardSkeleton";
import ErrorBoundary from "@/components/wrappers/ErrorBoundary";
import AnonymousProfilePage from "./AnonymousProfilePage";
import { ErrorPortfolioProjectCard } from "./ErrorPortfolioProjectCard";
import { ErrorProfileCard } from "./ErrorProfileCard";
import PortfolioSection from "./PortfolioSection";
import { ContactListSkeleton } from "@/components/contacts/ContactListSkeleton";
import { use } from "react";

interface ProfilePageProps {
  params: Promise<{}>;
  searchParams: Promise<{
    lang: string;
  }>;
}

export default async function ProfilePage(props: ProfilePageProps) {
  const searchParams = await props.searchParams;
  const lang = searchParams.lang || "en";
  const { t } = await getServerTranslation(lang, ["HomePage", "ProfilePage", "ContactList"]);
  const { user, isLoggedIn, isAnonymous } = await getServerAuth();

  // Early return for anonymous users
  if (!isLoggedIn || !user?.id) {
    return (
      (<AnonymousProfilePage
        lang={lang}
        isLoggedIn={isLoggedIn}
        errorMessage={(await cookies()).get("error_message")?.value}
      />)
    );
  }

  // Get user data synchronously as it's needed for the layout
  const userData = await fetchUserData(user.id);

  // Create the promise but don't await it
  const portfolioArtworksPromise = fetchUserPortfolioArtworksWithDetails(
    user.id,
  );

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <Header
          t={t}
          className="bg-background/80 backdrop-blur-xs"
        />
        <main className="mt-10 w-full grow justify-between lg:mt-20">
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
                      {!user || !user.id ? (
                        <ErrorContactCard
                          lang={lang}
                          message={t("noUserError", { ns: "ContactList" })}
                        />
                      ) : (
                        <ErrorBoundary
                          fallback={<ErrorContactCard lang={lang} />}
                        >
                          <Suspense fallback={<ContactListSkeleton />}>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                              <ContactList userId={user.id} lang={lang} />
                            </div>
                          </Suspense>
                        </ErrorBoundary>
                      )}
                    </TabsContent>

                    <TabsContent value="portfolio">
                      <ErrorBoundary
                        fallback={<ErrorPortfolioProjectCard lang={lang} />}
                      >
                        <PortfolioSection
                          showButtons={true}
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
                  "mt-6 w-full lg:w-[437px] lg:flex-shrink-0",
                  "max-h-[calc(100vh-225px)] overflow-y-scroll",
                  "lg:mt-0 lg:-ml-px lg:pl-6",
                )}
              >
                <Suspense fallback={<ProfileCardSkeleton />}>
                  {userData ? (
                    <ProfileCard
                      showButtons={true}
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

// Source: https://github.com/vercel/next.js/issues/74128
// TODO: Attempt to remove now that we have Next 15.2
export const dynamic = "force-dynamic";
