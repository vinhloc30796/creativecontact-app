import { MagicSignIn } from "@/components/auth/MagicSignIn";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { ThemedHero } from "@/components/wrappers/ThemedHero";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loading } from "@/components/Loading";
import { HeroTitle } from "@/components/ui/typography";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const awaitedSearchParams = await searchParams;
  const themeQuery = (awaitedSearchParams?.theme as string | undefined) ?? undefined;
  const eventSlug = (awaitedSearchParams?.eventSlug as string | undefined) ?? undefined;
  const next = (awaitedSearchParams?.next as string | undefined) ?? undefined;

  const allowedThemes = new Set<string>([
    "light",
    "trungthu-archive-2024",
    "trungthu-archive-2025",
    "early-access-2024",
  ]);
  const safeTheme =
    themeQuery && allowedThemes.has(themeQuery) ? themeQuery : undefined;

  return (
    <div {...(safeTheme ? { "data-theme": safeTheme } : {})}>
      <div className={cn("flex flex-col md:flex-row h-screen w-full overflow-hidden")}>
        {/* Left panel: hero only (no blur background) */}
        <ThemedHero className={cn("order-2 md:order-1 hidden md:block md:flex-1")} eventSlug={eventSlug} />

        {/* Right panel: blurred/background color via BackgroundDiv */}
        <BackgroundDiv
          shouldCenter={false}
          shouldImage={false}
          eventSlug={eventSlug}
          className={cn("order-1 md:order-2 flex-1 flex items-center justify-center")}
        >
          <Suspense fallback={<Loading />}>
            <Card className="w-[90%] max-w-[420px] overflow-hidden border-4 border-black shadow-[4px_4px_0_0_#000]">
              <CardHeader className="aspect-video md:hidden bg-[url('/banner.jpg')] bg-cover bg-center relative" />
              <CardContent className="p-6 flex flex-col gap-6">
                <HeroTitle
                  size="small"
                  bordered="black"
                  variant="accent"
                  className="text-black text-center"
                >
                  LOG&nbsp;IN
                </HeroTitle>
                <MagicSignIn purpose="login" redirectTo={next} />
              </CardContent>
            </Card>
          </Suspense>
        </BackgroundDiv>
      </div>
    </div>
  );
}
