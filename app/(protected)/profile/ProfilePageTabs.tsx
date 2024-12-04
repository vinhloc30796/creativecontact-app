"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n/init-client";
import { ContactList } from "@/components/contacts/ContactList";
import { ErrorContactCard } from "@/components/contacts/ErrorContactCard";
import ErrorBoundary from "@/components/wrappers/ErrorBoundary";
import { ErrorPortfolioProjectCard } from "./ErrorPortfolioProjectCard";
import PortfolioSection from "./PortfolioSection";
import { ContactListSkeleton } from "@/components/contacts/ContactListSkeleton";
import { User } from "@supabase/supabase-js";
import { Suspense } from "react";
import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";

interface ProfilePageTabsProps {
  user: User | null;
  userData: UserData | null;
  portfolioArtworksPromise: Promise<PortfolioArtworkWithDetails[]>
  params: {};
  searchParams: {
    lang: string;
  };
}

const tabs = ["#profile", "#contacts"]
export default function ProfilePageTabs({
  searchParams: { lang },
  user, userData, portfolioArtworksPromise
}: ProfilePageTabsProps) {
  const pageLang = lang || "en"
  const { t } = useTranslation(pageLang, ["ProfilePage", "ContactList"]);
  const defaultTab = localStorage.getItem("profile-tab") || tabs[1];
  const hashName = window.location.hash || defaultTab;
  const setTab = (tab: string) => {
    localStorage.setItem("profile-tab", tab);
    window.location.hash = tab
  }
  return (
    <Tabs defaultValue={hashName} onValueChange={setTab}>
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
          <ErrorBoundary fallback={<ErrorContactCard lang={lang} />}>
            <Suspense fallback={<ContactListSkeleton />}>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                <ContactList userId={user.id} lang={lang} />
              </div>
            </Suspense>
          </ErrorBoundary>
        )}
      </TabsContent>

      <TabsContent value="portfolio">
        <ErrorBoundary fallback={<ErrorPortfolioProjectCard lang={lang} />}>
          <PortfolioSection
            userData={userData}
            portfolioArtworksPromise={portfolioArtworksPromise}
            lang={lang}
          />
        </ErrorBoundary>
      </TabsContent>
    </Tabs>
  )
}