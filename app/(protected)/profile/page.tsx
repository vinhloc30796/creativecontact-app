// File: app/(protected)/profile/page.tsx

"use server";

// API imports
import { fetchUserContacts } from "@/app/api/user/[id]/contacts/helper";
import { fetchUserPortfolioArtworksWithDetails } from "@/app/api/user/[id]/portfolio-artworks/helper";
import { fetchUserData } from "@/app/api/user/helper";
import { UserData } from "@/app/types/UserInfo";

// UI imports
import { ErrorMessage } from "@/components/ErrorMessage";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Wrapper imports
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";

// Schema imports
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";

// Hook imports
import { useServerAuth } from "@/hooks/useServerAuth";
import { useTranslation } from "@/lib/i18n/init-server";

// Next.js imports
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Local component import
import { ContactList } from "@/components/contacts/ContactList";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import PortfolioSection from "./PortfolioSection";

interface ProfilePageProps {
  params: {};
  searchParams: {
    lang: string;
  };
}

interface UserSkills {
  id: number;
  name: string;
}

async function getUserSkills(userId?: string): Promise<UserSkills[]> {
  // TODO: Implement actual skill fetching logic
  // This is a placeholder implementation
  return [
    { id: 1, name: "JavaScript" },
    { id: 2, name: "React" },
    { id: 3, name: "Node.js" },
    { id: 4, name: "TypeScript" },
    { id: 5, name: "GraphQL" },
  ];
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  // User
  const lang = searchParams.lang || "en";
  const { t } = await useTranslation(lang, "ProfilePage");
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();
  // Cookies
  const cookieStore = cookies();
  const errorMessage = cookieStore.get("error_message")?.value;

  if (!isLoggedIn || isAnonymous || !user?.id) {
    redirect("/login");
  }

  // Add null checks before fetching
  let userData: UserData | null = null;
  let portfolioArtworks: PortfolioArtworkWithDetails[] = [];
  try {
    const [userDataResult, portfolioArtworksResult] = await Promise.allSettled([
      fetchUserData(user.id),
      fetchUserPortfolioArtworksWithDetails(user.id),
    ]);

    if (userDataResult.status === "fulfilled" && userDataResult.value) {
      userData = userDataResult.value;
    } else {
      console.error("Error fetching user data:", 
        userDataResult.status === "rejected" ? userDataResult.reason : "No data returned");
    }

    if (portfolioArtworksResult.status === "fulfilled") {
      portfolioArtworks = portfolioArtworksResult.value || [];
    } else {
      console.error("Error fetching portfolio artworks:", portfolioArtworksResult.reason);
    }
  } catch (error) {
    console.error("Error in data fetching:", error);
  }

  // Fetch user skills
  const userSkills = await getUserSkills(userData?.id);

  return (
    <BackgroundDiv>
      <Suspense fallback={null}>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </Suspense>
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
                        {t("contacts")}
                      </TabsTrigger>
                      <TabsTrigger value="portfolio">
                        {t("portfolio")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="contacts">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                        {userData && (
                          <Suspense fallback={<div>Loading contacts...</div>}>
                            <ContactList userId={userData.id} lang={lang} />
                          </Suspense>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="portfolio">
                      {userData && (
                        <Suspense fallback={<div>Loading portfolio...</div>}>
                          <PortfolioSection
                            userData={userData}
                            lang={lang}
                            existingPortfolioArtworks={
                              portfolioArtworks as PortfolioArtworkWithDetails[]
                            }
                          />
                        </Suspense>
                      )}
                    </TabsContent>

                    <TabsContent value="activity">
                      <div>Activity content coming soon...</div>
                    </TabsContent>

                    <TabsContent value="settings">
                      <div>Settings content coming soon...</div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              {userData && (
                <div
                  className={cn(
                    // Mobile styles
                    "mt-6 w-full",
                    // Set max height and enable scrolling
                    "max-h-[calc(100vh-225px)] overflow-y-scroll",
                    // Desktop styles
                    "lg:mt-0 lg:w-1/3 lg:pl-6"
                  )}
                >
                  <ProfileCard
                    t={t}
                    userData={userData}
                    userSkills={userSkills}
                    portfolioArtworks={portfolioArtworks}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
