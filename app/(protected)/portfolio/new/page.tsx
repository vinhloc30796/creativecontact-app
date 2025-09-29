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
    eventSlug?: string;
    next?: string;
  }>;
}

export default async function PortfolioCreatePage(
  props: PortfolioCreatePageProps,
) {
  const { isLoggedIn } = await getServerAuth();
  const searchParams = await props.searchParams;
  const lang = searchParams.lang || "en";
  const eventSlug = searchParams.eventSlug;
  const { t } = await getServerTranslation(lang, "HomePage");
  const project = {
    portfolioArtworks: {
      id: "new",
    },
    artworks: null,
  };
  return (
    <BackgroundDiv shouldCenter={false} shouldImage={false} eventSlug={eventSlug} className="w-full">
      <div className="flex w-full flex-col">
        <Suspense fallback={<LoadingUserHeader />}>
          <Header
            t={t}
            className="bg-background/80 backdrop-blur-xs"
          />
        </Suspense>
        <main className="flex w-full grow flex-col pt-0">
          <div className="w-full px-4 sm:px-8 md:px-16 mb-4 pt-4">
            <BackButton />
          </div>
          <div className="w-full px-4 sm:px-8 md:px-16">
            <Wrapper />
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}

// Source: https://github.com/vercel/next.js/issues/74128
// TODO: Attempt to remove now that we have Next 15.2
export const dynamic = "force-dynamic";

