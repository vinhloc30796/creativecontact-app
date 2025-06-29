import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { LoadingUserHeader } from "@/components/wrappers/LoadingUserHeader";
import { Header } from "@/components/Header";
import { getServerAuth } from "@/hooks/useServerAuth";
import { getServerTranslation } from "@/lib/i18n/init-server";
import { Suspense } from "react";
import { BackButton } from "../../profile/BackButton";
import Wrapper from "./wrapper.component";

interface PortfolioCreatePageProps {
  params: Promise<{}>;
  searchParams: Promise<{
    lang: string;
  }>;
}

export default async function PortfolioCreatePage(
  props: PortfolioCreatePageProps,
) {
  const { isLoggedIn } = await getServerAuth();
  const lang = (await props.searchParams).lang || "en";
  const { t } = await getServerTranslation(lang, "HomePage");
  const project = {
    portfolioArtworks: {
      id: "new",
    },
    artworks: null,
  };
  return (
    <BackgroundDiv className="min-h-screen w-full">
      <Suspense fallback={<LoadingUserHeader />}>
        <Header
          t={t}
          className="fixed left-0 right-0 top-0 z-30 bg-background/80 backdrop-blur-xs"
        />
      </Suspense>
      <main className="flex min-h-screen w-screen grow flex-col px-2 pt-10 lg:pt-32">
        <div className="container mx-auto mb-4">
          <BackButton />
        </div>
        <Wrapper />
      </main>
    </BackgroundDiv>
  );
}

// Source: https://github.com/vercel/next.js/issues/74128
// TODO: Attempt to remove now that we have Next 15.2
export const dynamic = "force-dynamic";
