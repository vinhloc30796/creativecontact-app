"use server";

import { Card } from "@/components/ui/card";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import {
  LoadingUserHeader,
  UserHeader,
} from "@/components/wrappers/UserHeader";
import { ArtworkProvider } from "@/contexts/ArtworkContext";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { useServerAuth } from "@/hooks/useServerAuth";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { BackButton } from "../../profile/BackButton";
import { PortfolioProjectCard } from "./PortfolioCreateForm";

interface PortfolioCreatePageProps {
  params: {};
  searchParams: {
    lang: string;
  };
}

export default async function PortfolioCreatePage({
  params,
  searchParams,
}: PortfolioCreatePageProps) {
  const { user, isLoggedIn, isAnonymous } = await useServerAuth();
  const lang = searchParams.lang || "en";

  const project = {
    portfolioArtworks: {
      id: "new",
    },
    artworks: null,
  };

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <Suspense fallback={<LoadingUserHeader />}>
          <UserHeader
            lang={lang}
            isLoggedIn={isLoggedIn}
            className="bg-background/80 backdrop-blur-sm"
          />
        </Suspense>

        <main className="relative z-20 mt-10 w-full flex-grow lg:mt-20">
          <div className="container mx-auto mb-4 px-4">
            <BackButton />
          </div>
          <div className="container mx-auto px-4">
            <Card className="w-full">
              <PortfolioProjectCard project={project as any} />
            </Card>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
