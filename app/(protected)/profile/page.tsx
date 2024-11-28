// File: app/(protected)/profile/page.tsx

"use server";

// API imports
import { fetchUserPortfolioArtworksWithDetails } from "@/app/api/user/[id]/portfolio-artworks/helper";
import { fetchUserData } from "@/app/api/user/helper";

// UI imports
import { ErrorMessage } from "@/components/ErrorMessage";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Wrapper imports
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";

// Hook imports
import { useServerAuth } from "@/hooks/useServerAuth";
import { useTranslation } from "@/lib/i18n/init-server";

// Next.js imports
import { headers } from "next/headers";
import Image from "next/image";
import { Suspense } from "react";
// Local component import
import { fetchUserContacts } from "@/app/api/user/[id]/contacts/helper";
import { ContactList } from "@/components/contacts/ContactList";
import { ContactListSkeleton } from "@/components/contacts/ContactListSkeleton";
import { ProfileCardSkeleton } from "@/components/profile/ProfileCardSkeleton";
import { cn } from "@/lib/utils";
import { UserCircle } from "lucide-react";
import { cookies } from "next/headers";
import PortfolioSection from "./PortfolioSection";
import PortfolioSectionSkeleton from "./PortfolioSectionSkeleton";

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

async function AnonymousProfilePage({
  lang,
  isLoggedIn,
  errorMessage,
}: {
  lang: string;
  isLoggedIn: boolean;
  errorMessage?: string;
}) {
  const { t } = await useTranslation(lang, "ProfilePage");

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
          <Card className="min-w-xl mx-auto max-w-3xl">
            <CardHeader className="relative aspect-video border-b bg-accent-foreground text-accent-foreground">
              <Image
                src="/banner.jpg"
                alt="Creative Contact - Banner"
                fill
                className="object-cover"
              />
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-6 text-center">
              <div className="inline-flex flex-col items-center justify-center gap-2 text-3xl sm:flex-row">
                <UserCircle className="h-10 w-10" />
                <span className="mt-2 font-bold sm:mt-0">
                  {t("notLoggedIn")}
                </span>
              </div>
              <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
                {t("pleaseLogIn")}
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </BackgroundDiv>
  );
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  console.log("[ProfilePage:ServerAction] Page action starting", {
    timestamp: new Date().toISOString(),
    headers: headers().get("x-invoke-path"), // Log the path that triggered the action
    searchParams,
  });

  // User authentication
  const lang = searchParams.lang || "en";
  console.log("[ProfilePage:ServerAction] Pre-auth");
  const { t } = await useTranslation(lang, "ProfilePage");
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();
  console.log("[ProfilePage:ServerAction] Post-auth", {
    isLoggedIn,
    isAnonymous,
    hasUserId: !!user?.id,
  });

  // Cookies check
  const cookieStore = cookies();
  console.log("[ProfilePage:ServerAction] Cookie access");
  const errorMessage = cookieStore.get("error_message")?.value;

  if (!isLoggedIn || !user?.id) {
    console.log("[ProfilePage:ServerAction] Early return - not logged in");
    return (
      <AnonymousProfilePage
        lang={lang}
        isLoggedIn={isLoggedIn}
        errorMessage={errorMessage}
      />
    );
  }

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
                        {t("contactsHeader")}
                      </TabsTrigger>
                      <TabsTrigger value="portfolio">
                        {t("portfolioHeader")}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="contacts">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                        <Suspense fallback={<ContactListSkeleton />}>
                          <ContactList
                            contactsPromise={fetchUserContacts(user.id)}
                            lang={lang}
                          />
                        </Suspense>
                      </div>
                    </TabsContent>

                    <TabsContent value="portfolio">
                      <Suspense fallback={<PortfolioSectionSkeleton />}>
                        <PortfolioSection
                          userDataPromise={fetchUserData(user.id)}
                          portfolioPromise={fetchUserPortfolioArtworksWithDetails(
                            user.id,
                          )}
                          lang={lang}
                        />
                      </Suspense>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div
                className={cn(
                  // Mobile styles
                  "mt-6 w-full",
                  // Set max height and enable scrolling
                  "max-h-[calc(100vh-225px)] overflow-y-scroll",
                  // Desktop styles
                  "lg:mt-0 lg:w-1/3 lg:pl-6",
                )}
              >
                <Suspense fallback={<ProfileCardSkeleton />}>
                  <ProfileCard
                    userDataPromise={fetchUserData(user.id)}
                    userSkillsPromise={getUserSkills(user.id)}
                    portfolioPromise={fetchUserPortfolioArtworksWithDetails(
                      user.id,
                    )}
                    lang={lang}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
