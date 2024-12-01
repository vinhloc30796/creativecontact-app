
"use server";

import { ErrorMessage } from "@/components/ErrorMessage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { LoadingUserHeader, UserHeader } from "@/components/wrappers/UserHeader";
import { useTranslation } from "@/lib/i18n/init-server";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

interface AnonymousProfilePageProps {
  lang: string;
  isLoggedIn: boolean;
  errorMessage?: string;
}

const AnonymousProfilePage = async ({
  lang,
  isLoggedIn,
  errorMessage,
}: AnonymousProfilePageProps) => {
  const { t } = await useTranslation(lang, "ProfilePage");

  return (
    <BackgroundDiv>
      <Suspense fallback={null}>
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </Suspense>
      <div className="flex min-h-screen w-full flex-col">
        <Suspense fallback={<LoadingUserHeader />}>
          <UserHeader
            lang={lang}
            isLoggedIn={isLoggedIn}
            className="bg-background/80 backdrop-blur-sm"
          />
        </Suspense>
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

export default AnonymousProfilePage;