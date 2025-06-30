// File: app/(protected)/profile/contacts/page.tsx

// API helpers
import { fetchUserData } from "@/app/api/user/helper";

// UI components
import { ContactList } from "@/components/contacts/ContactList";
import { ErrorContactCard } from "@/components/contacts/ErrorContactCard";
import { ContactListSkeleton } from "@/components/contacts/ContactListSkeleton";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileCardSkeleton } from "@/components/profile/ProfileCardSkeleton";
import ErrorBoundary from "@/components/wrappers/ErrorBoundary";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { Header } from "@/components/Header";

// Hooks & utils
import { getServerAuth } from "@/hooks/useServerAuth";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { Suspense } from "react";
import AnonymousProfilePage from "../AnonymousProfilePage";
import { fetchUserPortfolioArtworksWithDetails } from "@/app/api/user/[id]/portfolio-artworks/helper";
import { ErrorProfileCard } from "../ErrorProfileCard";

export const dynamic = "force-dynamic";

interface ContactsPageProps {
    searchParams: Promise<{
        lang?: string;
    }>;
}

export default async function ProfileContactsPage({
    searchParams,
}: ContactsPageProps) {
    const params = await searchParams;
    const lang = params?.lang || "en";
    const { t } = await getServerTranslation(lang, [
        "HomePage",
        "ProfilePage",
        "ContactList",
    ]);
    const { user, isLoggedIn, isAnonymous } = await getServerAuth();

    // Redirect anonymous / unauthenticated users
    if (!isLoggedIn || !user?.id || isAnonymous) {
        return (
            <AnonymousProfilePage
                lang={lang}
                isLoggedIn={isLoggedIn}
                errorMessage={(await cookies()).get("error_message")?.value}
            />
        );
    }

    const userData = await fetchUserData(user.id);
    const portfolioArtworksPromise = fetchUserPortfolioArtworksWithDetails(
        user.id,
    );

    return (
        <BackgroundDiv>
            <div className="flex min-h-screen w-full flex-col">
                <Header t={t} className="bg-background/80 backdrop-blur-xs" />
                <main className="mt-10 w-full grow justify-between lg:mt-20 pb-16 lg:pb-0">
                    <div className="w-full px-4 sm:px-8 md:px-16">
                        <div className="flex flex-col lg:flex-row">
                            {/* Contacts on the left */}
                            <div
                                className={cn(
                                    "w-full order-2 lg:order-1 lg:w-2/3 2xl:w-3/4 -mt-px lg:mt-0",
                                    "lg:h-[calc(100vh-225px)] lg:overflow-y-auto",
                                )}
                            >
                                <ErrorBoundary fallback={<ErrorContactCard lang={lang} />}>
                                    <Suspense fallback={<ContactListSkeleton />}>
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                                            <ContactList userId={user.id} lang={lang} />
                                        </div>
                                    </Suspense>
                                </ErrorBoundary>
                            </div>

                            {/* Profile card on the right */}
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